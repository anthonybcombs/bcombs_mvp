import { makeDb } from "../../helpers/database";

export const getChildInformation = async (id) => {
  const db = makeDb();
  let result = [];
  try {
    const child = await db.query (
      `SELECT 
        BIN_TO_UUID(ch_id) as ch_id, 
        new_childId,
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
        hospital_phone,
        child_lives_with,
        nickname,
        is_child_transferring,
        does_child_require_physical_education_service,
        history_prev_diseases,
        child_currently_doctors_care,
        reasons_previous_hospitalizations,
        comments_suggestion,
        list_special_dietary,
        list_any_allergies,
        mental_physical_disabilities,
        medical_action_plan,
        list_fears_unique_behavior,
        transfer_reason,
        prev_school_phone,
        prev_school_city,
        prev_school_address,
        prev_school_attended,
        prev_school_state,
        prev_school_zip_code,
        preffered_start_date,
        current_classroom,
        primary_language,
        needed_days,
        schedule_tour,
        voucher
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

export const addDaycareChild = async ({
  firstname,
  lastname,
  nickname,
  age,
  birthdate,
  gender,
  preffered_start_date,
  current_classroom,
  primary_language,
  needed_days,
  schedule_tour,
  voucher,
  address,
  city,
  state,
  zip_code,
  programs,
  ethnicities,
  child_lives_with,
  has_suspended,
  reason_suspended,
  is_child_transferring,
  does_child_require_physical_education_service,
  history_prev_diseases,
  child_currently_doctors_care,
  reasons_previous_hospitalizations,
  comments_suggestion,
  list_special_dietary,
  list_any_allergies,
  mental_physical_disabilities,
  medical_action_plan,
  list_fears_unique_behavior,
  transfer_reason,
  prev_school_phone,
  prev_school_city,
  prev_school_address,
  prev_school_attended,
  prev_school_state,
  prev_school_zip_code,
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
        nickname,
        age,
        birthdate,
        gender,
        preffered_start_date,
        current_classroom,
        primary_language,
        needed_days,
        schedule_tour,
        voucher,
        address,
        city,
        state,
        zip_code,
        programs,
        ethnicities,
        child_lives_with,
        has_suspended,
        reason_suspended,
        is_child_transferring,
        does_child_require_physical_education_service,
        history_prev_diseases,
        child_currently_doctors_care,
        reasons_previous_hospitalizations,
        comments_suggestion,
        list_special_dietary,
        list_any_allergies,
        mental_physical_disabilities,
        medical_action_plan,
        list_fears_unique_behavior,
        transfer_reason,
        prev_school_phone,
        prev_school_city,
        prev_school_address,
        prev_school_attended,
        prev_school_state,
        prev_school_zip_code,
        doctor_name,
        doctor_phone,
        hospital_preference,
        hospital_phone
      ) VALUES (UUID_TO_BIN(UUID()), 
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?)`,
      [
        firstname,
        lastname,
        nickname,
        age,
        birthdate,
        gender,
        preffered_start_date,
        current_classroom,
        primary_language,
        needed_days,
        schedule_tour,
        voucher,
        address,
        city,
        state,
        zip_code,
        programs,
        ethnicities,
        child_lives_with,
        has_suspended,
        reason_suspended,
        is_child_transferring,
        does_child_require_physical_education_service,
        history_prev_diseases,
        child_currently_doctors_care,
        reasons_previous_hospitalizations,
        comments_suggestion,
        list_special_dietary,
        list_any_allergies,
        mental_physical_disabilities,
        medical_action_plan,
        list_fears_unique_behavior,
        transfer_reason,
        prev_school_phone,
        prev_school_city,
        prev_school_address,
        prev_school_attended,
        prev_school_state,
        prev_school_zip_code,
        doctor_name,
        doctor_phone,
        hospital_preference,
        hospital_phone
      ]
    )

    lastId = result.insertId;
    child = await db.query(`SELECT (BIN_TO_UUID(ch_id)) as ch_id FROM child WHERE id=?`, [lastId]);
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

export const addChild = async ({
  firstname,
  lastname,
  age = null,
  birthdate = null,
  gender = null,
  phone_type = null,
  phone_number = null,
  email_type = null,
  email_address = null,
  phone_type2 = null,
  phone_number2 = null,
  email_type2 = null,
  email_address2 = null,
  address = null,
  city = null,
  state = null,
  zip_code = null,
  location_site = null,
  ethnicities = null,
  programs = null,
  school_name = null,
  school_phone = null,
  has_suspended = null,
  reason_suspended = null,
  year_taken = null,
  hobbies = null,
  life_events = null, 
  career_goals = null,
  colleges = null,
  affiliations = null,
  awards = null,
  accomplishments = null,
  mentee_gain_program = null,
  grade_number = null,
  grade_desc = null,
  class_rank = null,
  gpa_quarter_year = null,
  gpa_quarter_q1 = null,
  gpa_quarter_q2 = null,
  gpa_quarter_q3 = null,
  gpa_quarter_q4 = null,
  gpa_cumulative_year = null,
  gpa_cumulative_q1 = null,
  gpa_cumulative_q2 = null,
  gpa_cumulative_q3 = null,
  gpa_cumulative_q4 = null,
  doctor_name = null,
  doctor_phone = null,
  hospital_preference = null,
  hospital_phone = null,
  child_lives_with = null,
  nickname = null,
  middlename = null
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
        hospital_phone,
        child_lives_with,
        nickname,
        middlename
      ) VALUES (UUID_TO_BIN(UUID()), 
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        hospital_phone,
        child_lives_with,
        nickname,
        middlename
      ]
    )

    lastId = result.insertId;
    child = await db.query(`SELECT (BIN_TO_UUID(ch_id)) as ch_id FROM child WHERE id=?`, [lastId]);
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

export const updateChild = async ({
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
  hospital_phone,
  child_lives_with,
  nickname,
  is_child_transferring,
  does_child_require_physical_education_service,
  history_prev_diseases,
  child_currently_doctors_care,
  reasons_previous_hospitalizations,
  comments_suggestion,
  list_special_dietary,
  list_any_allergies,
  mental_physical_disabilities,
  medical_action_plan,
  list_fears_unique_behavior,
  transfer_reason,
  prev_school_phone,
  prev_school_city,
  prev_school_address,
  prev_school_attended,
  prev_school_state,
  prev_school_zip_code,
  preffered_start_date,
  current_classroom,
  primary_language,
  needed_days,
  schedule_tour,
  voucher,
  ch_id
}) => {

  const db = makeDb();
  let result;

  try {

    result = await db.query(
      `UPDATE child SET 
        firstname=?,
        lastname=?,
        age=?,
        birthdate=?,
        gender=?,
        phone_type=?,
        phone_number=?,
        email_type=?,
        email_address=?,
        phone_type2=?,
        phone_number2=?,
        email_type2=?,
        email_address2=?,
        address=?,
        city=?,
        state=?,
        zip_code=?,
        location_site=?,
        ethnicities=?,
        programs=?,
        school_name=?,
        school_phone=?,
        has_suspended=?,
        reason_suspended=?,
        year_taken=?,
        hobbies=?,
        life_events=?, 
        career_goals=?,
        colleges=?,
        affiliations=?,
        awards=?,
        accomplishments=?,
        mentee_gain_program=?,
        grade_number=?,
        grade_desc=?,
        class_rank=?,
        gpa_quarter_year=?,
        gpa_quarter_q1=?,
        gpa_quarter_q2=?,
        gpa_quarter_q3=?,
        gpa_quarter_q4=?,
        gpa_cumulative_year=?,
        gpa_cumulative_q1=?,
        gpa_cumulative_q2=?,
        gpa_cumulative_q3=?,
        gpa_cumulative_q4=?,
        doctor_name=?,
        doctor_phone=?,
        hospital_preference=?,
        hospital_phone=?,
        child_lives_with=?,
        nickname=?,
        is_child_transferring=?,
        does_child_require_physical_education_service=?,
        history_prev_diseases=?,
        child_currently_doctors_care=?,
        reasons_previous_hospitalizations=?,
        comments_suggestion=?,
        list_special_dietary=?,
        list_any_allergies=?,
        mental_physical_disabilities=?,
        medical_action_plan=?,
        list_fears_unique_behavior=?,
        transfer_reason=?,
        prev_school_phone=?,
        prev_school_city=?,
        prev_school_address=?,
        prev_school_attended=?,
        prev_school_state=?,
        prev_school_zip_code=?,
        preffered_start_date=?,
        current_classroom=?,
        primary_language=?,
        needed_days=?,
        schedule_tour=?,
        voucher=?
        WHERE ch_id=UUID_TO_BIN(?)
      `,
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
        hospital_phone,
        child_lives_with,
        nickname,
        is_child_transferring,
        does_child_require_physical_education_service,
        history_prev_diseases,
        child_currently_doctors_care,
        reasons_previous_hospitalizations,
        comments_suggestion,
        list_special_dietary,
        list_any_allergies,
        mental_physical_disabilities,
        medical_action_plan,
        list_fears_unique_behavior,
        transfer_reason,
        prev_school_phone,
        prev_school_city,
        prev_school_address,
        prev_school_attended,
        prev_school_state,
        prev_school_zip_code,
        preffered_start_date,
        current_classroom,
        primary_language,
        needed_days,
        schedule_tour,
        voucher,
        ch_id
      ]
    );
  } catch(error) {
    console.log(error)
  } finally {
    await db.close();
    return result;
  }
}

export const addChildChildRelationship = async({
  child,
  child2,
  relationship
}) => {
  const db = makeDb();
  let result = {};

  try {
    result = await db.query(
      `INSERT INTO child_child(
        id,
        child,
        child2,
        relationship
      ) VALUES (UUID_TO_BIN(UUID()), UUID_TO_BIN(?), UUID_TO_BIN(?), ?)`,
      [
        child,
        child2,
        relationship
      ]
    )
  } catch(err) {
    console.log("add parent error", err)
  } finally {
    await db.close();
    return result
  }
}

export const updateParentChildRelationship = async({
  id,
  relationship
}) => {
  const db = makeDb();
  let result = {};

  try {
    result = await db.query(
      `
        UPDATE child_child SET
        relationship=?
        WHERE id=UUID_TO_BIN(?)
      `,
      [
        relationship,
        id
      ]
    )
  } catch(err) {
    console.log("add parent error", err)
  } finally {
    await db.close();
    return result
  }
}

export const getChildName = async(child) => {
  const db = makeDb();
  let result;

  try {
    result = await db.query(
      `
        SELECT
        firstname
        FROM child
        WHERE ch_id=UUID_TO_BIN(?)
      `,
      [
        child
      ]
    );
  } catch(error) {
    console.log("error getchildname", error)
  } finally {
    await db.close();
    return result;
  }
}
export const getChildChildRelationship = async(child) => {
  const db = makeDb();
  let result = {};
  let childs = [];
  try {
    result = await db.query(
      `
        SELECT 
        BIN_TO_UUID(id) as id,
        BIN_TO_UUID(child) as child,
        BIN_TO_UUID(child2) as child2,
        relationship
        FROM child_child 
        WHERE child=UUID_TO_BIN(?)
      `,
      [
        child
      ]
    )

    for(const item of result) {
      const temp = await getChildName(item.child2);
      if(temp && temp.length > 0) {
        childs.push({
          id: item.id,
          child: item.child,
          child2: item.child2,
          relationship: item.relationship,
          details: temp[0]
        })
      }
    }
  } catch(err) {
    console.log("add parent error", err)
  } finally {
    await db.close();
    return childs
  }
}
