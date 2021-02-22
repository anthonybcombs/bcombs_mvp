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

export const getStudentCumulativeGradeByGroup = async ({
  app_group_id
}) => {
  const db = makeDb();
  let studentCumulative = [];
  let studentGrades = [];
  try {
    const response = await db.query(
      `SELECT  BIN_TO_UUID(child_id) as child_id,
        BIN_TO_UUID(app_group_id) as app_group_id,
        student_grade_cumulative_id,
        type,
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
      WHERE app_group_id=UUID_TO_BIN(?)`,
      [
        app_group_id
      ]
    );
    if(response ) {
      studentCumulative = [...(response || [])];
      const studentGradeCumulativeIds = response.map(item => item.student_grade_cumulative_id)
      
      if(studentGradeCumulativeIds.length > 0) {
        let subjects = await db.query(`
          SELECT * FROM student_grades 
          WHERE student_grade_cumulative_id IN (${studentGradeCumulativeIds.join(',')})`);
        
        studentCumulative = studentCumulative.map(item => {
          const studentCumulativeGrade = subjects.filter(grade => item.student_grade_cumulative_id === grade.student_grade_cumulative_id)
          return {
            ...item,
            grades:[...(studentCumulativeGrade || [])]
          }
        })
      }
    }
    
  } catch (error) {
    console.log('Error', error)
  } finally {
    await db.close();
    return studentCumulative;
  }
}

export const getStudentCumulativeGrade = async({
  app_group_id,
  child_id
}) => {
  const db = makeDb();
  let studentCumulative = null;
  let studentGrades = [];
  let currentSubjectGrades = [];
  try {
    const response = await db.query(
      `SELECT  BIN_TO_UUID(child_id) as child_id,
        BIN_TO_UUID(app_group_id) as app_group_id,
        student_grade_cumulative_id,
        type,
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
      WHERE app_group_id=UUID_TO_BIN(?) AND child_id=UUID_TO_BIN(?)`,
      [
        app_group_id,
        child_id
      ]
    );
    if(response && response[0]) {
      studentCumulative = {
        ...response[0]
      }
      if(studentCumulative) {
        currentSubjectGrades = await db.query(`
         SELECT * FROM student_grades 
         WHERE student_grade_cumulative_id=? `, [
           studentCumulative.student_grade_cumulative_id
        ]);
        studentCumulative = {
          ...studentCumulative,
          grades: currentSubjectGrades
        }
      }
    }
    
  } catch (error) {
    console.log('Error', error)
  } finally {
    await db.close();
    return studentCumulative;
  }
}


export const addUpdateStudentCumulativeGrades = async ({
  student_grade_cumulative_id = null,
  app_group_id,
  child_id,
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
  let studentCumulative = {};

  try {
    let cumulativeId = student_grade_cumulative_id;
    let currentSubjectGrades = [];
    const isUserExist = await db.query(`
      SELECT student_grade_cumulative_id 
      FROM student_grade_cumulative 
      WHERE child_id=UUID_TO_BIN(?) AND app_group_id=UUID_TO_BIN(?)`,
    [child_id, app_group_id]);

    if(isUserExist.length === 0) {
      const studentCumulativeResult = await db.query(
        `INSERT INTO student_grade_cumulative(
          child_id,
          app_group_id,
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
          child_id,
          app_group_id,
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

      cumulativeId =  studentCumulativeResult.insertId
  
    }
    else{
      const studentCumulativeResult = await db.query(
        `UPDATE student_grade_cumulative
         SET year_level=?,school_year_start=?,
         school_year_end=?,school_year_frame=?,
         class_name=?,class_type=?,class_teacher=?,
         attachment=?,date_updated=NOW() WHERE child_id=UUID_TO_BIN(?) AND app_group_id=UUID_TO_BIN(?)
        
        `,
        [
          year_level,
          school_year_start,
          school_year_end,
          school_year_frame,
          class_name,
          class_type,
          class_teacher,
          attachment,
          child_id,
          app_group_id
        ]
      );

      currentSubjectGrades = await db.query(`
        SELECT student_grades_id, subject FROM student_grades 
        WHERE student_grade_cumulative_id=? `, [cumulativeId]);
    }
    if(grades.length > 0) {
      for(let grade of grades) {
        const isSubjectExist = currentSubjectGrades.find(item => item.subject === grade.subject)
        console.log('isSubjectExist',isSubjectExist)
        if(!isSubjectExist){
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
            cumulativeId,
            grade.subject,
            grade.quarter_1 || 0,
            grade.quarter_2 || 0,
            grade.quarter_3 || 0,
            grade.quarter_4 || 0,
          ]
          );
        }
        else{
          await db.query(
            `UPDATE student_grades
             SET
              quarter_1=?,
              quarter_2=?,
              quarter_3=?,
              quarter_4=?
            WHERE student_grade_cumulative_id=? AND subject=?
            `,
          [
            grade.quarter_1 || 0,
            grade.quarter_2 || 0,
            grade.quarter_3 || 0,
            grade.quarter_4 || 0,
            cumulativeId,
            grade.subject,
          ]
          );
        }

      }
    }

    



    studentCumulative = await db.query(
      `SELECT  BIN_TO_UUID(child_id) as child_id,
        BIN_TO_UUID(app_group_id) as app_group_id,
        student_grade_cumulative_id,
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
      WHERE child_id=UUID_TO_BIN(?)`,
      [child_id]
    );

    if(studentCumulative && studentCumulative[0]) {
      studentCumulative = {
        ...studentCumulative[0]
      }
      if(studentCumulative) {
        console.log('studentCumulative',studentCumulative.student_grade_cumulative_id)
        let currentSubjectGrades = await db.query(`
         SELECT * FROM student_grades 
         WHERE student_grade_cumulative_id=? `, [
           studentCumulative.student_grade_cumulative_id
        ]);
        studentCumulative = {
          ...studentCumulative,
          grades: currentSubjectGrades
        }

        console.log('studentCumulative',studentCumulative)
      }
    }
  } catch (error) {
    console.log('Error', error)
  } finally {
    await db.close();
    return studentCumulative;
  }
}