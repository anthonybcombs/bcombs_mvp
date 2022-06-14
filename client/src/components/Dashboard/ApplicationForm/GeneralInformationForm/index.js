import React, { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import ErrorMessage from "../../../../helpers/ErrorMessage";
import { OPTION_SCHOOL_YEAR } from '../../../../constants/options';
import NumberFormat from 'react-number-format';
const GeneralInformationFormStyled = styled.div`
  position: relative; 
  margin-top:12px;

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

  .general-info-wrapper .grid-4 {
    display: grid;
    grid-template-columns: 31% 21% 41%;
    grid-gap: 3.33333333%;
  }

  .general-info-wrapper .grid-5 {
    display: grid;
    grid-template-columns: 19.2% 19.2% 19.2% 19.2%;
    grid-gap: 8%;
  }

  @media (max-width: 940px) {
    .general-info-wrapper .grid,
    .general-info-wrapper .grid-5,
    .general-info-wrapper .grid-4,
    .general-info-wrapper .grid-3,
    .general-info-wrapper .grid-2,
    .general-info-wrapper .grid-1 {
      grid-gap: 0;
      grid-template-columns: 100%;
    }
    #multiselectContainerReact {
      position: relative;
      top: 0;
    }
   .field-input:placeholder-shown + .field-label {
      max-width: calc(100% - 30%) !important;
    }
  }
  
  @media (max-width: 600px) {
    .general-info-wrapper .grid,
    .general-info-wrapper .grid-5,
    .general-info-wrapper .grid-4,
    .general-info-wrapper .grid-3,
    .general-info-wrapper .grid-2,
    .general-info-wrapper .grid-1 {
      padding: 0;
    }
    .general-info-wrapper>div {
      padding: 0;
    }
  }
  .radio-highlights{
    background: #f26e21 !important ;
  }

`;

export default function index({
  childGeneralInformation,
  handleChildFormDetailsChange,
  counter,
  actCount = [],
  satCount = [],
  psatCount = [],
  handleScoresChange,
  register,
  errors,
  isReadonly = false,
  pastChildInformation = {},
  isLot = 0,
  isVendorView,
  printPageClassname
}) {

  const createYearTakenSelect = () => {
    let options = [];
  
    // for (let i = 0; i < 7; i++) {
    //   options.push(<option key={i} value={currentYear - i}>{currentYear - i}</option>)
    // }
    
    options = OPTION_SCHOOL_YEAR.map(item => <option key={item.value} value={item.value}>{item.label}</option>)
    options.unshift(<option key="new" value="new">New</option>)
    return options;
  }

  const createMonthsSelect = () => {

    let options = [];

    for (let i = 12; i > 0; i--) {
      options.push(<option key={i} value={i}>{i}</option>);
    }

    return options;
  }


  const isStudentEntrepreneur = [
    {
      id: 1,
      label: 'Yes',
      value: 1
    },
    {
      id: 0,
      label: 'No',
      value: 0
    },
  ]

  const schoolGrades = [
    {
      id: 1,
      value: 12
    },
    {
      id: 2,
      value: 11
    },
    {
      id: 3,
      value: 10
    },
    {
      id: 4,
      value: 9
    },
    {
      id: 5,
      value: 8
    },
    {
      id: 6,
      value: 7
    },
    {
      id: 7,
      value: 6
    }
  ];

  const createACTFormn = () => {
    let items = [];

    for (let i = 1; i <= actCount; i++) {
      items.push(
        <div key={i} className="grid-1">
          <div className="form-group">
            <div className="field">
              <NumberFormat
                name="act_score"
                className="field-input"
                placeholder="ACT Score"
                id={`act_score_${counter - 1}`}
                onChange={({ target }) => handleChildFormDetailsChange((counter - 1), "general_information", "act_scores-" + (i - 1) + "-score", target.value)}
                defaultValue={childGeneralInformation.act_scores[i - 1].score}
              />
              <label className="field-label" for={`act_score_${counter - 1}`}>
                {
                  i <= 1 ?
                    <span
                      className="add"
                      onClick={(e) => handleScoresChange((counter - 1), "ACT", "add")}
                    >
                      <FontAwesomeIcon size="lg" icon={faPlusCircle} />
                    </span>
                    :
                    <span
                      className="remove"
                      onClick={(e) => handleScoresChange((counter - 1), "ACT", "remove")}
                    >
                      <FontAwesomeIcon size="lg" icon={faTimesCircle} />
                    </span>
                }
                &nbsp;ACT Score
              </label>
            </div>
          </div>
          <div className="form-group">
            <div className="field select-field-wrapper">
              <select
                name="act_year_taken"
                className="field-input"
                onChange={({ target }) => handleChildFormDetailsChange((counter - 1), "general_information", "act_scores-" + (i - 1) + "-year", target.value)}
                defaultValue={childGeneralInformation.act_scores[i - 1].year}
              >
                <option value="">Year</option>
                {createYearTakenSelect()}
              </select>
              <label className="field-label">Year started as Mentee`</label>
            </div>
          </div>
          <div className="form-group">
            <div className="field select-field-wrapper">
              <select
                name="act_month_taken"
                className="field-input"
                onChange={({ target }) => handleChildFormDetailsChange((counter - 1), "general_information", "act_scores-" + (i - 1) + "-month", target.value)}
                defaultValue={childGeneralInformation.act_scores[i - 1].month}
              >
                <option value="">Month</option>
                {createMonthsSelect()}
              </select>
              <label className="field-label">Month Taken</label>
            </div>
          </div>
        </div>
      );
    }
    return items;
  }

  const createSatForm = () => {
    let items = [];

    for (let i = 1; i <= satCount; i++) {
      items.push(
        <div key={i} className="grid-1">
          <div className="form-group">
            <div className="field">
              <NumberFormat
                name="sat_score"
                className="field-input"
                placeholder="SAT Score"
                id={`sat_score_${counter - 1}`}
                onChange={({ target }) => handleChildFormDetailsChange((counter - 1), "general_information", "sat_scores-" + (i - 1) + "-score", target.value)}
                defaultValue={childGeneralInformation.sat_scores[i - 1].score}
              />
              <label className="field-label" for={`sat_score_${counter - 1}`}>
                {
                  i <= 1 ?
                    <span
                      className="add"
                      onClick={(e) => handleScoresChange((counter - 1), "SAT", "add")}
                    >
                      <FontAwesomeIcon size="lg" icon={faPlusCircle} />
                    </span>
                    :
                    <span
                      className="remove"
                      onClick={(e) => handleScoresChange((counter - 1), "SAT", "remove")}
                    >
                      <FontAwesomeIcon size="lg" icon={faTimesCircle} />
                    </span>
                }
                &nbsp;SAT Score
              </label>
            </div>
          </div>
          <div className="form-group">
            <div className="field select-field-wrapper">
              <select
                name="act_year_taken"
                className="field-input"
                onChange={({ target }) => handleChildFormDetailsChange((counter - 1), "general_information", "sat_scores-" + (i - 1) + "-year", target.value)}
                defaultValue={childGeneralInformation.sat_scores[i - 1].year}
              >
                <option value="">Year</option>
                {createYearTakenSelect()}
              </select>
              <label className="field-label">Year Started as Mentee`</label>
            </div>
          </div>
          <div className="form-group">
            <div className="field select-field-wrapper">
              <select
                name="act_month_taken"
                className="field-input"
                onChange={({ target }) => handleChildFormDetailsChange((counter - 1), "general_information", "sat_scores-" + (i - 1) + "-month", target.value)}
                defaultValue={childGeneralInformation.sat_scores[i - 1].month}
              >
                <option value="">Month</option>
                {createMonthsSelect()}
              </select>
              <label className="field-label">Month Taken</label>
            </div>
          </div>
        </div>
      );
    }
    return items;
  }

  const createPsatForm = () => {
    let items = [];

    for (let i = 1; i <= psatCount; i++) {
      items.push(
        <div key={i} className="grid-1">
          <div className="form-group">
            <div className="field">
              <NumberFormat
                name="psat_score"
                className="field-input"
                id={`psat_score_${counter - 1}`}
                onChange={({ target }) => handleChildFormDetailsChange((counter - 1), "general_information", "psat_scores-" + (i - 1) + "-score", target.value)}
                placeholder="PSAT Score"
                defaultValue={childGeneralInformation.psat_scores[i - 1].score}
              />
              <label className="field-label" for={`psat_score_${counter - 1}`}>
                {
                  i <= 1 ?
                    <span
                      className="add"
                      onClick={(e) => handleScoresChange((counter - 1), "PSAT", "add")}
                    >
                      <FontAwesomeIcon size="lg" icon={faPlusCircle} />
                    </span>
                    :
                    <span
                      className="remove"
                      onClick={(e) => handleScoresChange((counter - 1), "PSAT", "remove")}
                    >
                      <FontAwesomeIcon size="lg" icon={faTimesCircle} />
                    </span>
                }
                &nbsp;PSAT Score
              </label>
            </div>
          </div>
          <div className="form-group">
            <div className="field select-field-wrapper">
              <select
                name="act_year_taken"
                className="field-input"
                onChange={({ target }) => handleChildFormDetailsChange((counter - 1), "general_information", "psat_scores-" + (i - 1) + "-year", target.value)}
                defaultValue={childGeneralInformation.psat_scores[i - 1].year}
              >
                <option value="">Year</option>
                {createYearTakenSelect()}
              </select>
              <label className="field-label">Year Started as Mentee</label>
            </div>
          </div>
          <div className="form-group">
            <div className="field select-field-wrapper">
              <select
                name="act_month_taken"
                className="field-input"
                onChange={({ target }) => handleChildFormDetailsChange((counter - 1), "general_information", "psat_scores-" + (i - 1) + "-month", target.value)}
                defaultValue={childGeneralInformation.psat_scores[i - 1].month}
              >
                <option value="">Month</option>
                {createMonthsSelect()}
              </select>
              <label className="field-label">Month Taken</label>
            </div>
          </div>
        </div>
      );
    }
    return items;
  }
  console.log('childGeneralInformation', childGeneralInformation)

  return (
    <GeneralInformationFormStyled className={printPageClassname}>
      {!isLot && <h3 className="heading">General Information</h3>}


      <div className="general-info-wrapper">
        <div className="grid-4">
          <div className="form-group">
            <div className="field select-field-wrapper">
              <select
                name={"ch_grade" + (counter - 1)}
                className={
                  isReadonly &&
                    !isVendorView &&
                    pastChildInformation &&
                    (pastChildInformation.grade_number || pastChildInformation.grade_number == "") &&
                    pastChildInformation.grade_number != childGeneralInformation.grade ?
                    "field-input highlights" : "field-input"
                }
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "grade", target.value);
                }}
                ref={register({ required: true })}
                defaultValue={childGeneralInformation.grade}
                disabled={isReadonly}
              >
                <option value="">Select Grade</option>
                {schoolGrades.map(opt => (
                  <option key={opt.id} value={opt.value}>
                    {opt.value}
                  </option>
                ))}
              </select>
              <label className="field-label"><span className="required">*</span> Grade</label>
            </div>
            <ErrorMessage
              field={errors["ch_grade" + (counter - 1)]}
              errorType="required"
              message="Grade is required."
            />
          </div>

        </div>

        {/* {
            childGeneralInformation.grade > 8 &&
            createACTFormn()
          }
          {
            childGeneralInformation.grade > 8 &&
            createSatForm()
          }
          {
            childGeneralInformation.grade > 8 &&
            createPsatForm()
          } */}
        <div className="grid-2">
          <div className="form-group">
            <div className="field">
              <input
                id={`ch_schoolname_${counter - 1}`}
                name={"ch_schoolname" + (counter - 1)}
                className={
                  isReadonly &&
                    !isVendorView &&
                    pastChildInformation &&
                    (pastChildInformation.school_name || pastChildInformation.school_name == "") &&
                    pastChildInformation.school_name != childGeneralInformation.school_name ?
                    "field-input highlights" : "field-input"
                }
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "school_name", target.value);
                }}
                placeholder="School Name"
                ref={register({ required: true })}
                defaultValue={childGeneralInformation.school_name}
                readOnly={isReadonly}
              />
              <label className="field-label" for={`ch_schoolname_${counter - 1}`}>
                <span className="required">*</span> School Name
              </label>
            </div>
            <ErrorMessage
              field={errors["ch_schoolname" + (counter - 1)]}
              errorType="required"
              message="Grade is required."
            />
          </div>
          <div className="form-group">
            <div className="field">
              {
                isReadonly ?
                  <input
                    name="ch_school_phone"
                    className={
                      isReadonly &&
                        !isVendorView &&
                        pastChildInformation &&
                        (pastChildInformation.school_phone || pastChildInformation.school_phone == "") &&
                        pastChildInformation.school_phone != childGeneralInformation.school_phone ?
                        "field-input highlights" : "field-input"
                    }
                    placeholder="Phone"
                    readOnly={isReadonly}
                    id={`ch_school_phone_${counter - 1}`}
                    defaultValue={childGeneralInformation.school_phone}
                  />
                  :
                  <NumberFormat
                    id={`ch_school_phone_${counter - 1}`}
                    name={"ch_school_phone" + (counter - 1)}
                    className="field-input"
                    placeholder="Phone"
                    onChange={({ target }) => {
                      handleChildFormDetailsChange(counter - 1, "general_information", "school_phone", target.value);
                    }}
                    defaultValue={childGeneralInformation.school_phone}
                    format="(###) ###-####" mask="_"
                    getInputRef={register({
                      validate: {
                        completed: value => {
                          if (value) {
                            return value.match(/\d/g).length === 10
                          } else {
                            return true;
                          }
                        }
                      }
                    })}
                  />
              }
              <label className="field-label" for={`ch_school_phone_${counter - 1}`}>Phone</label>
            </div>
            <ErrorMessage
              field={errors["ch_school_phone" + (counter - 1)]}
              errorType="completed"
              message="Phone Number must be consist of 10 digits."
            />
          </div>
        </div>
        {/* <div className="agree-text">
          Are there currently any problems with your child either at home or at school?
        </div>
        <div className="form-group">
          <label className={
            isReadonly &&
              !isVendorView &&
              pastChildInformation && (childGeneralInformation.has_suspended === "Yes" || (childGeneralInformation.has_suspended === 1 || typeof childGeneralInformation.has_suspended === 'boolean' && childGeneralInformation.has_suspended === true)) &&
              (pastChildInformation.has_suspended == 0) &&
              pastChildInformation.has_suspended != childGeneralInformation.has_suspended ?
              "cus-select-container radio-highlights" : "cus-select-container"
          }>
            Yes
            <input type="radio"
              onChange={({ target }) => {
                handleChildFormDetailsChange(counter - 1, "general_information", "has_suspended", target.value);
              }}
              value={"Yes"}
              //checked={childGeneralInformation.has_suspended+"" == "1"  || childGeneralInformation.has_suspended+"" === true}
              checked={childGeneralInformation.has_suspended == "Yes" || childGeneralInformation.has_suspended == "1" || (typeof childGeneralInformation.has_suspended === 'boolean' && childGeneralInformation.has_suspended === true)}
              readOnly={isReadonly}
              disabled={isReadonly}
            />
            <span className="checkmark"></span>
          </label>
          <label className={
            isReadonly &&
              !isVendorView &&
              pastChildInformation && (childGeneralInformation.has_suspended === "No" || childGeneralInformation.has_suspended === 0 || childGeneralInformation.has_suspended === "1" || typeof childGeneralInformation.has_suspended === 'boolean' && childGeneralInformation.has_suspended === false) &&
              (pastChildInformation.has_suspended == 1) &&
              pastChildInformation.has_suspended != childGeneralInformation.has_suspended ?
              "cus-select-container radio-highlights" : "cus-select-container"
          }>
            No
            <input type="radio"
              onChange={({ target }) => {
                handleChildFormDetailsChange(counter - 1, "general_information", "has_suspended", target.value);
              }}
              value={"No"}
              //checked={childGeneralInformation.has_suspended+"" == "0" || childGeneralInformation.has_suspended+"" === false}
              checked={childGeneralInformation.has_suspended == "No" || childGeneralInformation.has_suspended == "0" || (typeof childGeneralInformation.has_suspended === 'boolean' && childGeneralInformation.has_suspended === false)}
              readOnly={isReadonly}
              disabled={isReadonly}
            />
            <span className="checkmark"></span>
          </label>
        </div> */}
        {
          (childGeneralInformation.has_suspended == "Yes" || childGeneralInformation.has_suspended == "1" || (typeof childGeneralInformation.has_suspended === 'boolean' && childGeneralInformation.has_suspended === true)) &&
          <div className="form-group">
            <textarea
              name="reasons_suspended"
              className={
                isReadonly &&
                  !isVendorView &&
                  pastChildInformation &&
                  (pastChildInformation.reason_suspended || pastChildInformation.reason_suspended == "") &&
                  pastChildInformation.reason_suspended != childGeneralInformation.reason_suspended ?
                  "form-control ta-justice highlights-textarea" : "form-control ta-justice"
              }
              rows="4"
              placeholder="Explain"
              onChange={({ target }) => {
                handleChildFormDetailsChange(counter - 1, "general_information", "reason_suspended", target.value);
              }}
              //defaultValue={childGeneralInformation.reason_suspended}
              value={childGeneralInformation.reason_suspended}
              readOnly={isReadonly}
            >
            </textarea>
          </div>
        }
        <div className="grid-1">
          <div className="form-group">
            <div className="field select-field-wrapper">
              <select
                name={"mentee_start_year" + (counter - 1)}
                className={
                  isReadonly &&
                    !isVendorView &&
                    pastChildInformation &&
                    (pastChildInformation.year_taken || pastChildInformation.year_taken == "") &&
                    pastChildInformation.year_taken != childGeneralInformation.mentee_start_year ?
                    "field-input highlights" : "field-input"
                }
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "mentee_start_year", target.value);
                }}
                defaultValue={childGeneralInformation.mentee_start_year}
                disabled={isReadonly}
              >
                <option value="">Select Year</option>
                {createYearTakenSelect()}
              </select>
              <label className="field-label">Year Started as {isLot ? 'Lot®' : 'Mentee' }</label>
            </div>
          </div>
          <div className="form-group">
            <div className="field">
              <input
                name="ch_hobbies"
                className={
                  isReadonly &&
                    !isVendorView &&
                    pastChildInformation &&
                    (pastChildInformation.hobbies || pastChildInformation.hobbies == "") &&
                    pastChildInformation.hobbies != childGeneralInformation.hobbies ?
                    "field-input highlights" : "field-input"
                }
                id={`ch_hobbies_${counter - 1}`}
                placeholder='Please use "," as seperator (Eg: Example1, Example2)'
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "hobbies", target.value);
                }}
                defaultValue={childGeneralInformation.hobbies}
                readOnly={isReadonly}
              />
              <label className="field-label" for={`ch_hobbies_${counter - 1}`}>Hobbies / Personal Interests</label>
            </div>
          </div>
          <div className="form-group">
            <div className="field">
              <input
                name="ch_life_events"
                className={
                  isReadonly &&
                    !isVendorView &&
                    pastChildInformation &&
                    (pastChildInformation.life_events || pastChildInformation.life_events == "") &&
                    pastChildInformation.life_events != childGeneralInformation.life_events ?
                    "field-input highlights" : "field-input"
                }
                id={`ch_life_events_${counter - 1}`}
                placeholder='Please use "," as seperator (Eg: Example1, Example2)'
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "life_events", target.value);
                }}
                readOnly={isReadonly}
                defaultValue={childGeneralInformation.life_events}
              />
              <label className="field-label" for={`ch_life_events_${counter - 1}`}>Life events you would like to share</label>
            </div>
          </div>
        </div>

        <div className="grid-3">
          <div className="form-group">
            <div className="field">
              <input
                name="ch_career_goals"
                className={
                  isReadonly &&
                    pastChildInformation &&
                    (pastChildInformation.career_goals || pastChildInformation.career_goals == "") &&
                    pastChildInformation.career_goals != childGeneralInformation.career_goals ?
                    "field-input highlights" : "field-input"
                }
                id={`ch_career_goals_${counter - 1}`}
                placeholder='Please use "," as seperator (Eg: Example1, Example2)'
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "career_goals", target.value);
                }}
                defaultValue={childGeneralInformation.career_goals}
                readOnly={isReadonly}
              />
              <label className="field-label" for={`ch_career_goals_${counter - 1}`}>Career Goals</label>
            </div>
          </div>

          <div className="form-group">
            <div className="field">
              <input
                name="ch_colleges"
                className={
                  isReadonly &&
                    !isVendorView &&
                    pastChildInformation &&
                    (pastChildInformation.colleges || pastChildInformation.colleges == "") &&
                    pastChildInformation.colleges != childGeneralInformation.colleges ?
                    "field-input highlights" : "field-input"
                }
                id={`ch_colleges_${counter - 1}`}
                placeholder='Please use "," as seperator (Eg: Example1, Example2)'
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "colleges", target.value);
                }}
                defaultValue={childGeneralInformation.colleges}
                readOnly={isReadonly}
              />
              <label className="field-label" for={`ch_colleges_${counter - 1}`}>List of Colleges you are Considering Upon Graduation</label>
            </div>
          </div>
        </div>

        <div>
          <div className="form-group">
            <div className="field">
              <input
                name="ch_team_affiliations"
                className={
                  isReadonly &&
                    !isVendorView &&
                    pastChildInformation &&
                    (pastChildInformation.affiliations || pastChildInformation.affiliations == "") &&
                    pastChildInformation.affiliations != childGeneralInformation.team_affiliations ?
                    "field-input highlights" : "field-input"
                }
                id={`ch_team_affiliations_${counter - 1}`}
                placeholder='Please use "," as seperator (Eg: Example1, Example2)'
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "team_affiliations", target.value);
                }}
                defaultValue={childGeneralInformation.team_affiliations}
                readOnly={isReadonly}
              />

              <label className="field-label" for={`ch_team_affiliations_${counter - 1}`}>Clubs and other Organization Affiliations</label>
            </div>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <div className="field">
              <input
                name="ch_awards"
                className={
                  isReadonly &&
                    !isVendorView &&
                    pastChildInformation &&
                    (pastChildInformation.awards || pastChildInformation.awards == "") &&
                    pastChildInformation.awards != childGeneralInformation.awards ?
                    "field-input highlights" : "field-input"
                }
                id={`ch_awards_${counter - 1}`}
                placeholder='Please use "," as seperator (Eg: Example1, Example2)'
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "awards", target.value);
                }}
                defaultValue={childGeneralInformation.awards}
                readOnly={isReadonly}
              />
              <label className="field-label" for={`ch_awards_${counter - 1}`}>List of Awards</label>
            </div>
          </div>

          <div className="form-group">
            <div className="field">
              <input
                name="ch_accomplishments"
                className={
                  isReadonly &&
                    !isVendorView &&
                    pastChildInformation &&
                    (pastChildInformation.accomplishments || pastChildInformation.accomplishments == "") &&
                    pastChildInformation.accomplishments != childGeneralInformation.accomplishments ?
                    "field-input highlights" : "field-input"
                }
                id={`ch_accomplishments_${counter - 1}`}
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "accomplishments", target.value);
                }}
                placeholder='Please use "," as seperator (Eg: Example1, Example2)'
                defaultValue={childGeneralInformation.accomplishments}
                readOnly={isReadonly}
              />
              <label className="field-label" for={`ch_accomplishments_${counter - 1}`}>List of Accomplishments</label>
            </div>
          </div>
        </div>

        <div>
          <div className="form-group">
            <div>
              <label className="field-label-simple">
                <span className="required">*</span> What does the {isLot ? 'LOT®' : 'mentee'} hope to gain from the program?
              </label>
              <textarea
                name={"mentee_gain" + (counter - 1)}
                className={
                  isReadonly &&
                    !isVendorView &&
                    pastChildInformation &&
                    (pastChildInformation.mentee_gain_program || pastChildInformation.mentee_gain_program == "") &&
                    pastChildInformation.mentee_gain_program != childGeneralInformation.mentee_gain ?
                    "form-control highlights-textarea" : "form-control"
                }
                rows="4"
                placeholder="Explain"
                ref={register({ required: true })}
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "mentee_gain", target.value);
                }}
                defaultValue={childGeneralInformation.mentee_gain}
                readOnly={isReadonly}
              >
              </textarea>
            </div>
            <ErrorMessage
              field={errors["mentee_gain" + (counter - 1)]}
              errorType="required"
              message="Reason is required."
            />
          </div>
        </div>



      </div>


      {/* BUSINESS INFO */}
      {isLot ?
        <div className="general-info-wrapper">
          <div className="grid-4">
            <div className="form-group">
              <div className="field select-field-wrapper">
                <select
                  name={"ch_grade" + (counter - 1)}
                  className={
                    isReadonly &&
                      !isVendorView &&
                      pastChildInformation &&
                      (pastChildInformation.is_entrepreneur || pastChildInformation.is_entrepreneur == "") &&
                      pastChildInformation.is_entrepreneur != childGeneralInformation.is_entrepreneur ?
                      "field-input highlights" : "field-input"
                  }
                  onChange={({ target }) => {
                    handleChildFormDetailsChange(counter - 1, "general_information", "is_entrepreneur", parseInt(target.value));
                  }}
                  ref={register({ required: true })}
                  value={childGeneralInformation.is_entrepreneur}
                  disabled={isReadonly}
                >
                  <option value="">Please select</option>
                  {isStudentEntrepreneur.map(opt => (
                    <option key={opt.id} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <label className="field-label">Does the student have a part time job?</label>
              </div>

            </div>
          </div>

        </div>


        :
        <div />}

      {childGeneralInformation?.is_entrepreneur ? <>
        <div className="general-info-wrapper">
        <div className="grid">

          <div className="form-group">
            <div className="field">
              <input
                name="ch_business_name"
                // className="field-input"
                className={
                  isReadonly &&
                    !isVendorView &&
                    pastChildInformation &&
                    (pastChildInformation.business_name || pastChildInformation.business_name == "") &&
                    pastChildInformation.business_name != childGeneralInformation.business_name ?
                    "field-input highlights" : "field-input"
                }
                placeholder="Please list company name and title"
                id={`ch_business_name_${counter - 1}`}
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "business_name", target.value);
                }}
                readOnly={isReadonly}
                defaultValue={childGeneralInformation.business_name}
              />
              <label className="field-label" for={`ch_business_name_${counter - 1}`}>Please list company name and title</label>
            </div>
          </div>
        </div>
        </div>

      </> : <div />}
    </GeneralInformationFormStyled>
  )
}