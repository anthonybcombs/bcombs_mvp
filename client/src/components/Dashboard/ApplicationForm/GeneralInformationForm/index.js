import React, { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import ErrorMessage from "../../../../helpers/ErrorMessage";
import NumberFormat from 'react-number-format';
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

  .general-info-wrapper .grid-4 {
    display: grid;
    grid-template-columns: 31% 21% 41%;
    grid-gap: 3.33333333%;
  }

  .general-info-wrapper .grid-5 {
    display: grid;
    grid-template-columns: 19.2% 19.2% 19.2% 19.2%;
    grid-gap: 8%;

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
  isReadonly = false
}) {

  const createYearTakenSelect = () => {

    let currentYear = new Date().getFullYear();
    let options = [];
    for(let i = 0; i < 15; i++) {
      options.push(<option key={i} value={currentYear - i}>{currentYear - i}</option>)
    }

    return options;
  }

  const createMonthsSelect = () => {

    let options = [];

    for(let i = 12; i > 0; i--) {
      options.push(<option key={i} value={i}>{i}</option>);
    }

    return options;
  }

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

    for(let i = 1; i <= actCount; i++) {
      items.push (
        <div key={i} className="grid-1">
          <div className="form-group">
            <div className="field">
              <NumberFormat
                name="act_score"
                className="field-input"
                placeholder="ACT Score"
                onChange={({target}) => handleChildFormDetailsChange((counter - 1), "general_information" ,"act_scores-" + (i - 1) + "-score", target.value)}
                defaultValue={childGeneralInformation.act_scores[i - 1].score}
              />
              <label className="field-label">
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
                    onClick={(e) => handleScoresChange((counter - 1),"ACT", "remove")}
                  >
                    <FontAwesomeIcon size="lg" icon={faTimesCircle} />
                  </span>
                }
                &nbsp;ACT Score
              </label>
            </div>
          </div>
          <div className="form-group">
            <div className="field">
              <select
                name="act_year_taken"
                className="field-input"
                onChange={({target}) => handleChildFormDetailsChange((counter - 1), "general_information" ,"act_scores-" + (i - 1) + "-year", target.value)}
                defaultValue={childGeneralInformation.act_scores[i - 1].year}
              >
                  <option value="">Year</option>
                  {createYearTakenSelect()}
              </select>
              <label className="field-label">Year started as Mentee`</label>
            </div>
          </div>
          <div className="form-group">
            <div className="field">
              <select
                name="act_month_taken"
                className="field-input"
                onChange={({target}) => handleChildFormDetailsChange((counter - 1), "general_information" ,"act_scores-" + (i - 1) + "-month", target.value)}
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

    for(let i = 1; i <= satCount; i++) {
      items.push (
        <div key={i} className="grid-1">
          <div className="form-group">
            <div className="field">
              <NumberFormat
                name="sat_score"
                className="field-input"
                placeholder="SAT Score"
                onChange={({target}) => handleChildFormDetailsChange((counter - 1), "general_information" ,"sat_scores-" + (i - 1) + "-score", target.value)}
                defaultValue={childGeneralInformation.sat_scores[i - 1].score}
              />
              <label className="field-label">
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
            <div className="field">
              <select
                name="act_year_taken"
                className="field-input"
                onChange={({target}) => handleChildFormDetailsChange((counter - 1), "general_information" ,"sat_scores-" + (i - 1) + "-year", target.value)}
                defaultValue={childGeneralInformation.sat_scores[i - 1].year}
              >
                  <option value="">Year</option>
                  {createYearTakenSelect()}
              </select>
              <label className="field-label">Year Started as Mentee`</label>
            </div>
          </div>
          <div className="form-group">
            <div className="field">
              <select
                name="act_month_taken"
                className="field-input"
                onChange={({target}) => handleChildFormDetailsChange((counter - 1), "general_information" ,"sat_scores-" + (i - 1) + "-month", target.value)}
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

    for(let i = 1; i <= psatCount; i++) {
      items.push (
        <div key={i} className="grid-1">
          <div className="form-group">
            <div className="field">
              <NumberFormat
                name="psat_score"
                className="field-input"
                onChange={({target}) => handleChildFormDetailsChange((counter - 1), "general_information" ,"psat_scores-" + (i - 1) + "-score", target.value)}
                placeholder="PSAT Score"
                defaultValue={childGeneralInformation.psat_scores[i - 1].score}
              />
              <label className="field-label">
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
            <div className="field">
              <select
                name="act_year_taken"
                className="field-input"
                onChange={({target}) => handleChildFormDetailsChange((counter - 1), "general_information" ,"psat_scores-" + (i - 1) + "-year", target.value)}
                defaultValue={childGeneralInformation.psat_scores[i - 1].year}
              >
                  <option value="">Year</option>
                  {createYearTakenSelect()}
              </select>
              <label className="field-label">Year Started as Mentee`</label>
            </div>
          </div>
          <div className="form-group">
            <div className="field">
              <select
                name="act_month_taken"
                className="field-input"
                onChange={({target}) => handleChildFormDetailsChange((counter - 1), "general_information" ,"psat_scores-" + (i - 1) + "-month", target.value)}
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

  return (
    <GeneralInformationFormStyled>
      <h3 className="heading">General Information</h3>
      <div className="general-info-wrapper">
        <div className="grid-4">
          <div className="form-group">
            <div className="field">
            <select
                name={"ch_grade" + (counter-1)}
                className="field-input"
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
          {
            childGeneralInformation.grade > 8 &&
            <div className="form-group">
              <div className="field">
                {
                  !isReadonly ?
                  <select
                    name="ch_gpa_quarter"
                    className="field-input"
                    onChange={({ target }) => {
                      handleChildFormDetailsChange(counter - 1, "general_information", "gpa_quarter_year", target.value);
                    }}
                    defaultValue={childGeneralInformation.gpa_quarter_year}
                  >
                    <option value="">Start Year</option>
                    {createYearTakenSelect()}
                  </select>
                  :
                  <input 
                    type="text"
                    name="ch_gpa_quarter"
                    className="field-input"
                    defaultValue={childGeneralInformation.gpa_quarter_year}
                    readOnly={isReadonly}
                  />
                }

                <label className="field-label">GPA (Quarter)</label>
              </div>
            </div>
          }
          {
            childGeneralInformation.grade > 8 &&
            <div className="grid-5">
              <div className="form-group">
                <div className="field">
                  <NumberFormat 
                    name="gpa_quarter_q1"
                    className="field-input"
                    placeholder="Q1"
                    onChange={({ target }) => {
                      handleChildFormDetailsChange(counter - 1, "general_information", "gpa_quarter_q1", target.value);
                    }}
                    readOnly={isReadonly}
                    defaultValue={childGeneralInformation.gpa_quarter_q1}
                  />
                  <label className="field-label">Q1</label>
                </div>
              </div>
              <div className="form-group">
                <div className="field">
                  <NumberFormat
                    name="gpa_quarter_q2"
                    className="field-input"
                    placeholder="Q2"
                    onChange={({ target }) => {
                      handleChildFormDetailsChange(counter - 1, "general_information", "gpa_quarter_q2", target.value);
                    }}
                    readOnly={isReadonly}
                    defaultValue={childGeneralInformation.gpa_quarter_q2}
                  />
                  <label className="field-label">Q2</label>
                </div>
              </div>
              <div className="form-group">
                <div className="field">
                  <NumberFormat 
                    name="gpa_quarter_q3"
                    className="field-input"
                    placeholder="Q3"
                    onChange={({ target }) => {
                      handleChildFormDetailsChange(counter - 1, "general_information", "gpa_quarter_q3", target.value);
                    }}
                    readOnly={isReadonly}
                    defaultValue={childGeneralInformation.gpa_quarter_q3}
                  />
                  <label className="field-label">Q3</label>
                </div>
              </div>
              <div className="form-group">
                <div className="field">
                  <NumberFormat 
                    name="gpa_quarter_q4"
                    className="field-input"
                    placeholder="Q4"
                    onChange={({ target }) => {
                      handleChildFormDetailsChange(counter - 1, "general_information", "gpa_quarter_q4", target.value);
                    }}
                    readOnly={isReadonly}
                    defaultValue={childGeneralInformation.gpa_quarter_q4}
                  />
                  <label className="field-label">Q4</label>
                </div>
              </div>
            </div>
          }
        </div>
        {
          childGeneralInformation.grade > 8 &&
          <div className="grid-4">
            <div className="form-group">
              <div className="field">
                <input
                  name="ch_class_rank"
                  className="field-input"
                  placeholder="Enter Class Rank as a #"
                  onChange={({ target }) => {
                    handleChildFormDetailsChange(counter - 1, "general_information", "class_rank", target.value);
                  }}
                  readOnly={isReadonly}
                  defaultValue={childGeneralInformation.class_rank}
                />
                <label className="field-label">Class Rank</label>
              </div>
            </div>
            <div className="form-group">
              <div className="field">
                <select
                  name="ch_gpa_cumulative"
                  className="field-input"
                  onChange={({ target }) => {
                    handleChildFormDetailsChange(counter - 1, "general_information", "gpa_cumulative_year", target.value);
                  }}
                  readOnly={isReadonly}
                  defaultValue={childGeneralInformation.gpa_cumulative_year}
                >
                    <option value="">Start Year</option>
                    {createYearTakenSelect()}
                </select>
                <label className="field-label">GPA (Cumulative)</label>
              </div>
            </div>
            <div className="grid-5">
              <div className="form-group">
                <div className="field">
                  <NumberFormat 
                    name="gpa_cumulative_q1"
                    className="field-input"
                    placeholder="Q1"
                    onChange={({ target }) => {
                      handleChildFormDetailsChange(counter - 1, "general_information", "gpa_cumulative_q1", target.value);
                    }}
                    readOnly={isReadonly}
                    defaultValue={childGeneralInformation.gpa_cumulative_q1}
                  />
                  <label className="field-label">Q1</label>
                </div>
              </div>
              <div className="form-group">
                <div className="field">
                  <NumberFormat 
                    name="gpa_cumulative_q2"
                    className="field-input"
                    placeholder="Q2"
                    onChange={({ target }) => {
                      handleChildFormDetailsChange(counter - 1, "general_information", "gpa_cumulative_q2", target.value);
                    }}
                    readOnly={isReadonly}
                    defaultValue={childGeneralInformation.gpa_cumulative_q2}           
                  />
                  <label className="field-label">Q2</label>
                </div>
              </div>
              <div className="form-group">
                <div className="field">
                  <NumberFormat 
                    name="gpa_cumulative_q3"
                    className="field-input"
                    placeholder="Q3"
                    onChange={({ target }) => {
                      handleChildFormDetailsChange(counter - 1, "general_information", "gpa_cumulative_q3", target.value);
                    }}
                    readOnly={isReadonly}
                    defaultValue={childGeneralInformation.gpa_cumulative_q3}
                  />
                  <label className="field-label">Q3</label>
                </div>
              </div>
              <div className="form-group">
                <div className="field">
                  <NumberFormat 
                    name="gpa_cumulative_q4"
                    className="field-input"
                    placeholder="Q4"
                    onChange={({ target }) => {
                      handleChildFormDetailsChange(counter - 1, "general_information", "gpa_cumulative_q4", target.value);
                    }}
                    readOnly={isReadonly}
                    defaultValue={childGeneralInformation.gpa_cumulative_q4}
                  />
                  <label className="field-label">Q4</label>
                </div>
              </div>
            </div>
          </div>
        }
        {
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
        }
        <div className="grid-2">
          <div className="form-group">
            <div className="field">
              <input
                name={"ch_schoolname" + (counter - 1)}
                className="field-input"
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "school_name", target.value);
                }}
                placeholder="School Name"
                ref={register({ required: true })}
                defaultValue={childGeneralInformation.school_name}
                readOnly={isReadonly}
              />
              <label className="field-label"><span className="required">*</span> School Name</label>
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
                  className="field-input"
                  placeholder="Phone"
                  readOnly={isReadonly}
                  defaultValue={childGeneralInformation.school_phone}
                />
                :
                <NumberFormat 
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
                        if(value) {
                          return value.match(/\d/g).length === 10
                        } else {
                          return true;
                        }
                      }
                    }
                  })}
                />
              }
              <label className="field-label">Phone</label>
            </div>
            <ErrorMessage
              field={errors["ch_school_phone" + (counter - 1)]}
              errorType="completed"
              message="Phone Number must be consist of 10 digits."
            />
          </div>
        </div>
        <div className="agree-text">
          Are there currently any problems with your child either at home or at school? 
        </div>
        <div className="form-group">
          <label className="cus-select-container">
            Yes 
            <input type="radio" 
              onChange={({ target }) => {
                handleChildFormDetailsChange(counter - 1, "general_information", "was_suspended", target.value);
              }} 
              value="true"
              checked={childGeneralInformation.was_suspended + "" === "true"}
              readOnly={isReadonly}
            />
            <span className="checkmark"></span>
          </label>
          <label className="cus-select-container">
            No
            <input type="radio" 
              onChange={({ target }) => {
                handleChildFormDetailsChange(counter - 1, "general_information", "was_suspended", target.value);
              }} 
              value="false"
              checked={childGeneralInformation.was_suspended + "" === "false"}
              readOnly={isReadonly}
            />
            <span className="checkmark"></span>
          </label>
        </div>
        {
          childGeneralInformation.was_suspended &&
        <div className="form-group">
          <textarea 
            name="reasons_suspended"
            className="form-control ta-justice"
            rows="4"
            placeholder="Explain"
            onChange={({ target }) => {
              handleChildFormDetailsChange(counter - 1, "general_information", "reason_suspended", target.value);
            }}
            defaultValue={childGeneralInformation.reason_suspended}
            readOnly={isReadonly}
          >
          </textarea>
        </div>
        }
        <div className="grid-1">
          <div className="form-group">
            <div className="field">
              <select
                name={"mentee_start_year" + (counter - 1)}
                className="field-input"
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "mentee_start_year", target.value);
                }}
                defaultValue={childGeneralInformation.mentee_start_year}
                disabled={isReadonly}
              >
                  <option value="">Select Year</option>
                  { createYearTakenSelect() }
              </select>
              <label className="field-label">Year Started as Mentee</label>
            </div>
          </div>
          <div className="form-group">
            <div className="field">
              <input
                name="ch_hobbies"
                className="field-input"
                placeholder='Please use "," as seperator (Eg: Example1, Example2)'
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "hobbies", target.value);
                }}
                defaultValue={childGeneralInformation.hobbies}
                readOnly={isReadonly}
              />
              <label className="field-label">Hobbies / Personal Interests</label>
            </div>
          </div>
          <div className="form-group">
            <div className="field">
              <input
                name="ch_life_events"
                className="field-input"
                placeholder='Please use "," as seperator (Eg: Example1, Example2)'
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "life_events", target.value);
                }}
                readOnly={isReadonly}
                defaultValue={childGeneralInformation.life_events}
              />
              <label className="field-label">Life events you would like to share</label>
            </div>
          </div>
        </div>

        <div className="grid-3">
          <div className="form-group">
            <div className="field">
              <input 
                name="ch_career_goals"
                className="field-input"
                placeholder='Please use "," as seperator (Eg: Example1, Example2)'
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "career_goals", target.value);
                }}
                defaultValue={childGeneralInformation.career_goals}
                readOnly={isReadonly}
              />
              <label className="field-label">Career Goals</label>
            </div>
          </div>

          <div className="form-group">
            <div className="field">
              <input 
                name="ch_colleges"
                className="field-input"
                placeholder='Please use "," as seperator (Eg: Example1, Example2)'
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "colleges", target.value);
                }}
                defaultValue={childGeneralInformation.colleges}
                readOnly={isReadonly}
              />
              <label className="field-label">List of Colleges you are Considering Upon Graduation</label>
            </div>
          </div>
        </div>

        <div>
          <div className="form-group">
            <div className="field">
              <input
                name="ch_team_affiliations"
                className="field-input"
                placeholder='Please use "," as seperator (Eg: Example1, Example2)'
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "team_affiliations", target.value);
                }}
                defaultValue={childGeneralInformation.team_affiliations}
                readOnly={isReadonly}
              />
              
              <label className="field-label">Group and Other Team Affiliations</label>
            </div>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <div className="field">
              <input
                name="ch_awards"
                className="field-input"
                placeholder='Please use "," as seperator (Eg: Example1, Example2)'
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "awards", target.value);
                }}
                defaultValue={childGeneralInformation.awards}
                readOnly={isReadonly}
              />
              <label className="field-label">Please List of Awards</label>
            </div>
          </div>

          <div className="form-group">
            <div className="field">
              <input
                name="ch_accomplishments"
                className="field-input"
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "accomplishments", target.value);
                }}
                placeholder='Please use "," as seperator (Eg: Example1, Example2)'
                defaultValue={childGeneralInformation.accomplishments}
                readOnly={isReadonly}
              />
              <label className="field-label">Please List of Accomplishments</label>
            </div>
          </div>
        </div>

        <div>
          <div className="form-group">
            <div>
              <label className="field-label-simple">
                <span className="required">*</span> What does the mentee hope to gain from the program?
              </label>
              <textarea 
                name={"mentee_gain" + (counter - 1)}
                className="form-control"
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
    </GeneralInformationFormStyled>
  )
}