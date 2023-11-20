import React, { useEffect, useState, useContext } from 'react';
import styled, { ThemeContext } from "styled-components";

import Form from '../Dashboard/Builders/Form';

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

  svg {
    vertical-align: middle;
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
    #authOptions p:first-child {
      text-align: left;
    }
    #authOptions p:last-child {
      text-align: right;
    }
    button[type="submit"] {
      width: 300px;
    }
  }
  #g-recaptcha {
    margin-top: 3em;
  }

  .eventInfo {
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 769px) {
    .eventInfo {
      display: flex;
      flex-direction: column !important;
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


const AssessmentForm = props => {
  const [currentForm, setCurrentForm] = useState(null);
  const [currentStudentId, setCurrentStudentId] = useState('C110001');
  const [isLoading, setIsLoading] = useState(false);

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
      <div style={{ width: 665 }}>
        <label style={{ fontWeight: 'bolder'}}>Student ID</label>
        <input
          value={currentStudentId}
          onChange={handleInputChange}
          type="text"
          placeholder="Enter Student ID"
        />
        <button disabled={isLoading} onClick={getStudentAssessment} type="button" style={{ width: '100%' }}>Search</button>
      </div>
    </div>
    {isLoading ? <Loading /> : currentForm && <div className="eventInfo">
      <Form
        historyList={[]}
        key={currentForm?.form}
        {...(currentForm || {})}
        application_date="Most Up to date Application"
        isReadOnly={true}
        isFormHistory={false}
        // onChangeToEdit={handleChangeToEdit}
        onGetUpdatedApplication={(form_contents) => {

        }}
        onSubmitApplication={(form_contents) => {

        }}
        onSelectLatest={() => {
          // setIsFormHistory(false)
          // setApplicationFormKey(new Date().toISOString())
        }}
        hideAction={true}
      />
    </div>}

  </AssessmentStyled>
};

export default AssessmentForm;