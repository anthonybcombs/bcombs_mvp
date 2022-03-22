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

    let currentYear = new Date().getFullYear();
    let options = [];
    for (let i = 0; i < 15; i++) {
      options.push(<option key={i} value={currentYear - i}>{currentYear - i}</option>)
    }

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
              <label className="field-label">Year Started as Mentee`</label>
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
      <h3 className="heading">General Information</h3>
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
                <label className="field-label">Entrepreneur</label>
              </div>

            </div>
          </div>

          {childGeneralInformation?.is_entrepreneur ? <>
            <div className="grid-1">
              <div className="form-group">
                <div className="field">
                  <input
                    name="ch_include_in_directory"
                    // className="field-input"
                    className={
                      isReadonly &&
                        !isVendorView &&
                        pastChildInformation &&
                        (pastChildInformation.include_in_directory || pastChildInformation.include_in_directory == "") &&
                        pastChildInformation.include_in_directory != childGeneralInformation.include_in_directory ?
                        "field-input highlights" : "field-input"
                    }
                    placeholder="Include in Directory"
                    id={`ch_include_in_directory_${counter - 1}`}
                    onChange={({ target }) => {
                      handleChildFormDetailsChange(counter - 1, "general_information", "include_in_directory", target.value);
                    }}
                    readOnly={isReadonly}
                    defaultValue={childGeneralInformation.include_in_directory}
                  />
                  <label className="field-label" for={`ch_include_in_directory_${counter - 1}`}>Include in Directory?</label>
                </div>
              </div>
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
                    placeholder="Business Name"
                    id={`ch_business_name_${counter - 1}`}
                    onChange={({ target }) => {
                      handleChildFormDetailsChange(counter - 1, "general_information", "business_name", target.value);
                    }}
                    readOnly={isReadonly}
                    defaultValue={childGeneralInformation.business_name}
                  />
                  <label className="field-label" for={`ch_business_name_${counter - 1}`}>Business Name</label>
                </div>
              </div> <div className="form-group">
                <div className="field">
                  <input
                    name="ch_business_website"
                    // className="field-input"
                    className={
                      isReadonly &&
                        !isVendorView &&
                        pastChildInformation &&
                        (pastChildInformation.business_website || pastChildInformation.business_website == "") &&
                        pastChildInformation.business_website != childGeneralInformation.business_website ?
                        "field-input highlights" : "field-input"
                    }
                    placeholder="Business Website"
                    id={`ch_business_website_${counter - 1}`}
                    onChange={({ target }) => {
                      handleChildFormDetailsChange(counter - 1, "general_information", "business_website", target.value);
                    }}
                    readOnly={isReadonly}
                    defaultValue={childGeneralInformation.business_website}
                  />
                  <label className="field-label" for={`ch_business_website_${counter - 1}`}>Business Website</label>
                </div>
              </div>
            </div>

            <div className="grid-1">
              <div className="form-group">
                <div className="field">


                  {!isReadonly ? (
                    <NumberFormat
                      id={`ch_business_phone_${counter - 1}`}
                      name="business_phone"
                      className={
                        isReadonly &&
                          !isVendorView &&
                          pastChildInformation &&
                          (pastChildInformation.business_phone || pastChildInformation.business_phone == "") &&
                          pastChildInformation.business_phone != childGeneralInformation.business_phone ?
                          "field-input highlights" : "field-input"
                      }
                      placeholder="Phone"
                      onChange={({ target }) => {
                        handleChildFormDetailsChange(
                          counter - 1,
                          "general_information",
                          "business_phone",
                          target.value
                        );
                      }}
                      defaultValue={childGeneralInformation.business_phone}
                      format="(###) ###-####"
                      mask="_"
                      getInputRef={register({
                        validate: {
                          completed: value => {
                            if (value) {
                              return value.match(/\d/g).length === 10;
                            } else {
                              return true;
                            }
                          }
                        }
                      })}
                    />
                  ) : (
                    <input
                      name="ch_business_phone"
                      className={
                        isReadonly &&
                          !isVendorView &&
                          pastChildInformation &&
                          (pastChildInformation.business_phone || pastChildInformation.business_phone == "") &&
                          pastChildInformation.business_phone != childGeneralInformation.business_phone ?
                          "field-input highlights" : "field-input"
                      }
                      placeholder="Phone"
                      readOnly={isReadonly}
                      id={`ch_business_phone_${counter - 1}`}
                      defaultValue={childGeneralInformation.business_phone}
                    />
                  )}
                  <label className="field-label" for={`business_phone_${counter - 1}`}>Business Phone</label>
                </div>
                <ErrorMessage
                  field={errors["business_phone"]}
                  errorType="completed"
                  message="Phone Number must be consist of 10 digits."
                />
              </div>
              <div className="form-group">
                <div className="field">
                  <input
                    name="ch_business_email"
                    // className="field-input"
                    className={
                      isReadonly &&
                        !isVendorView &&
                        pastChildInformation &&
                        (pastChildInformation.business_email || pastChildInformation.business_email == "") &&
                        pastChildInformation.business_emailbusiness_email != childGeneralInformation.business_email ?
                        "field-input highlights" : "field-input"
                    }
                    placeholder="Business Email"
                    id={`ch_business_email_${counter - 1}`}
                    onChange={({ target }) => {
                      handleChildFormDetailsChange(counter - 1, "general_information", "business_email", target.value);
                    }}
                    readOnly={isReadonly}
                    defaultValue={childGeneralInformation.business_email}
                    ref={register({
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: "Invalid email address"
                      }
                    })}
                  />
                  <label className="field-label" for={`ch_business_email_${counter - 1}`}>Business Email</label>
                </div>
                <ErrorMessage
                  field={errors["ch_business_email"]}
                  errorType="pattern"
                  message="Invalid email address"
                />

              </div> <div className="form-group">
                <div className="field">
                  <input
                    name="ch_business_industry"
                    // className="field-input"
                    className={
                      isReadonly &&
                        !isVendorView &&
                        pastChildInformation &&
                        (pastChildInformation.business_industry || pastChildInformation.business_industry == "") &&
                        pastChildInformation.business_industry != childGeneralInformation.business_industry ?
                        "field-input highlights" : "field-input"
                    }
                    placeholder="Business Industry"
                    id={`ch_business_industry_${counter - 1}`}
                    onChange={({ target }) => {
                      handleChildFormDetailsChange(counter - 1, "general_information", "business_industry", target.value);
                    }}
                    readOnly={isReadonly}
                    defaultValue={childGeneralInformation.business_industry}
                  />
                  <label className="field-label" for={`ch_business_industry_${counter - 1}`}>Business Industry</label>
                </div>
              </div>
            </div>

            <div className="grid">
              <div className="form-group">
                <div className="field">
                  <input
                    name="ch_business_address"
                    // className="field-input"
                    className={
                      isReadonly &&
                        !isVendorView &&
                        pastChildInformation &&
                        (pastChildInformation.business_address || pastChildInformation.business_address == "") &&
                        pastChildInformation.business_address != childGeneralInformation.business_address ?
                        "field-input highlights" : "field-input"
                    }
                    placeholder="Business Address"
                    id={`ch_business_address_${counter - 1}`}
                    onChange={({ target }) => {
                      handleChildFormDetailsChange(counter - 1, "general_information", "business_address", target.value);
                    }}
                    readOnly={isReadonly}
                    defaultValue={childGeneralInformation.business_address}
                  />
                  <label className="field-label" for={`ch_business_address_${counter - 1}`}>Business Address</label>
                </div>
              </div>
            </div>
            <div className="grid">
              <div className="form-group">
                <div className="field">
                  <input
                    name="ch_business_description"
                    // className="field-input"
                    className={
                      isReadonly &&
                        !isVendorView &&
                        pastChildInformation &&
                        (pastChildInformation.business_description || pastChildInformation.business_description == "") &&
                        pastChildInformation.business_description != childGeneralInformation.business_description ?
                        "field-input highlights" : "field-input"
                    }
                    placeholder="Business Description"
                    id={`ch_business_description_${counter - 1}`}
                    onChange={({ target }) => {
                      handleChildFormDetailsChange(counter - 1, "general_information", "business_description", target.value);
                    }}
                    readOnly={isReadonly}
                    defaultValue={childGeneralInformation.business_description}
                  />
                  <label className="field-label" for={`ch_business_description_${counter - 1}`}>Business Description</label>
                </div>
              </div>
            </div>
            <div className="grid-4">
              <div className="form-group">
                <div className="field">
                  <input
                    name="ch_employment_status"
                    // className="field-input"
                    className={
                      isReadonly &&
                        !isVendorView &&
                        pastChildInformation &&
                        (pastChildInformation.employment_status || pastChildInformation.employment_status == "") &&
                        pastChildInformation.employment_status != childGeneralInformation.employment_status ?
                        "field-input highlights" : "field-input"
                    }
                    placeholder="Employment Status"
                    id={`ch_employment_status_${counter - 1}`}
                    onChange={({ target }) => {
                      handleChildFormDetailsChange(counter - 1, "general_information", "employment_status", target.value);
                    }}
                    readOnly={isReadonly}
                    defaultValue={childGeneralInformation.employment_status}
                  />
                  <label className="field-label" for={`ch_employment_status_${counter - 1}`}>Employment Status</label>
                </div>
              </div>
            </div>
          </> : <div />}
        </div>


        :
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
            {/* {
              childGeneralInformation.grade > 8 &&
              <div className="form-group">
                <div className="field select-field-wrapper">
                  {
                    !isReadonly ?
                      <select
                        name="ch_gpa_quarter"
                        className={
                          isReadonly &&
                            !isVendorView &&
                            pastChildInformation && (pastChildInformation.gpa_quarter_year || pastChildInformation.gpa_quarter_year == '') &&
                            (pastChildInformation.gpa_quarter_year != childGeneralInformation.gpa_quarter_year) ?
                            "field-input highlights" : "field-input"
                        }
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
                        className={
                          isReadonly &&
                            !isVendorView &&
                            pastChildInformation && (pastChildInformation.gpa_quarter_year || pastChildInformation.gpa_quarter_year == '') &&
                            (pastChildInformation.gpa_quarter_year != childGeneralInformation.gpa_quarter_year) ?
                            "field-input highlights" : "field-input"
                        }
                        type="text"
                        name="ch_gpa_quarter"
                        defaultValue={childGeneralInformation.gpa_quarter_year}
                        readOnly={isReadonly}
                      />
                  }

                  <label className="field-label">GPA (Quarter)</label>
                </div>
              </div>
            } */}
            {/* {
              childGeneralInformation.grade > 8 &&
              <div className="grid-5">
                <div className="form-group">
                  <div className="field">
                    <NumberFormat
                      id={`gpa_quarter_q1_${counter - 1}`}
                      name="gpa_quarter_q1"
                      className={
                        isReadonly &&
                          !isVendorView &&
                          pastChildInformation &&
                          (pastChildInformation.gpa_quarter_q1 || pastChildInformation.gpa_quarter_q1 == "") &&
                          pastChildInformation.gpa_quarter_q1 != childGeneralInformation.gpa_quarter_q1 ?
                          "field-input highlights" : "field-input"
                      }
                      placeholder="Q1"
                      onChange={({ target }) => {
                        handleChildFormDetailsChange(counter - 1, "general_information", "gpa_quarter_q1", target.value);
                      }}
                      readOnly={isReadonly}
                      defaultValue={childGeneralInformation.gpa_quarter_q1}
                    />
                    <label className="field-label" for={`gpa_quarter_q1_${counter - 1}`}>Q1</label>
                  </div>
                </div>
                <div className="form-group">
                  <div className="field">
                    <NumberFormat
                      id={`gpa_quarter_q2_${counter - 1}`}
                      name="gpa_quarter_q2"
                      className={
                        isReadonly &&
                          !isVendorView &&
                          pastChildInformation &&
                          (pastChildInformation.gpa_quarter_q2 || pastChildInformation.gpa_quarter_q2 == "") &&
                          pastChildInformation.gpa_quarter_q2 != childGeneralInformation.gpa_quarter_q2 ?
                          "field-input highlights" : "field-input"
                      }

                      // onChange={({ target }) => {
                      //   handleChildFormDetailsChange(counter - 1, "general_information", "gpa_quarter_q3", target.value);
                      // }}
                      placeholder="Q2"
                      onChange={({ target }) => {
                        handleChildFormDetailsChange(counter - 1, "general_information", "gpa_quarter_q2", target.value);
                      }}
                      readOnly={isReadonly}
                      defaultValue={childGeneralInformation.gpa_quarter_q2}
                    />
                    <label className="field-label" for={`gpa_quarter_q2_${counter - 1}`}>Q2</label>
                  </div>
                </div>
                <div className="form-group">
                  <div className="field">
                    <NumberFormat
                      id={`gpa_quarter_q3_${counter - 1}`}
                      name="gpa_quarter_q3"
                      className={
                        isReadonly &&
                          !isVendorView &&
                          pastChildInformation &&
                          (pastChildInformation.gpa_quarter_q3 || pastChildInformation.gpa_quarter_q3 == "") &&
                          pastChildInformation.gpa_quarter_q3 != childGeneralInformation.gpa_quarter_q3 ?
                          "field-input highlights" : "field-input"
                      }
                      placeholder="Q3"
                      onChange={({ target }) => {
                        handleChildFormDetailsChange(counter - 1, "general_information", "gpa_quarter_q3", target.value);
                      }}
                      readOnly={isReadonly}
                      defaultValue={childGeneralInformation.gpa_quarter_q3}
                    />
                    <label className="field-label" for={`gpa_quarter_q3_${counter - 1}`}>Q3</label>
                  </div>
                </div>
                <div className="form-group">
                  <div className="field">
                    <NumberFormat
                      id={`gpa_quarter_q4_${counter - 1}`}
                      name="gpa_quarter_q4"
                      className={
                        isReadonly &&
                          !isVendorView &&
                          pastChildInformation &&
                          (pastChildInformation.gpa_quarter_q4 || pastChildInformation.gpa_quarter_q4 == "") &&
                          pastChildInformation.gpa_quarter_q4 != childGeneralInformation.gpa_quarter_q4 ?
                          "field-input highlights" : "field-input"
                      }
                      placeholder="Q4"
                      onChange={({ target }) => {
                        handleChildFormDetailsChange(counter - 1, "general_information", "gpa_quarter_q4", target.value);
                      }}
                      readOnly={isReadonly}
                      defaultValue={childGeneralInformation.gpa_quarter_q4}
                    />
                    <label className="field-label" for={`gpa_quarter_q4_${counter - 1}`}>Q4</label>
                  </div>
                </div>
              </div>
            } */}
          </div>
          {/* {
            childGeneralInformation.grade > 8 &&
            <div className="grid-4">
              <div className="form-group">
                <div className="field">
                  <input
                    name="ch_class_rank"
                    // className="field-input"
                    className={
                      isReadonly &&
                        !isVendorView &&
                        pastChildInformation &&
                        (pastChildInformation.class_rank || pastChildInformation.class_rank == "") &&
                        pastChildInformation.class_rank != childGeneralInformation.class_rank ?
                        "field-input highlights" : "field-input"
                    }
                    placeholder="Enter Group Rank as a #"
                    id={`ch_class_rank_${counter - 1}`}
                    onChange={({ target }) => {
                      handleChildFormDetailsChange(counter - 1, "general_information", "class_rank", target.value);
                    }}
                    readOnly={isReadonly}
                    defaultValue={childGeneralInformation.class_rank}
                  />
                  <label className="field-label" for={`ch_class_rank_${counter - 1}`}>Group Rank</label>
                </div>
              </div>
              <div className="form-group">
                <div className="field select-field-wrapper">
                  <select
                    name="ch_gpa_cumulative"
                    className={
                      isReadonly &&
                        !isVendorView &&
                        pastChildInformation &&
                        (pastChildInformation.gpa_cumulative_year || pastChildInformation.gpa_cumulative_year == "") &&
                        pastChildInformation.gpa_cumulative_year != childGeneralInformation.gpa_cumulative_year ?
                        "field-input highlights" : "field-input"
                    }
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
                      id={`gpa_cumulative_q1_${counter - 1}`}
                      name="gpa_cumulative_q1"
                      //className="field-input"
                      className={
                        isReadonly &&
                          !isVendorView &&
                          pastChildInformation &&
                          (pastChildInformation.gpa_cumulative_q1 || pastChildInformation.gpa_cumulative_q1 == "") &&
                          pastChildInformation.gpa_cumulative_q1 != childGeneralInformation.gpa_cumulative_q1 ?
                          "field-input highlights" : "field-input"
                      }
                      placeholder="Q1"
                      onChange={({ target }) => {
                        handleChildFormDetailsChange(counter - 1, "general_information", "gpa_cumulative_q1", target.value);
                      }}
                      readOnly={isReadonly}
                      defaultValue={childGeneralInformation.gpa_cumulative_q1}
                    />
                    <label className="field-label" for={`gpa_cumulative_q1_${counter - 1}`}>Q1</label>
                  </div>
                </div>
                <div className="form-group">
                  <div className="field">
                    <NumberFormat
                      id={`gpa_cumulative_q2_${counter - 1}`}
                      name="gpa_cumulative_q2"
                      className={
                        isReadonly &&
                          !isVendorView &&
                          pastChildInformation &&
                          (pastChildInformation.gpa_cumulative_q2 || pastChildInformation.gpa_cumulative_q2 == "") &&
                          pastChildInformation.gpa_cumulative_q2 != childGeneralInformation.gpa_cumulative_q2 ?
                          "field-input highlights" : "field-input"
                      }
                      placeholder="Q2"
                      onChange={({ target }) => {
                        handleChildFormDetailsChange(counter - 1, "general_information", "gpa_cumulative_q2", target.value);
                      }}
                      readOnly={isReadonly}
                      defaultValue={childGeneralInformation.gpa_cumulative_q2}
                    />
                    <label className="field-label" for={`gpa_cumulative_q2_${counter - 1}`}>Q2</label>
                  </div>
                </div>
                <div className="form-group">
                  <div className="field">
                    <NumberFormat
                      id={`gpa_cumulative_q3_${counter - 1}`}
                      name="gpa_cumulative_q3"
                      // className="field-input"
                      className={
                        isReadonly &&
                          !isVendorView &&
                          pastChildInformation &&
                          (pastChildInformation.gpa_cumulative_q3 || pastChildInformation.gpa_cumulative_q3 == "") &&
                          pastChildInformation.gpa_cumulative_q3 != childGeneralInformation.gpa_cumulative_q3 ?
                          "field-input highlights" : "field-input"
                      }
                      placeholder="Q3"
                      onChange={({ target }) => {
                        handleChildFormDetailsChange(counter - 1, "general_information", "gpa_cumulative_q3", target.value);
                      }}
                      readOnly={isReadonly}
                      defaultValue={childGeneralInformation.gpa_cumulative_q3}
                    />
                    <label className="field-label" for={`gpa_cumulative_q3_${counter - 1}`}>Q3</label>
                  </div>
                </div>
                <div className="form-group">
                  <div className="field">
                    <NumberFormat
                      id={`gpa_cumulative_q4_${counter - 1}`}
                      name="gpa_cumulative_q4"
                      // className="field-input"
                      className={
                        isReadonly &&
                          !isVendorView &&
                          pastChildInformation &&
                          (pastChildInformation.gpa_cumulative_q4 || pastChildInformation.gpa_cumulative_q4 == "") &&
                          pastChildInformation.gpa_cumulative_q4 != childGeneralInformation.gpa_cumulative_q4 ?
                          "field-input highlights" : "field-input"
                      }
                      placeholder="Q4"
                      onChange={({ target }) => {
                        handleChildFormDetailsChange(counter - 1, "general_information", "gpa_cumulative_q4", target.value);
                      }}
                      readOnly={isReadonly}
                      defaultValue={childGeneralInformation.gpa_cumulative_q4}
                    />
                    <label className="field-label" for={`gpa_cumulative_q4_${counter - 1}`}>Q4</label>
                  </div>
                </div>
              </div>
            </div>
          } */}
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
          <div className="agree-text">
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
          </div>
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
                <label className="field-label">Year Started as Mentee</label>
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

                <label className="field-label" for={`ch_team_affiliations_${counter - 1}`}>Group and Other Team Affiliations</label>
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
                <label className="field-label" for={`ch_awards_${counter - 1}`}>Please List of Awards</label>
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
                <label className="field-label" for={`ch_accomplishments_${counter - 1}`}>Please List of Accomplishments</label>
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
        </div>}
    </GeneralInformationFormStyled>
  )
}