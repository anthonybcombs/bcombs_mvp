import fetch from "node-fetch";
import { makeDb } from "../../helpers/database";
import { s3BucketRootPath } from "../../helpers/aws";
import { getUserInfo } from "../users/";

export const createCalendar = async (calendar) => {
  try {
      const UserInfo=await getUserInfo()
  } catch (error) {
    return error;
  }
};
