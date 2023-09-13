import express from "express";
import {
  currentS3BucketName,
  s3Bucket,
  s3BucketRootPath,
  uploadFile
} from "../helpers/aws";
import { customConnection, makeDb } from "../helpers/database";
import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";
import { sendMigratedAccount, bookDemoSchedule } from "../helpers/email";

import { submitCustomApplication, addApplicationUser, createApplication } from '../api/applications';
import { addChild } from '../api/child';
import { checkUserEmail, executeSignUp, executeAddUserProfile } from '../api/users';
import { getUserTypes } from "../api/userTypes/";

import {
  addParent
} from "../api/parents";



const multer = require("multer");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const isUserExist = async user => {
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
export const getUserFromDatabase = async email => {
  const db = makeDb();
  let result;
  try {
    const rows = await db.query(
      `SELECT BIN_TO_UUID(id) as id,email,is_profile_filled,BIN_TO_UUID(type),profile_img,attendance_filter_config from users where email=?`,
      [email]
    );
    result = rows[0];
  } catch (error) {
  } finally {
    await db.close();
    return result;
  }
};

export const updateLastLogin = async userId => {
  const db = makeDb();
  let result;

  try {
    const rows = await db.query(
      `UPDATE users SET last_login=now()   where id=UUID_TO_BIN(?)`,
      [userId]
    );
    console.log('updateLastLogin rows', rows)
    result = rows;
  } catch (error) {
    console.log('error updateLastLogin',error)
  } finally {
    await db.close();
    return result;
  }
};


export const getUserProfileFromDatabase = async userId => {
  const db = makeDb();
  let result;
  try {
    const rows = await db.query(
      `SELECT BIN_TO_UUID(id) as id,
        first_name,
        last_name,
        family_relationship,
        gender,
        custom_gender,
        zip_code,
        birth_date,
        address,
        school,
        ethnicity,
        grade,
        security_question1,
        security_question1_answer,
        security_question2,
        security_question2_answer,
        security_question3,
        security_question3_answer,
        is_parent_allow_shared
        from user_profiles where user_id=UUID_TO_BIN(?)`,
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

export const getVendors = async () => {
  const db = makeDb();
  let result;
  try {
    result = await db.query(
      `SELECT 
        BIN_TO_UUID(id) as id,
        id2,
        new_vendorId
        FROM vendor`
    );
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
    return result;
  }
}

export const updateVendorNewId = async ({ newVendorId, id }) => {
  const db = makeDb();
  let result;

  try {
    result = await db.query(
      `UPDATE 
        vendor 
      SET new_vendorId=? 
      WHERE id=UUID_TO_BIN(?)`,
      [newVendorId, id]
    );
  } catch (error) {
    console.log("error update admin", error);
  } finally {
    await db.close();
    return result;
  }
}

export const getUsers = async () => {
  const db = makeDb();
  let result;
  try {
    result = await db.query(
      `SELECT 
        BIN_TO_UUID(id) as id,
        id2,
        new_userId
        FROM users`
    );
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
    return result;
  }
}

export const updateUserNewId = async ({ newUserId, id }) => {
  const db = makeDb();
  let result;

  try {
    result = await db.query(
      `UPDATE 
        users 
      SET new_userId=? 
      WHERE id=UUID_TO_BIN(?)`,
      [newUserId, id]
    );
  } catch (error) {
    console.log("error update admin", error);
  } finally {
    await db.close();
    return result;
  }
}

export const getChilds = async () => {
  const db = makeDb();
  let result;
  try {
    result = await db.query(
      `SELECT 
        id,
        BIN_TO_UUID(ch_id) as ch_id,
        new_childId
        FROM child`
    );
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
    return result;
  }
}

export const updateChildNewId = async ({ newChildId, ch_id }) => {
  const db = makeDb();
  let result;

  try {
    result = await db.query(
      `UPDATE 
        child 
      SET new_childId=? 
      WHERE ch_id=UUID_TO_BIN(?)`,
      [newChildId, ch_id]
    );
  } catch (error) {
    console.log("error update admin", error);
  } finally {
    await db.close();
    return result;
  }
}

export const getParents = async () => {
  const db = makeDb();
  let result;
  try {
    result = await db.query(
      `SELECT 
        id,
        BIN_TO_UUID(parent_id) as parent_id,
        new_parentId
        FROM parent`
    );
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
    return result;
  }
}

export const updateNewParentId = async ({ newParentId, parent_id }) => {
  const db = makeDb();
  let result;

  try {
    result = await db.query(
      `UPDATE 
        parent 
      SET new_parentId=? 
      WHERE parent_id=UUID_TO_BIN(?)`,
      [newParentId, parent_id]
    );
  } catch (error) {
    console.log("error update admin", error);
  } finally {
    await db.close();
    return result;
  }
}

router.get("/updateParentNewId", async (req, res) => {
  const parents = await getParents();
  const defaultSize = 4;

  for (let parent of parents) {
    let addZero = 0;
    if (parent.id > 9999) {
      addZero = 1;
    }

    const id2 = parent.id + "";
    const padId = id2.padStart(defaultSize + addZero, '0');
    const newParentId = 'P11' + padId;
    parent.newParentId = newParentId;

    if (!parent.new_parentId) {
      updateNewParentId(parent);
    }

    delete parent.newParentId;
  }
  res.send(parents);
});

router.get("/updateChildNewId", async (req, res) => {
  let childs = await getChilds();
  const defaultSize = 4;

  childs = childs.filter(ch => {
    return !ch.new_childId
  })

  for (let child of childs) {
    let addZero = 0;
    if (child.id > 9999) {
      addZero = 1;
    }

    const id2 = child.id + "";
    const padId = id2.padStart(defaultSize + addZero, '0');
    const newChildId = 'C11' + padId;
    child.newChildId = newChildId;

    if (!child.new_childId) {
      updateChildNewId(child);
    }
  }
  res.send(childs);
});

router.get("/updateUserNewId", async (req, res) => {
  const users = await getUsers();
  const defaultSize = 4;
  for (let user of users) {
    let addZero = 0;

    if (user.id2 > 9999) {
      addZero = 1;
    }

    const id2 = user.id2 + "";
    const padId = id2.padStart(defaultSize + addZero, '0');
    const newUserId = 'U11' + padId;
    user.newUserId = newUserId;

    if (!user.new_userId) {
      await updateUserNewId(user);
    }
  }
  res.send(users);
});

router.get("/updateVendorNewId", async (req, res) => {
  const vendors = await getVendors();

  vendors.map(async (vendor) => {
    let addZero = 0;
    const defaultSize = 4;

    if (vendor.id2 > 9999) {
      addZero = 1;
    }

    const id2 = vendor.id2 + "";
    const padId = id2.padStart(defaultSize + addZero, '0');
    const newVendorId = 'V11' + padId;
    vendor.newVendorId = newVendorId;

    if (!vendor.new_vendorId) {
      await updateVendorNewId(vendor);
    }
  });
  res.send(vendors);
});

router.get("/userProfile", async (req, res) => {
  try {
    const { email } = req.query;
    const user = await getUserFromDatabase(email);
    const userProfile = await getUserProfileFromDatabase(user.id);
    res.send(JSON.stringify(userProfile || {}));
  } catch (error) { }
});

router.get("/securityQuestions", async (req, res) => {
  try {
    const { email } = req.query;

    console.log("securityQuestions", email);
    const user = await getUserFromDatabase(email);
    console.log("securityQuestions user", user);
    let result = {};
    if (user) {
      const userProfile = await getUserProfileFromDatabase(user.id);

      if (userProfile) {
        result = {
          security_question1: userProfile.security_question1,
          security_question2: userProfile.security_question2,
          security_question3: userProfile.security_question3
        };
        console.log("securityQuestions result", result);
      } else {
        result = {
          error: "Please complete profile first."
        };
      }
    } else {
      result = {
        error: "Email address doesn't exist."
      };
    }
    res.send(JSON.stringify(result));
  } catch (error) {
    res.send(error);
  }
});

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
    const userInfoResponse = await fetch(`${process.env.AUTH_API}/userinfo`, {
      method: "GET",
      headers: {
        Authorization: `${creds.token_type} ${creds.access_token}`,
        "Content-Type": "application/json"
      }
    });
    const userInfo = await userInfoResponse.json();

    const response = await getUserFromDatabase(userInfo.email);
    userInfo.is_profile_filled =
      response && response.is_profile_filled === 0 ? false : true;
    userInfo.profile_img =
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
    const AuthResponse = await fetch(`${process.env.AUTH_API}/oauth/token`, {
      method: "POST",
      body: params
    });
    const authData = await AuthResponse.json();
    if (authData.hasOwnProperty("access_token")) {
      const userInfoResponse = await fetch(`${process.env.AUTH_API}/userinfo`, {
        method: "POST",
        headers: {
          Authorization: `${authData.token_type} ${authData.access_token}`,
          "Content-Type": "application/json"
        }
      });
      const userInfo = await userInfoResponse.json();
      res.send(
        JSON.stringify({
          ...authData,
          ...userInfo
        })
      );
      return;
    }
    c
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
      await fetch(
        `${process.env.AUTH_API}/dbconnections/change_password`, {
        method: "POST",
        body: params
      });
      res.send({ messageType: "info", message: "Email has been send!" });
      return;
    }
    res.send({
      messageType: "error",
      message: "Email address does not exist."
    });
  } catch (error) {
    res.send({
      messageType: "error",
      message: "Email address does not exist."
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
          "User already registered, please use different username and email address."
      });
      return;
    }
    res.send({
      messageType: "info",
      message: "proced"
    });
  } catch (error) { }
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
      email
    } = req.body;
    const { id } = await getUserFromDatabase(email);
    await db.query(
      "INSERT INTO user_profiles (id,user_id,first_name,last_name,family_relationship,gender,custom_gender,zip_code,birth_date) values(UUID_TO_BIN(UUID()),UUID_TO_BIN(?),?,?,?,?,?,?,?)",
      [
        id,
        personalInfo.firstname,
        personalInfo.lastname,
        personalInfo.familyrelationship,
        personalInfo.gender,
        personalInfo.customgender,
        personalInfo.zipcode,
        personalInfo.dateofbirth
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
        `${process.env.AUTH_API}/dbconnections/signup`,
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
    const insertedRows = await db.query(
      `INSERT IGNORE INTO users(id,auth_id,type,email,username) values(UUID_TO_BIN(UUID()),?,UUID_TO_BIN(?,true),?,?)`,
      [
        user.hasOwnProperty("isSocial")
          ? authData.sub
          : `auth0|${authData._id}`,
        user.hasOwnProperty("isSocial") ? rows[0].id : user.type.id.toString(),
        user.email,
        user.username
      ]
    );
    if (insertedRows.affectedRows > 0 && !user.hasOwnProperty("isSocial")) {
      res.send({
        error: "",
        messageType: "info",
        message: `User created! We sent confirmation email to ${user.email}.`
      });
      return;
    }
    res.send({
      error: "",
      messageType: "",
      message: ""
    });
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

// ADDED BY DENNIS

router.put("/user/profile", async (req, res) => {
  const db = makeDb();
  try {
    const { personalInfo, otherInfo } = req.body;
    console.log("req.bodyyy", otherInfo);
    await db.query(
      "UPDATE user_profiles SET first_name=?,last_name=?,family_relationship=?,gender=?,custom_gender=?,zip_code=?,birth_date=?,address=?,school=?,ethnicity=?,grade=?,security_question1=?,security_question1_answer=?,security_question2=?,security_question2_answer=?,security_question3=?,security_question3_answer=?,is_parent_allow_shared=? where id=UUID_TO_BIN(?)",
      [
        personalInfo.firstname,
        personalInfo.lastname,
        personalInfo.familyrelationship,
        personalInfo.gender,
        personalInfo.customgender,
        personalInfo.zipcode,
        personalInfo.dateofbirth,
        personalInfo.address,
        personalInfo.school,
        personalInfo.ethnicity,
        personalInfo.grade,
        personalInfo.securityquestion1,
        personalInfo.securityquestion1answer,
        personalInfo.securityquestion2,
        personalInfo.securityquestion2answer,
        personalInfo.securityquestion3,
        personalInfo.securityquestion3answer,
        personalInfo.is_parent_allow_shared,
        personalInfo.id
      ]
    );

    if (otherInfo.child_ids && otherInfo.child_ids.length > 0) {
      const childIds = otherInfo.child_ids.map(id => `UUID_TO_BIN("${id}")`);
      console.log("Child Ids", childIds);
      await db.query(
        `UPDATE child SET firstname=?,lastname=?,birthdate=?,gender=?,zip_code=? WHERE ch_id IN (${childIds.join(
          ","
        )})`,
        [
          personalInfo.firstname,
          personalInfo.lastname,
          personalInfo.dateofbirth,
          personalInfo.gender,
          personalInfo.zipcode
        ]
      );
    }

    if (otherInfo.parent_ids && otherInfo.parent_ids.length > 0) {
      const parentIds = otherInfo.parent_ids.map(id => `UUID_TO_BIN('${id}')`);
      console.log("Parent Ids", parentIds);
      await db.query(
        `UPDATE parent SET firstname=?,lastname=?,address=?,zip_code=?, is_parent_allow_shared=? WHERE parent_id IN (${parentIds.join(
          ","
        )})`,
        [
          personalInfo.firstname,
          personalInfo.lastname,
          personalInfo.address,
          personalInfo.zipcode,
          personalInfo.is_parent_allow_shared
        ]
      );
    }

    const payload = {
      first_name: personalInfo.firstname,
      last_name: personalInfo.lastname,
      family_relationship: personalInfo.family_relationship,
      gender: personalInfo.gender,
      custom_gender: personalInfo.customgender,
      birth_date: personalInfo.dateofbirth,
      zip_code: personalInfo.zipcode,
      address: personalInfo.address,
      ethnicity: personalInfo.ethnicity,
      school: personalInfo.school,
      grade: personalInfo.grade,
      security_question1: personalInfo.securityquestion1,
      security_question1_answer: personalInfo.securityquestion1answer,
      security_question2: personalInfo.securityquestion2,
      security_question2_answer: personalInfo.securityquestion2answer,
      security_question3: personalInfo.securityquestion3,
      security_question3_answer: personalInfo.securityquestion3answer,
      is_info_shared: personalInfo.is_info_shared,
      is_parent_allow_shared: personalInfo.is_parent_allow_shared,
      id: personalInfo.id
    };

    res.status(200).json({ data: payload });
  } catch (error) {
    console.log("Error", error);
    res.status(400).json({ error: true, Message: error });
  } finally {
    await db.close();
  }
});

router.post("/user/photo", async (req, res) => {
  const db = makeDb();
  try {
    const { email, image } = req.body;
    console.log("REQ.BODYYYYYYY", req.body);
    const currentUser = await getUserFromDatabase(email);
    if (currentUser) {
      const buf = Buffer.from(
        image.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      const s3Payload = {
        Bucket: currentS3BucketName,
        Key: `user/${currentUser.id}/${currentUser.id}.jpg`,
        Body: buf,
        ContentEncoding: "base64",
        ContentType: "image/jpeg",
        ACL: "public-read"
      };
      await uploadFile(s3Payload);

      await db.query("UPDATE users SET profile_img=? where id=UUID_TO_BIN(?)", [
        s3Payload.Key,
        currentUser.id
      ]);
      let updatedUser = await getUserFromDatabase(email);

      updatedUser.profile_img = updatedUser.profile_img
        ? `${s3BucketRootPath}${updatedUser.profile_img
        }?${new Date().getTime()}`
        : "";

      res.status(200).json({ error: true, data: updatedUser });
    } else {
      res.status(401).json({ error: true, Message: "User not found" });
    }
  } catch (err) {
    console.log("ERROR", err);
    res.status(500).json({ error: true, Message: "Something went wrong" });
  } finally {
    db.close();
  }
});

// router.post("/groups", async (req, res) => {
//   const db = makeDb();
//   try {
//     const { id, name, visibility, email, contacts = [] } = req.body;
//     const currentUser = await getUserFromDatabase(email);

//     const response = await db.query(
//       "INSERT INTO `groups`( `id`,`name`, `visibility`,`user_id`) VALUES (UUID_TO_BIN(?),?,?,UUID_TO_BIN(?))",
//       [id, name, visibility || "Public", currentUser.id]
//     );

//     if (contacts.length > 0) {
//       let groupMemberValuesQuery = contacts.reduce((accumulator, memberId) => {
//         accumulator += `(UUID_TO_BIN("${id}"),UUID_TO_BIN("${memberId}")),`;
//         return accumulator;
//       }, "");

//       groupMemberValuesQuery = groupMemberValuesQuery.substring(
//         0,
//         groupMemberValuesQuery.length - 1
//       );

//       await db.query(
//         "INSERT IGNORE INTO `group_members`(`group_id`,`user_id`) VALUES " +
//           groupMemberValuesQuery
//       );
//     }

//     res.status(201).json({ data: response });
//   } catch (error) {
//     console.log("error", error);
//     res.status(400).json({ error: true, Message: "Something went wrong" });
//   } finally {
//     await db.close();
//   }
// });

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

    const rowIds = rows.map(item => `UUID_TO_BIN("${item.id}")`);

    let members =
      rowIds && rowIds.length > 0
        ? await db.query(
          "SELECT BIN_TO_UUID(group_id) as `group_id`,BIN_TO_UUID(user_id) as `user_id` from `group_members` WHERE `group_id` IN (" +
          rowIds.join(",") +
          ")"
        )
        : [];
    members = JSON.parse(JSON.stringify(members));

    const formattedRows = rows.map(item => {
      const groupMembers = members
        .filter(member => member.group_id === item.id)
        .map(subItem => subItem.user_id);

      return {
        ...item,
        contacts: [...(groupMembers || [])]
      };
    });

    res.status(201).json({ data: formattedRows });
  } catch (error) {
    console.log("Error", error);
    res.status(400).json({ error: true, Message: "Something went wrong" });
  } finally {
    await db.close();
  }
});

router.post("/contact", async (req, res) => {
  const db = makeDb();
  try {
    const {
      id,
      first_name,
      last_name,
      phone_number,
      email,
      relation,
      authEmail,
      selectedGroups = []
    } = req.body;
    const user = await getUserFromDatabase(email);
    const currentUser = await getUserFromDatabase(authEmail);
    if (user) {
      const response = await db.query(
        "INSERT IGNORE INTO `contacts`(`id`,`user_id`,`first_name`,`last_name`,`phone_number`,`email`,`relation`,`added_by`) VALUES (UUID_TO_BIN(?),UUID_TO_BIN(?),?,?,?,?,?,UUID_TO_BIN(?))",
        [
          id,
          user.id,
          first_name,
          last_name,
          phone_number,
          email,
          relation,
          currentUser.id
        ]
      );

      if (selectedGroups.length > 0) {
        let groupValuesQuery = selectedGroups.reduce((accumulator, groupId) => {
          accumulator += `(UUID_TO_BIN("${groupId}"),UUID_TO_BIN("${id}")),`;
          return accumulator;
        }, "");
        groupValuesQuery = groupValuesQuery.substring(
          0,
          groupValuesQuery.length - 1
        );

        await db.query(
          "INSERT IGNORE INTO `group_members`(`group_id`,`user_id`) VALUES " +
          groupValuesQuery
        );
      }

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

router.post("/group/update", upload.single("file"), async (req, res) => {
  const db = makeDb();
  const file = req.file;
  const { id = '', email, selected_contacts } = req.body;
  console.log('REQ BODYYY', req.body)
  const currentUser = await getUserFromDatabase(email);

  if (file) {
    if (currentUser) {
      const params = {
        Bucket: currentS3BucketName,
        Key: `group/${currentUser.id}/${currentUser.id}.jpg`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read"
      };

      s3Bucket.upload(params, async function (err, data) {
        if (err) {
          res.status(500).json({ error: true, Message: err });
        } else {
          await db.query(
            "UPDATE groups SET profile_img=? where id=UUID_TO_BIN(?)",
            [data.key, id]
          );
        }
      });
    } else {
      res.status(401).json({ error: true, Message: "User not found" });
    }
  }
});

router.get("/invitation/event/:id", async (req, res) => {
  const db = makeDb();
  const { id } = req.params;
  const { calendar, response, userId } = req.query;

  try {
    await db.query(
      "UPDATE `event_attendee` SET status=? WHERE event_id=UUID_TO_BIN(?) AND user_id=UUID_TO_BIN(?)",
      [response, id, userId]
    );

    await db.query(
      "INSERT IGNORE INTO event_calendar(event_id,calendar_id,date_added) VALUES (UUID_TO_BIN(?),UUID_TO_BIN(?),NOW())",
      [id, calendar]
    );

    res.redirect(`${process.env.APP_CLIENT_URL}/dashboard`);
  } catch (error) {
    console.log("Invitation Error", error);
  } finally {
    await db.close();
  }
});
router.get("/invitation/calendar/:id/:status", async (req, res) => {
  const db = makeDb();
  const { id, status } = req.params;
  const { userId, groupId } = req.query;

  try {
    await db.query(
      `UPDATE user_calendars_follow SET is_following=? WHERE calendar_id=UUID_TO_BIN(?) AND user_id=UUID_TO_BIN(?) AND group_id=UUID_TO_BIN(?)`,
      [status, id, userId, groupId]
    );
    res.redirect(`${process.env.APP_CLIENT_URL}/dashboard/mycalendars`);
  } catch (error) {
    console.log("Invitation Error", error);
  } finally {
    await db.close();
  }
});



router.post("/child/attendance/search", async (req, res) => {
  const db = makeDb();
  const { firstname, lastname, childId, eventId, attendanceType } = req.body;
  let child = null;
  let childAttendance = null;
  try {

    child = await db.query(
      `SELECT BIN_TO_UUID(c.ch_id) as ch_id, c.firstname, c.lastname, c.new_childId
      FROM child c
      WHERE c.new_childId=? AND c.firstname=? AND c.lastname=?
     `,
      [childId, firstname, lastname]
    );

    child =  child && child[0] && {
      ...child[0],
      ch_id: child[0].ch_id
    };

    if(child && attendanceType === 'forms') {
      const customApplication = await db.query(
        `SELECT BIN_TO_UUID(c.app_id) as ch_id
        FROM custom_application c
        WHERE c.child=UUID_TO_BIN(?)
       `,
        [child.ch_id]
      );

      console.log('customApplication',customApplication)
      if(customApplication && customApplication[0]) {
        child.ch_id = customApplication[0].ch_id;
      }

    }
 


    if (child) {
      childAttendance = await db.query(
        `SELECT a.*, 
          BIN_TO_UUID(a.app_group_id) as app_group_id, 
          BIN_TO_UUID(a.child_id) as child_id,
          BIN_TO_UUID(a.event_id) as event_id
          FROM attendance a
          WHERE a.child_id=UUID_TO_BIN(?) AND a.event_id=UUID_TO_BIN(?)
       `,
        [child.ch_id, eventId]
      );
      childAttendance = childAttendance ? childAttendance[0] : null
      console.log('attendanceeee', childAttendance)
    }
  } catch (error) {
    console.log("Search Child Error", error);
  } finally {
    db.close();

    return res.json({
      child: child,
      attendance: childAttendance
    })
  }
});

router.get("/event/:eventId", async (req, res) => {

  const db = makeDb();
  const { eventId } = req.params;
  let event = null;
  try {
    event = await db.query(
      `SELECT 
        id,
        event_type,
        title, 
        start, 
        end, 
        is_full_day, 
        vendor_app_group, 
        tags, 
        description, 
        qr_code_url, 
        location
      FROM bc_calendar_event
      WHERE id=?
     `,
      [eventId]
    );
    event = event && event[0]
  }catch(error) {

    console.log('error',error)
    return res.json({
      event: null,
      message: 'Something went wrong'
    });
  } finally {
    db.close();
    return res.json({
      event
    });
  }

})

router.get("/attendance/events", async (req, res) => {
  const db = makeDb();
  const { vendorId, appGroup } = req.query;
  let { attendanceType } = req.query;

  let events = null;

  try {

    let whereValues = [vendorId];

    if(attendanceType) {
      attendanceType = attendanceType === 'mentoring' ? 'bcombs' : 'forms'; 
      whereValues = [
        ...whereValues,
        attendanceType
      ]
    }

    if(appGroup  && attendanceType) {
      whereValues = [
        ...whereValues,
        appGroup
      ]
    }

    events = await db.query(
      `SELECT 
        bce.id,
        bce.event_type,
        bce.title, 
        bce.start, 
        bce.end, 
        bce.is_full_day, 
        bce.vendor_app_group, 
        bce.tags, 
        bce.description, 
        bce.qr_code_url, 
        bce.location,
        bce.attendance_type,
        v.name as app_group_name,
        CONVERT( vca.form_contents  USING utf8) as form_contents

      FROM bc_calendar_event bce
      LEFT JOIN vendor_app_groups v ON v.app_grp_id=UUID_TO_BIN(bce.attendance_app_group)
      LEFT JOIN vendor_custom_application vca ON vca.form_id=UUID_TO_BIN(bce.attendance_app_group)
      WHERE bce.vendor_id2=? AND bce.event_type='attendance'
      ${attendanceType ? ' AND bce.attendance_type=? ' : ''}
      ${appGroup ? ' AND bce.attendance_app_group=? ' : ''}
      ORDER BY bce.start DESC
     `,
     whereValues
    );

      
  
      for(let x = 0; x < events.length; x++) {

        if(events[x].attendance_type === 'forms' && events[x].form_contents) {

          events[x].form_contents = events[x].form_contents ? Buffer.from(events[x].form_contents, "base64").toString("utf-8") : "{}";
          events[x].form_contents = JSON.parse(events[x].form_contents);
  
          if(events[x].form_contents && events[x].form_contents.formData) {
            events[x].form_name = events[x].form_contents.formTitle;
            delete events[x].form_contents;
          }
        }

   
      }





  } catch (error) {
    console.log("Search Child Error", error);
  } finally {
    db.close();

    return res.json({
      events
    });
  }
});


router.delete("/attendance/event", async (req, res) => {

  const db = makeDb();
  const { eventId, vendorId } = req.body;
  let event = null;
  try {


    const currentEvent = await db.query(
      `SELECT qr_code_url FROM bc_calendar_event WHERE id=? AND vendor_id2=?`,
      [eventId, vendorId]
    );

    if (currentEvent && currentEvent[0]) {

      if (currentEvent[0].qr_code_url) {
        await deleteFile(currentEvent[0].qr_code_url);
      }

      await db.query(
        `DELETE  FROM attendance WHERE event_id=UUID_TO_BIN(?)`,
        [eventId]
      );
      await db.query(
        `DELETE  FROM bc_calendar_event WHERE id=? AND vendor_id2=?`,
        [eventId, vendorId]
      );
  
    }


    event = event && event[0]
  } catch (error) {

    console.log('error', error)
    return res.json({
      event: null,
      message: 'Something went wrong'
    });
  } finally {
    db.close();
    return res.json({
      message: 'Event has been deleted successfully!'
    });
  }

})

router.get("/parentvendor", async (req, res) => {
  const db = makeDb();
  const { email } = req.query;

  try {
    const vendors = await db.query(
      `SELECT DISTINCT BIN_TO_UUID(a.vendor) vendor_id, v.name, a.class_teacher from parent p, application a, vendor v 
      WHERE p.email_address=? AND
      p.application=a.app_id AND v.id=a.vendor;
 `,
      [email]
    );

    const applicationGroups = vendors.map(item => {
      return item.class_teacher ? item.class_teacher.split(',') : []
    }).flat()


    let vendorAppGroups = [];
    let vendorsIds = vendors.map(item => `UUID_TO_BIN('${item.vendor_id}')`).join(',');
    const vendorAppGroupIds = applicationGroups.map(id => `UUID_TO_BIN('${id}')`).join(',');

    if (vendorsIds.length > 0) {
      vendorAppGroups = await db.query(
        `SELECT name, BIN_TO_UUID(app_grp_id) as app_grp_id, BIN_TO_UUID(vendor) as vendor_id FROM vendor_app_groups
         WHERE app_grp_id IN (${vendorAppGroupIds});
      `
        // [email]
      );
    }

    return res.json({
      vendors,
      vendorAppGroups
    })
  } catch (error) {
    console.log("GET Parent Vendor Error", error);
  } finally {
    await db.close();
  }
});


router.post("/application/import", async (req, res) => {

  const db = makeDb();
  try {
    const { type } = req.query;
    const { data } = req.body;

    
    let userType = await getUserTypes();

    userType = userType.filter(type => {
      return type.name === "USER";
    })[0];

    console.log('userType',userType)

    if (type === 'custom') {

      for (let application of data) {

        let loginType = application.form_contents.formData.filter((item) => {
          return item.type == "login"
        });

        let nameType = application.form_contents.formData.filter((item) => {
          return item.type == "name" && item.label !== 'Parent'
        });

        const formContentString = application.form_contents ? JSON.stringify(application.form_contents) : "{}";
        application.form_contents = Buffer.from(formContentString, "utf-8").toString("base64");

        let email;
        let password;
        let firstname = '';
        let middlename = '';
        let lastname = '';
        const hasLoginField = loginType;
        const hasNameField = nameType;

        loginType = loginType ? loginType[0] : {};

        nameType = nameType ? nameType[0] : {};

        if (hasLoginField) {
          email = loginType?.fields.filter((item) => {
            return item.type == "email"
          });
          password = loginType?.fields.filter((item) => {
            return item.type == "password"
          });

          email = email && email.length > 0 ? email[0] : "";
          password = password && password.length > 0 ? password[0] : "";
        }

        if (hasNameField) {
          firstname = nameType?.fields.filter((item) => {
            return item.label == "First Name"
          });
          middlename = nameType?.fields.filter((item) => {
            return item.label == "Middle Name"
          });
          lastname = nameType?.fields.filter((item) => {
            return item.label == "Last Name"
          });


          let firstnameValue = firstname && firstname[0]?.value.slice(1, -1);
          let lastnameValue = lastname && lastname[0]?.value.slice(1, -1);
          let middlenameValue = middlename && middlename[0]?.value.slice(1, -1);

          const childObj = {
            firstname: firstnameValue,
            lastname: lastnameValue,
            middlename: middlenameValue
          }

          

          const child = await addChild(childObj);


          application.child = child.ch_id;

          const customApplication = await submitCustomApplication(application);

          if(application.account_details) {
 
            if(application.create_profile) {
              let parent = {
                username: application.account_details.firstname + "" + application.account_details.lastname,
                email: application.account_details.email,
                password: application.account_details.password,
                type: userType
              };
    
              const resp = await executeSignUp(parent);
  
              let parentInfo = {
                ...parent,
                email: parent.email,
                dateofbirth: new Date()
              };
  
              await executeAddUserProfile(parentInfo);
              const parentUser = await getUserFromDatabase(parent.email);

              if (parentUser) {
                await addApplicationUser({
                  user_id: parentUser.id,
                  custom_app_id: customApplication.app_id
                });
              }

              
  
  
              console.log('Execute Signup on custom form', resp)
            }
          }
    


        } else {

          return res.json({
            messageType: "error",
            message: "Prime field name is required"
          })
        }


      }

    }
    // IMPORT MENTORING STARTS HERE
    else if (type === 'mentoring') {
      let newChilds = [];
      let newParents = [];

      for (let application of data) {
      
        const tempChildId = null;

        console.log('application.child',application.child)

        const child = await addChild({ ...application.child });
        const parents = application.parents;
        const currentChild = { ...application.child };

        application.class_teacher = "";
        application.child = child && child.ch_id;

        newChilds.push({
          tempId: tempChildId,
          newId: child.ch_id
        })

        application = await createApplication(application);

        const tempParentId = null;
        parents.application = application.app_id;
        const newParent = await addParent(parents);
        let checkEmail = await checkUserEmail(parents.email_address);

        if (checkEmail && checkEmail.is_exist && checkEmail.status !== 'Email is available to use') {
          console.log("Parent Status: ", checkEmail.status);
        } else {
       
          let user = {
            username: parents.firstname + "" + parents.lastname,
            email: parents.email_address,
            password: parents.password,
            type: userType
          };


          console.log('parents.create_profile', parents.create_profile)
          if (parents.create_profile) {
            await executeSignUp(user);

            let parentInfo = {
              ...parents,
              email: parents.email_address,
              dateofbirth: parents.birthdate
            };

            await executeAddUserProfile(parentInfo);
          }

          // if (currentChild && currentChild.create_profile && currentChild.password) {
          //   let childUser = {
          //     username: currentChild.firstname + "" + currentChild.lastname,
          //     email: currentChild.email_address,
          //     password: currentChild.password,
          //     type: userType
          //   };

          //   console.log('childUser', childUser)
          //   const resp = await executeSignUp(childUser);
          //   console.log('childUser resp', resp)
          // }

          newParents.push({
            tempId: tempParentId,
            newId: newParent?.parent_id
          })

          const parentUser = await getUserFromDatabase(parents.email_address);


          if (parentUser) {
            await addApplicationUser({
              user_id: parentUser.id,
              app_id: application.app_id
            });
          }


        }


      }
    }

  }
  catch (error) {
    console.log("GET Parent Vendor Error", error);

    return res.json({
      message: 'Something went wrong'
    })
  } finally {
    await db.close();

    return res.json({
      message: 'Import Success'
    })
  }
})


// router.post("/vendor/default", async (req, res) => {
//   const db = makeDb();
//   try {
//     const { user_id, vendor_id } = req.body;
//     console.log('user_id', user_id)
//     console.log('vendor_id', vendor_id)
    
//     if (vendor_id) {
//       await db.query(`UPDATE vendor
//         SET is_default = CASE
//         WHEN id=UUID_TO_BIN(?) THEN 1
//         ELSE 0
//         END
//         WHERE user=UUID_TO_BIN(?);
//       `,
//         [vendor_id, user_id]
//       );
//     }
//     else {
//       await db.query(`UPDATE vendor
//         SET is_default = 0
//         WHERE user=UUID_TO_BIN(?);
//       `,
//         [user_id]
//       );
//     }

//   }
//   catch (error) {
//     console.log('Vendor Default Error', error)
//     return res.json({
//       message: 'Something went wrong'
//     })
//   } finally {
//     await db.close();
//     return res.json({
//       message: 'Vendor Updated'
//     })
//   }

// });


router.post("/demo_schedule/request", async (req, res) => {
  try {
    const {
      organizationName = '',
      organizationType = '',
      organizationSize = '',
      websiteUrl = '',
      fullName = '',
      clientEmail = '',
      contactNo = ''
    } = req.body

    await bookDemoSchedule({
      organizationName,
      organizationType,
      organizationSize,
      websiteUrl,
      fullName,
      clientEmail,
      contactNo
    })
    return res.json({
      message: 'message sent'
    })
  } catch (error) {
    return res.json({
      message: 'Something went wrong'
    })
  }
});




// SCRIPT FOR MIGRATION

const BACKUP_VENDOR = [
  //"info@100blackmenofcharlotte.org"
  "rsinger@100blackmen-atlanta.org"
  // "100blackmentriangleeast@gmail.com",
  // "jewettwalker@100bmla.net"
];

function getFormattedDate(date) {
  date = new Date(date);

  if (date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, "0");
    let day = date
      .getDate()
      .toString()
      .padStart(2, "0");

    return year + "-" + month + "-" + day;
  }
  return null;
}

router.get("/migrate", async (req, res) => {
  const remoteDb = customConnection(
    "162.241.217.198",
    "bcombstc_bcomb",
    "Bcomb@123",
    "bcombstc_bcombss"
  );
  try {
    if (!remoteDb) {
      res.status(401).json({ Message: "Connection not found!" });
    }
    const applicationResults = await remoteDb.query(
      "select * from application;"
    );
    const userResults = await remoteDb.query("select * from users;");
    const schoolResults = await remoteDb.query("select * from schools;");
    const parentResults = await remoteDb.query("select * from parent;");
    // let users = userResults.filter(user => user.user_type === "User");
    let vendors = userResults.filter(
      user => user.user_type === "Vendor" && BACKUP_VENDOR.includes(user.email)
    );

    let allUsers = vendors.map(user => {
      let name = user.name.split(" ");
      let username = user.email.split("@");
      let payload = {
        user: {
          id: user.id,
          email: user.email,
          type:
            user.user_type === "User"
              ? "5de2809e-c2b3-5cc5-a0c2-bf11c3aae280"
              : "61c3b2e2-8099-c5be-c5a0-c2bf11c3aae2",
          username: username[0],
          user_type: user.user_type,
          is_profile_filled: 0,
          password: `Bcombs123!`
        },
        profile: {
          firstname: name[0],
          lastname: name[1],
          gender: user.gender === 2 ? "Male" : "Female",
          zip: user.zip_code,
          birth_date: getFormattedDate(user.dob),
          address: user.address,
          city: user.city
        }
      };

      if (user.user_type === "Vendor") {
        const currentSchool = schoolResults.find(
          school =>
            BACKUP_VENDOR.includes(school.schoolEmail) &&
            school.schoolEmail == user.email
        );

        if (currentSchool) {
          let applications = applicationResults
            .filter(
              application => application.school === currentSchool.schoolName
            )
            .map((application, index) => {
              let currentParent = parentResults.filter(
                parent => parent.appId === application.appId
              );
              currentParent = currentParent.map(parent => {
                return {
                  application: parent.appId,
                  relationchip_to_child: parent.relationshipToChild,
                  firstname: parent.fnameParent,
                  lastname: parent.lnameParent,
                  phone_type: parent.primaryPhoneTypeParent,
                  phone_number: parent.primaryPhoneNumberParent,
                  secondary_phone_type: parent.primarySecondPhoneTypeParent,
                  secondary_phone_number: parent.primarySecondPhoneNumberParent,
                  email_type: parent.emailTypeParent,
                  email_address: parent.PrimaryEmailParent,
                  secondary_email_type: parent.PrimarySecondEmailTypeParent,
                  secondary_email_address: parent.PrimarySecondEmailParent,
                  password: `Bcombs123_${index}!!!`,
                  gender: parent.genderParent,
                  address: parent.PrimaryAddressTypeParent,
                  state: parent.PrimaryStateParent,
                  city: parent.PrimaryCity,
                  zip_code: parent.PrimaryZipParent,

                  occupation: parent.occupationParent,
                  employers_name: parent.employeenameParent,
                  parent_goals: parent.goalProgramParent,
                  parent_child_goals: parent.goalChildProgramParent,
                  level_of_education: parent.highLevel_edu_parent,
                  child_hs_grad: parent.child_grad_parent,
                  child_col_grad: parent.child_att_col_parent
                };
              });

              let studentStatus = application.studentStatus;
              if (studentStatus === "IP") {
                studentStatus = "new_applicant_in_process";
              } else if (studentStatus === "SU") {
                studentStatus = "current_student";
              } else if (studentStatus === "A") {
                studentStatus = "new_applicant_accepted";
              } else if (studentStatus === "R") {
                studentStatus = "new_applicant_rejected";
              } else if (studentStatus === "WL") {
                studentStatus = "waiting_list";
              } else if (studentStatus === "NLS") {
                studentStatus = "no_longer_student";
              } else if (studentStatus === "MO") {
                studentStatus = "missed_opportunity";
              }

              let applicationStatus = "waiting_for_verification";
              if (application.status === "V") {
                applicationStatus = "verified";
              } else if (application.status === "R") {
                applicationStatus = "rejected";
              }
              return {
                id: application.appId,
                verification: applicationStatus,
                application_date: application.created_at,
                is_archieved: application.archieveStatus,
                archived_date: application.archieved_date,
                color_designation: application.color,
                notes: application.notes,
                student_status: studentStatus,
                children: {
                  phone_type: application.child_phoneType,
                  phone_number: application.child_phoneNo,
                  secondary_phone_type: application.child_second_phoneType,
                  secondary_phone_number: application.child_second_phoneNo,
                  email_address: application.emailChild,
                  email_type: application.child_emailType,
                  secondary_email_address: application.emailSecondChild,
                  secondary_email_type: application.second_child_emailType,
                  firstname: application.fnamChild,
                  lastname: application.lnamChild,

                  birthdate: getFormattedDate(application.dobChild),
                  gender: application.genderChild,
                  address: application.addressChild,
                  city: application.cityChild,
                  zip_code: application.zipChild,
                  location_site: application.locationSiteChild || "",
                  state: application.stateChild,
                  ethnicities: application.ethnicityChild,
                  programs: application.programChild,
                  hobbies: application.child_hobbies,
                  life_events: application.life_events,
                  career_goals: application.child_career_goals,
                  colleges: application.child_list_colleges,
                  awards: application.child_list_award,
                  language: application.languageChild,
                  accomplishments: application.child_list_accomp,
                  year_taken: application.start_year_as_mentee,
                  grade: application.grade,
                  school_name: application.school,
                  school_phone: application.prevschoolphoneChild,
                  gpa_quarter_year: application.gpa_child,
                  gpa_quarter_q1: application.gpa_q1_child,
                  gpa_quarter_q2: application.gpa_q2_child,
                  gpa_quarter_q3: application.gpa_q3_child,
                  gpa_quarter_q4: application.gpa_q4_child,
                  gpa_cumulative_year: application.gpa_cum_child,
                  gpa_cumulative_q1: application.gpa_cum_q1_child,
                  gpa_cumulative_q2: application.gpa_cum_q2_child,
                  gpa_cumulative_q3: application.gpa_cum_q3_child,
                  gpa_cumulative_q4: application.gpa_cum_q4_child,
                  doctor_name: application.underDoctorCareChild,
                  hospital_preference: application.hospitalnameChild,
                  hospital_phone: application.hospitalphoneChild,
                  mentee_gain_program: application.child_mentee_hope,
                  class_rank: application.class_rank
                },
                parents: currentParent
              };
            });

          payload = {
            ...payload,
            vendor: {
              ...(currentSchool || {})
            },
            applications
          };
        }
      }

      return payload;
    });

    await remoteDb.close();
    const db = makeDb();

    console.log("process.env.AUTH_CLIENT_ID", process.env.AUTH_CLIENT_ID);
    for (const item of allUsers) {
      const params = new URLSearchParams();
      //console.log("Create Account: Email", item.user.email);

      params.append("client_id", process.env.AUTH_CLIENT_ID);
      params.append("username", item.user.username);
      params.append("email", item.user.email);
      params.append("password", item.user.password);
      params.append("connection", "Username-Password-Authentication");
      const signUpResponse = await fetch(
        "https://bcombd.us.auth0.com/dbconnections/signup",
        {
          method: "POST",
          body: params
        }
      );
      const authData = await signUpResponse.json();

      console.log("Create Account: authData", authData);
      console.log("Create Account: item.user.type", item.user.type);
      console.log("Create Account: item.user.email", item.user.email);
      console.log("Create Account: item.user.username", item.user.username);

      if (authData && authData.statusCode !== 400) {
        const insertedRows = await db.query(
          `INSERT INTO users(id,auth_id,email,type,username)
          VALUES(UUID_TO_BIN(UUID()),?,?,UUID_TO_BIN(?),?)`,
          [
            `auth0|${authData._id}`,
            item.user.email,
            item.user.type,
            item.user.username
          ]
        );
        console.log("Create Account: insertedRows", insertedRows);

        if (insertedRows.affectedRows > 0) {
          const user = await getUserFromDatabase(item.user.email);
          console.log("Create Account: User", user);
          if (user) {
            await db.query(
              "INSERT INTO user_profiles (id,user_id,first_name,last_name,family_relationship,gender,custom_gender,zip_code,birth_date) values(UUID_TO_BIN(UUID()),UUID_TO_BIN(?),?,?,?,?,?,?,?)",
              [
                user.id,
                item.profile.firstname,
                item.profile.lastname,
                "",
                item.profile.gender || "",
                "",
                item.profile.zip,
                getFormattedDate(item.profile.birth_date)
              ]
            );

            // await sendMigratedAccount({
            //   email: item.user.email,
            //   firstname: item.profile.firstname,
            //   password: item.user.password
            // });

            if (item.user.user_type === "Vendor") {
              await db.query(
                `INSERT INTO vendor(id, user)
                VALUES(UUID_TO_BIN(UUID()), UUID_TO_BIN(?))
                `,
                [user.id]
              );

              let currentVendor = await db.query(
                `SELECT
                BIN_TO_UUID(id) as id,
                BIN_TO_UUID(user) as user
                FROM vendor WHERE user=UUID_TO_BIN(?)`,
                [user.id]
              );
              currentVendor = JSON.parse(JSON.stringify(currentVendor));

              if (currentVendor && currentVendor[0]) {
                // 51
                //currentVendor.id
                for (const application of item.applications) {
                  const childId = uuidv4();
                  await db.query(
                    `INSERT IGNORE INTO child(
                    ch_id,
                    firstname,
                    lastname,
                    age,
                    birthdate,
                    gender,
                    phone_type,
                    phone_number,
                    email_type,
                    email_address,
                    phone_type2,
                    phone_number2,
                    email_type2,
                    email_address2,
                    address,
                    city,
                    state,
                    zip_code,
                    location_site,
                    ethnicities,
                    programs,
                    school_name,
                    school_phone,
                    has_suspended,
                    reason_suspended,
                    year_taken,
                    hobbies,
                    life_events,
                    career_goals,
                    colleges,
                    affiliations,
                    awards,
                    accomplishments,
                    mentee_gain_program,
                    grade_number,
                    grade_desc,
                    class_rank,
                    gpa_quarter_year,
                    gpa_quarter_q1,
                    gpa_quarter_q2,
                    gpa_quarter_q3,
                    gpa_quarter_q4,
                    gpa_cumulative_year,
                    gpa_cumulative_q1,
                    gpa_cumulative_q2,
                    gpa_cumulative_q3,
                    gpa_cumulative_q4,
                    doctor_name,
                    doctor_phone,
                    hospital_preference,
                    hospital_phone
                  ) VALUES (UUID_TO_BIN(?),
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                      childId,
                      application.children.firstname, // firstname
                      application.children.lastname, //lastname
                      0, // age
                      getFormattedDate(application.children.birthdate), // dob
                      application.children.gender, // gender
                      application.children.phone_type, // phone_type
                      application.children.phone_number, // phone_number
                      application.children.email_type, // email_type
                      application.children.email_address, // email_address
                      application.children.secondary_phone_type, // phone_type2
                      application.children.secondary_phone_number, // phone_number2
                      application.children.secondary_email_type, // email_type2
                      application.children.secondary_email_address, // email_address2
                      application.children.address, // address
                      application.children.city, // city
                      application.children.state, // state
                      application.children.zip_code, // zip
                      application.children.location_site, // loc site
                      application.children.ethnicities, // ethnicities
                      application.children.programs, // prgrams
                      application.children.school_name, // school_name
                      application.children.school_phone, // school phone
                      0, //has suspended
                      "",
                      application.children.year_taken, // YEAR TAKEN
                      application.children.hobbies, //hobbies
                      application.children.life_events, // life events
                      application.children.career_goals, // career goals
                      application.children.colleges, // collenges
                      "", // AFFLIATION,
                      application.children.awards, // awards
                      application.children.accomplishments, // accomplishments
                      application.children.mentee_gain_program, // mentee gain program
                      application.children.grade || 0, // grade number
                      "", // GRADE DESC
                      application.children.class_rank, // classrank
                      application.children.gpa_quarter_year, //  quarter year gpa
                      application.children.gpa_quarter_q1,
                      application.children.gpa_quarter_q2,
                      application.children.gpa_quarter_q3,
                      application.children.gpa_quarter_q4,
                      application.children.gpa_cumulative_year,
                      application.children.gpa_cumulative_q1,
                      application.children.gpa_cumulative_q2,
                      application.children.gpa_cumulative_q3,
                      application.children.gpa_cumulative_q4,
                      application.children.doctor_name,
                      "", // doctor_phone
                      application.children.hospital_preference,
                      application.children.hospital_phone
                    ]
                  );
                  const appId = uuidv4();
                  console.log("Application ID", appId);
                  console.log("Application Vendor ID", currentVendor[0].id);
                  console.log("Application Child ID", childId);
                  await db.query(
                    `INSERT INTO application(
                      app_id,
                      vendor,
                      child,
                      verification,
                      student_status
                    ) VALUES (
                      UUID_TO_BIN(?),
                      UUID_TO_BIN(?),
                      UUID_TO_BIN(?),
                      ?, ?)`,
                    [
                      appId,
                      currentVendor[0].id,
                      childId,
                      application.verification,
                      application.student_status
                    ]
                  );
                  for (const parent in item.applications.parents) {
                    const parentId = uuidv4();
                    await db.query(
                      `INSERT IGNORE INTO parent(
                        parent_id,
                        application,
                        firstname,
                        lastname,
                        phone_type,
                        phone_number,
                        email_type,
                        email_address,
                        phone_type2,
                        phone_number2,
                        email_type2,
                        email_address2,
                        password,
                        address,
                        city,
                        state,
                        zip_code,
                        occupation,
                        employers_name,
                        parent_goals,
                        parent_child_goals,
                        live_area,
                        level_of_education,
                        child_hs_grad,
                        child_col_grad,
                        emergency_contacts
                      ) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?),
                        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                        ?, ?, ?, ?)`,
                      [
                        parentId,
                        appId,
                        parent.firstname,
                        parent.lastname,
                        parent.phone_type,
                        parent.phone_number,
                        parent.email_type,
                        parent.email_address,
                        parent.secondary_phone_type,
                        parent.secondary_phone_number,
                        parent.secondary_email_type,
                        parent.secondary_email_address,
                        parent.password,
                        parent.address,
                        parent.city,
                        parent.state,
                        parent.zip_code,
                        parent.occupation,
                        parent.employers_name,
                        parent.parent_goals,
                        parent.parent_child_goals,
                        "", // LIVE AREA
                        parent.level_of_education,
                        parent.child_hs_grad,
                        parent.child_col_grad,
                        ""
                      ]
                    );
                    const isParentExist = await db.query(
                      `SELECT email FROM users WHERE email=?`,
                      [parent.email_address]
                    );
                    // ***************************************** //
                    if (!isParentExist) {
                      const parentUsername = parent.email_address.split("@");
                      // const parentParams = new URLSearchParams();
                      // parentParams.append(
                      //   "client_id",
                      //   process.env.AUTH_CLIENT_ID
                      // );
                      // parentParams.append("username", parentUsername[0]);
                      // parentParams.append("email", parent.email_address);
                      // parentParams.append("password", parent.password);
                      // parentParams.append(
                      //   "connection",
                      //   "Username-Password-Authentication"
                      // );
                      // const parentSignupResponse = await fetch(
                      //   "https://bcombd.us.auth0.com/dbconnections/signup",
                      //   {
                      //     method: "POST",
                      //     body: params
                      //   }
                      // );
                      //const parentAuthData = await parentSignupResponse.json();

                      // if (parentAuthData) {
                      //   const insertedRows = await db.query(
                      //     `INSERT IGNORE INTO users(id,auth_id,type,email,username) values(UUID_TO_BIN(UUID()),?,UUID_TO_BIN(?,true),?,?)`,
                      //     [
                      //       `auth0|${parentAuthData._id}`,
                      //       "5de2809e-c2b3-5cc5-a0c2-bf11c3aae280",
                      //       parent.email_address,
                      //       parentUsername
                      //     ]
                      //   );
                      //   if (insertedRows.affectedRows > 0) {
                      //     await db.query(
                      //       "INSERT INTO user_profiles (id,user_id,first_name,last_name,family_relationship,gender) values(UUID_TO_BIN(UUID()),UUID_TO_BIN(?),?,?,?,?)",
                      //       [
                      //         user.id,
                      //         parent.firstname,
                      //         parent.lastname,
                      //         "",
                      //         parent.gender || ""
                      //       ]
                      //     );
                      //   }
                      //   // await sendMigratedAccount({
                      //   //   email: parent.email_address,
                      //   //   firstname: item.profile.firstname,
                      //   //   password: item.user.password
                      //   // });
                      // }
                    }
                    // ***************************************** //
                  }
                }
              }
            }
          }
        }
      }
    }

    res.status(200).json({ allUsers });
  } catch (error) {
    console.log("Error", error);

    res.status(401).json({ Message: "Connection Error!" });
  } finally {
  }
});

router.get("/application/migrate", async (req, res) => {
  const remoteDb = customConnection(
    "162.241.217.198",
    "bcombstc_bcomb",
    "Bcomb@123",
    "bcombstc_bcombss",
    3006
  );
  try {
    if (!remoteDb) {
      res.status(401).json({ Message: "Connection not found!" });
    }
    const applicationResults = await remoteDb.query(
      "select * from application;"
    );
    const userResults = await remoteDb.query("select * from users;");
    //const schoolResults = await remoteDb.query("select * from schools;");
    const parentResults = await remoteDb.query("select * from appparent;");
    // let users = userResults.filter(user => user.user_type === "User");
    let vendor = userResults.find(
      user =>
        user.user_type === "Vendor" &&
        user.email === "rsinger@100blackmen-atlanta.org"
    );

    let applications = applicationResults
      .filter(application => application.school === vendor.name)
      .map((application, index) => {
        let currentParent = parentResults.filter(
          parent => parent.appId === application.appId
        );
        currentParent = currentParent.map(parent => {
          return {
            application: parent.appId,
            relationchip_to_child: parent.relationshipToChild,
            firstname: parent.fnameParent,
            lastname: parent.lnameParent,
            phone_type: parent.primaryPhoneTypeParent,
            phone_number: parent.primaryPhoneNumberParent,
            secondary_phone_type: parent.primarySecondPhoneTypeParent,
            secondary_phone_number: parent.primarySecondPhoneNumberParent,
            email_type: parent.emailTypeParent,
            email_address: parent.PrimaryEmailParent,
            secondary_email_type: parent.PrimarySecondEmailTypeParent,
            secondary_email_address: parent.PrimarySecondEmailParent,
            password: `Bcombs123_${index}!!!`,
            gender: parent.genderParent,
            address: parent.PrimaryAddressTypeParent,
            state: parent.PrimaryStateParent,
            city: parent.PrimaryCity,
            zip_code: parent.PrimaryZipParent,

            occupation: parent.occupationParent,
            employers_name: parent.employeenameParent,
            parent_goals: parent.goalProgramParent,
            parent_child_goals: parent.goalChildProgramParent,
            level_of_education: parent.highLevel_edu_parent,
            child_hs_grad: parent.child_grad_parent,
            child_col_grad: parent.child_att_col_parent
          };
        });

        let studentStatus = application.studentStatus;
        if (studentStatus === "IP") {
          studentStatus = "new_applicant_in_process";
        } else if (studentStatus === "SU") {
          studentStatus = "current_student";
        } else if (studentStatus === "A") {
          studentStatus = "new_applicant_accepted";
        } else if (studentStatus === "R") {
          studentStatus = "new_applicant_rejected";
        } else if (studentStatus === "WL") {
          studentStatus = "waiting_list";
        } else if (studentStatus === "NLS") {
          studentStatus = "no_longer_student";
        } else if (studentStatus === "MO") {
          studentStatus = "missed_opportunity";
        }

        let applicationStatus = "waiting_for_verification";
        if (application.status === "V") {
          applicationStatus = "verified";
        } else if (application.status === "R") {
          applicationStatus = "rejected";
        }
        return {
          id: application.appId,
          verification: applicationStatus,
          application_date: application.created_at,
          is_archieved: application.archieveStatus,
          archived_date: application.archieved_date,
          color_designation: application.color,
          notes: application.notes,
          student_status: studentStatus,
          children: {
            phone_type: application.child_phoneType,
            phone_number: application.child_phoneNo,
            secondary_phone_type: application.child_second_phoneType,
            secondary_phone_number: application.child_second_phoneNo,
            email_address: application.emailChild,
            email_type: application.child_emailType,
            secondary_email_address: application.emailSecondChild,
            secondary_email_type: application.second_child_emailType,
            firstname: application.fnamChild,
            lastname: application.lnamChild,

            birthdate: getFormattedDate(application.dobChild),
            gender: application.genderChild,
            address: application.addressChild,
            city: application.cityChild,
            zip_code: application.zipChild,
            location_site: application.locationSiteChild || "",
            state: application.stateChild,
            ethnicities: application.ethnicityChild,
            programs: application.programChild,
            hobbies: application.child_hobbies,
            life_events: application.life_events,
            career_goals: application.child_career_goals,
            colleges: application.child_list_colleges,
            awards: application.child_list_award,
            language: application.languageChild,
            accomplishments: application.child_list_accomp,
            year_taken: application.start_year_as_mentee,
            grade: application.grade,
            school_name: application.school,
            school_phone: application.prevschoolphoneChild,
            gpa_quarter_year: application.gpa_child,
            gpa_quarter_q1: application.gpa_q1_child,
            gpa_quarter_q2: application.gpa_q2_child,
            gpa_quarter_q3: application.gpa_q3_child,
            gpa_quarter_q4: application.gpa_q4_child,
            gpa_cumulative_year: application.gpa_cum_child,
            gpa_cumulative_q1: application.gpa_cum_q1_child,
            gpa_cumulative_q2: application.gpa_cum_q2_child,
            gpa_cumulative_q3: application.gpa_cum_q3_child,
            gpa_cumulative_q4: application.gpa_cum_q4_child,
            doctor_name: application.underDoctorCareChild,
            hospital_preference: application.hospitalnameChild,
            hospital_phone: application.hospitalphoneChild,
            mentee_gain_program: application.child_mentee_hope,
            class_rank: application.class_rank
          },
          parents: currentParent
        };
      });

    //for (const application of applications) {
    //   const childId = uuidv4();
    //   await db.query(
    //     `INSERT IGNORE INTO child(
    //       ch_id,
    //       firstname,
    //       lastname,
    //       age,
    //       birthdate,
    //       gender,
    //       phone_type,
    //       phone_number,
    //       email_type,
    //       email_address,
    //       phone_type2,
    //       phone_number2,
    //       email_type2,
    //       email_address2,
    //       address,
    //       city,
    //       state,
    //       zip_code,
    //       location_site,
    //       ethnicities,
    //       programs,
    //       school_name,
    //       school_phone,
    //       has_suspended,
    //       reason_suspended,
    //       year_taken,
    //       hobbies,
    //       life_events,
    //       career_goals,
    //       colleges,
    //       affiliations,
    //       awards,
    //       accomplishments,
    //       mentee_gain_program,
    //       grade_number,
    //       grade_desc,
    //       class_rank,
    //       gpa_quarter_year,
    //       gpa_quarter_q1,
    //       gpa_quarter_q2,
    //       gpa_quarter_q3,
    //       gpa_quarter_q4,
    //       gpa_cumulative_year,
    //       gpa_cumulative_q1,
    //       gpa_cumulative_q2,
    //       gpa_cumulative_q3,
    //       gpa_cumulative_q4,
    //       doctor_name,
    //       doctor_phone,
    //       hospital_preference,
    //       hospital_phone
    //     ) VALUES (UUID_TO_BIN(?),
    //       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
    //       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
    //       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
    //       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
    //       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    //     [
    //       childId,
    //       application.children.firstname, // firstname
    //       application.children.lastname, //lastname
    //       0, // age
    //       getFormattedDate(application.children.birthdate), // dob
    //       application.children.gender, // gender
    //       application.children.phone_type, // phone_type
    //       application.children.phone_number, // phone_number
    //       application.children.email_type, // email_type
    //       application.children.email_address, // email_address
    //       application.children.secondary_phone_type, // phone_type2
    //       application.children.secondary_phone_number, // phone_number2
    //       application.children.secondary_email_type, // email_type2
    //       application.children.secondary_email_address, // email_address2
    //       application.children.address, // address
    //       application.children.city, // city
    //       application.children.state, // state
    //       application.children.zip_code, // zip
    //       application.children.location_site, // loc site
    //       application.children.ethnicities, // ethnicities
    //       application.children.programs, // prgrams
    //       application.children.school_name, // school_name
    //       application.children.school_phone, // school phone
    //       0, //has suspended
    //       "",
    //       application.children.year_taken, // YEAR TAKEN
    //       application.children.hobbies, //hobbies
    //       application.children.life_events, // life events
    //       application.children.career_goals, // career goals
    //       application.children.colleges, // collenges
    //       "", // AFFLIATION,
    //       application.children.awards, // awards
    //       application.children.accomplishments, // accomplishments
    //       application.children.mentee_gain_program, // mentee gain program
    //       application.children.grade || 0, // grade number
    //       "", // GRADE DESC
    //       application.children.class_rank, // classrank
    //       application.children.gpa_quarter_year, //  quarter year gpa
    //       application.children.gpa_quarter_q1,
    //       application.children.gpa_quarter_q2,
    //       application.children.gpa_quarter_q3,
    //       application.children.gpa_quarter_q4,
    //       application.children.gpa_cumulative_year,
    //       application.children.gpa_cumulative_q1,
    //       application.children.gpa_cumulative_q2,
    //       application.children.gpa_cumulative_q3,
    //       application.children.gpa_cumulative_q4,
    //       application.children.doctor_name,
    //       "", // doctor_phone
    //       application.children.hospital_preference,
    //       application.children.hospital_phone
    //     ]
    //   );
    //   const appId = uuidv4();
    //   console.log("Application ID", appId);
    //   console.log("Application Vendor ID", currentVendor[0].id);
    //   console.log("Application Child ID", childId);
    //   await db.query(
    //     `INSERT INTO application(
    //         app_id,
    //         vendor,
    //         child,
    //         verification,
    //         student_status
    //       ) VALUES (
    //         UUID_TO_BIN(?),
    //         UUID_TO_BIN(?),
    //         UUID_TO_BIN(?),
    //         ?, ?)`,
    //     [
    //       appId,
    //       currentVendor[0].id,
    //       childId,
    //       application.verification,
    //       application.student_status
    //     ]
    //   );
    //   for (const parent in applications.parents) {
    //     const parentId = uuidv4();
    //     await db.query(
    //       `INSERT IGNORE INTO parent(
    //           parent_id,
    //           application,
    //           firstname,
    //           lastname,
    //           phone_type,
    //           phone_number,
    //           email_type,
    //           email_address,
    //           phone_type2,
    //           phone_number2,
    //           email_type2,
    //           email_address2,
    //           password,
    //           address,
    //           city,
    //           state,
    //           zip_code,
    //           occupation,
    //           employers_name,
    //           parent_goals,
    //           parent_child_goals,
    //           live_area,
    //           level_of_education,
    //           child_hs_grad,
    //           child_col_grad,
    //           emergency_contacts
    //         ) VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?),
    //           ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
    //           ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
    //           ?, ?, ?, ?)`,
    //       [
    //         parentId,
    //         appId,
    //         parent.firstname,
    //         parent.lastname,
    //         parent.phone_type,
    //         parent.phone_number,
    //         parent.email_type,
    //         parent.email_address,
    //         parent.secondary_phone_type,
    //         parent.secondary_phone_number,
    //         parent.secondary_email_type,
    //         parent.secondary_email_address,
    //         parent.password,
    //         parent.address,
    //         parent.city,
    //         parent.state,
    //         parent.zip_code,
    //         parent.occupation,
    //         parent.employers_name,
    //         parent.parent_goals,
    //         parent.parent_child_goals,
    //         "", // LIVE AREA
    //         parent.level_of_education,
    //         parent.child_hs_grad,
    //         parent.child_col_grad,
    //         ""
    //       ]
    //     );
    //     const isParentExist = await db.query(
    //       `SELECT email FROM users WHERE email=?`,
    //       [parent.email_address]
    //     );
    //     // ***************************************** //
    //     if (!isParentExist) {
    //       const parentUsername = parent.email_address.split("@");
    //       // const parentParams = new URLSearchParams();
    //       // parentParams.append(
    //       //   "client_id",
    //       //   process.env.AUTH_CLIENT_ID
    //       // );
    //       // parentParams.append("username", parentUsername[0]);
    //       // parentParams.append("email", parent.email_address);
    //       // parentParams.append("password", parent.password);
    //       // parentParams.append(
    //       //   "connection",
    //       //   "Username-Password-Authentication"
    //       // );
    //       // const parentSignupResponse = await fetch(
    //       //   "https://bcombd.us.auth0.com/dbconnections/signup",
    //       //   {
    //       //     method: "POST",
    //       //     body: params
    //       //   }
    //       // );
    //       //const parentAuthData = await parentSignupResponse.json();
    //       // const parentAuthData = { _id: "test" };
    //       // if (parentAuthData) {
    //       //   const insertedRows = await db.query(
    //       //     `INSERT IGNORE INTO users(id,auth_id,type,email,username) values(UUID_TO_BIN(UUID()),?,UUID_TO_BIN(?,true),?,?)`,
    //       //     [
    //       //       `auth0|${parentAuthData._id}`,
    //       //       "5de2809e-c2b3-5cc5-a0c2-bf11c3aae280",
    //       //       parent.email_address,
    //       //       parentUsername
    //       //     ]
    //       //   );
    //       //   if (insertedRows.affectedRows > 0) {
    //       //     await db.query(
    //       //       "INSERT INTO user_profiles (id,user_id,first_name,last_name,family_relationship,gender) values(UUID_TO_BIN(UUID()),UUID_TO_BIN(?),?,?,?,?)",
    //       //       [
    //       //         user.id,
    //       //         parent.firstname,
    //       //         parent.lastname,
    //       //         "",
    //       //         parent.gender || ""
    //       //       ]
    //       //     );
    //       //   }
    //       //   // await sendMigratedAccount({
    //       //   //   email: parent.email_address,
    //       //   //   firstname: item.profile.firstname,
    //       //   //   password: item.user.password
    //       //   // });
    //       // }
    //     }
    //     // ***************************************** //
    //   }
    // }
    res.status(200).json({ vendor, applications });
  } catch (error) {
    res.status(401).json({ Message: err });
  } finally {
  }
});


router.get("/vendor/default/summary", async (req, res) => {
  const db = makeDb();

  // 5791e581-900a-11ec-b327-c6999e2fbc8f
  try {

    const defaultUserId = '5791e581-900a-11ec-b327-c6999e2fbc8f';
    const applications = await db.query(
      `SELECT 
        BIN_TO_UUID(app.app_id) as app_id, 
        BIN_TO_UUID(app.vendor) as vendor, 
        BIN_TO_UUID(app.child) as child,
        app.section1_signature,
        app.section1_date_signed,
        app.section2_signature,
        app.section2_date_signed,
        app.section3_signature,
        app.section3_date_signed,
        app.verification,
        app.student_status,
        app.color_designation,
        app.notes,
        app.class_teacher,
        app.application_date,
        app.archived_date,
        app.section3_text,
        app.section1_name,
        app.section2_name,
        app.section3_name,
        app.is_daycare,
        app.is_lot 
      FROM application app, vendor v WHERE app.vendor=v.id AND v.user=UUID_TO_BIN(?) `,
      [defaultUserId]
    );

    console.log('applicationssssssss', applications)
    return res.status(200).json({
      data: applications
    })
  } catch (error) {

    return res.status(400).json({
      error
    })
  } finally {
    await db.close();
  }
});

export default router;
