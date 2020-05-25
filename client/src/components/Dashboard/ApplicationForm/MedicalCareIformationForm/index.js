import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import NumberFormat from 'react-number-format';

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
                  name="doctophone"
                  className="field-input"
                  placeholder="Phone"
                  onChange={({ target }) => {
                    handleChildFormDetailsChange((counter - 1), "emergency_care_information", "doctor_phone", target.value)
                  }}
                  defaultValue={childEmergencyCare.doctor_phone}
                  placeholder="Phone"
                  format="(###) ###-####" mask="_"
                />
                :
                <input
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
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <div className="field">
              <input
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
                  name="hospitalPhone"
                  className="field-input"
                  placeholder="Phone"
                  onChange={({ target }) => {
                    handleChildFormDetailsChange((counter - 1), "emergency_care_information", "hospital_phone", target.value)
                  }}
                  defaultValue={childEmergencyCare.phone}
                  placeholder="Phone"
                  format="(###) ###-####" mask="_"
                />
                :
                <input
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
          </div>
        </div>
      </div>
    </MedicalCareInfoStyled>
  )
}