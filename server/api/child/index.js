import { makeDb } from "../../helpers/database";

export const getChildInformation = async (id) => {
  const db = makeDb();
  let result = [];
  try {
    const child = await db.query (
      `SELECT 
        BIN_TO_UUID(ch_id) as ch_id, 
        firstname,
        lastname,
        age,
        birthdate,
        gender,
        phone_type,
        phone_number,
        email_type,
        email_address,
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
        FROM child 
        WHERE ch_id=UUID_TO_BIN(?)`,
        [id]
    )
    result = child;
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
    return result;
  }
};

export const addChild = async ({
  firstname,
  lastname,
  age,
  birthdate,
  gender,
  phone_type,
  phone_number,
  email_type,
  email_address,
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
}) => {
  const db = makeDb();
  let result = {};
  let lastId = "";
  let child;

  try {
    result = await db.query(
      `INSERT INTO child(
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
      ) VALUES (UUID_TO_BIN(UUID()), 
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?)`,
      [
        firstname,
        lastname,
        age,
        birthdate,
        gender,
        phone_type,
        phone_number,
        email_type,
        email_address,
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
      ]
    )

    lastId = result.insertId;
    child = await db.query("SELECT (BIN_TO_UUID(ch_id)) as ch_id FROM child WHERE id=?", [lastId]);
    child = child.length > 0 ? child[0]: "";

  } catch(err) {
    console.log("add child error", err);
  } finally {
    await db.close();
    console.log("Add child", result);
    console.log("ID ID ID", child);
    return child;
  }
}