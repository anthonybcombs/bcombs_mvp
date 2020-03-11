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
router.post("/users/add", async (req, res) => {
  const user = req.body;
  const db = makeDb();
  try {
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
