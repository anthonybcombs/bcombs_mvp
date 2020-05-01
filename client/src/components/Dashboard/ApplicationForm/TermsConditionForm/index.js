import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

const TermsConditionsFormStyled = styled.div`
  .waiver-wrapper p {
    font-size: 18px;
    color: #2d2b2b;
    line-height: 1.6;
    margin-bottom: 20px;
    padding-left: 15px;
    padding-right: 15px;
  }

  .waiver-wrapper .grid {
    display: grid;
    grid-template-columns: 10% 41.3% 41.3%;
    grid-gap: 3.33333333%;
  }
`;

export default function index() {

  const data = {};
  const [waiverStatus, setWaiverStatus] = useState(false)

  const handleWaiverStatus = (e) => {
    setWaiverStatus(e.target.checked);

    console.log(waiverStatus);
    console.log(e.target.checked);
  }

  const waiverWordings = [{
      value: "I, as the parent/guardian, authorize the center to obtain medical attentionfor my child in an emergency."
    }, {
      value: "I, as the Operator, do agree to provide transportaion to an appropriate medical re-source in the event of emergency situation, other children in the facility will be supervised by a responsible adult. i will from the  physician or the child's parent, guardian, or full time custodian."
    }
  ]
  
  const getCurrentDate = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    return today;
  }
  return (
    <TermsConditionsFormStyled>
      <h3 className="heading">Terms & Conditions</h3>
      <div className="waiver-wrapper">

        {waiverWordings.map((opt, index) => (
            <p key={index}>{opt.value}</p>
        ))}

        <div className="grid">
          <div>
            <label className="cus-checkbox-container">
              <input
                type="checkbox" 
                checked={waiverStatus}
                onChange={handleWaiverStatus} 
              />
              <span className="checkmark"></span>
            </label>
          </div>
          <div>
            <div className="form-group">
              <div className="field">
                <input
                  name="waiversignature"
                  className="field-input"
                  value={data.waiverSignature}
                  placeholder="Electronic Signature"
                />
                <label className="field-label">Electronic Signature</label>
              </div>
            </div>
          </div>
          <div>
            <div className="form-group">
              <div className="field">
                <input
                  name="waiversignature"
                  className="field-input"
                  value={data.waiverSignature}
                  placeholder="Electronic Signature"
                  readOnly
                  value={getCurrentDate()}
                />
                <label className="field-label">Date</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TermsConditionsFormStyled>
  )
}