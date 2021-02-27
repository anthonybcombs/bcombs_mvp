import { makeDb } from '../../helpers/database';

const getAverage = (grades, type) => {
	return grades.map(grade => {
		if (type === 'semestral') {
			return {
				...grade,
				semestral_1_average: parseFloat(((grade.quarter_1 || 0) + (grade.quarter_2 || 0)) / 2),
				semestral_2_average: parseFloat(((grade.quarter_3 || 0) + (grade.quarter_4 || 0)) / 2),
				semestral_final: parseFloat(
					((grade.quarter_1 || 0) + (grade.quarter_2 || 0) + (grade.quarter_3 || 0) + (grade.quarter_4 || 0)) / 4
				),
			};
		} else if (type === 'quarter') {
			return {
				...grade,
				quarter_average: parseFloat(
					((grade.quarter_1 || 0) + (grade.quarter_2 || 0) + (grade.quarter_3 || 0) + (grade.quarter_4 || 0)) / 4
				),
			};
		}
		return {
			...grade,
		};
	});
};

export const getGrades = async () => {
	const db = makeDb();
	const result = [];
	try {
		const grades = await db.query('SELECT BIN_TO_UUID(ID) as id,name FROM grades');
		grades.forEach(grade => {
			result.push({ id: grade.id, name: grade.name });
		});
		return result;
	} catch (error) {
	} finally {
		await db.close();
	}
};

export const getStudentCumulativeByChildID = async (childId) => {
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
        school_type,
        school_name,
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
			[childId]
		);
		if (response) {
			studentCumulative = [...(response || [])];
			const studentGradeCumulativeIds = response.map(item => item.student_grade_cumulative_id);

			if (studentGradeCumulativeIds.length > 0) {
				let subjects = await db.query(`
          SELECT * FROM student_grades 
          WHERE student_grade_cumulative_id IN (${studentGradeCumulativeIds.join(',')})`);

				studentCumulative = studentCumulative.map(item => {
					const studentCumulativeGrade = subjects.filter(
						grade => item.student_grade_cumulative_id === grade.student_grade_cumulative_id
					);
					return {
						...item,
						grades: [...(studentCumulativeGrade || [])],
					};
				});
			}
		}

		for (const sc of studentCumulative) {
			sc.grades = getAverage(sc.grades, sc.school_year_frame);
			console.log('studentCumulative sc', sc);
			console.log('studentCumulative', getAverage(sc.grades, sc.school_year_frame));
		}
	} catch (error) {
		console.log('Error', error);
	} finally {
		await db.close();
		return studentCumulative;
	}
}

export const getStudentCumulativeGradeByGroup = async ({ app_group_id }) => {
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
        school_type,
        school_name,
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
			[app_group_id]
		);
		if (response) {
			studentCumulative = [...(response || [])];
			const studentGradeCumulativeIds = response.map(item => item.student_grade_cumulative_id);

			if (studentGradeCumulativeIds.length > 0) {
				let subjects = await db.query(`
          SELECT * FROM student_grades 
          WHERE student_grade_cumulative_id IN (${studentGradeCumulativeIds.join(',')})`);

				studentCumulative = studentCumulative.map(item => {
					const studentCumulativeGrade = subjects.filter(
						grade => item.student_grade_cumulative_id === grade.student_grade_cumulative_id
					);
					return {
						...item,
						grades: [...(studentCumulativeGrade || [])],
					};
				});
			}
		}

		for (const sc of studentCumulative) {
			sc.grades = getAverage(sc.grades, sc.school_year_frame);
			console.log('studentCumulative sc', sc);
			console.log('studentCumulative', getAverage(sc.grades, sc.school_year_frame));
		}
	} catch (error) {
		console.log('Error', error);
	} finally {
		await db.close();
		return studentCumulative;
	}
};

export const getStudentCumulativeGrade = async ({ app_group_id, child_id }) => {
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
        school_type,
        school_name,
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
			[app_group_id, child_id]
		);
		if (response && response[0]) {
			studentCumulative = {
				...response[0],
			};
			if (studentCumulative) {
				currentSubjectGrades = await db.query(
					`
         SELECT * FROM student_grades 
         WHERE student_grade_cumulative_id=? `,
					[studentCumulative.student_grade_cumulative_id]
				);
				studentCumulative = {
					...studentCumulative,
					grades: currentSubjectGrades,
				};

				studentCumulative.grades = getAverage(studentCumulative.grades, studentCumulative.school_year_frame);
			}
		}
	} catch (error) {
		console.log('Error', error);
	} finally {
		await db.close();
		return studentCumulative;
	}
};

export const addUpdateStudentCumulativeGrades = async ({
	student_grade_cumulative_id = null,
	app_group_id,
	child_id,
	year_level,
	school_type,
	school_name,
	school_year_start,
	school_year_end,
	school_year_frame,
	class_name,
	class_type,
	class_teacher,
	attachment,
	grades = [],
	deleted_grades = [],
}) => {
	const db = makeDb();
	let studentCumulative = {};

	try {
		let cumulativeId = student_grade_cumulative_id;
		let currentSubjectGrades = [];
		const isUserExist = await db.query(
			`
      SELECT student_grade_cumulative_id 
      FROM student_grade_cumulative 
      WHERE child_id=UUID_TO_BIN(?) AND app_group_id=UUID_TO_BIN(?)`,
			[child_id, app_group_id]
		);

		if (isUserExist.length === 0) {
			const studentCumulativeResult = await db.query(
				`INSERT INTO student_grade_cumulative(
          child_id,
          app_group_id,
          year_level,
          school_type,
          school_name,
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
          ?,
          ?,
          NOW()
        )
        `,
				[
					child_id,
					app_group_id,
					year_level,
					school_type,
					school_name,
					school_year_start,
					school_year_end,
					school_year_frame,
					class_name,
					class_type,
					class_teacher,
					attachment,
				]
			);

			cumulativeId = studentCumulativeResult.insertId;
		} else {
			const studentCumulativeResult = await db.query(
				`UPDATE student_grade_cumulative
         SET year_level=?,
         school_type=?,school_name=?,
         school_year_start=?,
         school_year_end=?,school_year_frame=?,
         class_name=?,class_type=?,class_teacher=?,
         attachment=?,date_updated=NOW() WHERE child_id=UUID_TO_BIN(?) AND app_group_id=UUID_TO_BIN(?)
        
        `,
				[
					year_level,
					school_type,
					school_name,
					school_year_start,
					school_year_end,
					school_year_frame,
					class_name,
					class_type,
					class_teacher,
					attachment,
					child_id,
					app_group_id,
				]
			);

			currentSubjectGrades = await db.query(
				`
        SELECT student_grades_id,subject FROM student_grades 
        WHERE student_grade_cumulative_id=? `,
				[cumulativeId]
			);
		}
		if (grades.length > 0) {
			for (let grade of grades) {
				const isSubjectExist = currentSubjectGrades.find(item => item.subject === grade.subject);
				if (!isSubjectExist) {
					await db.query(
						`INSERT INTO student_grades
              (
                student_grade_cumulative_id,
                class,
                subject,
                quarter_1,
                quarter_2,
                quarter_3,
                quarter_4,
                date_created
              )
            VALUES (?,?,?,?,?,?,?,NOW())
            `,
						[
							cumulativeId,
							grade.class,
							grade.subject,
							grade.quarter_1 || 0,
							grade.quarter_2 || 0,
							grade.quarter_3 || 0,
							grade.quarter_4 || 0,
						]
					);
				} else {
					await db.query(
						`UPDATE student_grades
             SET
              quarter_1=?,
              quarter_2=?,
              quarter_3=?,
              quarter_4=?
            WHERE student_grade_cumulative_id=? AND subject=? AND class=?
            `,
						[
							grade.quarter_1 || 0,
							grade.quarter_2 || 0,
							grade.quarter_3 || 0,
							grade.quarter_4 || 0,
							cumulativeId,
							grade.subject,
							grade.class,
						]
					);
				}
			}
		}

		if (deleted_grades.length > 0) {
			await db.query(
				`DELETE FROM student_grades
         WHERE student_grades_id IN (${deleted_grades.join(',')}) AND 
         student_grade_cumulative_id=?
        `,
				[cumulativeId]
			);
		}

		studentCumulative = await db.query(
			`SELECT  BIN_TO_UUID(child_id) as child_id,
        BIN_TO_UUID(app_group_id) as app_group_id,
        student_grade_cumulative_id,
        year_level,
        school_type,
        school_name,
        school_year_start,
        school_year_end,
        school_year_frame,
        class_name,
        class_type,
        class_teacher,
        attachment,
        date_added
      FROM student_grade_cumulative
      WHERE student_grade_cumulative_id=?`,
			[cumulativeId]
		);

		if (studentCumulative && studentCumulative[0]) {
			studentCumulative = {
				...studentCumulative[0],
			};
			if (studentCumulative) {
				let currentSubjectGrades = await db.query(
					`
         SELECT * FROM student_grades 
         WHERE student_grade_cumulative_id=? `,
					[studentCumulative.student_grade_cumulative_id]
				);
				studentCumulative = {
					...studentCumulative,
					grades: currentSubjectGrades,
				};
				studentCumulative.grades = getAverage(studentCumulative.grades, studentCumulative.school_year_frame);
			}
		}
	} catch (error) {
		console.log('Error', error);
	} finally {
		await db.close();
		return studentCumulative;
	}
};

export const getStudentStandardizedTest = async child_id => {
	const db = makeDb();
	let studentStandardizedTest = [];
	try {
		studentStandardizedTest = await db.query(
			`SELECT student_test_id,
        BIN_TO_UUID(child_id) as child_id,
        BIN_TO_UUID(app_group_id) as app_group_id,
        test_name,
        attempt,
        grade_taken,
        month_taken,
        score,
        ach_level,
        school_percentage,
        nationality_percentage,
        district_percentage,
        state_percentage,
        attachment
      FROM student_standardized_test
      WHERE child_id=UUID_TO_BIN(?)`,
			[child_id]
		);
	} catch (error) {
		console.log('Error', error);
	} finally {
		await db.close();
		return studentStandardizedTest;
	}
};

export const addUpdateStudentTest = async (studentTest = []) => {
	const db = makeDb();
	let studentTestList = [];

	try {
		for (const test of studentTest) {
			let studentTestId = test.student_test_id || null;
			let studentChildId = test.child_id;
			let currentSubjectGrades = [];
			const isTestExist = studentTestId
				? await db.query(
						`SELECT student_test_id 
          FROM student_standardized_test 
          WHERE student_test_id=?`,
						[studentTestId]
				  )
				: null;

			if (!isTestExist && !studentTestId) {
				const studentStardizedTestResult = await db.query(
					`INSERT INTO student_standardized_test(
            child_id,
            app_group_id,
            test_name,
            attempt,
            grade_taken,
            month_taken,
            score,
            ach_level,
            school_percentage,
            nationality_percentage,
            district_percentage,
            state_percentage,
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
            ?,
            ?,
            ?,
            NOW()
          )
        `,
					[
						test.child_id,
						test.app_group_id,
						test.test_name,
						test.attempt,
						test.grade_taken,
						test.month_taken,
						test.score,
						test.ach_level,
						test.school_percentage,
						test.nationality_percentage,
						test.district_percentage,
						test.state_percentage,
						test.attachment,
					]
				);

				studentTestId = studentStardizedTestResult.insertId;
			} else {
				const studentStardizedTestResult = await db.query(
					`UPDATE student_standardized_test
          SET test_name=?,attempt=?,
            grade_taken=?,month_taken=?,
            score=?,ach_level=?,school_percentage=?,
            nationality_percentage=?, district_percentage=?,
            state_percentage=?, attachment=?,
            date_updated=NOW() 
          WHERE student_test_id=?
        `,
					[
						test.test_name,
						test.attempt,
						test.grade_taken,
						test.month_taken,
						test.score,
						test.ach_level,
						test.school_percentage,
						test.nationality_percentage,
						test.district_percentage,
						test.state_percentage,
						test.attachment,
						studentTestId,
					]
				);
			}

			studentTestList = await db.query(
				`SELECT  
          student_test_id,
          BIN_TO_UUID(child_id) as child_id,
          BIN_TO_UUID(app_group_id) as app_group_id,
          test_name,
          attempt,
          grade_taken,
          month_taken,
          score,
          ach_level,
          school_percentage,
          nationality_percentage,
          district_percentage,
          state_percentage,
          attachment
        FROM student_standardized_test
        WHERE child_id=UUID_TO_BIN(?)`,
				[studentChildId]
			);
		}
	} catch (error) {
		console.log('Error', error);
	} finally {
		await db.close();
		return studentTestList;
	}
};

export const removeStudentTest = async (studentTestIds = [], childId) => {
	const db = makeDb();
  let studentTestList = [];
	try {
		await db.query(
			`DELETE FROM student_standardized_test
       WHERE student_test_id IN (${studentTestIds.join(',')}) AND 
       child_id=UUID_TO_BIN(?)
      `,
			[childId]
		);

		studentTestList = await db.query(
			`SELECT  
        student_test_id,
        BIN_TO_UUID(child_id) as child_id,
        BIN_TO_UUID(app_group_id) as app_group_id,
        test_name,
        attempt,
        grade_taken,
        month_taken,
        score,
        ach_level,
        school_percentage,
        nationality_percentage,
        district_percentage,
        state_percentage,
        attachment
      FROM student_standardized_test
      WHERE child_id=UUID_TO_BIN(?)`,
			[childId]
		);
	} catch (err) {
    console.log('Error removeStudentTest', err);
    return [];
	} finally {
		await db.close();
		return studentTestList;
	}
};
