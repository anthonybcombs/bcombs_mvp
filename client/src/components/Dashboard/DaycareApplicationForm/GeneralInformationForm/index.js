import React, { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import ErrorMessage from "../../../../helpers/ErrorMessage";
import NumberFormat from 'react-number-format';

import STATES from "../../ApplicationForm/states.json";

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
  register,
  errors,
  isReadonly = false,
  pastChildInformation = {},
  isVendorView
}) {

  console.log('DayCare Application Form', childGeneralInformation)
  console.log('DayCare Application Form pastChildInformation',pastChildInformation)

  return (
    <GeneralInformationFormStyled>
      <h3 className="heading">General Information</h3>
      <div className="general-info-wrapper">

        <div className="agree-text">
          <span className="required">*</span> Is your child transferring from a previous daycare? 
        </div>
        <div className="form-group">
          <label className={
              isReadonly &&
              !isVendorView &&
              pastChildInformation && childGeneralInformation.is_child_transferring === "Currently Enrolled" && 
              (pastChildInformation.is_child_transferring || pastChildInformation.is_child_transferring == "") &&
              pastChildInformation.is_child_transferring != childGeneralInformation.is_child_transferring ?
              "cus-select-container radio-highlights" : "cus-select-container"
              }>
            Currently Enrolled 
            <input type="radio" 
              name={"ch_transfer" + (counter - 1)}
              onChange={({ target }) => {
                handleChildFormDetailsChange(counter - 1, "general_information", "is_child_transferring", "Currently Enrolled");
              }} 
              value={"Currently Enrolled"}
              checked={childGeneralInformation.is_child_transferring == "Currently Enrolled"}
              readOnly={isReadonly}
              disabled={isReadonly}
              ref={register({
                validate: {
                  otherCBChecked: value => {
                    if(childGeneralInformation.is_child_transferring) return true;
                    return false;
                  }
                }
              })}
            />
            <span className="checkmark"></span>
          </label>
          <label className={
              isReadonly &&
              !isVendorView &&
              pastChildInformation && childGeneralInformation.is_child_transferring === "Yes" && 
              (pastChildInformation.is_child_transferring || pastChildInformation.is_child_transferring == "") &&
              pastChildInformation.is_child_transferring != childGeneralInformation.is_child_transferring ?
              "cus-select-container radio-highlights" : "cus-select-container"
            }>
            Yes 
            <input type="radio"
              name={"ch_transfer" + (counter - 1)}
              onChange={({ target }) => {
                handleChildFormDetailsChange(counter - 1, "general_information", "is_child_transferring", "Yes");
              }} 
              value={"Yes"}
              checked={childGeneralInformation.is_child_transferring == "Yes"}
              readOnly={isReadonly}
              disabled={isReadonly}
              ref={register({
                validate: {
                  otherCBChecked: value => {
                    if(childGeneralInformation.is_child_transferring) return true;
                    return false;
                  }
                }
              })}
            />
            <span className="checkmark"></span>
          </label>
          <label className={
              isReadonly &&
              !isVendorView &&
              pastChildInformation && childGeneralInformation.is_child_transferring === "No" && 
              (pastChildInformation.is_child_transferring || pastChildInformation.is_child_transferring == "") &&
              pastChildInformation.is_child_transferring != childGeneralInformation.is_child_transferring ?
              "cus-select-container radio-highlights" : "cus-select-container"
            }>
            No
            <input type="radio"
              name={"ch_transfer" + (counter - 1)}
              onChange={({ target }) => {
                handleChildFormDetailsChange(counter - 1, "general_information", "is_child_transferring", "No");
              }} 
              value={"No"}
              checked={childGeneralInformation.is_child_transferring == "No"}
              readOnly={isReadonly}
              disabled={isReadonly}
              ref={register({
                validate: {
                  otherCBChecked: value => {
                    if(childGeneralInformation.is_child_transferring) return true;
                    return false;
                  }
                }
              })}
            />
            <span className="checkmark"></span>
          </label>
          <ErrorMessage
            field={errors["ch_transfer" + (counter - 1)]}
            errorType="otherCBChecked"
            message="Is child transferring required"
          />
        </div>
        {
          childGeneralInformation.is_child_transferring == "Yes" && (
            <>
              <div className="grid-2">
                <div className="form-group">
                  <div className="field">
                    <input
                      id={`ch_transfer_reason${counter - 1}`}
                      name={"ch_transfer_reason" + (counter - 1)}
                      className={
                        isReadonly &&
                        !isVendorView &&
                        pastChildInformation &&
                        (pastChildInformation.transfer_reason || pastChildInformation.transfer_reason == "") &&
                        pastChildInformation.transfer_reason != childGeneralInformation.transfer_reason ?
                        "field-input highlights" : "field-input"
                      }
                      onChange={({ target }) => {
                        handleChildFormDetailsChange(counter - 1, "general_information", "transfer_reason", target.value);
                      }}
                      placeholder="Explain"
                      ref={register({required: true})}
                      defaultValue={childGeneralInformation.transfer_reason}
                      readOnly={isReadonly}
                    />
                    <label className="field-label" htmlFor={`ch_transfer_reason_${counter - 1}`}>
                      <span className="required">*</span> If Yes, please explain
                    </label>
                  </div>
                  <ErrorMessage
                    field={errors["ch_transfer_reason" + (counter - 1)]}
                    errorType="required"
                    message="Explanation is required"
                  />
                </div>
                <div className="form-group">
                  <div className="field">
                    <input
                      id={`ch_prev_school_attended${counter - 1}`}
                      name={"ch_prev_school_attended" + (counter - 1)}
                      className={
                        isReadonly &&
                        !isVendorView &&
                        pastChildInformation &&
                        (pastChildInformation.prev_school_attended || pastChildInformation.prev_school_attended == "") &&
                        pastChildInformation.prev_school_attended != childGeneralInformation.prev_school_attended ?
                        "field-input highlights" : "field-input"
                      }
                      onChange={({ target }) => {
                        handleChildFormDetailsChange(counter - 1, "general_information", "prev_school_attended", target.value);
                      }}
                      placeholder="Explain"
                      ref={register({required: true})}
                      defaultValue={childGeneralInformation.prev_school_attended}
                      readOnly={isReadonly}
                    />
                    <label className="field-label" htmlFor={`ch_prev_school_attended${counter - 1}`}>
                      <span className="required">*</span>Previous School Attended
                    </label>
                  </div>
                  <ErrorMessage
                    field={errors["ch_prev_school_attended" + (counter - 1)]}
                    errorType="required"
                    message="Previous School Attended is required"
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <div className="field">
                    <NumberFormat
                      id={`ch_school_phone${counter - 1}`}
                      name={"ch_school_phone" + (counter - 1)}
                      className={
                        isReadonly &&
                        !isVendorView &&
                        pastChildInformation &&
                        (pastChildInformation.prev_school_phone ||
                          pastChildInformation.prev_school_phone == "") &&
                        pastChildInformation.prev_school_phone !=
                        childGeneralInformation.prev_school_phone
                          ? "field-input highlights"
                          : "field-input"
                      }
                      placeholder="Phone Number"
                      onChange={({ target }) => {
                        handleChildFormDetailsChange(
                          counter - 1,
                          "general_information",
                          "prev_school_phone",
                          target.value
                        );
                      }}
                      defaultValue={childGeneralInformation?.prev_school_phone}
                      format="(###) ###-####"
                      mask="_"
                      getInputRef={register({
                        required: true,
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
                    <label className="field-label" htmlFor={`ch_school_phone${counter - 1}`}>
                      <span className="required">*</span> School Phone
                    </label>
                  </div>
                  <ErrorMessage
                    field={errors["ch_school_phone" + (counter - 1)]}
                    errorType="required"
                    message="Phone is required"
                  />
                </div>
                <div className="form-group">
                  <div className="field select-field-wrapper">
                    <select
                      disabled={isReadonly}
                      name={"ch_school_state" + (counter - 1)}
                      className={
                        isReadonly &&
                        !isVendorView &&
                        pastChildInformation &&
                        (pastChildInformation.prev_school_state ||
                          pastChildInformation.prev_school_state == "") &&
                        pastChildInformation.prev_school_state != childGeneralInformation.prev_school_state
                          ? "field-input highlights"
                          : "field-input"
                      }
                      onChange={({ target }) => {
                        handleChildFormDetailsChange(
                          counter - 1,
                          "general_information",
                          "prev_school_state",
                          target.value
                        );
                      }}
                      readOnly={isReadonly}
                      defaultValue={childGeneralInformation.prev_school_state}
                      ref={register({ required: true })}>
                      <option value="">Select</option>
                      {STATES.map((opt, index) => (
                        <option key={index + 1} value={opt.abbreviation}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                    <label className="field-label">
                      <span className="required">*</span> State
                    </label>
                  </div>
                  <ErrorMessage
                    field={errors["ch_school_state" + (counter - 1)]}
                    errorType="required"
                    message="State is required"
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <div className="field">
                    <input
                      id={`ch_school_city${counter - 1}`}
                      name={"ch_school_city" + (counter - 1)}
                      className={
                        isReadonly &&
                        !isVendorView &&
                        pastChildInformation &&
                        (pastChildInformation.prev_school_city || pastChildInformation.prev_school_city == "") &&
                        pastChildInformation.prev_school_city != childGeneralInformation.prev_school_city ?
                        "field-input highlights" : "field-input"
                      }
                      onChange={({ target }) => {
                        handleChildFormDetailsChange(counter - 1, "general_information", "prev_school_city", target.value);
                      }}
                      placeholder="City"
                      ref={register({required: true})}
                      defaultValue={childGeneralInformation.prev_school_city}
                      readOnly={isReadonly}
                    />
                    <label className="field-label" htmlFor={`ch_school_city${counter - 1}`}>
                      <span className="required">*</span> City
                    </label>
                  </div>
                  <ErrorMessage
                    field={errors["ch_school_city" + (counter - 1)]}
                    errorType="required"
                    message="City is required"
                  />
                </div>
                <div className="form-group">
                  <div className="field">
                    <input
                      id={`ch_school_zip_code${counter - 1}`}
                      name={"ch_school_zip_code" + (counter - 1)}
                      className={
                        isReadonly &&
                        !isVendorView &&
                        pastChildInformation &&
                        (pastChildInformation.prev_school_zip_code || pastChildInformation.prev_school_zip_code == "") &&
                        pastChildInformation.prev_school_zip_code != childGeneralInformation.prev_school_zip_code ?
                        "field-input highlights" : "field-input"
                      }
                      onChange={({ target }) => {
                        if (target.value.match(/^-{0,1}\d+$/)) {
                          handleChildFormDetailsChange(counter - 1, "general_information", "prev_school_zip_code", target.value);
                        } else {
                          target.value = target.value.slice(0, -1);
                        }
                      }}
                      placeholder="Zip Code"
                      ref={register({ minLength: 5, required: true })}
                      defaultValue={childGeneralInformation.prev_school_zip_code}
                      readOnly={isReadonly}
                      maxLength="5"
                    />
                    <label className="field-label" htmlFor={`ch_school_zip_code${counter - 1}`}>
                      <span className="required">*</span> Zip Code
                    </label>
                  </div>
                  <ErrorMessage
                    field={errors["ch_school_zip_code" + (counter - 1)]}
                    errorType="required"
                    message="Zip Code is required"
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <div className="field">
                    <input
                      id={`ch_school_address${counter - 1}`}
                      name={"ch_school_address" + (counter - 1)}
                      className={
                        isReadonly &&
                        !isVendorView &&
                        pastChildInformation &&
                        (pastChildInformation.prev_school_address || pastChildInformation.prev_school_address == "") &&
                        pastChildInformation.prev_school_address != childGeneralInformation.prev_school_address ?
                        "field-input highlights" : "field-input"
                      }
                      onChange={({ target }) => {
                        handleChildFormDetailsChange(counter - 1, "general_information", "prev_school_address", target.value);
                      }}
                      placeholder="Address"
                      ref={register({required: true})}
                      defaultValue={childGeneralInformation.prev_school_address}
                      readOnly={isReadonly}
                    />
                    <label className="field-label" htmlFor={`ch_school_address${counter - 1}`}>
                      <span className="required">*</span> Address
                    </label>
                  </div>
                  <ErrorMessage
                    field={errors["ch_school_address" + (counter - 1)]}
                    errorType="required"
                    message="Address is required"
                  />
                </div>
              </div>
            </>
          )
        }

        <div className="agree-text">
          Does your child required additional physical / educational services 
        </div>
        <div className="form-group">

      
          <label  className={
              isReadonly &&
              !isVendorView &&
              pastChildInformation && childGeneralInformation.does_child_require_physical_education_service === "Yes" && 
              (pastChildInformation.does_child_require_physical_education_service || pastChildInformation.does_child_require_physical_education_service == "") &&
              pastChildInformation.does_child_require_physical_education_service != childGeneralInformation.does_child_require_physical_education_service ?
              "cus-select-container radio-highlights" : "cus-select-container"
              }>
            Yes 
            <input type="radio" 
              className="field-input"
              onChange={({ target }) => {
                handleChildFormDetailsChange(counter - 1, "general_information", "does_child_require_physical_education_service", "Yes");
              }} 
              value={"Yes"}
              checked={childGeneralInformation.does_child_require_physical_education_service == "Yes"}
              readOnly={isReadonly}
              disabled={isReadonly}
            />
            <span className="checkmark"></span>
          </label>
          <label  className={
              isReadonly &&
              !isVendorView &&
              pastChildInformation && childGeneralInformation.does_child_require_physical_education_service === "No" && 
              (pastChildInformation.does_child_require_physical_education_service || pastChildInformation.does_child_require_physical_education_service == "") &&
              pastChildInformation.does_child_require_physical_education_service != childGeneralInformation.does_child_require_physical_education_service ?
              "cus-select-container radio-highlights" : "cus-select-container"
              }>
            No
            <input type="radio" 
              onChange={({ target }) => {
                handleChildFormDetailsChange(counter - 1, "general_information", "does_child_require_physical_education_service", "No");
              }} 

           
              value={"No"}
              checked={childGeneralInformation.does_child_require_physical_education_service == "No"}
              readOnly={isReadonly}
              disabled={isReadonly}
            />
            <span className="checkmark"></span>
          </label>
        </div>

        <div className="agree-text">
          Are there currently any problems with your child either at home or at school? 
        </div>
        <div className="form-group">
          <label className={
              isReadonly &&
              !isVendorView &&
              pastChildInformation && (childGeneralInformation.has_suspended === "Yes" || childGeneralInformation.has_suspended === "1" ||  childGeneralInformation.has_suspended === true) && 
              (!pastChildInformation.has_suspended || pastChildInformation.has_suspended == false) &&
              pastChildInformation.has_suspended != childGeneralInformation.has_suspended ?
              "cus-select-container radio-highlights" : "cus-select-container"
            }>
            Yes 
            <input type="radio" 
              onChange={({ target }) => {
                handleChildFormDetailsChange(counter - 1, "general_information", "has_suspended", target.value);
              }} 
              value={"Yes"}
              checked={childGeneralInformation.has_suspended == "Yes" || childGeneralInformation.has_suspended == "1" || (typeof  childGeneralInformation.has_suspended === 'boolean' && childGeneralInformation.has_suspended  === true)}
              readOnly={isReadonly}
              disabled={isReadonly}
            />
            <span className="checkmark"></span>
          </label>
          <label className={
              isReadonly &&
              !isVendorView &&
              pastChildInformation &&  (childGeneralInformation.has_suspended === "No" || childGeneralInformation.has_suspended === "0" ||  childGeneralInformation.has_suspended === false) && 
              ( pastChildInformation.has_suspended ) &&
              pastChildInformation.has_suspended != childGeneralInformation.has_suspended ?
              "cus-select-container radio-highlights" : "cus-select-container"
            }>
            No
            <input type="radio" 
              onChange={({ target }) => {
                handleChildFormDetailsChange(counter - 1, "general_information", "has_suspended", target.value);
              }} 
              value={"No"}
              checked={childGeneralInformation.has_suspended+"" == "No" || childGeneralInformation.has_suspended == "0" ||  (typeof  childGeneralInformation.has_suspended === 'boolean' && childGeneralInformation.has_suspended  === false)}
              readOnly={isReadonly}
              disabled={isReadonly}
            />
            <span className="checkmark"></span>
          </label>
        </div>
        {
         (childGeneralInformation.has_suspended == "Yes" || childGeneralInformation.has_suspended == "1" || (typeof  childGeneralInformation.has_suspended === 'boolean' && childGeneralInformation.has_suspended  === true)) &&
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
        <div>
          <div className="form-group">
            <div>
              <label className="field-label-simple">
                1. Please list any history of significant previous diseases, including convulsions, heart trouble and diabetes.
              </label>
              <textarea 
                name={"history_prev_diseases" + (counter - 1)}
                className="form-control"
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastChildInformation &&
                  (pastChildInformation.history_prev_diseases || pastChildInformation.history_prev_diseases == "") &&
                  pastChildInformation.history_prev_diseases != childGeneralInformation.history_prev_diseases ?
                  "form-control highlights-textarea" : "form-control"
                }
                rows="4"
                ref={register()}
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "history_prev_diseases", target.value);
                }}
                defaultValue={childGeneralInformation.history_prev_diseases}
                readOnly={isReadonly}
              >
              </textarea>
            </div>
          </div>

          <div className="form-group">
            <div>
              <label className="field-label-simple">
                2. Is your child currently under doctors care? please list the reason(s) and any medication(s) your child may be taking on a regular basis, including dosage and possible side effects.
              </label>
              <textarea 
                name={"child_currently_doctors_care" + (counter - 1)}
                className="form-control"
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastChildInformation &&
                  (pastChildInformation.child_currently_doctors_care || pastChildInformation.child_currently_doctors_care == "") &&
                  pastChildInformation.child_currently_doctors_care != childGeneralInformation.child_currently_doctors_care ?
                  "form-control highlights-textarea" : "form-control"
                }
                rows="4"
                ref={register()}
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "child_currently_doctors_care", target.value);
                }}
                defaultValue={childGeneralInformation.child_currently_doctors_care}
                readOnly={isReadonly}
              >
              </textarea>
            </div>
          </div>

          <div className="form-group">
            <div>
              <label className="field-label-simple">
                3. Please list the date and reason(s) for any previous hospitalizations and/or surgeries.
              </label>
              <textarea 
                name={"reasons_previous_hospitalizations" + (counter - 1)}
                className="form-control"
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastChildInformation &&
                  (pastChildInformation.reasons_previous_hospitalizations || pastChildInformation.reasons_previous_hospitalizations == "") &&
                  pastChildInformation.reasons_previous_hospitalizations != childGeneralInformation.reasons_previous_hospitalizations ?
                  "form-control highlights-textarea" : "form-control"
                }
                rows="4"
                ref={register()}
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "reasons_previous_hospitalizations", target.value);
                }}
                defaultValue={childGeneralInformation.reasons_previous_hospitalizations}
                readOnly={isReadonly}
              >
              </textarea>
            </div>
          </div>

          <div className="form-group">
            <div>
              <label className="field-label-simple">
                4. Any comments or suggestions regarding your child that may help us, including special activities he/she may enjoy.
              </label>
              <textarea 
                name={"comments_suggestion" + (counter - 1)}
                className="form-control"
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastChildInformation &&
                  (pastChildInformation.comments_suggestion || pastChildInformation.comments_suggestion == "") &&
                  pastChildInformation.comments_suggestion != childGeneralInformation.comments_suggestion ?
                  "form-control highlights-textarea" : "form-control"
                }
                rows="4"
                ref={register()}
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "comments_suggestion", target.value);
                }}
                defaultValue={childGeneralInformation.comments_suggestion}
                readOnly={isReadonly}
              >
              </textarea>
            </div>
          </div>

          <div className="form-group">
            <div>
              <label className="field-label-simple">
                5. Please list any special dietary concerns.
              </label>
              <textarea 
                name={"list_special_dietary" + (counter - 1)}
                className="form-control"
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastChildInformation &&
                  (pastChildInformation.list_special_dietary || pastChildInformation.list_special_dietary == "") &&
                  pastChildInformation.list_special_dietary != childGeneralInformation.list_special_dietary ?
                  "form-control highlights-textarea" : "form-control"
                }
                rows="4"
                ref={register()}
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "list_special_dietary", target.value);
                }}
                defaultValue={childGeneralInformation.list_special_dietary}
                readOnly={isReadonly}
              >
              </textarea>
            </div>
          </div>

          <div className="form-group">
            <div>
              <label className="field-label-simple">
                6. Please list any allergies that your child may have (e.g. Food Insect Stings, Medicines, Etc.) and related medication. <span className="required">*</span>
              </label>
              <textarea 
                name={"list_any_allergies" + (counter - 1)}
                className="form-control"
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastChildInformation &&
                  (pastChildInformation.list_any_allergies || pastChildInformation.list_any_allergies == "") &&
                  pastChildInformation.list_any_allergies != childGeneralInformation.list_any_allergies ?
                  "form-control highlights-textarea" : "form-control"
                }
                rows="4"
                ref={register({ required: true })}
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "list_any_allergies", target.value);
                }}
                defaultValue={childGeneralInformation.list_any_allergies}
                readOnly={isReadonly}
              >
              </textarea>
              <ErrorMessage
                field={errors["list_any_allergies" + (counter - 1)]}
                errorType="required"
                message="Explain"
              />
            </div>
          </div>

          <div className="form-group">
            <div>
              <label className="field-label-simple">
                7. Does the child have any physical or mental disabilities? If so, please list.
              </label>
              <textarea 
                name={"mental_physical_disabilities" + (counter - 1)}
                className="form-control"
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastChildInformation &&
                  (pastChildInformation.mental_physical_disabilities || pastChildInformation.mental_physical_disabilities == "") &&
                  pastChildInformation.mental_physical_disabilities != childGeneralInformation.mental_physical_disabilities ?
                  "form-control highlights-textarea" : "form-control"
                }
                rows="4"
                ref={register()}
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "mental_physical_disabilities", target.value);
                }}
                defaultValue={childGeneralInformation.mental_physical_disabilities}
                readOnly={isReadonly}
              >
              </textarea>
            </div>
          </div>

          <div className="form-group">
            <div>
              <label className="field-label-simple">
                8. Is there a need for a medical action plan? If so, please describe.
              </label>
              <textarea 
                name={"medical_action_plan" + (counter - 1)}
                className="form-control"
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastChildInformation &&
                  (pastChildInformation.medical_action_plan || pastChildInformation.medical_action_plan == "") &&
                  pastChildInformation.medical_action_plan != childGeneralInformation.medical_action_plan ?
                  "form-control highlights-textarea" : "form-control"
                }
                rows="4"
                ref={register()}
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "medical_action_plan", target.value);
                }}
                defaultValue={childGeneralInformation.medical_action_plan}
                readOnly={isReadonly}
              >
              </textarea>
            </div>
          </div>

          <div className="form-group">
            <div>
              <label className="field-label-simple">
                9. List any particular fears or unique behavior characteristics the child has.
              </label>
              <textarea 
                name={"list_fears_unique_behavior" + (counter - 1)}
                className="form-control"
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastChildInformation &&
                  (pastChildInformation.list_fears_unique_behavior || pastChildInformation.list_fears_unique_behavior == "") &&
                  pastChildInformation.list_fears_unique_behavior != childGeneralInformation.list_fears_unique_behavior ?
                  "form-control highlights-textarea" : "form-control"
                }
                rows="4"
                ref={register()}
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "general_information", "list_fears_unique_behavior", target.value);
                }}
                defaultValue={childGeneralInformation.list_fears_unique_behavior}
                readOnly={isReadonly}
              >
              </textarea>
            </div>
          </div>

        </div>
      </div>
    </GeneralInformationFormStyled>
  )
}