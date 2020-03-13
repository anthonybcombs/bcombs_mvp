import express from "express";
import { makeDb } from "../helpers/database";
import fetch from "node-fetch";
const router = express.Router();

router.get("/userTypes", async (req, res) => {
  const db = makeDb();
  const result = [];
  try {
    const userTypes = await db.query(
      "SELECT BIN_TO_UUID(ID) as id,name FROM user_type"
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
      res.send(JSON.stringify({ ...authData, ...userInfo }));
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
    const changePasswordResponse = await fetch(
      "https://bcombs.auth0.com/dbconnections/change_password",
      {
        method: "POST",
        body: params
      }
    );
    res.send("success");
  } catch (error) {
    console.log(error);
    res.send("error");
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
          body: params
        }
      );
      authData = await signUpResponse.json();
    } else {
      authData = user;
    }
    const rows = await db.query(
      "SELECT BIN_TO_UUID(id) AS id FROM user_type WHERE name='USER'"
    );
    await db.query(
      `INSERT IGNORE INTO users(id,auth_id,type,email) values(UUID_TO_BIN(UUID()),?,UUID_TO_BIN(?),?)`,
      [
        user.hasOwnProperty("isSocial")
          ? authData.sub
          : `auth0|${authData._id}`,
        user.hasOwnProperty("isSocial") ? rows[0].id : user.type.id,
        user.email
      ]
    );
    res.send("success");
  } catch (error) {
    res.send("error");
  } finally {
    await db.close();
  }
});
export default router;
