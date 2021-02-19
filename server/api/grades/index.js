import { makeDb } from "../../helpers/database";

export const getGrades = async () => {
  const db = makeDb();
  const result = [];
  try {
    const grades = await db.query(
      "SELECT BIN_TO_UUID(ID) as id,name FROM grades"
    );
    grades.forEach((grade) => {
      result.push({ id: grade.id, name: grade.name });
    });
    return result;
  } catch (error) {
  } finally {
    await db.close();
  }
};


export const getStudentCumulativeGrades = async({
  user_id
}) => {
  const db = makeDb();
  let studentCumulative = [];
  try {
    studentCumulative = await db.query(
      `SELECT  BIN_TO_UUID(user_id) as user_id,
        year_level,
        school_year_start,
        school_year_end,
        school_year_frame,weqwew
        class_name,
        class_type,
        class_teacher,
        attachment,
        date_added
      FROM student_grade_cumulative
      WHERE user_id=UUID_TO_BIN(?)`,
      [user_id]
    );


    
  } catch (error) {
    console.log('Error', error)
  } finally {
    await db.close();
    return studentCumulative;
  }
}


export const addStudentCumulativeGrades = async ({
  user_id,
  year_level,
  school_year_start,
  school_year_end,
  school_year_frame,
  class_name,
  class_type,
  class_teacher,
  attachment,
  grades = []
}) =>  {
  const db = makeDb();
  let studentCumulative = [];
  try {
    const studentCumulativeResult = await db.query(
      `INSERT INTO student_grade_cumulative(
        user_id,
        year_level,
        school_year_start,
        school_year_end,
        school_year_frame,
        class_name,
        class_type,
        class_teacher,
        attachment,
        date_added
      )
      VALUES (
        UUID_TO_BIN(?),
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        NOW()
      )
      `,
      [
        user_id,
        year_level,
        school_year_start,
        school_year_end,
        school_year_frame,
        class_name,
        class_type,
        class_teacher,
        attachment
      ]
    );

    for(let grade of grades) {
      await db.query(
        `INSERT INTO student_grades
          (
            student_grade_cumulative_id,
            subject,
            quarter_1,
            quarter_2,
            quarter_3,
            quarter_4,
            date_created
          )
        VALUES (?,?,?,?,?,?,NOW())
        `,
      [
        studentCumulativeResult.insertId,
        grade.subject,
        grade.quarter_1 || 0,
        grades.quarter_2 || 0,
        grade.quarter_3 || 0,
        grade.quarter_4 || 0,
      ]
      );
    }

    studentCumulative = await db.query(
      `SELECT  BIN_TO_UUID(user_id) as user_id,
        year_level,
        school_year_start,
        school_year_end,
        school_year_frame,
        class_name,
        class_type,
        class_teacher,
        attachment,
        date_added
      FROM student_grade_cumulative
      WHERE user_id=UUID_TO_BIN(?)`,
      [user_id]
    );
  } catch (error) {
    console.log('Error', error)
  } finally {
    await db.close();
    return studentCumulative;
  }
}