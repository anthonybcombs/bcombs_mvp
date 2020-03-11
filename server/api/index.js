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
router.post("/users/add", async (req, res) => {
  try {
    const user = req.body;
    const db = makeDb();
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
    const authData = await signUpResponse.json();
    await db.query(
      `INSERT INTO users(id,auth_id,type,email,verified,username) values(UUID_TO_BIN(UUID()),?,UUID_TO_BIN(?),?,?,?)`,
      [
        authData._id,
        user.type.id,
        user.email,
        authData.email_verified,
        user.username
      ]
    );
    if (authData.hasOwnPropert("_id")) {
      //send email
      await fetch(
        "https://bcombs.auth0.com/api/management/v2/jobs/post_verification_email",
        {
          method: "POST",
          body: {
            user_id: authData.user_id,
            client_id: process.env.AUTH_CLIENT_ID
          }
        }
      );
      res.send("success");
      return;
    }
    res.send("error");
  } catch (error) {
    res.send("error");
  } finally {
    await db.close();
  }
});
export default router;
