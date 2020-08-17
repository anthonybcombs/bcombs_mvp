import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import ErrorMessage from "../../../../helpers/ErrorMessage";

const Section3FormStyled = styled.div`
  .waiver-wrapper .message {
    font-size: 18px;
    color: #2d2b2b;
    line-height: 1.6;
    margin-bottom: 20px;
    padding-left: 15px;
    padding-right: 15px;
    white-space: break-spaces;
  }

  .waiver-wrapper .grid {
    display: grid;
    grid-template-columns: 10% 41.3% 41.3%;
    grid-gap: 3.33333333%;
  }
`;

export default function index({
  handleWaiverFormDetailsChange,
  section3,
  pDate,
  register,
  errors,
  name,
  text,
  isReadonly
}) {

 
  return (
    <Section3FormStyled>
      <h3 className="heading">{name}</h3>
      <div className="waiver-wrapper">

        <p className="message">
          {text}
        </p>

        <div className="grid">
          <div>
            <label className="cus-checkbox-container">
              <input
                type="checkbox"
                name="section3_checkbox" 
                checked={section3.checked}
                onChange={() => {
                  handleWaiverFormDetailsChange("section3", "checked", !section3.checked)
                }} 
                ref={register({required: true})}
                disabled={isReadonly}
              />
              <span 
                style={{"borderColor": (errors.section3_checkbox) ? "red": "" }} 
                className="checkmark">  
              </span>
            </label>
          </div>
          <div>
            <div className="form-group">
              <div className="field">
                <input
                  id="section3_signature"
                  name="section3_signature"
                  className="field-input"
                  placeholder="Electronic Signature"
                  onChange={({ target }) => {
                    handleWaiverFormDetailsChange("section3", "signature", target.value)
                  }}
                  ref={register({required: true})}
                  readOnly={isReadonly}
                  defaultValue={section3.signature}
                />
                <label className="field-label" for="section3_signature"><span className="required">*</span> Electronic Signature</label>
              </div>
              <ErrorMessage
                field={errors.section3_signature}
                errorType="required"
                message="Signature is required."
              />
            </div>
          </div>
          <div>
            <div className="form-group">
              <div className="field">
                <input
                  name="terms_date"
                  className="field-input"
                  placeholder="Date"
                  readOnly
                  defaultValue={pDate}
                  readOnly={isReadonly}
                />
                <label className="field-label">Date</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section3FormStyled>
  )
}