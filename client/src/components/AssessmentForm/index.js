import React, { useEffect, useState, useContext } from 'react';
import styled, { ThemeContext } from "styled-components";

import Loading from '../../helpers/Loading.js'

const AssessmentStyled = styled.form`
 

  justify-content: center;
  padding: 14px !important;
  input:required {
    box-shadow: none;
  }
  input:invalid {
    box-shadow: none;
  }
  input {
    background: none;
    width: 100%;
    color: black;
    font-size: ${({ theme }) => theme.input.fontSize};
    display: block;
    border: none;
    border-radius: 1;
    border: none;
    outline: 0;
    border-bottom: 2px solid lightgrey;
    outline: 0;
    margin-top: 1em;
    margin-bottom: 1em;
  }
  input:focus {
    border-color: ${({ theme }) => theme.input.focus.border.color};
    transition: 3s;
  }
  button {
    color: ${({ theme }) => theme.button.textColor.primary};
    font-size: ${({ theme }) => theme.button.fontSize} !important;
    border: none;
    box-shadow: 0px 3px 6px #908e8e;
    padding-top: 1em;
    padding-bottom: 1em;
    border-radius: 10px !important;
  }
  button[type="button"] {
    padding: 10px;
    display: block;
    margin: 1em auto;
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    border: none;
  }

  button:disabled {
    background-color: #ccc; 
    color: #888; 
    cursor: not-allowed; 
  }

  p.error {
    text-align: left !important;
  }
  p.error-size {
    font-size: 14px !important;
  }
  @media (min-width: 600px) {
    .grid {
      grid-template-columns: 50% 50%;
      grid-gap: 1%;
    }

    button[type="submit"] {
      width: 300px;
    }
  }

 

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  th {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
    position: relative;
  }

  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    position: relative;
  }
  
  .tableContainer {
    display: flex;
    flex-direction: row;
    margin-top: 15px;
    width: 100%;

  }


  .row-header {
    background-color: #D3D3D3;
  }

  .assessmentInfo {
    display: flex;
    flex-direction: column;
    background-color: white;
    padding: 12px;
  }


  .detailsContainer{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 20px;
  }

  @media (max-width: 780px) {
    .assessmentInfo {
      display: flex;
      flex-direction: column !important;
      padding: 12px;
    }

    .detailsContainer{
      display: flex;
      flex-direction: column !important;
      justify-content: space-between;
      margin-top: 20px;
    }
  }
`;


const getAssessmentForm = async id => {
  const response = await fetch(`${process.env.API_HOST}/api/form/assessment?studentId=${id}`, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  });
  return response.json();
}

const score = ['1', '2', '3', '4'];

const removeExtraCharacters = (string = '') => string.replaceAll(/[\\"]/g, "")

const Checked = <span style={{ textDecoration: 'underline' }}>✔</span>

const AssessmentForm = props => {
  const [currentForm, setCurrentForm] = useState(null);
  const [currentStudentId, setCurrentStudentId] = useState('C110001');
  const [assessment, setAssessment] = useState({
    assessment: []
  });
  const [isLoading, setIsLoading] = useState(false);

  // FOR TESTING PURPOSES ONLY
  // useEffect(() => {
  //   getStudentAssessment();
  // }, []);

  const handleInputChange = e => {
    e.preventDefault();
    // if (e.key === 'Enter') {
    //   let searchString = e.target.value;
    //   getStudentAssessment(searchString)
    // }
    setCurrentStudentId(e.target.value);
  }
  // C110001
  const getStudentAssessment = async () => {
    try {
      setIsLoading(true);
      const response = await getAssessmentForm(currentStudentId);

      const formContents = response?.data?.form_contents?.formData;

      let instructor = formContents.find(item => item.label === 'Instructor');
      instructor = instructor && {
        name: `${removeExtraCharacters(instructor?.fields[1]?.value || '')} ${removeExtraCharacters(instructor?.fields[2]?.value || '')}`
      }
      let student = formContents.find(item => item.label === 'Name');

      student = student && {
        name: `${removeExtraCharacters(student?.fields[1]?.value || '')} ${removeExtraCharacters(student?.fields[2]?.value || '')}`
      }

      let date = formContents.find(item => item.label === 'Date');

      date = date && {
        value: `${date?.fields[0]?.value || ''}-${date?.fields[1]?.value || ''}-${date?.fields[2]?.value || ''}`
      }

      let instrument = formContents.filter(item => item.label === 'Instrument');

      if (instrument.length > 0) {

        let name = instrument[0]?.fields[0]?.value;
        name = removeExtraCharacters(name);
        let type = instrument[1]?.fields[0]?.value;
        type = type && JSON.parse(type)
        type = typeof type === 'object' ? Object.values(type)[0] : '';
        instrument = {
          name,
          type
        }
      }

      let student_registered = formContents.find(item => item.label.includes('student registered for Fall'))
      if (student_registered) {
        student_registered = student_registered?.fields[0]?.value;

        student_registered = student_registered && JSON.parse(student_registered)
        student_registered = typeof student_registered === 'object' ? Object.values(student_registered)[0] : '';
        student_registered = {
          value: student_registered
        }
      }

      let absence = formContents.find(item => item.label.includes('absence'));


      if (absence) {
        absence = {
          value: removeExtraCharacters(absence?.fields[0]?.value || '')
        }

      }

      let expectation = formContents.find(item => item.label.includes('The student is __ expectations.'));
      if (expectation) {
        expectation = expectation?.fields[0]?.value;
        expectation = expectation && JSON.parse(expectation)
        expectation = typeof expectation === 'object' ? Object.values(expectation)[0] : '';
        expectation = {
          value: expectation
        }
      }
      let questions = formContents.filter(item => {
        const isOptionScore = item.type === 'multipleChoice' && item.fields[0] && item.fields[0].options.every(opt => score.includes(opt.label))
        return item.type === 'multipleChoice' && isOptionScore

      });

      questions = questions.map(item => {
        let value = item.fields[0].value.replace(/\\/g, '');
        value = value && JSON.parse(value)
        value = typeof value === 'object' ? Object.values(value)[0] : '';
        return {
          label: item.label,
          answer: value
        }
      });

      let comment = formContents.find(item => item.label.includes('Comment and Suggestion for Improvement'));

      comment = comment && {
        value: `${removeExtraCharacters(comment?.fields[0]?.value || '')}`
      }



      setAssessment({
        ...assessment,
        student,
        instructor,
        instrument,
        absence,
        student_registered,
        expectation,
        questions,
        comment,
        date
      });

      setCurrentForm(response?.data || null);
    } catch (err) {
      setCurrentForm(null);
    }
    finally {
      setIsLoading(false);
    }
  }
  const theme = useContext(ThemeContext);

  return <AssessmentStyled
    theme={theme}
  >
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: 680 }}>
        <label style={{ fontWeight: 'bolder' }}>Student ID</label>
        <input
          value={currentStudentId}
          onChange={handleInputChange}
          type="text"
          placeholder="Enter Student ID"
        />
        <button disabled={isLoading} onClick={getStudentAssessment} type="button" style={{ width: '100%' }}>Search</button>
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center'}}>
      {isLoading ? <Loading /> : currentForm && <div className="assessmentInfo" style={{ width: 680 }}>

        <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
          <h4>Community Music School</h4>
          <h4>Student Progress Report</h4>
        </div>

        <div className="detailsContainer">
          <div>Instructor: {assessment?.instructor?.name}</div>
          <div>Student Name: {assessment?.student?.name}</div>
          <div>Date: {assessment?.date?.value}</div>
        </div>

        <div className="detailsContainer">
          <div>Instrument: {assessment?.instrument?.name}</div>
          <div>
            Virtual: {assessment?.instrument?.type === 'Virtual' ? Checked : '_'}{`    `}
            In-Person: {assessment?.instrument?.type === 'In-Person' ? Checked : '_'}
          </div>
          {/* <div>In-Person: {assessment?.instrument?.type === 'In-Person' ? '✔' : ''}</div> */}
        </div>


        <div className="detailsContainer">
          <div>How many absence: {assessment?.absence?.value || 0}</div>
          <div>Is this student registered for Falll 2023: 
            
            {assessment?.student_registered?.value === 'Yes' ? Checked : '_'} Yes {assessment?.student_registered?.value === 'No' ? '✔' : '_'} No</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', marginTop: 15, fontWeight: 'bold' }}>
          <div>Ratings: 1 - Not acceptable; 4 - Exceed expectations: Place an X where appropriate</div>
        </div>

        <div className="tableContainer">
          <table style={{ width: '100%' }}>
            <thead>
              <tr className="row-header">
                <th></th>
                <th>1</th>
                <th>2</th>
                <th>3</th>
                <th>4</th>
              </tr>
            </thead>
            <tbody>
              {assessment?.questions ? assessment.questions.map(item => {

                return <tr>
                  <td>{item.label}</td>
                  <td style={style.columnScore}>{item.answer === '1' && 'X'}</td>
                  <td style={style.columnScore}>{item.answer === '2' && 'X'}</td>
                  <td style={style.columnScore}>{item.answer === '3' && 'X'}</td>
                  <td style={style.columnScore}>{item.answer === '4' && 'X'}</td>
                </tr>

              }) : null}

            </tbody>
          </table>
        </div>


        <div style={{ display: 'flex', flexDirection: 'row', marginTop: 20 }}>

          <div>The student is {assessment?.expectation?.value === 'meeting' ? Checked : '__'} meeting {assessment?.expectation?.value === 'not meeting' ? Checked : '__'} not meeting {assessment?.expectation?.value === 'exceeding' ? Checked : '__'} exceeding expectations.</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 20 }}>
          <div style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Comments and Suggestions for Improvement</div>

          <div style={{ marginTop: 12 }}>{assessment?.comment?.value}</div>
        </div>
      </div>}
    </div>

  </AssessmentStyled>
};

const style = {
  detailsContainer: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  columnScore: { fontSize: 24, textAlign: 'center' }
}

export default AssessmentForm;