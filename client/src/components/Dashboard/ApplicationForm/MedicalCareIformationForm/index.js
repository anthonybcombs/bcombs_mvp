import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

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

export default function index() {

  const data = {};

  return (
    <MedicalCareInfoStyled>
      <h3 className="heading">Emergency Medical Care Information</h3>
      <div className="medical-info-wrapper">

        <div className="grid-2">
          <div className="form-group">
            <div className="field">
              <input
                name="doctorname"
                className="field-input"
                value={data.doctorName}
                placeholder="Doctor Name"
              />
              <label className="field-label">Doctor Name</label>
            </div>
          </div>

          <div className="form-group">
            <div className="field">
              <input
                name="doctophone"
                className="field-input"
                value={data.doctorPhone}
                placeholder="Phone"
              />
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
                value={data.hospitalName}
                placeholder="Doctor Name"
              />
              <label className="field-label">Hospital Name</label>
            </div>
          </div>

          <div className="form-group">
            <div className="field">
              <input
                name="hospitalPhone"
                className="field-input"
                value={data.hospitalPhone}
                placeholder="Phone"
              />
              <label className="field-label">Phone</label>
            </div>
          </div>
        </div>
      </div>
    </MedicalCareInfoStyled>
  )
}