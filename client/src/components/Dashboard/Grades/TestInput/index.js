import React, { useEffect, useState } from 'react'
import GradeInputStyled from './styles'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from '@reach/router';
import { parse } from 'query-string';

import StandardTest from './standardTest'
import GradeInput from './gradeInput'


import {
  requestGetApplications,
  requestGetCustomApplications,
  requestGetApplicationByUserId 
  //requestGetCustomApplicationByVendor,
} from '../../../../redux/actions/Application';
//import { requestUserGroup } from '../../../../redux/actions/Groups';
import { requestVendor, requestVendorAppGroups } from '../../../../redux/actions/Vendors';

import { requestGetStudentCumulativeGradeByAppGroup, requestGetStudentCumulativeGradeByVendor, requestGetStudentCumulativeGradeByParent } from '../../../../redux/actions/Grades'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faDownload, faUpload } from '@fortawesome/free-solid-svg-icons'

// import { CSVLink, CSVDownload } from "react-csv";
// import { format } from "date-fns";

import ImportTestGradeDialog from './ImportTestGradeDialog';
import ExportTestGradeDialogStyled from './ExpotTestGradeDialog';
import ConfirmDialog from './ConfirmDialog'
// import { REQUEST_CUSTOM_APPLICATION_HISTORY_COMPLETED } from '../../../../redux/actions/Constant';

export default ({ child_id }) => {
  const { auth, gradeInput: { gradeList }, groups: { application_groups }, loading: { gradeLoading }, vendors, applications, form } = useSelector(({ auth, gradeInput, groups, loading, vendors, applications, form }) => {

    return {
      auth, gradeInput, groups, loading, vendors, applications, form
    }
  });
  const dispatch = useDispatch()
  const queryLocation = useLocation();
  const { group_id, group_type, return_page, request_type, type, appGroupIds = null, is_parent = null, parent_ids = null, selected_child = null, vendor } = parse(queryLocation.search)
  const isVendor = request_type === 'vendor'
  const DATE_FORMAT = "MM/dd/yyyy";
  console.log('applications gradeList',gradeList)
  console.log('applications',applications)

  let exportTestData = [];
  let exportGradesData = [];
  const appGroupIdList = appGroupIds && (type === 'all' || is_parent) ? appGroupIds.split(',') : []
  const parentIds = parent_ids && (type === 'all' || is_parent) ? parent_ids.split(',') : []
  //let selectedAppGroup = '';

  const [selectImportType, setSelectImportType] = useState();
  const [selectExportType, setSelecteExportType] = useState();
  const [formattedSt, setFormattedSt] = useState([]);
  const [formattedGrades, setFormattedGrades] = useState([]);
  const [selectedAppGroup, setSelectedAppGroup] = useState('');
  const [hasChanged, setHasChanged] = useState(false)
  const [backDialog, setBackDialog] = useState(false)

  const populateClass = (classes = []) => {

    //if(!classes) classes = [];

    let grades = {}

    let index = 0;

    const row = {
      [`Class Type ${index + 1}`]: '',
      [`Class Name ${index + 1}`]: '',
      [`Class Designation ${index + 1}`]: '',
      [`Class Teacher Name ${index + 1}`]: '',
      [`Class Grade Q1 ${index + 1}`]: '',
      [`Class Grade Q2 ${index + 1}`]: '',
      [`Class Grade Q4 ${index + 1}`]: '',
      [`Class Letter Q1 ${index + 1}`]: '',
      [`Class Letter Q2 ${index + 1}`]: '',
      [`Class Letter Q3 ${index + 1}`]: '',
      [`Class Letter Q4 ${index + 1}`]: '',
      [`Class Grade Mid Letter ${index + 1}`]: '',
      [`Class Grade Mid Number ${index + 1}`]: '',
      [`Class Grade Final Letter ${index + 1}`]: '',
      [`Class Grade Final Number ${index + 1}`]: '',
      [`Class Grade Year Final Letter ${index + 1}`]: '',
      [`Class Grade Year Final Number ${index + 1}`]: '',
      [`Class Help Needed Q1 ${index + 1}`]: '',
      [`Class Help Needed Q2 ${index + 1}`]: '',
      [`Class Help Needed Q3 ${index + 1}`]: '',
      [`Class Help Needed Q4 ${index + 1}`]: '',
      [`Class Help Needed Overall ${index + 1}`]: '',
      [`Class Attendance Absent Q1 ${index + 1}`]: '',
      [`Class Attendance Absent Q2 ${index + 1}`]: '',
      [`Class Attendance Absent Q3 ${index + 1}`]: '',
      [`Class Attendance Absent Q4 ${index + 1}`]: '',
      [`Class Attendance Tardy Q1 ${index + 1}`]: '',
      [`Class Attendance Tardy Q2 ${index + 1}`]: '',
      [`Class Attendance Tardy Q3 ${index + 1}`]: '',
      [`Class Attendance Tardy Q4 ${index + 1}`]: '',
      [`Class Attendance Present Q1 ${index + 1}`]: '',
      [`Class Attendance Present Q2 ${index + 1}`]: '',
      [`Class Attendance Present Q3 ${index + 1}`]: '',
      [`Class Attendance Present Q4 ${index + 1}`]: '',
      [`Class Attendance Total Q1 ${index + 1}`]: '',
      [`Class Attendance Total Q2 ${index + 1}`]: '',
      [`Class Attendance Total Q3 ${index + 1}`]: '',
      [`Class Attendance Total Q4 ${index + 1}`]: '',
      [`Class Attendance Overall Absent ${index + 1}`]: '',
      [`Class Attendance Overall Tardy ${index + 1}`]: '',
      [`Class Attendance Overall Present ${index + 1}`]: '',
      [`Class Attendance Overall Total ${index + 1}`]: ''
    }

    grades = { ...grades, ...row };

    return grades;
  }

  console.log('gradeList', gradeList);

  if (gradeList.length > 0) {
    gradeList.map((gr) => {

      const stardarizedTestList = gr.standardized_test;

      if (stardarizedTestList.length > 0) {
        stardarizedTestList.map((st) => {
          const row = {
            // 'Student Name': gr.lastname + ', ' + gr.firstname,
            // 'Student ID': gr.child_id,
            // 'ST ID': st.student_test_id,
            // 'ST Test Name': st.test_name,
            // 'ST Attempt': st.attempt,
            // 'ST Grade Taken': st.grade_taken,
            // 'ST Month Taken': st.month_taken ? format(new Date(st.month_taken), DATE_FORMAT) : '',
            // 'ST Score': st.score,
            // 'ST %': st.score_percentage,
            // 'ST Ach level': st.ach_level,
            // 'ST % School': st.school_percentage,
            // 'ST % District': st.district_percentage,
            // 'ST % State': st.state_percentage,
            // 'ST % Nationality': st.nationality_percentage

            'Student Name': gr.lastname + ', ' + gr.firstname,
            'Student ID': gr.child_id,
            'App Group ID': gr.app_group_id,
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

          exportTestData.push(row);
        });
      } else {
        const row = {
          'Student Name': gr.lastname + ', ' + gr.firstname,
          'Student ID': gr.child_id,
          'App Group ID': gr.app_group_id,
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
        exportTestData.push(row);
      }

      const cumulativeGradesList = gr.cumulative_grades;

      if (cumulativeGradesList.length > 0) {
        cumulativeGradesList.map((cg) => {

          const pClass = populateClass(cg.grades);

          const row = {
            'Student Name': gr.lastname + ', ' + gr.firstname,
            'Student ID': gr.child_id,
            'App Group ID': gr.app_group_id,
            'Cumulative Grade ID': '',
            'Student Level': '',
            'Student Designations': '',
            'School Name': '',
            'School Designation': '',
            'School Year Start': '',
            'School Year End': '',
            'School Year Time Frame': '',
            'GPA Scale': '',
            'Semester 1 (GPA)': '',
            'Semester 2 (GPA)': '',
            'GPA Final': '',
            'Class Rank (Sem 1)': '',
            'Class Rank (Sem 2)': '',
            ...pClass
          }

          exportGradesData.push(row);
        });
      } else {
        const cg = {} //Temporary fix for cg not defined
        const pClass = populateClass(cg.grades || {});

        const row = {
          'Student Name': gr.lastname + ', ' + gr.firstname,
          'Student ID': gr.child_id,
          'App Group ID': gr.app_group_id,
          'Cumulative Grade ID': '',
          'Student Level': '',
          'Student Designations': '',
          'School Name': '',
          'School Designation': '',
          'School Year Start': '',
          'School Year End': '',
          'School Year Time Frame': '',
          'GPA Scale': '',
          'Semester 1 (GPA)': '',
          'Semester 2 (GPA)': '',
          'GPA Final': '',
          'Class Rank (Sem 1)': '',
          'Class Rank (Sem 2)': '',
          ...pClass
        }

        exportGradesData.push(row);
      }
    });
  } else {

    console.log('selectedAppGroup', selectedAppGroup);

    exportTestData.push({
      'Student Name': '',
      'Student ID': '',
      'App Group ID': selectedAppGroup,
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
    })

    const pClass = populateClass([]);

    exportGradesData.push({
      'Student Name': '',
      'Student ID': '',
      'App Group ID': selectedAppGroup,
      'Cumulative Grade ID': '',
      'Student Level': '',
      'Student Designations': '',
      'School Name': '',
      'School Designation': '',
      'School Year Start': '',
      'School Year End': '',
      'School Year Time Frame': '',
      'GPA Scale': '',
      'Semester 1 (GPA)': '',
      'Semester 2 (GPA)': '',
      'GPA Final': '',
      'Class Rank (Sem 1)': '',
      'Class Rank (Sem 2)': '',
      ...pClass
    })
  }

  const handleTestImport = () => {
    setSelectImportType('standardtest-import');
  }

  const handleGradesImport = () => {
    setSelectImportType('grades-import');
  }

  const handleImportedTestData = (data = []) => {
    let formattedSt = [];

    for (let i = 1; i < data.length; i++) {
      let fields = data[i].split('"').join('').split(',');

      if (fields.length == 15) {
        const st = {
          name: fields[1].trim() + ' ' + fields[0].trim(),
          child_id: fields[2],
          app_group_id: fields[3],
          student_test_id: fields[4],
          test_name: fields[5],
          attempt: fields[6],
          grade_token: fields[7],
          month_taken: fields[8],
          score: fields[9],
          score_percentage: fields[10],
          ach_level: fields[11],
          school_percentage: fields[12],
          district_percentage: fields[13],
          state_percentage: fields[14],
          nationality_percentage: fields[15]
        }
        formattedSt.push(st);
      }
    }
    setFormattedSt([...formattedSt]);
  }

  const requestList = () => {

    if (group_id && group_type) {

      if ((isVendor || type === 'all')) {
        if (vendors && (Array.isArray(vendors) )) {
          const vendorId = parseInt(vendor);
          const currentVendor = vendors.find(item => item.id2 === vendorId);
          
          if(currentVendor){
            dispatch(requestGetStudentCumulativeGradeByVendor(currentVendor.id))
          }
         
        }

   
        else {
          dispatch(requestGetStudentCumulativeGradeByVendor(group_id))
        }


      } else {
        // if(type !== 'all') {
        //   console.log('group_idzzzz',group_id)
        //   console.log('group_idzzzz group_type',group_type)
        //   dispatch(requestGetStudentCumulativeGradeByAppGroup({
        //     app_group_id: group_id,
        //     app_group_type: group_type
        //   }))
        // }
        dispatch(requestGetStudentCumulativeGradeByAppGroup({
          app_group_id: group_id,
          app_group_type: group_type
        }))

      }
    }
    else if(is_parent) {
      dispatch(requestGetStudentCumulativeGradeByParent(parentIds))
    }
  }

  useEffect(() => {
    requestList();
    if (request_type === 'forms' ) {
      dispatch(requestGetCustomApplications(group_id));
    }

  }, []);


  useEffect(() => {
    if (auth) {
      //  type && type === 'all'
      dispatch(requestVendor(auth.user_id));
      // dispatch(requestUserGroup(auth.email));
    }

  }, [auth]);

  useEffect(() => {
    if (vendors && vendors.length > 0) {
      //dispatch(requestGetApplications(vendors[0].id));

      console.log('vendors', vendors);
      const vendorId = parseInt(vendor);
      const currentVendor = vendors.find(item => item.id2 === vendorId);
      if (type && type === 'all' && !is_parent) {

        console.log('currentVendorzzz',currentVendor)
        dispatch(requestGetStudentCumulativeGradeByVendor(currentVendor.id));
        dispatch(requestGetApplications(currentVendor.id));
      }
      console.log('VENDORRRRRRRRRRR', vendors)

      dispatch(requestVendorAppGroups(currentVendor.id))
    }
    else if(is_parent && auth) {
      if(auth.user_id) {
        dispatch(requestGetApplicationByUserId(auth.user_id))
      }
    }

  }, [vendors]);



  useEffect(() => {
    console.log('grades list has been changed');
  }, [gradeList]);


  const handleFormattedGrades = (fields, size) => {
    let formattedGrades = [];

    let start = 18;
    for (let i = 0; i < size; i++) {
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

      formattedGrades.push(row);
    }

    return formattedGrades;
  }

  const handleImportGradesData = (data = []) => {
    let formattedGrades = [];

    const colHeaders = data[0].split('"').join('').split(',');

    const importedGrades = colHeaders.filter((i) => {
      return i.includes('Class Type')
    });


    for (let i = 1; i < data.length; i++) {
      let fields = data[i].split('"').join('').split(',');

      if (fields.length >= 17) {
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
    setFormattedGrades([...formattedGrades]);
  }

  const handleGetGroupGradeTest = (appGroupId = '') => {
    console.log('call my api'); console.log('appGroupId', appGroupId);
    if (appGroupId) {
      setSelectedAppGroup(appGroupId);
      //selectedAppGroup = appGroupId;
      console.log('appGroupIddddddd', appGroupId)
      dispatch(requestGetStudentCumulativeGradeByAppGroup({
        app_group_id: appGroupId,
        app_group_type: 'bcombs'
      }));
    }
  }

  const handleBack = () => {
    if (is_parent) {
      window.location.replace(`/dashboard/myapplication`)
    }
    else { 
      const backUrl = child_id
        ? `/dashboard/grades/profile/${child_id}?group_id=${group_id}&group_type=${group_type}&request_type=${request_type}${vendor ? `vendor=${vendor}` : ''}`
        : (!return_page && (group_id || group_type))
          ? `/dashboard/studentdata${vendor ? `?vendor=${vendor}` : ''}`
          : `/dashboard/grades?group_id=${group_id}&request_type=${request_type}&group_type=${group_type}&vendor=${vendor}`
      window.location.replace(backUrl)
    }

  }

  return (
    <GradeInputStyled>
      <div className='gradeInputView-header'>
        <div className='action left'>
          <h2>Grade and Test Input</h2>
        </div>
        <div className='action right'>
          {/* <CSVLink
            id="gradeExportBtn"
            filename='Standard Test Export.csv'
            data={exportTestData}
            asyncOnClick={true}
          >
            <button
              className='btn-save'
            >
              <FontAwesomeIcon icon={faDownload} />
              <span>Export</span>
            </button>
          </CSVLink> */}
          {!is_parent && <>
            <button
              className='btn-save'
              onClick={() => { setSelecteExportType('standardtest-export') }}
            >
              <FontAwesomeIcon icon={faDownload} />
              <span>Export</span>
            </button>
            <button
              className='btn-save'
              onClick={handleTestImport}
            >
              <FontAwesomeIcon icon={faUpload} />
              <span>Import</span>
            </button>
          </>}

        </div>
      </div>
      <div id='viewWrapper'>
        <div id='gradeInputView'>
          <a
            className='back-btn'
            onClick={(e) => {
              e.preventDefault()
              if (hasChanged) {
                setBackDialog(true)
              } else {
                handleBack()
              }
            }}
          >
            <FontAwesomeIcon className='back-icon' icon={faAngleLeft} />
            Back
          </a>
          <StandardTest
            appGroupIds={appGroupIdList}
            applications={is_parent ? applications.userAllApplications : applications.activeapplications}
            importData={formattedSt}
            childId={child_id}
            groupId={group_id}
            groupType={group_type}
            loading={gradeLoading}
            requestList={requestList}
            onHasChanged={(bool) => setHasChanged(bool)}
            type={type}
            vendors={vendors}
            selectedChild={selected_child}
            isParent={is_parent}
            vendorId={group_id}
            
          />
          <div className='gradeInputView-header' style={{ 'marginTop': '1rem' }}>
            <div className='action left'></div>
            <div className='action right'>
              {/* <CSVLink
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
              </CSVLink> */}
              {!is_parent && <>  <button
                className='btn-save'
                onClick={() => { setSelecteExportType('grades-export') }}
              >
                <FontAwesomeIcon icon={faDownload} />
                <span>Export</span>
              </button>
                <button
                  className='btn-save'
                  onClick={handleGradesImport}
                >
                  <FontAwesomeIcon icon={faUpload} />
                  <span>Import</span>
                </button>
              </>}


            </div>
          </div>
          <GradeInput
            appGroupIds={appGroupIdList}
            applications={is_parent ? applications.userAllApplications : applications.activeapplications}
            importData={formattedGrades}
            childId={child_id}
            loading={gradeLoading}
            groupType={group_type}
            groupId={group_id}
            requestList={requestList}
            onHasChanged={(bool) => setHasChanged(bool)}
            type={type}
            vendors={vendors}
            selectedChild={selected_child}
            isParent={is_parent}
            vendorId={group_id}
          />
        </div>
      </div>
      {
        selectImportType == 'standardtest-import' && (
          <ImportTestGradeDialog
            inputType='test'
            data={exportTestData}
            onClose={() => setSelectImportType()}
            onImport={(data) => {
              setSelectImportType();
              handleImportedTestData(data)
            }}
          />
        )
      }
      {
        selectImportType == 'grades-import' && (
          <ImportTestGradeDialog
            inputType='grades'
            data={exportGradesData}
            onClose={() => setSelectImportType()}
            onImport={(data) => {
              setSelectImportType();
              handleImportGradesData(data)
            }}
          />
        )
      }
      {
        selectExportType == 'standardtest-export' && (
          <ExportTestGradeDialogStyled
            inputType='test'
            onClose={() => { setSelecteExportType() }}
            appGroups={application_groups}
            formAppGroups={form.formAppGroups}
            onGetGroupGradeTest={handleGetGroupGradeTest}
            data={exportTestData}
            loading={gradeLoading}
          >
          </ExportTestGradeDialogStyled>
        )
      }
      {
        selectExportType == 'grades-export' && (
          <ExportTestGradeDialogStyled
            inputType='grades'
            onClose={() => { setSelecteExportType() }}
            appGroups={application_groups}
            onGetGroupGradeTest={handleGetGroupGradeTest}
            data={exportGradesData}
            loading={gradeLoading}
          >
          </ExportTestGradeDialogStyled>
        )
      }
      {
        backDialog && (
          <ConfirmDialog
            onClose={() => setBackDialog(false)}
            onConfirm={handleBack}
            title='Confirm leaving page'
            content='You have unsaved changes. Would you like to leave this page?'
          />
        )
      }
    </GradeInputStyled>
  )
}
