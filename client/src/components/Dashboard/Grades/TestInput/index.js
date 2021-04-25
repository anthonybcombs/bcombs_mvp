import React, { useEffect, useState } from 'react'
import GradeInputStyled from './styles'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from '@reach/router';
import { parse } from 'query-string';

import StandardTest from './standardTest'
import GradeInput from './gradeInput'

import { requestGetStudentCumulativeGradeByAppGroup, requestGetStudentCumulativeGradeByUser } from '../../../../redux/actions/Grades'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faUpload } from '@fortawesome/free-solid-svg-icons'

import { CSVLink, CSVDownload } from "react-csv";
import { format } from "date-fns";

import ImportTestGradeDialog from './ImportTestGradeDialog';
import { formatError } from 'graphql'

export default ({ child_id }) => {
  const { gradeInput: { gradeList } } = useSelector(({ gradeInput }) => ({
    gradeInput
  }));
  const dispatch = useDispatch()
  const queryLocation = useLocation();
	const { group_id, group_type, return_page } = parse(queryLocation.search)
  const DATE_FORMAT = "MM/dd/yyyy";

  let exporTestData = [];
  let exportGradesData = [];

  const populateClass = (classes = []) => {

    if(!classes) classes = [];

    let grades = {}

    classes.map((cl, index) => {

      const row = {
        [`Class Type ${index + 1}`]: cl.class,
        [`Class Name ${index + 1}`]: cl.subject,
        [`Class Designation ${index + 1}`]: cl.designation,
        [`Class Teacher Name ${index + 1}`]: cl.teacher_name,
        [`Class Grade Q1 ${index + 1}`]: cl.grade_quarter_1,
        [`Class Grade Q2 ${index + 1}`]: cl.grade_quarter_2,
        [`Class Grade Q3 ${index + 1}`]: cl.grade_quarter_3,
        [`Class Grade Q4 ${index + 1}`]: cl.grade_quarter_4,
        [`Class Letter Q1 ${index + 1}`]: cl.letter_grade_quarter_1,
        [`Class Letter Q2 ${index + 1}`]: cl.letter_grade_quarter_2,
        [`Class Letter Q3 ${index + 1}`]: cl.letter_grade_quarter_3,
        [`Class Letter Q4 ${index + 1}`]: cl.letter_grade_quarter_4,
        [`Class Grade Mid Letter ${index + 1}`]: cl.letter_mid_final_grade,
        [`Class Grade Mid Number ${index + 1}`]: cl.mid_final_grade,
        [`Class Grade Final Letter ${index + 1}`]: cl.letter_final_grade,
        [`Class Grade Final Number ${index + 1}`]: cl.final_grade,
        [`Class Grade Year Final Letter ${index + 1}`]: cl.letter_year_final_grade,
        [`Class Grade Year Final Number ${index + 1}`]: cl.year_final_grade,
        [`Class Help Needed Q1 ${index + 1}`]: cl.help_q1,
        [`Class Help Needed Q2 ${index + 1}`]: cl.help_q2,
        [`Class Help Needed Q3 ${index + 1}`]: cl.help_q3,
        [`Class Help Needed Q4 ${index + 1}`]: cl.help_q4,
        [`Class Help Needed Overall ${index + 1}`]: cl.help_needed,
        [`Class Attendance Absent Q1 ${index + 1}`]: cl.attendance_quarter_1_absent,
        [`Class Attendance Absent Q2 ${index + 1}`]: cl.attendance_quarter_2_absent,
        [`Class Attendance Absent Q3 ${index + 1}`]: cl.attendance_quarter_3_absent,
        [`Class Attendance Absent Q4 ${index + 1}`]: cl.attendance_quarter_4_absent,
        [`Class Attendance Tardy Q1 ${index + 1}`]: cl.attendance_quarter_1_tardy,
        [`Class Attendance Tardy Q2 ${index + 1}`]: cl.attendance_quarter_2_tardy,
        [`Class Attendance Tardy Q3 ${index + 1}`]: cl.attendance_quarter_3_tardy,
        [`Class Attendance Tardy Q4 ${index + 1}`]: cl.attendance_quarter_4_tardy,
        [`Class Attendance Present Q1 ${index + 1}`]: cl.attendance_quarter_1_present,
        [`Class Attendance Present Q2 ${index + 1}`]: cl.attendance_quarter_2_present,
        [`Class Attendance Present Q3 ${index + 1}`]: cl.attendance_quarter_3_present,
        [`Class Attendance Present Q4 ${index + 1}`]: cl.attendance_quarter_4_present,
        [`Class Attendance Total Q1 ${index + 1}`]: cl.attendance_quarter_1_total,
        [`Class Attendance Total Q2 ${index + 1}`]: cl.attendance_quarter_2_total,
        [`Class Attendance Total Q3 ${index + 1}`]: cl.attendance_quarter_3_total,
        [`Class Attendance Total Q4 ${index + 1}`]: cl.attendance_quarter_4_total,
        [`Class Attendance Overall Absent ${index + 1}`]: cl.attendance_quarter_1_absent + cl.attendance_quarter_2_absent + cl.attendance_quarter_3_absent + cl.attendance_quarter_4_absent,
        [`Class Attendance Overall Tardy ${index + 1}`]: cl.attendance_quarter_1_tardy + cl.attendance_quarter_2_tardy + cl.attendance_quarter_3_tardy + cl.attendance_quarter_4_tardy,
        [`Class Attendance Overall Present ${index + 1}`]: cl.attendance_quarter_1_present + cl.attendance_quarter_2_present + cl.attendance_quarter_3_present + cl.attendance_quarter_4_present,
        [`Class Attendance Overall Total ${index + 1}`]: cl.attendance_quarter_1_total + cl.attendance_quarter_2_total + cl.attendance_quarter_3_total + cl.attendance_quarter_4_total
      }

      grades = {...grades, ...row};
    });

    return grades;
  }

  gradeList.map((gr) => {

    const stardarizedTestList = gr.standardized_test;

    if(stardarizedTestList.length > 0) {
      stardarizedTestList.map((st) => {
        const row = {
          'Student Name': gr.lastname + ', ' + gr.firstname,
          'Student ID': gr.child_id,
          'ST ID': st.student_test_id,
          'ST Test Name': st.test_name,
          'ST Attempt': st.attempt,
          'ST Grade Taken': st.grade_taken,
          'ST Month Taken': st.month_taken ? format(new Date(st.month_taken), DATE_FORMAT) : '',
          'ST Score': st.score,
          'ST %': st.score_percentage,
          'ST Ach level': st.ach_level,
          'ST % School': st.school_percentage,
          'ST % District': st.district_percentage,
          'ST % State': st.state_percentage,
          'ST % Nationality': st.nationality_percentage
        }
    
        exporTestData.push(row);
      });
    } else {
      const row = {
        'Student Name': gr.lastname + ', ' + gr.firstname,
        'Student ID': gr.child_id,
        'ST ID': '',
        'ST Test Name': '',
        'ST Attempt': '',
        'ST Grade Taken': '',
        'ST Month Taken': '',
        'ST Score': '',
        'ST %': '',
        'ST Ach level': '',
        'ST % School': '',
        'ST % District': '',
        'ST % State': '',
        'ST % Nationality': ''
      }
      exporTestData.push(row);
    }



    const cumulativeGradesList = gr.cumulative_grades;

    cumulativeGradesList.map((cg) => {

      const pClass = populateClass(cg.grades);

      const row = {
        'Student Name': gr.lastname + ', ' + gr.firstname,
        'Student ID': gr.child_id,
        'App Group ID': gr.app_group_id,
        'Cumulative Grade ID': cg.student_grade_cumulative_id,
        'Student Level': cg.year_level,
        'Student Designations': cg.school_designation,
        'School Name': cg.school_name,
        'School Designation': cg.school_designation,
        'School Year Start': cg.school_year_start ? format(new Date(cg.school_year_start), DATE_FORMAT) : '',
        'School Year End': cg.school_year_end ? format(new Date(cg.school_year_end), DATE_FORMAT) : '',
        'School Year Time Frame': cg.school_year_frame,
        'GPA Scale': cg.scale,
        'Semester 1 (GPA)': cg.gpa_sem_1,
        'Semester 2 (GPA)': cg.gpa_sem_2,
        'GPA Final': cg.gpa_final,
        'Class Rank (Sem 1)': cg.mid_student_rank,
        'Class Rank (Sem 2)': cg.final_student_rank,
        ...pClass
      }

      exportGradesData.push(row);
    });

    console.log('exportGradesData', exportGradesData);
 
  });

  const [selectImportType, setSelectImportType] = useState();

  const [formattedSt, setFormattedSt] = useState([]);
  const [formattedGrades, setFormattedGrades] = useState([]);

  const handleTestImport = () => {
    setSelectImportType('standardtest-import');
  }

  const handleGradesImport = () => {
    setSelectImportType('grades-import');
  }

  const handleImportedTestData = (data = []) => {
    let formattedSt = [];

    for(let i = 1; i < data.length; i++) {
      let fields = data[i].split('"').join('').split(',');

      if(fields.length == 15) {
        console.log('fields', fields);
        const st = {
          name: fields[1].trim() + ' ' + fields[0].trim(),
          child_id: fields[2],
          student_test_id: fields[3],
          test_name: fields[4],
          attempt: fields[5],
          grade_token: fields[6],
          month_taken: fields[7],
          score: fields[8],
          score_percentage: fields[9],
          ach_level: fields[10],
          school_percentage: fields[11],
          district_percentage: fields[12],
          state_percentage: fields[13],
          nationality_percentage: fields[14]
        }
        formattedSt.push(st);
      }
    }
    setFormattedSt([...formattedSt]);
  }

  const requestList = () => {
    // dispatch(requestGetStudentCumulativeGradeByAppGroup({
    //   app_group_id: '97754eb9-fc18-11ea-8212-dafd2d0ae3ff',
    //   app_group_type: 'bcombs'
    // }))
    if (group_id && group_type) {
      dispatch(requestGetStudentCumulativeGradeByAppGroup({
        app_group_id: group_id,
        app_group_type: group_type
      }))
    }
  }

  useEffect(() => {
    requestList()
  }, [])

  const handleFormattedGrades = (fields, size) => {
    let formattedGrades = [];

    let start = 18;
    for(let i = 0; i < size; i++) {
      const row = {
        class: fields[start++],
        subject: fields[start++],
        designation: fields[start++],
        teacher_name: fields[start++],
        grade_quarter_1: fields[start++],
        grade_quarter_2: fields[start++],
        grade_quarter_3: fields[start++],
        grade_quarter_4: fields[start++],
        letter_grade_quarter_1: fields[start++],
        letter_grade_quarter_2: fields[start++],
        letter_grade_quarter_3: fields[start++],
        letter_grade_quarter_4: fields[start++],
        letter_mid_final_grade: fields[start++],
        mid_final_grade: fields[start++],
        letter_final_grade: fields[start++],
        final_grade: fields[start++],
        letter_year_final_grade: fields[start++],
        year_final_grade: fields[start++],
        help_q1: fields[start++],
        help_q2: fields[start++],
        help_q3: fields[start++],
        help_q4: fields[start++],
        help_needed: fields[start++],
        attendance_quarter_1_absent: fields[start++],
        attendance_quarter_2_absent: fields[start++],
        attendance_quarter_3_absent: fields[start++],
        attendance_quarter_4_absent: fields[start++],
        attendance_quarter_1_tardy: fields[start++],
        attendance_quarter_2_tardy: fields[start++],
        attendance_quarter_3_tardy: fields[start++],
        attendance_quarter_4_tardy: fields[start++],
        attendance_quarter_1_present: fields[start++],
        attendance_quarter_2_present: fields[start++],
        attendance_quarter_3_present: fields[start++],
        attendance_quarter_4_present: fields[start++],
        attendance_quarter_1_total: fields[start++],
        attendance_quarter_2_total: fields[start++],
        attendance_quarter_3_total: fields[start++],
        attendance_quarter_4_total: fields[start++]
      }

      start += 4;

      console.log('start', start);

      formattedGrades.push(row);
    }

    return formattedGrades;
  }

  const handleImportGradesData = (data = []) => {
    let formattedGrades = [];

    const colHeaders = data[0].split('"').join('').split(',');

    console.log('col headers', colHeaders);
    console.log('import grades', data);

    const importedGrades = colHeaders.filter((i) => {
      return i.includes('Class Type')
    });

    console.log('total grades', importedGrades);

    for(let i = 1; i < data.length; i++) {
      let fields = data[i].split('"').join('').split(',');

      console.log('fields', fields);

      if(fields.length >= 17) {
        const cg = {
          name: fields[1].trim() + ' ' + fields[0].trim(),
          child_id: fields[2],
          app_group_id: fields[3],
          student_grade_cumulative_id: fields[4],
          year_level: fields[5],
          school_designation: fields[6],
          school_name: fields[7],
          school_designation: fields[8],
          school_year_start: fields[9],
          school_year_end: fields[10],
          school_year_frame: fields[11],
          scale: fields[12],
          gpa_sem_1: fields[13],
          gpa_sem_2: fields[14],
          gpa_final: fields[15],
          mid_student_rank: fields[16],
          final_student_rank: fields[17],
          grades: handleFormattedGrades(fields, importedGrades.length)
        }

        cg.help_needed = cg.grades.filter(e => (e.help_q1 || e.help_q2 || e.help_q3 || e.help_q4)).map(e => e.subject);

        formattedGrades.push(cg);
      }
    }

    console.log('formattedGrades', formattedGrades);
    setFormattedGrades([...formattedGrades]);
  }

  return (
    <GradeInputStyled>
      <div className='gradeInputView-header'>
        <div className='action left'>
          <h2>Grade and Test Input</h2>
        </div>
        <div className='action right'>
          <CSVLink
            id="gradeExportBtn"
            filename='Standard Test Export.csv'
            data={exporTestData}
          >
            <button
              className='btn-save'
            >
              <FontAwesomeIcon icon={faDownload} />
              <span>Export</span>
            </button>
          </CSVLink>
          <button
            className='btn-save'
            onClick={handleTestImport}
          >
            <FontAwesomeIcon icon={faUpload} />
            <span>Import</span>
          </button>
        </div>
      </div>
     <div id='viewWrapper'>
      <div id='gradeInputView'>
        <StandardTest
          importData={formattedSt}
          childId={child_id}
          groupId={group_id}
          groupType={group_type}
          returnPage={return_page}
          requestList={requestList}
        />
        <div className='gradeInputView-header' style={{'marginTop': '1rem'}}>
          <div className='action left'></div>
          <div className='action right'>
            <CSVLink
              id="gradeExportBtn"
              filename='Grades Export.csv'
              data={exportGradesData}
            >
              <button
                className='btn-save'
              >
                <FontAwesomeIcon icon={faDownload} />
                <span>Export</span>
              </button>
            </CSVLink>
            <button
              className='btn-save'
              onClick={handleGradesImport}
            >
              <FontAwesomeIcon icon={faUpload} />
              <span>Import</span>
            </button>
          </div>
        </div>
        <GradeInput 
          importData={formattedGrades}
          childId={child_id}
          requestList={requestList}
        />
      </div>
     </div>
     {
       selectImportType == 'standardtest-import'  && (
         <ImportTestGradeDialog
          inputType='test'
          data={exporTestData}
          onClose={() => setSelectImportType()}
          onImport={(data) => {
            setSelectImportType(); 
            handleImportedTestData(data)
          }}
         />
       )
     }
     {
       selectImportType == 'grades-import'  && (
         <ImportTestGradeDialog
          inputType='grades'
          data={exporTestData}
          onClose={() => setSelectImportType()}
          onImport={(data) => {
            setSelectImportType(); 
            handleImportGradesData(data)
          }}
         />
       )
     }
    </GradeInputStyled>
  )
}
