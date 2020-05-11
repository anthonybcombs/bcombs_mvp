import { makeDb } from "../../helpers/database";
import randomColor from "../../helpers/randomColor";
import fetch from "node-fetch";
import {
  currentS3BucketName,
  s3Bucket,
  s3BucketRootPath
} from "../../helpers/aws";
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
const isProfileExistFromDatabase = async id => {
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
  } finally {
    await db.close();
    return result;
  }
};
export const getUserInfo = async creds => {
  try {
    const userInfoResponse = await fetch("https://bcombs.auth0.com/userinfo", {
      method: "GET",
      headers: {
        Authorization: `${creds.token_type} ${creds.access_token}`,
        "Content-Type": "application/json"
      }
    });
    const userInfo = await userInfoResponse.json();
    const users = await getUsers();
    const { is_profile_filled, profile_img, id } = users.filter(
      user => user.email === userInfo.email
    )[0];
    userInfo.is_profile_filled = is_profile_filled === 0 ? false : true;
    userInfo.profile_img = profile_img
      ? `${s3BucketRootPath}${profile_img}`
      : null;
    userInfo.user_id = id;
    return userInfo;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const executeSignIn = async user => {
  try {
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
      if (authData.hasOwnProperty("error")) {
        return {
          user: {
            ...authData,
            ...userInfo
          },
          status: {
            messageType: "error",
            message: authData.error_description
          }
        };
      }
      return {
        user: {
          ...authData,
          ...userInfo
        },
        status: {
          messageType: "Info",
          message: "User signed in."
        }
      };
    }
    if (authData.hasOwnProperty("error")) {
      return {
        user: authData,
        status: {
          messageType: "error",
          message: authData.error_description
        }
      };
    }
    return {
      user: authData,
      status: {
        messageType: "Info",
        message: "User signed in."
      }
    };
  } catch (error) {
    console.log(error);
    return {
      status: {
        messageType: "error",
        message: "there error in requesting sign in endpoint."
      }
    };
  }
};
export const executeChangePassword = async reqData => {
  try {
    const users = await getUsers();
    const user = users.filter(user => user.email === reqData.email)[0];
    if (user.hasOwnProperty("email")) {
      const params = new URLSearchParams();
      params.append("client_id", process.env.AUTH_CLIENT_ID);
      params.append("email", user.email);
      params.append("connection", "Username-Password-Authentication");
      await fetch("https://bcombs.auth0.com/dbconnections/change_password", {
        method: "POST",
        body: params
      });
      return {
        messageType: "info",
        message: "Email has been send!"
      };
    }
    return {
      messageType: "error",
      message: "Email address does not exist."
    };
  } catch (error) {
    return {
      messageType: "error",
      message: "Email address does not exist."
    };
  }
};
export const executeSignUp = async user => {
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
    if (insertedRows.affectedRows > 0 && !user.hasOwnProperty("isSocial")) {
      return {
        messageType: "info",
        message: `User created! We sent confirmation email to ${user.email}.`
      };
    }
    return {
      messageType: "",
      message: ""
    };
  } catch (error) {
    return {
      messageType: "error",
      message: "there error in requesting sign up endpoint."
    };
  } finally {
    await db.close();
  }
};
export const executeUserUpdate = async user => {
  const db = makeDb();
  try {
    const { personalInfo, familyMembers, members, calendarInfo, email } = user;
    const users = await getUsers();
    const { id } = users.filter(user => user.email === email)[0];
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
          personalInfo.dateofbirth
        ]
      );
      await db.query(
        "INSERT IGNORE INTO user_calendars (id,user_id,name,color) VALUES(UUID_TO_BIN(UUID()),UUID_TO_BIN(?),?,?)",
        [id, calendarInfo.name, await randomColor({ user_id: id })]
      );
      const insertedCalendar = await db.query(
        "SELECT BIN_TO_UUID(id) as id,color from user_calendars where user_id=UUID_TO_BIN(?) AND name=?",
        [id, calendarInfo.name]
      );
      console.log(insertedCalendar[0]);
      const buf = Buffer.from(
        calendarInfo.image.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      var data = {
        Bucket: currentS3BucketName,
        Key: `calendars/${id}/${insertedCalendar[0].id}/calendarBackground.jpg`,
        Body: buf,
        ContentEncoding: "base64",
        ContentType: "image/jpeg",
        ACL: "public-read"
      };
      s3Bucket.putObject(data, function(err, data) {
        if (err) {
          console.log(err);
          console.log("Error uploading data: ", data);
        } else {
          console.log("succesfully uploaded the image!");
        }
      });
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
          id
        ]
      );
      await db.query(
        "UPDATE user_calendars set image=?,name=? WHERE user_id=UUID_TO_BIN(?)",
        ["", calendarInfo.name, id]
      );
    }
    return {
      messageType: "info",
      message: "user updated."
    };
  } catch (error) {
    console.log(error);
    return {
      messageType: "error",
      message: "there is an error in user update endpoint."
    };
  } finally {
    await db.close();
  }
};

export const executeGetUser = async keyword => {
  const db = makeDb();
  let result = [];
  try {
    keyword = keyword.toLowerCase();
    result = await db.query(
      `SELECT 
      BIN_TO_UUID(users.id) as id,
      users.email,
      user_profiles.last_name,
      user_profiles.first_name 
      FROM users,user_profiles 
      WHERE ( LOWER(users.email) LIKE ? OR 
        LOWER(user_profiles.last_name) LIKE ? OR 
        LOWER(user_profiles.first_name) LIKE ? ) AND user_profiles.user_id=users.id`,
      [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
    );

    console.log("RESULT", result);
    result = result.map(user => {
      return {
        given_name: user.first_name,
        family_name: user.last_name,
        email: user.email,
        id: user.id
      };
    });
    return result;
  } catch (error) {
    console.log("executeGetUser Error", error);
  } finally {
    await db.close();
    return result;
  }
};
