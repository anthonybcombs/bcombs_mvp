import express from "express";
import {
  currentS3BucketName,
  s3Bucket,
  s3BucketRootPath,
} from "../helpers/aws";
import { makeDb } from "../helpers/database";
import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";
const multer = require("multer");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
      `SELECT BIN_TO_UUID(id) as id,email,is_profile_filled,BIN_TO_UUID(type),profile_img from users where email=?`,
      [email]
    );
    result = rows[0];
  } catch (error) {
  } finally {
    await db.close();
    return result;
  }
};

const getUserProfileFromDatabase = async (userId) => {
  const db = makeDb();
  let result;
  try {
    const rows = await db.query(
      `SELECT BIN_TO_UUID(id) as id,
        first_name,
        last_name,
        family_relationship,
        gender,
        zip_code,
        birth_date from user_profiles where user_id=UUID_TO_BIN(?)`,
      [userId]
    );
    result = rows[0];
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
    return result;
  }
};

router.get("/userProfile", async (req, res) => {
  try {
    const { email } = req.query;
    const user = await getUserFromDatabase(email);
    const userProfile = await getUserProfileFromDatabase(user.id);
    res.send(JSON.stringify(userProfile || {}));
  } catch (error) {}
});

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

    const response = await getUserFromDatabase(userInfo.email);
    userInfo.isProfileFilled =
      response && response.is_profile_filled === 0 ? false : true;
    userInfo.profileImg =
      response && response.profile_img
        ? `${s3BucketRootPath}${response.profile_img}`
        : null;
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

// FOR REGISTRATION
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
    if (calendarInfo) {
      await db.query(
        "INSERT INTO user_calendars (id,user_id,image,name) VALUES(UUID_TO_BIN(UUID()),UUID_TO_BIN(?),?,?)",
        [id, "", calendarInfo.name]
      );
    }
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
      `INSERT IGNORE INTO users(id,auth_id,type,email,username) values(UUID_TO_BIN(UUID()),?,UUID_TO_BIN(?,true),?,?)`,
      [
        user.hasOwnProperty("isSocial")
          ? authData.sub
          : `auth0|${authData._id}`,
        user.hasOwnProperty("isSocial") ? rows[0].id : user.type.id.toString(),
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

// ADDED BY DENNIS

router.put("/user/profile", async (req, res) => {
  const db = makeDb();
  try {
    const { personalInfo } = req.body;
    console.log("personalInfo req.body", req.body);
    await db.query(
      "UPDATE user_profiles SET first_name=?,last_name=?,family_relationship=?,gender=?,zip_code=?,birth_date=? where id=UUID_TO_BIN(?)",
      [
        personalInfo.firstname,
        personalInfo.lastname,
        personalInfo.familyrelationship,
        personalInfo.gender,
        personalInfo.zipcode,
        personalInfo.dateofbirth,
        personalInfo.id,
      ]
    );
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
  }
});

router.post("/user/photo", upload.single("file"), async (req, res) => {
  const db = makeDb();
  const file = req.file;

  if (file) {
    const { email } = req.body;
    const currentUser = await getUserFromDatabase(email);

    if (currentUser) {
      const params = {
        Bucket: currentS3BucketName,
        Key: `user/${currentUser.id}/${currentUser.id}.jpg`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read",
      };

      s3Bucket.upload(params, async function (err, data) {
        if (err) {
          console.log("Error", err);
          res.status(500).json({ error: true, Message: err });
        } else {
          console.log("Data", data);

          await db.query(
            "UPDATE users SET profile_img=? where id=UUID_TO_BIN(?)",
            [data.key, currentUser.id]
          );
        }
      });
    } else {
      res.status(401).json({ error: true, Message: "User not found" });
    }
  }
});

router.post("/groups", async (req, res) => {
  const db = makeDb();
  try {
    const { name, visibility, email } = req.body;
    const { id } = await getUserFromDatabase(email);

    const response = await db.query(
      "INSERT INTO `groups`(`id`, `name`, `visibility`,`user_id`) VALUES (UUID_TO_BIN(UUID()),?,?,UUID_TO_BIN(?))",
      [name, visibility.toString(), id]
    );

    res.status(201).json({ data: response });
  } catch (error) {
    res.status(400).json({ error: true, Message: "Something went wrong" });
  } finally {
    await db.close();
  }
});

router.post("/usergroups", async (req, res) => {
  const db = makeDb();
  let result = [];
  try {
    const { email } = req.body;
    const { id } = await getUserFromDatabase(email);
    let rows = await db.query(
      "SELECT BIN_TO_UUID(id) as `id`,name,visibility from `groups` WHERE user_id=UUID_TO_BIN(?)",
      [id]
    );
    rows = JSON.parse(JSON.stringify(rows));
    const rowIds = rows.map((item) => `UUID_TO_BIN('${item.id}')`);

    let members = await db.query(
      "SELECT BIN_TO_UUID(group_id) as `group_id`,BIN_TO_UUID(user_id) as `user_id` from `group_members` WHERE `group_id` IN (" +
        rowIds.join(",") +
        ")"
    );
    members = JSON.parse(JSON.stringify(members));
    console.log("members", members);
    const formattedRows = rows.map((item) => {
      const groupMembers = members
        .filter((member) => member.group_id === item.id)
        .map((subItem) => subItem.user_id);

      return {
        ...item,
        contacts: [...(groupMembers || [])],
      };
    });
    console.log();
    res.status(201).json({ data: formattedRows });
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ error: true, Message: "Something went wrong" });
  } finally {
    await db.close();
    return result;
  }
});

router.post("/contact", async (req, res) => {
  const db = makeDb();
  try {
    const {
      id,
      firstName,
      lastName,
      phoneNumber,
      email,
      userIds,
      selectedGroups,
    } = req.body;
    const user = await getUserFromDatabase(email);

    if (user) {
      const response = await db.query(
        "INSERT IGNORE INTO `contacts`(`id`,`user_id`,`first_name`,`last_name`,`phone_number`,`email`) VALUES (UUID_TO_BIN(?),UUID_TO_BIN(?),?,?,?,?)",
        [id, user.id, firstName, lastName, phoneNumber, email]
      );

      let groupValuesQuery = selectedGroups.reduce((accumulator, groupId) => {
        accumulator += `(UUID_TO_BIN("${groupId}"),UUID_TO_BIN("${id}")),`;
        return accumulator;
      }, "");
      groupValuesQuery = groupValuesQuery.substring(
        0,
        groupValuesQuery.length - 1
      );
      console.log("groupValuesQuery", groupValuesQuery);
      await db.query(
        "INSERT IGNORE INTO `group_members`(`group_id`,`user_id`) VALUES " +
          groupValuesQuery
      );
      res.status(201).json({ data: response });
    } else {
      res.status(400).json({ error: true, Message: "User not exist!" });
    }
  } catch (error) {
    console.log("Error", error);
    res.status(400).json({ error: true, Message: "Something went wrong" });
  } finally {
    await db.close();
  }
});

export default router;

// id: contact.id,
// userIds: contact.userIds,
// firstName: contact.firstName,
// lastName: contact.lastName,
// phoneNumber: contact.phoneNumber,
// email: contact.email,
// relation: contact.relation
