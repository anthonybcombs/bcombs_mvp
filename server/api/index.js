import express from "express";
import { makeDb } from "../helpers/database";
import fetch from "node-fetch";
const router = express.Router();
const isUserExist = async user => {
  const db = makeDb();
  let result;
  try {
    const rows = await db.query(
      `SELECT count(email) as emailCount from users where email=? or username=?`,
      [user.email, user.username]
    );
    if (rows[0].emailCount > 0) {
      result = true;
    }
    result = false;
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
    return result;
  }
};
const getUserFromDatabase = async email => {
  const db = makeDb();
  let result;
  try {
    const rows = await db.query(`SELECT * from users where email=?`, [email]);
    result = rows[0];
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
    return result;
  }
};
router.get("/userTypes", async (req, res) => {
  const db = makeDb();
  const result = [];
  try {
    const userTypes = await db.query(
      "SELECT BIN_TO_UUID(ID) as id,name FROM user_types"
    );
    userTypes.forEach(userType => {
      result.push({ id: userType.id, name: userType.name });
    });
    res.send(JSON.stringify(result));
  } catch (error) {
  } finally {
    await db.close();
  }
});

router.post("/auth/userInfo", async (req, res) => {
  try {
    const creds = req.body;
    const userInfoResponse = await fetch("https://bcombs.auth0.com/userinfo", {
      method: "POST",
      headers: {
        Authorization: `${creds.token_type} ${creds.access_token}`,
        "Content-Type": "application/json"
      }
    });
    const userInfo = await userInfoResponse.json();
    const { is_profile_filled } = await getUserFromDatabase(userInfo.email);
    userInfo.isProfileFilled = is_profile_filled === 0 ? false : true;
    res.send(userInfo);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});
router.post("/auth/authorize", async (req, res) => {
  try {
    const user = req.body;
    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("client_id", process.env.AUTH_CLIENT_ID);
    params.append("client_secret", process.env.AUTH_CLIENT_SECRET);
    params.append("username", user.email);
    params.append("password", user.password);
    const AuthResponse = await fetch("https://bcombs.auth0.com/oauth/token", {
      method: "POST",
      body: params
    });
    const authData = await AuthResponse.json();
    if (authData.hasOwnProperty("access_token")) {
      const userInfoResponse = await fetch(
        "https://bcombs.auth0.com/userinfo",
        {
          method: "POST",
          headers: {
            Authorization: `${authData.token_type} ${authData.access_token}`,
            "Content-Type": "application/json"
          }
        }
      );
      const userInfo = await userInfoResponse.json();
      res.send(
        JSON.stringify({
          ...authData,
          ...userInfo
        })
      );
      return;
    }
    res.send(JSON.stringify(authData));
  } catch (error) {
    res.send("error");
  }
});
router.post("/auth/changepassword", async (req, res) => {
  try {
    const user = req.body;
    const params = new URLSearchParams();
    params.append("client_id", process.env.AUTH_CLIENT_ID);
    params.append("email", user.email);
    params.append("connection", "Username-Password-Authentication");
    await fetch("https://bcombs.auth0.com/dbconnections/change_password", {
      method: "POST",
      body: params
    });
    res.send("success");
  } catch (error) {
    res.send("error");
  }
});
router.post("/users/add", async (req, res) => {
  const db = makeDb();
  try {
    const user = req.body;
    if (await isUserExist(user)) {
      res.send({
        error: "user exist",
        messageType: "error",
        message: "User already exist."
      });
      return;
    }
    let authData;
    if (!user.hasOwnProperty("isSocial")) {
      const params = new URLSearchParams();
      params.append("client_id", process.env.AUTH_CLIENT_ID);
      params.append("username", user.username);
      params.append("email", user.email);
      params.append("password", user.password);
      params.append("connection", "Username-Password-Authentication");
      const signUpResponse = await fetch(
        "https://bcombs.auth0.com/dbconnections/signup",
        {
          method: "POST",
          body: params
        }
      );
      authData = await signUpResponse.json();
    } else {
      authData = user;
    }
    const rows = await db.query(
      "SELECT BIN_TO_UUID(id) AS id FROM user_types WHERE name='USER'"
    );
    await db.query(
      `INSERT IGNORE INTO users(id,auth_id,type,email,username) values(UUID_TO_BIN(UUID()),?,UUID_TO_BIN(?),?,?)`,
      [
        user.hasOwnProperty("isSocial")
          ? authData.sub
          : `auth0|${authData._id}`,
        user.hasOwnProperty("isSocial") ? rows[0].id : user.type.id,
        user.email,
        user.username
      ]
    );
    res.send({ error: "", messageType: "info", message: "User Added!" });
  } catch (error) {
    res.send({
      error: "there error in requesting add user endpoint.",
      messageType: "error",
      message: "error"
    });
  } finally {
    await db.close();
  }
});
export default router;
