import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

const LiabilityWaiverStyled = styled.div`
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
      value: "100 black man of america, inc. does not carry an accident insurance policy to help cover the cost of accidential injuries to any child on a 100 black man of america, inc. sponsered trip or event. i certify that i am the parent or legal guardian of the child named above. i have read the above statements regarding accident insurance and/ or liability coverage on 100 black man of america, inc. or its representative to seek, authorize and grand consent to any qualified health care personal to provide all necessary or appropriate medical treatment to the child for any illness or injury. 100 black man of america, inc. and its representative and released from any and all claims and causes of action that may arise out of such action."
    }, {
      value: "It is the purpose of this agreement to exempt, waive and relieve 100 black man of america, inc. from liability for personal injury, property damage, and/or wrongful death caused bt the negligence, if any, of 100 black man of america, inc. its agents members of assigness. i acknowledge that i have read the above agreement and have not relied upon any other representative made by 100 black man of america, inc., its agree, members and assigness."
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
    <LiabilityWaiverStyled>
      <h3 className="heading">Liability Waiver</h3>
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
    </LiabilityWaiverStyled>
  )
}