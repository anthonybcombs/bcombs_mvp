import { makeDb } from "../../helpers/database";
import randomColor from "../../helpers/randomColor";
import fetch from "node-fetch";
import {
  currentS3BucketName,
  s3Bucket,
  s3BucketRootPath
} from "../../helpers/aws";
import client, { getRedisKey } from "../../services/redis";
import { getUserFromDatabase } from "../index";

export const getUsers = async () => {
  const db = makeDb();
  try {
    const rows = await db.query(
      `SELECT BIN_TO_UUID(id) as id,email,auth_id,is_profile_filled,BIN_TO_UUID(type) as type,profile_img from users`
    );
    return rows;
  } catch (error) {
  } finally {
    await db.close();
  }
};
const getUserProfileBySecurityQuestions = async data => {
  const db = makeDb();
  try {
    const row = await db.query(
      `SELECT BIN_TO_UUID(id) as id FROM user_profiles WHERE BIN_TO_UUID(user_id)=? AND security_question1_answer=? AND security_question2_answer=? AND security_question3_answer=?`,
      [data.id, data.security_question1, data.security_question2, data.security_question3]
    );

    return row[0] || {};
  } catch (error) {
  } finally {
    await db.close();
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
    let userInfo;
    const UserInfoCache = JSON.parse(await getRedisKey(creds.access_token));
    if (UserInfoCache === null) {
      const userInfoResponse = await fetch(
        "https://bcombd.us.auth0.com/userinfo",
        {
          method: "GET",
          headers: {
            Authorization: `${creds.token_type} ${creds.access_token}`,
            "Content-Type": "application/json"
          }
        }
      );
      userInfo = await userInfoResponse.json();
      const users = await getUsers();
      const user = users.filter(user => user.email === userInfo.email)[0];
      if (user) {
        const { is_profile_filled, profile_img, id, type } = user;
        userInfo.is_profile_filled = is_profile_filled === 0 ? false : true;
        userInfo.profile_img = profile_img
          ? `${s3BucketRootPath}${profile_img}`
          : null;
        userInfo.user_id = id;
        userInfo.type = type;
        client.set(creds.access_token, JSON.stringify(userInfo));
        client.EXPIRE([creds.access_token, "5"]);
      }
    } else {
      userInfo = UserInfoCache;
    }
    return userInfo;
  } catch (error) {
    return {};
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

    console.log("Process ENV", process.env);

    const AuthResponse = await fetch(
      "https://bcombd.us.auth0.com/oauth/token",
      {
        method: "POST",
        body: params
      }
    );
    const authData = await AuthResponse.json();
    if (authData.hasOwnProperty("access_token")) {
      const userInfoResponse = await fetch(
        "https://bcombd.us.auth0.com/userinfo",
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
        console.log("auth data", authData);
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

      console.log("auth data", authData);
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
    let authData;
    const users = await getUsers();
    const user = users.filter(user => user.email === reqData.email)[0];
    if (user.hasOwnProperty("email")) {
      if (reqData.reset_type === 'security questions') {
        if (user.is_profile_filled) {
          const profile = await getUserProfileBySecurityQuestions({ id: user.id, security_question1: reqData.security_question1, security_question2: reqData.security_question2, security_question3: reqData.security_question3});
          if (Object.keys(profile).length) {
            const params = new URLSearchParams();
            params.append("password", reqData.password);
            params.append("connection", "Username-Password-Authentication");
            const res = await fetch("https://bcombd.us.auth0.com/api/v2/users/" + user.auth_id, {
              method: "PATCH",
              body: params
            });
            authData = await res.json();
            if (authData.error) {
              return {
                messageType: "error",
                message: authData.error
              }
            }
            return {
              messageType: "info",
              message: "Reset Password was successful."
            };
          }
          return {
            messageType: "error",
            message: "Answers to Security Questions didn't match. Please try again."
          };
        }
        return {
          messageType: "error",
          message: "Please complete profile first."
        };
      }
      if (reqData.reset_type === 'email') {
        const params = new URLSearchParams();
        params.append("client_id", process.env.AUTH_CLIENT_ID);
        params.append("email", user.email);
        params.append("connection", "Username-Password-Authentication");
        await fetch("https://bcombd.us.auth0.com/dbconnections/change_password", {
          method: "POST",
          body: params
        });
        return {
          messageType: "info",
          message: "Reset Password email has been sent."
        };
      }
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
  console.log(
    "EXECUTE SIGNUP **************************************************************"
  );
  try {
    let authData;
    console.log(
      "executeSignUp process.env.AUTH_CLIENT_ID",
      process.env.AUTH_CLIENT_ID
    );
    if (!user.hasOwnProperty("isSocial")) {
      const params = new URLSearchParams();
      params.append("client_id", process.env.AUTH_CLIENT_ID);
      params.append("username", user.username);
      params.append("email", user.email);
      params.append("password", user.password);
      params.append("connection", "Username-Password-Authentication");
      const signUpResponse = await fetch(
        "https://bcombd.us.auth0.com/dbconnections/signup",
        {
          method: "POST",
          body: params
        }
      );
      console.log("AUTH DATA signUpResponse", signUpResponse);
      authData = await signUpResponse.json();
      console.log("AUTH DATA authData", authData);

      if (authData.error) {
        return {
          messageType: "error",
          message: authData.error
        };
      }
    } else {
      authData = user;
    }
    const rows = await db.query(
      "SELECT BIN_TO_UUID(id) AS id FROM user_types WHERE name='USER'"
    );
    const insertedRows = await db.query(
      `INSERT INTO users(id,auth_id,type,email,username) values(UUID_TO_BIN(UUID()),?,UUID_TO_BIN(?),?,?)`,
      [
        user.hasOwnProperty("isSocial")
          ? authData.sub
          : `auth0|${authData._id}`,
        user.hasOwnProperty("isSocial") ? rows[0].id : user.type.id,
        user.email,
        user.username
      ]
    );
    if (insertedRows.affectedRows > 0) {
      if (!user.hasOwnProperty("isSocial")) {
        return {
          messageType: "info",
          message: `User created! We sent confirmation email to ${user.email}.`
        };
      } else {
        return {
          messageType: "info",
          message: "User created!"
        };
      }
    }
  } catch (error) {
    console.log("Signup Error", error);
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
    const {
      personalInfo,
      familyMembers,
      members,
      calendarInfo,
      email
    } = user.info;
    const users = await getUsers();
    const { id } = users.filter(user => user.email === email)[0];
    const isProfileExist = await isProfileExistFromDatabase(id);

    console.log("familyMembers", familyMembers);
    if (!isProfileExist) {
      await db.query(
        "UPDATE users SET is_profile_filled=1 where id=UUID_TO_BIN(?)",
        [id]
      );
      await db.query(
        "INSERT IGNORE INTO user_profiles (id,user_id,first_name,last_name,family_relationship,gender,custom_gender,zip_code,birth_date,security_question1,security_question1_answer,security_question2,security_question2_answer,security_question3,security_question3_answer) values(UUID_TO_BIN(UUID()),UUID_TO_BIN(?),?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          id,
          personalInfo.firstname,
          personalInfo.lastname,
          personalInfo.familyrelationship,
          personalInfo.gender,
          personalInfo.customgender || "",
          personalInfo.zipcode,
          personalInfo.dateofbirth,
          personalInfo.securityquestion1,
          personalInfo.securityquestion1answer,
          personalInfo.securityquestion2,
          personalInfo.securityquestion2answer,
          personalInfo.securityquestion3,
          personalInfo.securityquestion3answer,
        ]
      );
      familyMembers.forEach(async familyMember => {
        await db.query(
          "INSERT IGNORE INTO family_members (id,user_id,first_name,last_name,family_relationship,gender,custom_gender,zip_code,birth_date,type) values(UUID_TO_BIN(UUID()),UUID_TO_BIN(?),?,?,?,?,?,?,?,?)",
          [
            id,
            familyMember.firstname,
            familyMember.lastname,
            familyMember.familyrelationship,
            familyMember.gender,
            familyMember.customgender || "",
            familyMember.zipcode,
            familyMember.dateofbirth,
            familyMember.type
          ]
        );
      });
      if (Object.keys(calendarInfo).length > 0) {
        await db.query(
          "INSERT IGNORE INTO user_calendars (id,user_id,name,color) VALUES(UUID_TO_BIN(UUID()),UUID_TO_BIN(?),?,?)",
          [id, calendarInfo.name, await randomColor({ user_id: id })]
        );
        const insertedCalendar = await db.query(
          "SELECT BIN_TO_UUID(id) as id,color from user_calendars where user_id=UUID_TO_BIN(?) AND name=?",
          [id, calendarInfo.name]
        );
        const buf = Buffer.from(
          calendarInfo.image.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        );
        const data = {
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
      }
    } else {
      await db.query(
        "UPDATE users SET is_profile_filled=1 where id=UUID_TO_BIN(?)",
        [id]
      );
      await db.query(
        "UPDATE user_profiles SET first_name=?,last_name=?,family_relationship=?,gender=?,custom_gender=?,zip_code=?,birth_date=?,security_question1=?,security_question1_answer=?,security_question2=?,security_question2_answer=?,security_question3=?,security_question3_answer=? WHERE user_id=UUID_TO_BIN(?)",
        [
          personalInfo.firstname,
          personalInfo.lastname,
          personalInfo.familyrelationship,
          personalInfo.gender,
          personalInfo.customgender,
          personalInfo.zipcode,
          personalInfo.dateofbirth,
          personalInfo.securityquestion1,
          personalInfo.securityquestion1answer,
          personalInfo.securityquestion2,
          personalInfo.securityquestion2answer,
          personalInfo.securityquestion3,
          personalInfo.securityquestion3answer,
          id
        ]
      );
      await db.query(
        "UPDATE user_calendars set image=?,name=? WHERE user_id=UUID_TO_BIN(?)",
        ["", calendarInfo.name, id]
      );
    }
    client.DEL(user.creds.access_token);
    return {
      messageType: "info",
      message: "user updated."
    };
  } catch (error) {
    console.log("executeUserUpdate Error", error);
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

export const getUserApplication = async email => {
  let result = {};
  const db = makeDb();

  try {
    let parent = await db.query(
      `SELECT vendor.name,
      parent.email_address,
      parent.firstname,
      parent.lastname,
      parent.phone_number,
      parent.address,
      parent.city,
      parent.zip_code,
      application.verification,
      BIN_TO_UUID(parent.parent_id) as parent_id,
      BIN_TO_UUID( parent.application) as application_id
      FROM application,parent,vendor 
      WHERE email_address=? AND 
      parent.application=application.app_id AND 
      application.vendor=vendor.id`,
      [email]
    );

    let child = await db.query(
      `
      SELECT vendor.name,
       child.email_address,
       child.firstname,child.lastname,
       child.phone_number,
       child.address,
       child.city,
       child.zip_code,
       BIN_TO_UUID(child.ch_id) as child_id,
       BIN_TO_UUID( application.app_id) as application_id,
       application.verification
       FROM application,child,vendor 
       WHERE email_address=? AND 
       child.ch_id=application.child AND 
       application.vendor=vendor.id`,
      [email]
    );
    // result = {
    //   parent: parent.length > 0 ? JSON.parse(JSON.stringify(parent)) : [],
    //   child: child.length > 0 ? JSON.parse(JSON.stringify(child)) : []
    // };

    result = {
      parent,
      child
    };

    console.log("getUserApplication result", result);
    return result;
  } catch (error) {
    console.log("getUserApplication error", error);
  } finally {
    await db.close();
  }
};

export const checkUserEmail = async email => {
  const db = makeDb();

  try {
    console.log("Check User Email", email);
    const rows = await db.query(
      `SELECT BIN_TO_UUID(id) as id FROM users WHERE email=?`,
      [email]
    );
    console.log("Check User Rows", rows);
    if (rows.length > 0) {
      return {
        is_exist: true,
        status: "Email is available to use"
      };
    }

    return {
      is_exist: false,
      status: "Email not exist"
    };
  } catch (err) {
    console.log("Check User Email", err);
  } finally {
    await db.close();
  }
};

export const executeAddUserProfile = async payload => {
  const db = makeDb();

  try {
    const currentUser = await getUserFromDatabase(payload.email);
    console.log("Execute Add User Profile ", currentUser);
    console.log("Execute Add User Payload", payload);
    await db.query(
      "INSERT IGNORE INTO user_profiles (id,user_id,first_name,last_name,gender,zip_code,birth_date) values(UUID_TO_BIN(UUID()),UUID_TO_BIN(?),?,?,?,?,?)",
      [
        currentUser.id,
        payload.firstname,
        payload.lastname,
        payload.gender || "",
        payload.zip_code || "",
        payload.dateofbirth || ""
      ]
    );
  } catch (err) {
    console.log("Check User Email", err);
  } finally {
    await db.close();
  }
};
/*
select vendor.name,parent.email_address,parent.firstname,parent.lastname,parent.phone_number,
parent.address,
parent.city,
parent.zip_code
 from application,parent,vendor 
WHERE email_address='sanjosedennis7593@gmail.com' AND 
parent.application=application.app_id AND 
application.vendor=vendor.id;
*/
