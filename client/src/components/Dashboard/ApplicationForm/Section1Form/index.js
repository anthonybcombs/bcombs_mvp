import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import ErrorMessage from "../../../../helpers/ErrorMessage";

const Section1FormStyled = styled.div`
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

  @media (max-width: 768px) {
    .waiver-wrapper .grid {
      grid-gap: 0;
      grid-template-columns: 100%;
    }
    .cus-checkbox-container .checkmark {
      top: -32px;
    }
   .field-input:placeholder-shown + .field-label {
      max-width: calc(100% - 30%) !important;
    }
  }
  @media (max-width: 600px) {
    .waiver-wrapper .grid,
    .waiver-wrapper > div {
      padding: 0;
    }
  }
`;

export default function index({
  handleWaiverFormDetailsChange,
  section1,
  pDate,
  register,
  errors,
  name,
  text,
  isReadonly = false,
  emptyFields = {}
}) {

  console.log('section1 2222222',section1)
  return (
    <Section1FormStyled>
      <h3 className="heading">{name}</h3>
      <div className="waiver-wrapper">

        <p className="message">
          {text}
        </p>

        <div className="grid">
          <div>
            <label className="cus-checkbox-container">
              <input
                className={`${emptyFields?.section_1_checked && 'highlights'} `}
                name="section1_checkbox"
                type="checkbox"
                checked={section1.checked}
                onChange={({ target }) => {
                  handleWaiverFormDetailsChange("section1", "checked", !section1.checked)
                }}
                ref={register({ required: !isReadonly ? true : false })}
               // disabled={isReadonly}
              />
              <span
                style={{ "borderColor": (errors.section1_checkbox || emptyFields?.section_2_checked) ? "red" : "" }}
                className="checkmark">
              </span>
            </label>
          </div>
          <div>
            <div className="form-group">
              <div className="field">
                <input
                  id="section1_signature"
                  name="section1_signature"
                  className={`field-input ${emptyFields?.section_1_signature && !isReadonly && 'highlights'} `}
                  placeholder="Electronic Signature"
                  onChange={({ target }) => {
                    handleWaiverFormDetailsChange("section1", "signature", target.value)
                  }}
                  ref={register({ required: !isReadonly ? true : false })}
                  value={section1?.signature}
                  // disabled={isReadonly}
                />
                <label className="field-label" htmlFor="section1_signature"><span className="required">*</span> Electronic Signature</label>
              </div>
              <ErrorMessage
                field={errors.section1_signature}
                errorType="required"
                message="Signature is required."
              />
            </div>
          </div>
          <div>
            <div className="form-group">
              <div className="field">
                <input
                  name="waiver_date"
                  className="field-input"
                  placeholder="Date"
                  readOnly
                  onChange={() => { }}
                  value={pDate}
                />
                <label className="field-label">Date</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section1FormStyled>
  )
}