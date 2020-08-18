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

`;

export default function index({
  childEmergencyCare,
  handleChildFormDetailsChange,
  counter,
  register,
  errors,
  isReadonly = false
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
                id="ch_doctorname"
                name="ch_doctorname"
                className="field-input"
                onChange={({ target }) => {
                  handleChildFormDetailsChange((counter - 1), "emergency_care_information", "doctor_name", target.value)
                }}
                placeholder="Doctor Name"
                defaultValue={childEmergencyCare.doctor_name}
                readOnly={isReadonly}
              />
              <label className="field-label">Doctor Name</label>
            </div>
          </div>

          <div className="form-group">
            <div className="field">
              {
                !isReadonly ?
                <NumberFormat 
                  id="doctophone"
                  name="doctophone"
                  className="field-input"
                  placeholder="Phone"
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
                  id="doctophone"
                  name="doctophone"
                  className="field-input"
                  placeholder="Phone"
                  defaultValue={childEmergencyCare.doctor_phone}
                  placeholder="Phone"
                  readOnly={isReadonly}
                />
              }

              <label className="field-label">Phone</label>
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
                id="hospitalname"
                name="hospitalname"
                className="field-input"
                placeholder="Hospital Preference"
                onChange={({ target }) => {
                  handleChildFormDetailsChange((counter - 1), "emergency_care_information", "hospital_preference", target.value)
                }}
                defaultValue={childEmergencyCare.hospital_preference}
                placeholder="Hospital Preference"
                readOnly={isReadonly}
              />
              <label className="field-label">Hospital Preference</label>
            </div>
          </div>

          <div className="form-group">
            <div className="field">
              {
                !isReadonly ?
                <NumberFormat 
                  id="hospitalPhone"
                  name="hospitalPhone"
                  className="field-input"
                  placeholder="Phone"
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
                  id="hospitalPhone"
                  name="hospitalPhone"
                  className="field-input"
                  placeholder="Phone"
                  defaultValue={childEmergencyCare.hospital_phone}
                  placeholder="Phone"
                  readOnly={isReadonly}
                />
              }
              <label className="field-label">Phone</label>
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