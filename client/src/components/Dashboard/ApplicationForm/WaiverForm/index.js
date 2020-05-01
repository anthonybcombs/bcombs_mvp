import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

const WaiverFormStyled = styled.div`
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
      value: "I hereby acknowledge and consent to allow the Triangle East chapter of the 100 black man of america, inc. through my child's involvement with the youth enhancement academy ad a program provided by the aforementioned youth advocacy group to use photographs taken during working sessions to be used at the discretion of the triangle East chapter of the 100 black man of america. inc."
    }, {
      value: "I acknowledge these photographs will be used for, but not limited to, the purpose of the publications for the Triangle East chapter of the 100 black man of america's youth enhancement academy."
    }, {
      value: "I acknowledge that these picture taken during these sessions and any other activity sponsered by, or in conjuction with the Triangle East chapter of the 100 black man of america's youth enhancement academy may be used to the Triangle East chapter of the 100 black man of america, inc."
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
    <WaiverFormStyled>
      <h3 className="heading">Waiver</h3>
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
    </WaiverFormStyled>
  )
}