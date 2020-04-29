import express from "express";
import { makeDb } from "../helpers/database";
import fetch from "node-fetch";
const router = express.Router();
const isUserExist = async (user) => {
  const db = makeDb();
  let result;
  try {
    const rows = await db.query(
      `SELECT auth_id from users where email=? or username=?`,
      [user.email, user.username]
    );
    if (rows.length > 0) {
      result = true;
      if (user.hasOwnProperty("isSocial")) {
        const authType = user.sub.split("|")[0];
        if (rows[0].auth_id.includes(authType)) {
          result = false;
        }
      }
    } else {
      result = false;
    }
  } catch (error) {
  } finally {
    await db.close();
    return result;
  }
};
const getUserFromDatabase = async (email) => {
  const db = makeDb();
  let result;
  try {
    const rows = await db.query(
      `SELECT BIN_TO_UUID(id) as id,email,is_profile_filled,BIN_TO_UUID(type) from users where email=?`,
      [email]
    );
    result = rows[0];
  } catch (error) {
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
    userTypes.forEach((userType) => {
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
      method: "GET",
      headers: {
        Authorization: `${creds.token_type} ${creds.access_token}`,
        "Content-Type": "application/json",
      },
    });
    const userInfo = await userInfoResponse.json();
    const { is_profile_filled } = await getUserFromDatabase(userInfo.email);
    userInfo.isProfileFilled = is_profile_filled === 0 ? false : true;
    res.send(userInfo);
  } catch (error) {
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
      body: params,
    });
    const authData = await AuthResponse.json();
    if (authData.hasOwnProperty("access_token")) {
      const userInfoResponse = await fetch(
        "https://bcombs.auth0.com/userinfo",
        {
          method: "POST",
          headers: {
            Authorization: `${authData.token_type} ${authData.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const userInfo = await userInfoResponse.json();
      res.send(
        JSON.stringify({
          ...authData,
          ...userInfo,
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
    const reqData = req.body;
    const user = await getUserFromDatabase(reqData.email);
    if (user.hasOwnProperty("email")) {
      const params = new URLSearchParams();
      params.append("client_id", process.env.AUTH_CLIENT_ID);
      params.append("email", user.email);
      params.append("connection", "Username-Password-Authentication");
      await fetch("https://bcombs.auth0.com/dbconnections/change_password", {
        method: "POST",
        body: params,
      });
      res.send({ messageType: "info", message: "Email has been send!" });
      return;
    }
    res.send({
      messageType: "error",
      message: "Email address does not exist.",
    });
  } catch (error) {
    res.send({
      messageType: "error",
      message: "Email address does not exist.",
    });
  }
});
router.post("/users/isuserexist", async (req, res) => {
  try {
    const user = req.body;
    if (await isUserExist(user)) {
      res.send({
        messageType: "error",
        message:
          "User already registered, please use different username and email address.",
      });
      return;
    }
    res.send({
      messageType: "info",
      message: "proceed",
    });
  } catch (error) {}
});
router.post("/users/update", async (req, res) => {
  const db = makeDb();
  try {
    const {
      personalInfo,
      familyMembers,
      members,
      calendarInfo,
      email,
    } = req.body;
    const { id } = await getUserFromDatabase(email);
    await db.query(
      "INSERT INTO user_profiles (id,user_id,first_name,last_name,family_relationship,gender,zip_code,birth_date) values(UUID_TO_BIN(UUID()),UUID_TO_BIN(?),?,?,?,?,?,?)",
      [
        id,
        personalInfo.firstname,
        personalInfo.lastname,
        personalInfo.familyrelationship,
        personalInfo.gender,
        personalInfo.zipcode,
        personalInfo.dateofbirth,
      ]
    );
    await db.query(
      "UPDATE users SET is_profile_filled=1 where id=UUID_TO_BIN(?)",
      [id]
    );
    await db.query(
      "INSERT INTO user_calendars (id,user_id,image,name) VALUES(UUID_TO_BIN(UUID()),UUID_TO_BIN(?),?,?)",
      [id, "", calendarInfo.name]
    );
  } catch (error) {
  } finally {
    await db.close();
  }
});
router.post("/users/add", async (req, res) => {
  const db = makeDb();
  try {
    const user = req.body;
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
          body: params,
        }
      );
      authData = await signUpResponse.json();
    } else {
      authData = user;
    }
    const rows = await db.query(
      "SELECT BIN_TO_UUID(id) AS id FROM user_types WHERE name='USER'"
    );
    const insertedRows = await db.query(
      `INSERT IGNORE INTO users(id,auth_id,type,email,username) values(UUID_TO_BIN(UUID()),?,UUID_TO_BIN(?),?,?)`,
      [
        user.hasOwnProperty("isSocial")
          ? authData.sub
          : `auth0|${authData._id}`,
        user.hasOwnProperty("isSocial") ? rows[0].id : user.type.id,
        user.email,
        user.username,
      ]
    );
    if (insertedRows.affectedRows > 0 && !user.hasOwnProperty("isSocial")) {
      res.send({
        error: "",
        messageType: "info",
        message: `User created! We sent confirmation email to ${user.email}.`,
      });
      return;
    }
    res.send({
      error: "",
      messageType: "",
      message: "",
    });
  } catch (error) {
    res.send({
      error: "there error in requesting add user endpoint.",
      messageType: "error",
      message: "error",
    });
  } finally {
    await db.close();
  }
});
export default router;
