import React, { useEffect, useState } from 'react'
import GradeInputStyled from './styles'
import Loading from '../../../../helpers/Loading.js'

import { useSelector, useDispatch } from 'react-redux'

import StandardTest from './standardTest'
import GradeInput from './gradeInput'

import { requestGetStudentCumulativeGradeByAppGroup } from '../../../../redux/actions/Grades'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faUpload } from '@fortawesome/free-solid-svg-icons'

import { CSVLink, CSVDownload } from "react-csv";
import { format } from "date-fns";

import ImportTestGradeDialog from './ImportTestGradeDialog';

export default () => {

  const { gradeInput: { gradeList } } = useSelector(({ gradeInput }) => ({
    gradeInput
  }));
  const dispatch = useDispatch()

  const DATE_FORMAT = "MM/dd/yyyy";

  let exporTestData = [];

  console.log('gradeList', gradeList);

  gradeList.map((gr) => {

    const stardarizedTestList = gr.standardized_test;

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
 
  });

  const [selectImportTestGrade, setSelectImportTestGrade] = useState(false);
  const [formattedSt, setFormattedSt] = useState([]);

  const handleTestImport = () => {
    setSelectImportTestGrade(true);
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

  useEffect(() => {
    dispatch(requestGetStudentCumulativeGradeByAppGroup({
      app_group_id: '97754eb9-fc18-11ea-8212-dafd2d0ae3ff',
      app_group_type: 'bcombs'
    }))
  }, [])

  return (
    <GradeInputStyled>
      <div className='gradeInputView-header'>
        <div className='action left'>
          <h2>Grade and Test Input</h2>
        </div>
        <div className='action right'>
          <CSVLink
            id="gradeExportBtn"
            filename='Standart Test.csv'
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
        />
        <GradeInput />
      </div>
     </div>
     {
       selectImportTestGrade && (
         <ImportTestGradeDialog
          inputType='test'
          data={exporTestData}
          onClose={() => setSelectImportTestGrade(false)}
          onImport={(data) => {
            setSelectImportTestGrade(false); 
            handleImportedTestData(data)
          }}
         />
       )
     }
    </GradeInputStyled>
  )
}
