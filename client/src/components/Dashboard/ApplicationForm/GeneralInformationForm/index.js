import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

const GeneralInformationFormStyled = styled.div`
  position: relative;

  .general-info-wrapper {
    padding-bottom: 30px !important;
  }

  .general-info-wrapper .grid-1 {
    display: grid;
    grid-template-columns: 31% 31% 31%;
    grid-gap: 3.33333333%;
  }

  .general-info-wrapper .grid-2 {
    display: grid;
    grid-template-columns: 48.33% 48.33%;
    grid-gap: 3.33333333%;
  }

  .general-info-wrapper .grid-3 {
    display: grid;
    grid-template-columns: 31% 65.3%;
    grid-gap: 3.33333333%;
  }

  .general-info-wrapper .agree-text {
    font-size: 18px;
    padding-left: 15px;
    color: #4b525a;
    font-weight: bold;
    margin-bottom: 20px;
  }
`;

export default function index() {

  const data = {};
  const {groups} = useSelector( ({groups}) => ({groups}) );

  const [menteeStatus, setMenteeStatus] = useState();

  const handleMenteeStatus = (event) => {
    console.log(event.target.value);

    setMenteeStatus(event.target.value);
  }

  const createYearTakenSelect = () => {

    let currentYear = new Date().getFullYear();
    let options = [];
    for(let i = 0; i < 20; i++) {
      options.push(<option key={i} value={currentYear - i}>{currentYear - i}</option>)
    }

    return options;
  }

  console.log(groups);

  return (
    <GeneralInformationFormStyled>
      <h3 className="heading">General Information</h3>
      <div className="general-info-wrapper">
        <div className="grid-1">
          <div className="form-group">
            <div className="field">
            <select
                name="gender"
                className="field-input"
                value={data.group}>
                  <option value="">Select</option>
                {groups.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <label className="field-label">Groups</label>
            </div>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <div className="field">
              <input
                name="schoolname"
                className="field-input"
                value={data.schoolName}
                placeholder="School Name"
              />
              <label className="field-label">School Name</label>
            </div>
          </div>
          <div className="form-group">
            <div className="field">
              <input
                name="phone"
                className="field-input"
                value={data.schoolPhone}
                placeholder="Phone"
              />
              <label className="field-label">Phone</label>
            </div>
          </div>
        </div>
        <div className="agree-text">
          Has the Mentee ever been Suspended from School and/or involved in the Juvenile Justice System?
        </div>
        <div className="form-group">
          <label className="cus-select-container">
            Yes 
            <input type="radio" onChange={handleMenteeStatus} value="yes" checked={menteeStatus === "yes"}/>
            <span className="checkmark"></span>
          </label>
          <label className="cus-select-container">
            No
            <input type="radio" onChange={handleMenteeStatus} value="no" checked={menteeStatus === "no"}/>
            <span className="checkmark"></span>
          </label>
        </div>
        {
          menteeStatus == "yes" &&
        <div className="form-group">
          <textarea 
            className="form-control ta-justice"
            rows="4"
            placeholder="Explain">
          </textarea>
        </div>
        }
        <div className="grid-1">
          <div className="form-group">
            <div className="field">
              <select
                name="yeartaken"
                className="field-input"
                value={data.yeartaken}>
                  <option value="">Select Year</option>
                  { createYearTakenSelect() }
              </select>
              <label className="field-label">Year Taken</label>
            </div>
          </div>
          <div className="form-group">
            <div className="field">
              <input
                name="hobbies"
                className="field-input"
                value={data.hobbies}
                placeholder='Please use "," as seperator (Eg: Example1, Example2)'
              />
              <label className="field-label">Hobbies / Personal Interests</label>
            </div>
          </div>
          <div className="form-group">
            <div className="field">
              <input
                name="lifevents"
                className="field-input"
                value={data.lifevents}
                placeholder='Please use "," as seperator (Eg: Example1, Example2)'
              />
              <label className="field-label">Life events you would like to share</label>
            </div>
          </div>
        </div>

        <div className="grid-3">
          <div className="form-group">
            <div className="field">
              <input 
                name="careergoals"
                className="field-input"
                value={data.careergoals}
                placeholder='Please use "," as seperator (Eg: Example1, Example2)'
              />
              <label className="field-label">Career Goals</label>
            </div>
          </div>

          <div className="form-group">
            <div className="field">
              <input 
                name="careergoals"
                className="field-input"
                value={data.colleges}
                placeholder='Please use "," as seperator (Eg: Example1, Example2)'
              />
              <label className="field-label">List of Colleges you are Considering Upon Graduation</label>
            </div>
          </div>
        </div>

        <div>
          <div className="form-group">
            <div className="field">
              <input
                name="othergroup"
                className="field-input"
                value={data.othergroup}
                placeholder='Please use "," as seperator (Eg: Example1, Example2)'
              />
              <label className="field-label">Group and Other Team Affiliations</label>
            </div>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <div className="field">
              <input
                name="awards"
                className="field-input"
                value={data.awards}
                placeholder='Please use "," as seperator (Eg: Example1, Example2)'
              />
              <label className="field-label">Please List of Awards</label>
            </div>
          </div>

          <div className="form-group">
            <div className="field">
              <input
                name="accomplishments"
                className="field-input"
                value={data.accomplishments}
                placeholder='Please use "," as seperator (Eg: Example1, Example2)'
              />
              <label className="field-label">Please List of Accomplishments</label>
            </div>
          </div>
        </div>

        <div>
          <div className="form-group">
            <label className="field-label-simple">
              What does the mentee hope to gain from the program?
            </label>
            <textarea 
              className="form-control"
              rows="4"
              placeholder="Explain">
            </textarea>
          </div>
        </div>
      </div>
    </GeneralInformationFormStyled>
  )
}