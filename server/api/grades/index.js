import { makeDb } from '../../helpers/database';

import { currentS3BucketName, s3Bucket, s3BucketRootPath, uploadFile } from '../../helpers/aws';

import { getChildInformation } from '../child';

const getAverage = (grades, type) => {
	return grades.map(grade => {
		if (type === 'semestral') {
			return {
				...grade,
				semestral_1_average: parseFloat(((grade.grade_quarter_1 || 0) + (grade.grade_quarter_2 || 0)) / 2),
				semestral_2_average: parseFloat(((grade.grade_quarter_3 || 0) + (grade.grade_quarter_4 || 0)) / 2),
				semestral_final: parseFloat(
					((grade.grade_quarter_1 || 0) +
						(grade.grade_quarter_2 || 0) +
						(grade.grade_quarter_3 || 0) +
						(grade.grade_quarter_4 || 0)) /
						4
				),
				final_semestral_1_attendance: (grade.attendance_quarter_1_total || 0) + (grade.attendance_quarter_2_total || 0),
				final_semestral_2_attendance: (grade.attendance_quarter_3_total || 0) + (grade.attendance_quarter_4_total || 0),
			};
		} else if (type === 'quarter') {
			return {
				...grade,
				quarter_average: parseFloat(
					((grade.grade_quarter_1 || 0) +
						(grade.grade_quarter_2 || 0) +
						(grade.grade_quarter_3 || 0) +
						(grade.grade_quarter_4 || 0)) /
						4
				),
				final_quarter_attendance:
					(grade.attendance_quarter_1_total || 0) +
					(grade.attendance_quarter_2_total || 0) +
					(grade.attendance_quarter_3_total || 0) +
					(grade.attendance_quarter_4_total || 0),
				attendance_quarter_1_present:
					grade.attendance_quarter_1_total - (grade.attendance_quarter_1_tardy + grade.attendance_quarter_1_absent),
				attendance_quarter_2_present:
					grade.attendance_quarter_2_total - (grade.attendance_quarter_2_tardy + grade.attendance_quarter_2_absent),
				attendance_quarter_3_present:
					grade.attendance_quarter_3_total - (grade.attendance_quarter_3_tardy + grade.attendance_quarter_3_absent),
				attendance_quarter_4_present:
					grade.attendance_quarter_4_total - (grade.attendance_quarter_4_tardy + grade.attendance_quarter_4_absent),
			};
		}
		return {
			...grade,
		};
	});
};

const formatFormContents = applications => {
	for (let application of applications) {
		application.form_contents = application.form_contents
			? Buffer.from(application.form_contents, 'base64').toString('utf-8')
			: '{}';
		application.form_contents = application.form_contents;
	}

	return applications;
};

const getTotalAttendance = (cumulativeGrade, type) => {
	cumulativeGrade.map(cumulative => {
		if (cumulative.school_year_frame === 'semestral') {
			item.grades.reduce((accum, grade) => {
				return accum + (grade.attendance || 0);
			}, 0);
		}
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

const formatFile = async (attachment, id, path = 'grades') => {
	const file = { ...(attachment || {}) };
	if (file && file.data) {
		const buf = Buffer.from(file?.data.replace(/^data:image\/\w+;base64,/, ''), 'base64');
		const s3Payload = {
			Bucket: currentS3BucketName,
			Key: `${path}/${id}/${file.filename}`,
			Body: buf,
			ContentEncoding: 'base64',
			ContentType: file.contentType,
			ACL: 'public-read',
		};
		await uploadFile(s3Payload);
		return s3Payload;
	}
	return null;
};

export const getStudentCumulativeByChildId = async childId => {
	const db = makeDb();
	let studentCumulative = [];
	let studentGrades = [];
	try {
		const response = await db.query(
			`SELECT  BIN_TO_UUID(child_id) as child_id,
				student_grade_cumulative.application_type,
				student_grade_cumulative.student_grade_cumulative_id,
				student_grade_cumulative.year_level,
				student_grade_cumulative.school_type,
				student_grade_cumulative.school_name,
				student_grade_cumulative.child_designation,
				student_grade_cumulative.school_designation,
				student_grade_cumulative.mid_student_rank,
				student_grade_cumulative.final_student_rank,
				student_grade_cumulative.school_year_start,
				student_grade_cumulative.school_year_end,
				student_grade_cumulative.school_year_frame,
				student_grade_cumulative.class_name,
				student_grade_cumulative.gpa_sem_1,
				student_grade_cumulative.gpa_sem_2,
				student_grade_cumulative.gpa_final,
				student_grade_cumulative.class_type,
				student_grade_cumulative.scale,
				student_grade_cumulative.attachment,
				student_grade_cumulative.date_added,
				child.firstname,
				child.lastname,
				child.birthdate,
				child.gender
			FROM student_grade_cumulative,child
			WHERE 
				student_grade_cumulative.child_id=UUID_TO_BIN(?)
			AND
				child.ch_id=student_grade_cumulative.child_id`,
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
		}
	} catch (error) {
		console.log('Error', error);
	} finally {
		await db.close();
		return studentCumulative;
	}
};

export const getStudentCumulativeGradeByAppGroupId = async (app_group_id, app_group_type = 'application') => {
	const db = makeDb();
	let studentCumulative = [];
	let studentGrades = [];
	try {
		let response = await db.query(
			app_group_type === 'forms'
				? `SELECT app.class_teacher as app_group_id,
				vag.name as app_group_name,
				CONVERT(form_contents USING utf8) as form_contents,
				BIN_TO_UUID(app.app_id) as child_id
			FROM custom_application app
			INNER JOIN vendor_app_groups vag
			ON vag.app_grp_id=UUID_TO_BIN(app.class_teacher)
			WHERE app.class_teacher=?`
				: `SELECT app.class_teacher as app_group_id,
				vag.name as app_group_name,
        BIN_TO_UUID(ch.ch_id) as child_id,
				BIN_TO_UUID(app.app_id) as app_id,
				ch.firstname,
				ch.lastname
      FROM application app
      INNER JOIN child ch
			ON ch.ch_id=app.child
			INNER JOIN vendor_app_groups vag
      ON vag.app_grp_id=UUID_TO_BIN(app.class_teacher)
			WHERE app.class_teacher=?`,
			[app_group_id]
		);

		if (response) {
			if (app_group_type === 'forms') {
				response = formatFormContents(response);
			}

			studentCumulative = [...(response || [])];
			const childIds = response.map(item => item.child_id).filter(id => id);

			if (childIds.length > 0) {
				let cumulativeGrade = await db.query(`
            SELECT   
              BIN_TO_UUID(sgc.app_group_id) as app_group_id,
							BIN_TO_UUID(sgc.child_id) as child_id,
              sgc.student_grade_cumulative_id,
              sgc.application_type,
              sgc.year_level,
              sgc.school_type,
							sgc.school_name,
							sgc.child_designation,
							sgc.school_designation,
							sgc.mid_student_rank,
							sgc.final_student_rank,
              sgc.school_year_start,
              sgc.school_year_end,
              sgc.school_year_frame,
              sgc.class_name,
							sgc.class_type,
							sgc.gpa_sem_1,
							sgc.gpa_sem_2,
							sgc.gpa_final,
							sgc.scale,
              sgc.attachment,
              sgc.class_name 
            FROM student_grade_cumulative sgc
						WHERE sgc.child_id IN (${childIds.map(id => `UUID_TO_BIN('${id}')`).join(',')})
				`);

				let standardizedTest = await db.query(`
					SELECT   
						student_test_id,
						BIN_TO_UUID(child_id) as child_id,
						test_name,
						attempt,
						grade_taken,
						month_taken,
						score,
						score_percentage,
						ach_level,
						school_percentage,
						nationality_percentage,
						district_percentage,
						state_percentage,
						attachment
					FROM student_standardized_test
					WHERE child_id IN (${childIds.map(id => `UUID_TO_BIN('${id}')`).join(',')})
				`);

				studentCumulative = studentCumulative
					.map(item => {
						let currentStudentCumulative = cumulativeGrade.filter(cg => cg.child_id === item.child_id)
						.sort((a,b) => b.year_level - a.year_level)

						console.log('currentStudentCumulative',currentStudentCumulative)
						let studentTest = standardizedTest.filter(st => st.child_id === item.child_id);
						return {
							...item,
							cumulative_grades: [...(currentStudentCumulative || [])],
							standardized_test: [...(studentTest || [])],
						};
					})
					.sort((a, b) => b.year_level > a.year_level);

				for (let sc of studentCumulative) {
					const studentGradeCumulativeIds = sc.cumulative_grades
						.map(item => item.student_grade_cumulative_id)
						.filter(item => item);

					if (studentGradeCumulativeIds.length > 0) {
						let subjects = await db.query(`
                SELECT * FROM student_grades 
                WHERE student_grade_cumulative_id IN (${studentGradeCumulativeIds.join(',')})`);

						if (subjects && subjects.length > 0) {
							sc.cumulative_grades = sc.cumulative_grades.map(item => {
								const studentGrade = subjects.filter(
									grade => item.student_grade_cumulative_id === grade.student_grade_cumulative_id
								);
								return {
									...item,
									grades: [...(studentGrade || [])],
								};
							});

							for (const scg of sc.cumulative_grades) {
								if (scg.grades && scg.grades.length > 0) {
									scg.grades = getAverage(scg.grades, scg.school_year_frame);
								}
							}
						}
					}
				}
				console.log('studentCumulative', studentCumulative);
			}
		}
	} catch (error) {
		console.log('Error', error);
	} finally {
		await db.close();
		return studentCumulative;
	}
};

export const getStudentCumulativeGradeVendor = async ({ vendor_id }) => {
	const db = makeDb();
	let studentCumulative = [];
	let studentGrades = [];
	try {
		let applicationStudent = await db.query(
			`SELECT child.firstname,
					child.lastname,
					sgc.student_grade_cumulative_id,
					sgc.year_level,
					sgc.application_type,
					BIN_TO_UUID(sgc.app_group_id) as app_group_id,
					vag.name as app_group_name,
					BIN_TO_UUID(app.child) as child_id,
					BIN_TO_UUID(app.vendor) as vendor
				FROM child
				INNER JOIN application app ON app.child=child.ch_id
				LEFT JOIN student_grade_cumulative sgc ON sgc.child_id=child.ch_id
				INNER JOIN vendor_app_groups vag ON vag.app_grp_id=sgc.app_group_id
				INNER JOIN vendor vndr ON vndr.id=vag.vendor
				WHERE vndr.id=UUID_TO_BIN(?)`,
			[vendor_id]
		);

		let customApplicationStudent = await db.query(
			`SELECT app.class_teacher as app_group_id,
				sgc.student_grade_cumulative_id,
				sgc.year_level,
				sgc.application_type,
				vag.name as app_group_name,
				CONVERT(form_contents USING utf8) as form_contents,
				BIN_TO_UUID(app.app_id) as child_id
			FROM custom_application app
			LEFT JOIN student_grade_cumulative sgc ON sgc.child_id=app.app_id
			LEFT JOIN vendor_app_groups vag
			ON vag.app_grp_id=app.class_teacher
			WHERE app.vendor=UUID_TO_BIN(?)`,
			[vendor_id]
		);

		if (customApplicationStudent && customApplicationStudent.length > 0) {
			customApplicationStudent = formatFormContents(customApplicationStudent);
		}

		let response = [...(applicationStudent || []), ...(customApplicationStudent || [])];

		if (response) {
			studentCumulative = [...(response || [])];
			const studentGradeCumulativeIds = response.map(item => item.student_grade_cumulative_id).filter(item => item);

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
        student_grade_cumulative_id,
        application_type,
        year_level,
        school_type,
				school_name,
				child_designation,
				school_designation,
				mid_student_rank,
        final_student_rank,
        school_year_start,
        school_year_end,
        school_year_frame,
        class_name,
				class_type,
				scale,
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
					`SELECT * FROM student_grades 
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

// semestral_1_average and semestral_2_average are no longer used
export const addUpdateStudentCumulativeGrades = async (studentCumulativeGrade = []) => {
	const db = makeDb();
	let studentCumulativeGradesResult = [];
	try {
		for (let sc of studentCumulativeGrade) {
			let {
				student_grade_cumulative_id = null,
				application_type = 'bcombs',
				attachment = null,
				app_group_id,
				child_id,
				year_level,
				school_type,
				school_name,
				child_designation,
				school_designation,
				mid_student_rank,
				final_student_rank,
				school_year_start,
				school_year_end,
				school_year_frame,
				class_name,
				class_type,
				gpa_sem_1,
				gpa_sem_2,
				gpa_final,
				scale,
				grades = [],
				standardized_test = [],
				deleted_grades = [],
				deleted_standardized_test = [],
			} = sc;
			let studentCumulative = {};
			let cumulativeId = student_grade_cumulative_id;
			let currentSubjectGrades = [];

			const isUserExist = cumulativeId
				? await db.query(
						`SELECT student_grade_cumulative_id,attachment
      	FROM student_grade_cumulative 
      	WHERE  student_grade_cumulative_id=?`,
						[cumulativeId]
				  )
				: [];

			if (isUserExist.length === 0) {
				const studentCumulativeResult = await db.query(
					`INSERT INTO student_grade_cumulative(
          child_id,
					app_group_id,
					application_type,
          year_level,
          school_type,
					school_name,
					child_designation,
					school_designation,
					mid_student_rank,
					final_student_rank,
          school_year_start,
          school_year_end,
          school_year_frame,
          class_name,
					class_type,
					gpa_sem_1,
					gpa_sem_2,
					gpa_final,
					scale,
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
						application_type,
						year_level,
						school_type,
						school_name,
						child_designation,
						school_designation,
						mid_student_rank,
						final_student_rank,
						school_year_start,
						school_year_end,
						school_year_frame,
						class_name,
						class_type,
						gpa_sem_1,
						gpa_sem_2,
						gpa_final,
						scale,
					]
				);

				cumulativeId = studentCumulativeResult.insertId;

				const s3Payload = await formatFile(attachment, cumulativeId);

				if (s3Payload) {
					await db.query(
						`UPDATE student_grade_cumulative
						 SET attachment=?, date_updated=NOW() 
						 WHERE student_grade_cumulative_id=?
						`,
						[s3Payload.Key, cumulativeId]
					);
				}
			} else {
				const s3Payload = await formatFile(attachment, cumulativeId);
				const studentCumulativeResult = await db.query(
					`UPDATE student_grade_cumulative
         SET year_level=?,
					 school_type=?,
					 school_name=?,
					 child_designation=?,
					 school_designation=?,
					 mid_student_rank=?,
					 final_student_rank=?,
         	school_year_start=?,
				 	school_year_end=?,
				 	school_year_frame=?,
				 	class_name=?,
					class_type=?,
					gpa_sem_1=?,
					gpa_sem_2=?,
					gpa_final=?,
					scale=?,
				 	attachment=?,
					date_updated=NOW() 
				 WHERE child_id=UUID_TO_BIN(?) AND 
				 	student_grade_cumulative_id=?
        `,
					[
						year_level,
						school_type,
						school_name,
						child_designation,
						school_designation,
						mid_student_rank,
						final_student_rank,
						school_year_start,
						school_year_end,
						school_year_frame,
						class_name,
						class_type,
						gpa_sem_1,
						gpa_sem_2,
						gpa_final,
						scale,
						s3Payload ? s3Payload.Key : isUserExist[0] && isUserExist[0].attachment,
						child_id,
						cumulativeId,
					]
				);

				currentSubjectGrades = await db.query(
					`SELECT student_grades_id,subject FROM student_grades 
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
								teacher_name,
								designation,
                grade_quarter_1,
                grade_quarter_2,
                grade_quarter_3,
								grade_quarter_4,
								letter_grade_quarter_1,
                letter_grade_quarter_2,
                letter_grade_quarter_3,
								letter_grade_quarter_4,
								summer_grade_1,
                summer_grade_2,
								summer_grade_3,
								mid_quarter_remarks,
								final_quarter_remarks,
								attendance_quarter_1_total,
								attendance_quarter_2_total,
								attendance_quarter_3_total,
								attendance_quarter_4_total,
								attendance_quarter_1_absent,
								attendance_quarter_2_absent,
								attendance_quarter_3_absent,
								attendance_quarter_4_absent,
								attendance_quarter_1_tardy,
								attendance_quarter_2_tardy,
								attendance_quarter_3_tardy,
								attendance_quarter_4_tardy,
								mid_final_grade,
								final_grade,
								year_final_grade,
								letter_mid_final_grade,
								letter_final_grade,
								letter_year_final_grade,
								help_needed,
								help_q1,
                help_q2,
                help_q3,
								help_q4,
                date_created
              )
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,NOW())
            `,
							[
								cumulativeId,
								grade.class,
								grade.subject,
								grade.teacher_name,
								grade.designation,
								grade.grade_quarter_1 || 0,
								grade.grade_quarter_2 || 0,
								grade.grade_quarter_3 || 0,
								grade.grade_quarter_4 || 0,
								grade.letter_grade_quarter_1 || '',
								grade.letter_grade_quarter_2 || '',
								grade.letter_grade_quarter_3 || '',
								grade.letter_grade_quarter_4 || '',
								grade.summer_grade_1 || 0,
								grade.summer_grade_2 || 0,
								grade.summer_grade_3 || 0,
								grade.mid_quarter_remarks || 0,
								grade.final_quarter_remarks || 0,
								grade.attendance_quarter_1_total || 0,
								grade.attendance_quarter_2_total || 0,
								grade.attendance_quarter_3_total || 0,
								grade.attendance_quarter_4_total || 0,
								grade.attendance_quarter_1_absent || 0,
								grade.attendance_quarter_2_absent || 0,
								grade.attendance_quarter_3_absent || 0,
								grade.attendance_quarter_4_absent || 0,
								grade.attendance_quarter_1_tardy || 0,
								grade.attendance_quarter_2_tardy || 0,
								grade.attendance_quarter_3_tardy || 0,
								grade.attendance_quarter_4_tardy || 0,
								grade.mid_final_grade || 0,
								grade.final_grade || 0,
								grade.year_final_grade || 0,
								grade.letter_mid_final_grade || '',
								grade.letter_final_grade || '',
								grade.letter_year_final_grade || '',
								grade.help_needed || '',
								grade.help_q1 || '',
								grade.help_q2 || '',
								grade.help_q3 || '',
								grade.help_q4 || '',
							]
						);
					} else {
						await db.query(
							`UPDATE student_grades
             SET
						  grade_quarter_1=?,
						  grade_quarter_2=?,
						  grade_quarter_3=?,
							grade_quarter_4=?,
							letter_grade_quarter_1=?,
						  letter_grade_quarter_2=?,
						  letter_grade_quarter_3=?,
							letter_grade_quarter_4=?,
							summer_grade_1=?,
						  summer_grade_2=?,
							summer_grade_3=?,
							mid_quarter_remarks=?,
							final_quarter_remarks=?,
							attendance_quarter_1_total=?,
              attendance_quarter_2_total=?,
              attendance_quarter_3_total=?,
							attendance_quarter_4_total=?,
							attendance_quarter_1_absent=?,
              attendance_quarter_2_absent=?,
              attendance_quarter_3_absent=?,
							attendance_quarter_4_absent=?,
							attendance_quarter_1_tardy=?,
              attendance_quarter_2_tardy=?,
              attendance_quarter_3_tardy=?,
							attendance_quarter_4_tardy=?,
							mid_final_grade=?,
							final_grade=?,
							year_final_grade=?,
							letter_mid_final_grade=?,
							letter_final_grade=?,
							letter_year_final_grade=?,
							help_needed=?
							
            WHERE student_grade_cumulative_id=? AND subject=? AND class=?
            `,
							[
								grade.grade_quarter_1 || 0,
								grade.grade_quarter_2 || 0,
								grade.grade_quarter_3 || 0,
								grade.grade_quarter_4 || 0,
								grade.letter_grade_quarter_1 || '',
								grade.letter_grade_quarter_2 || '',
								grade.letter_grade_quarter_3 || '',
								grade.letter_grade_quarter_4 || '',
								grade.summer_grade_1 || 0,
								grade.summer_grade_2 || 0,
								grade.summer_grade_3 || 0,
								grade.mid_quarter_remarks || 0,
								grade.final_quarter_remarks || 0,
								grade.attendance_quarter_1_total || 0,
								grade.attendance_quarter_2_total || 0,
								grade.attendance_quarter_3_total || 0,
								grade.attendance_quarter_4_total || 0,
								grade.attendance_quarter_1_absent || 0,
								grade.attendance_quarter_2_absent || 0,
								grade.attendance_quarter_3_absent || 0,
								grade.attendance_quarter_4_absent || 0,
								grade.attendance_quarter_1_tardy || 0,
								grade.attendance_quarter_2_tardy || 0,
								grade.attendance_quarter_3_tardy || 0,
								grade.attendance_quarter_4_tardy || 0,
								grade.mid_final_grade || 0,
								grade.final_grade || 0,
								grade.year_final_grade || 0,
								grade.letter_mid_final_grade || '',
								grade.letter_final_grade || '',
								grade.letter_year_final_grade || '',
								grade.help_needed || '',
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
				application_type === 'forms'
					? `SELECT BIN_TO_UUID(sgc.child_id) as child_id,
				sgc.student_grade_cumulative_id,
				sgc.application_type,
				sgc.year_level,
				sgc.child_designation,
				sgc.school_designation,
				sgc.mid_student_rank,
				sgc.final_student_rank,
				sgc.school_type,
				sgc.school_name,
				sgc.school_year_start,
				sgc.school_year_end,
				sgc.school_year_frame,
				sgc.class_name,
				sgc.class_type,
				sgc.gpa_sem_1,
				sgc.gpa_sem_2,
				sgc.gpa_final,
				sgc.scale,
				sgc.attachment,
				sgc.date_added,
				CONVERT(form_contents USING utf8) as form_contents
			FROM student_grade_cumulative sgc, custom_application ca
			WHERE sgc.student_grade_cumulative_id=? AND
				ca.app_id=sgc.child_id`
					: `SELECT BIN_TO_UUID(sgc.child_id) as child_id,
				sgc.student_grade_cumulative_id,
				sgc.application_type,
				sgc.year_level,
				sgc.child_designation,
				sgc.school_designation,
				sgc.mid_student_rank,
				sgc.final_student_rank,
				sgc.school_type,
				sgc.school_name,
				sgc.school_year_start,
				sgc.school_year_end,
				sgc.school_year_frame,
				sgc.class_name,
				sgc.class_type,
				sgc.gpa_sem_1,
				sgc.gpa_sem_2,
				sgc.gpa_final,
				sgc.scale,
				sgc.attachment,
				sgc.date_added,				
				ch.firstname,
				ch.lastname
			FROM student_grade_cumulative sgc, child ch
			WHERE sgc.student_grade_cumulative_id=? AND
				ch.ch_id=sgc.child_id`,
				[cumulativeId]
			);

			if (application_type === 'forms') {
				studentCumulative = formatFormContents(studentCumulative);
			}

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
					studentCumulativeGradesResult = [...(studentCumulativeGradesResult ||[]),studentCumulative]
				}
			}
		}
	} catch (error) {
		console.log('Error', error);
	} finally {
		await db.close();
		console.log('studentCumulativeGradesResult 111', studentCumulativeGradesResult)
		console.log('studentCumulativeGradesResult 222')
		return studentCumulativeGradesResult;
	}
};

export const getStudentStandardizedTest = async child_id => {
	const db = makeDb();
	let studentStandardizedTest = [];
	try {
		studentStandardizedTest = await db.query(
			`SELECT student_test_id,
        BIN_TO_UUID(child_id) as child_id,
        test_name,
        attempt,
        grade_taken,
        month_taken,
				score,
				score_percentage,
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
						`SELECT student_test_id,attachment
          FROM student_standardized_test 
          WHERE student_test_id=?`,
						[studentTestId]
				  )
				: null;
			if (!isTestExist && !studentTestId) {
				const studentStardizedTestResult = await db.query(
					`INSERT INTO student_standardized_test(
            child_id,
            test_name,
            attempt,
            grade_taken,
            month_taken,
						score,
						score_percentage,
            ach_level,
            school_percentage,
            nationality_percentage,
            district_percentage,
            state_percentage,
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
            ?,
            ?,
            ?,
            NOW()
          )
        `,
					[
						test.child_id,
						test.test_name,
						test.attempt,
						test.grade_taken,
						test.month_taken,
						test.score,
						test.score_percentage,
						test.ach_level,
						test.school_percentage,
						test.nationality_percentage,
						test.district_percentage,
						test.state_percentage,
					]
				);

				studentTestId = studentStardizedTestResult.insertId;

				const s3Payload = await formatFile(test.attachment, studentTestId, 'student_test');
				if (s3Payload) {
					await db.query(
						`UPDATE student_standardized_test
							SET attachment=?, date_updated=NOW() 
							WHERE student_test_id=?
						`,
						[s3Payload.Key, studentTestId]
					);
				}
			} else {
				const s3Payload = await formatFile(test.attachment, studentTestId, 'student_test');
				const studentStardizedTestResult = await db.query(
					`UPDATE student_standardized_test
          SET test_name=?,attempt=?,
            grade_taken=?,month_taken=?,
            score=?,score_percentage=?,ach_level=?,school_percentage=?,
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
						test.score_percentage,
						test.ach_level,
						test.school_percentage,
						test.nationality_percentage,
						test.district_percentage,
						test.state_percentage,
						s3Payload ? s3Payload.Key : isTestExist[0] && isTestExist[0].attachment,
						studentTestId,
					]
				);
			}

			studentTestList = await db.query(
				`SELECT  
          student_test_id,
          BIN_TO_UUID(child_id) as child_id,
          test_name,
          attempt,
          grade_taken,
          month_taken,
					score,
					score_percentage,
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

export const removeStudentTest = async (studentTestIds = []) => {
	const db = makeDb();
	let studentTestList = [];
	try {
		await db.query(
			`DELETE FROM student_standardized_test
       WHERE student_test_id IN (${studentTestIds.join(',')})
      `
		);

		studentTestList = await db.query(
			`SELECT  
        student_test_id,
        BIN_TO_UUID(child_id) as child_id,
        test_name,
        attempt,
        grade_taken,
        month_taken,
				score,
				score_percentage,
        ach_level,
        school_percentage,
        nationality_percentage,
        district_percentage,
        state_percentage,
        attachment
      FROM student_standardized_test`
		);
	} catch (err) {
		console.log('Error removeStudentTest', err);
		return [];
	} finally {
		await db.close();
		return studentTestList;
	}
};

/*
 	standardized_test: [StudentStandardizedTest]
	cumulative_grades: [StudentCumulativeGrade]
*/
export const getStudentRecordById = async childId => {
	let studentRecord = {};
	try {
		const cumulativeGrades = await getStudentCumulativeByChildId(childId);
		const standardizedTest = await getStudentStandardizedTest(childId);
		const childInfo = await getChildInformation(childId);
		studentRecord = {
			standardized_test: standardizedTest,
			cumulative_grades: cumulativeGrades,
			info: childInfo ? childInfo[0] : {}
		};
	} catch (err) {
		console.log('Error getStudentRecordById', err);
		return [];
	} finally {
		return studentRecord;
	}
};


export const updateChildDetails = async ({
  firstname,
  lastname,
	school_name,
	hobbies,
	career_goals,
	accomplishments,
  ch_id
}) => {
  const db = makeDb();
  let result;
  try {
   	await db.query(
      `UPDATE child SET 
        firstname=?,
        lastname=?,
        school_name=?,
        hobbies=?,
				career_goals=?,
				accomplishments=?
        WHERE ch_id=UUID_TO_BIN(?)
      `,
      [
        firstname,
  			lastname,
				school_name,
				hobbies,
				career_goals,
				accomplishments,
  			ch_id
      ]
    );
		result = await getChildInformation(ch_id);
		result = result ? result[0] : {};
  } catch(error) {
    console.log(error)
  } finally {
    await db.close();
    return result;
  }
}