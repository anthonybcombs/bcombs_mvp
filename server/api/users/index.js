import { makeDb } from "../../helpers/database";
import { s3BucketRootPath } from "../../helpers/aws";
import fetch from "node-fetch";

export const getUsers = async () => {
  const db = makeDb();
  let result;
  try {
    const rows = await db.query(
      `SELECT BIN_TO_UUID(id) as id,email,auth_id,is_profile_filled,BIN_TO_UUID(type) as type,profile_img from users`
    );
    result = rows;
  } catch (error) {
  } finally {
    await db.close();
    return result;
  }
};
const isProfileExistFromDatabase = async (id) => {
  const db = makeDb();
  let result;
  try {
    const rows = await db.query(
      `SELECT BIN_TO_UUID(id) as id FROM user_profiles WHERE BIN_TO_UUID(user_id)=?`,
      [id]
    );
    if (rows.length > 0) {
      result = true;
    } else {
      result = false;
    }
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
    return result;
  }
};
export const getUserInfo = async (creds) => {
  try {
    const userInfoResponse = await fetch("https://bcombs.auth0.com/userinfo", {
      method: "GET",
      headers: {
        Authorization: `${creds.token_type} ${creds.access_token}`,
        "Content-Type": "application/json",
      },
    });
    const userInfo = await userInfoResponse.json();
    const users = await getUsers();
    const { is_profile_filled, profile_img, id } = users.filter(
      (user) => user.email === userInfo.email
    )[0];
    userInfo.is_profile_filled = is_profile_filled === 0 ? false : true;
    userInfo.profile_img = profile_img
      ? `${s3BucketRootPath}${profile_img}`
      : null;
    userInfo.user_id = id;
    return userInfo;
  } catch (error) {
    return error;
  }
};
export const executeSignIn = async (user) => {
  try {
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

      return {
        user: {
          ...authData,
          ...userInfo,
        },
        status: {
          messageType: "Info",
          message: "User signed in.",
        },
      };
    }
    return {
      user: authData,
      status: {
        messageType: "Info",
        message: "User signed in.",
      },
    };
  } catch (error) {
    return {
      status: {
        messageType: "error",
        message: "there error in requesting sign in endpoint.",
      },
    };
  }
};
export const executeChangePassword = async (reqData) => {
  try {
    const users = await getUsers();
    const user = users.filter((user) => user.email === reqData.email)[0];
    if (user.hasOwnProperty("email")) {
      const params = new URLSearchParams();
      params.append("client_id", process.env.AUTH_CLIENT_ID);
      params.append("email", user.email);
      params.append("connection", "Username-Password-Authentication");
      await fetch("https://bcombs.auth0.com/dbconnections/change_password", {
        method: "POST",
        body: params,
      });
      return {
        messageType: "info",
        message: "Email has been send!",
      };
    }
    return {
      messageType: "error",
      message: "Email address does not exist.",
    };
  } catch (error) {
    return {
      messageType: "error",
      message: "Email address does not exist.",
    };
  }
};
export const executeSignUp = async (user) => {
  const db = makeDb();
  try {
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
      return {
        messageType: "info",
        message: `User created! We sent confirmation email to ${user.email}.`,
      };
    }
    return {
      messageType: "",
      message: "",
    };
  } catch (error) {
    return {
      messageType: "error",
      message: "there error in requesting sign up endpoint.",
    };
  } finally {
    await db.close();
  }
};
export const executeUserUpdate = async (user) => {
  const db = makeDb();
  try {
    const { personalInfo, familyMembers, members, calendarInfo, email } = user;
    const users = await getUsers();
    const { id } = users.filter((user) => user.email === email)[0];
    const isProfileExist = await isProfileExistFromDatabase(id);
    if (!isProfileExist) {
      await db.query(
        "UPDATE users SET is_profile_filled=1 where id=UUID_TO_BIN(?)",
        [id]
      );
      await db.query(
        "INSERT IGNORE INTO user_profiles (id,user_id,first_name,last_name,family_relationship,gender,zip_code,birth_date) values(UUID_TO_BIN(UUID()),UUID_TO_BIN(?),?,?,?,?,?,?)",
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
        "INSERT IGNORE INTO user_calendars (id,user_id,image,name) VALUES(UUID_TO_BIN(UUID()),UUID_TO_BIN(?),?,?)",
        [id, "", calendarInfo.name]
      );
    } else {
      await db.query(
        "UPDATE user_profiles SET first_name=?,last_name=?,family_relationship=?,gender=?,zip_code=?,birth_date=? WHERE user_id=UUID_TO_BIN(?)",
        [
          personalInfo.firstname,
          personalInfo.lastname,
          personalInfo.familyrelationship,
          personalInfo.gender,
          personalInfo.zipcode,
          personalInfo.dateofbirth,
          id,
        ]
      );
      await db.query(
        "UPDATE user_calendars set image=?,name=? WHERE user_id=UUID_TO_BIN(?)",
        ["", calendarInfo.name, id]
      );
    }
    return {
      messageType: "info",
      message: "user updated.",
    };
  } catch (error) {
    return {
      messageType: "error",
      message: "there is an error in user update endpoint.",
    };
  } finally {
    await db.close();
  }
};
