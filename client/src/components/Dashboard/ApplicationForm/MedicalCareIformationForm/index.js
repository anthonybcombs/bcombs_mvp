import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import NumberFormat from 'react-number-format';
import ErrorMessage from "../../../../helpers/ErrorMessage";

const MedicalCareInfoStyled = styled.div`
  position: relative;

  .medical-info-wrapper {
    padding-bottom: 30px !important;
  }

  .medical-info-wrapper .grid-2 {
    display: grid;
    grid-template-columns: 48.33% 48.33%;
    grid-gap: 3.33333333%;
  }

  @media (max-width: 768px) {
    .medical-info-wrapper .grid-2 {
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
    .medical-info-wrapper .grid-2 {
      padding: 0;
    }
  }
`;

export default function index({
  childEmergencyCare,
  handleChildFormDetailsChange,
  counter,
  register,
  errors,
  isReadonly = false,
  pastChildInformation = {},
  isVendorView
}) {

  const data = {};

  return (
    <MedicalCareInfoStyled>
      <h3 className="heading">Emergency Medical Care Information</h3>
      <div className="medical-info-wrapper">

        <div className="grid-2">
          <div className="form-group">
            <div className="field">
              <input
                name="ch_doctorname"
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastChildInformation &&
                  (pastChildInformation.doctor_name || pastChildInformation.doctor_name == "") &&
                  pastChildInformation.doctor_name != childEmergencyCare.doctor_name ?
                  "field-input highlights" : "field-input"
                }
                id={`ch_doctorname_${counter - 1}`}
                onChange={({ target }) => {
                  handleChildFormDetailsChange((counter - 1), "emergency_care_information", "doctor_name", target.value)
                }}
                placeholder="Doctor Name"
                defaultValue={childEmergencyCare.doctor_name}
                readOnly={isReadonly}
              />
              <label className="field-label" for={`ch_doctorname_${counter - 1}`}>Doctor Name</label>
            </div>
          </div>

          <div className="form-group">
            <div className="field">
              {
                !isReadonly ?
                <NumberFormat 
                  name="doctophone"
                  className="field-input"
                  placeholder="Phone"
                  id={`doctophone_${counter - 1}`}
                  onChange={({ target }) => {
                    handleChildFormDetailsChange((counter - 1), "emergency_care_information", "doctor_phone", target.value)
                  }}
                  defaultValue={childEmergencyCare.doctor_phone}
                  placeholder="Phone"
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
                :
                <input
                  name="doctophone"
                  className={
                    isReadonly &&
                    !isVendorView &&
                    pastChildInformation &&
                    (pastChildInformation.doctor_phone || pastChildInformation.doctor_phone == "") &&
                    pastChildInformation.doctor_phone != childEmergencyCare.doctor_phone ?
                    "field-input highlights" : "field-input"
                  }
                  placeholder="Phone"
                  id={`doctophone_${counter - 1}`}
                  defaultValue={childEmergencyCare.doctor_phone}
                  placeholder="Phone"
                  readOnly={isReadonly}
                />
              }

              <label className="field-label" for={`doctophone_${counter - 1}`}>Phone</label>
            </div>
            <ErrorMessage
              field={errors["doctophone"]}
              errorType="completed"
              message="Phone Number must be consist of 10 digits."
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <div className="field">
              <input
                name="hospitalname"
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastChildInformation &&
                  (pastChildInformation.hospital_preference || pastChildInformation.hospital_preference == "") &&
                  pastChildInformation.hospital_preference != childEmergencyCare.hospital_preference ?
                  "field-input highlights" : "field-input"
                }
                id={`hospitalname_${counter - 1}`}
                placeholder="Hospital Preference"
                onChange={({ target }) => {
                  handleChildFormDetailsChange((counter - 1), "emergency_care_information", "hospital_preference", target.value)
                }}
                defaultValue={childEmergencyCare.hospital_preference}
                placeholder="Hospital Preference"
                readOnly={isReadonly}
              />
              <label className="field-label" for={`hospitalname_${counter - 1}`}>Hospital Preference</label>
            </div>
          </div>

          <div className="form-group">
            <div className="field">
              {
                !isReadonly ?
                <NumberFormat 
                  name="hospitalPhone"
                  className="field-input"
                  placeholder="Phone"
                  id={`hospitalPhone_${counter - 1}`}
                  onChange={({ target }) => {
                    handleChildFormDetailsChange((counter - 1), "emergency_care_information", "hospital_phone", target.value)
                  }}
                  defaultValue={childEmergencyCare.hospital_phone}
                  placeholder="Phone"
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
                :
                <input
                  name="hospitalPhone"
                  className={
                    isReadonly &&
                    !isVendorView &&
                    pastChildInformation &&
                    (pastChildInformation.hospital_phone || pastChildInformation.hospital_phone == "") &&
                    pastChildInformation.hospital_phone != childEmergencyCare.hospital_phone ?
                    "field-input highlights" : "field-input"
                  }
                  placeholder="Phone"
                  id={`hospitalPhone_${counter - 1}`}
                  defaultValue={childEmergencyCare.hospital_phone}
                  placeholder="Phone"
                  readOnly={isReadonly}
                />
              }
              <label className="field-label" for={`hospitalPhone_${counter - 1}`}>Phone</label>
            </div>
            <ErrorMessage
              field={errors["hospitalPhone"]}
              errorType="completed"
              message="Phone Number must be consist of 10 digits."
            />
          </div>
        </div>
      </div>
    </MedicalCareInfoStyled>
  )
}