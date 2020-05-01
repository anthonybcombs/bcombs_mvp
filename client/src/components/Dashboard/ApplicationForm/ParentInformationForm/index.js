import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus
} from "@fortawesome/free-solid-svg-icons";

import ProfileImg from "../../../../images/profile.png";

import STATES from "../states.json";

const ParentInformationStyled = styled.div`
  position: relative;

  .parent-info-wrapper {
    padding-bottom: 30px !important;
  }

  .parent-info-wrapper .grid-1 {
    display: grid;
    grid-template-columns: 31% 31% 31%;
    grid-gap: 3.33333333%;
  }

  .parent-info-wrapper .grid-2 {
    display: grid;
    grid-template-columns: 48.33% 48.33%;
    grid-gap: 3.33333333%;
  }

  .parent-info-wrapper .grid-3 {
    display: grid;
    grid-template-columns: 31% 65.3%;
    grid-gap: 3.33333333%;
  }

  .parent-info-wrapper  .grid-4 {
    display: grid;
    grid-template-columns: 31% 31% 31%;
    grid-gap: 3.33333333%;
  }

  .parent-info-wrapper .img-profile-wrapper {
    width: 17%;
    margin-bottom: 30px;
  }

  .parent-info-wrapper .address-wrapper {
    padding: 0;
    padding-right: 15px;
    user-select: none;
  }

  .parent-info-wrapper .add-address {
    margin-left: 15px;
    border: 2px solid #f26e21;
    position: relative;
    padding: 10px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .parent-info-wrapper .add-address span i {
    background: #f26e21;
    width: 20px;
    height: 20px;
    line-height: 21px;
    text-align: center;
    border-radius: 50%;
    font-size: 13px;
    position: absolute;
    left: -10px;
    top: 12px;
    font-weight: normal;
    color: white;
    cursor: pointer;
  }

  .parent-info-wrapper .add-address span i.minus {
    background: #D33125 !important;
  }

  .parent-info-wrapper .add-address p {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    padding-left: 15px;
    color: #4b525a;
  }

  .parent-info-wrapper .address-field-wrapper {
    opacity: 0;
    visibility: hidden;
    display: none;

    -webkit-transition: opacity 100ms, visibility 100ms;
    transition: opacity 100ms, visibility 100ms;
  }

  .parent-info-wrapper .address-field-wrapper.show {
    visibility: visible;
    opacity: 1;
    display: grid;
  }
`;

export default function index() {

  const data = {};

  const PHONE_OPTIONS = [
    { id: 1, value: "Cell", name: "Cell"},
    { id: 2, value: "Home", name: "Home"},
    { id: 3, value: "Work", name: "Work"}
  ];

  const EDUCATION_LEVEL_OPTIONS = [
    { id: 1, value: "Some High School", name: "Some High School"},
    { id: 2, value: "High School Graduate", name: "High School Graduate"},
    { id: 3, value: "Some College", name: "Some College"},
    { id: 4, value: "Associates Degree", name: "Associates Degree"},
    { id: 5, value: "Bachelors Degree", name: "Bachelors Degree"},
    { id: 6, value: "Masters Degree", name: "Masters Degree"},
    { id: 7, value: "Doctoral of Professional Degree", name: "Doctoral or Professional Degree"}
  ];

  const EMAIL_OPTIONS = [
    { id: 1, value: "Personal", name: "Personal"},
    { id: 2, value: "Work", name: "Work"}
  ]

  const IMPORTANCE_OPTIONS = [
    {id: 1, value: "Not Important", name: "Not Important"},
    {id: 2, value: "SomeWhat Important", name: "Somewhat Important"},
    {id: 3, value: "Important", name: "Important"},
    {id: 4, value: "Very Important", name: "Very Important"},
  ]

  const [showAddress, setShowAddress] = useState(false);

  const [yearLivedStatus, setYearLivedStatus] = useState();

  const handleShowAddress = () => {
    setShowAddress(!showAddress);
  }

  const handleYearLivedStatus = (e) => {
    setYearLivedStatus(e.target.value);
  }

  return (
    <ParentInformationStyled>
      <h3 className="heading">Family Information</h3>
      <div className="parent-info-wrapper">
        <div className="img-profile-wrapper">
          <img src={ProfileImg} width="80" height="80" />
          <input type="file" name="file"/>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <div className="field">
              <input
                name="parentFirstname"
                className="field-input"
                value={data.parentFirstName}
                placeholder="First Name"
              />
              <label className="field-label">First Name</label>
            </div>
          </div>

          <div className="form-group">
            <div className="field">
              <input
                name="parentLastname"
                className="field-input"
                value={data.parentLastname}
                placeholder="Last Name"
              />
              <label className="field-label">Last Name</label>
            </div>
          </div>
        </div>

        <div className="grid-1">
          <div className="form-group">
            <div className="field">
              <select
                name="parentphonetype1"
                className="field-input"
                value={data.selectedParentPhoneType1}>
                  <option value="" >Select Type</option>
                {PHONE_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <label className="field-label">Type</label>
            </div>
          </div>

          <div className="form-group">
            <div className="field">
              <input
                name="parentPhone1"
                className="field-input"
                value={data.parentPhone1}
                placeholder="Phone Number"
              />
              <label className="field-label">Phone Number</label>
            </div>
          </div>
        </div>

        <div className="grid-1">
          <div className="form-group">
            <div className="field">
              <select
                name="parentemailtype1"
                className="field-input"
                value={data.selectedParentEmailType1}>
                  <option value="" >Select Type</option>
                {EMAIL_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <label className="field-label">Select Type</label>
            </div>
          </div>

          <div className="form-group">
            <div className="field">
              <input
                name="parentEmail1"
                className="field-input"
                value={data.parentEmail1}
                placeholder="Email Address"
              />
              <label className="field-label">Email Address</label>
            </div>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <div className="field">
              <input
                type="password"
                name="paswword"
                className="field-input"
                value={data.password}
                placeholder="Password"
                autoComplete="new-password"
              />
              <label className="field-label">Password</label>
            </div>
          </div>

          <div className="form-group">
            <div className="field">
              <input
                type="password"
                name="paswword"
                className="field-input"
                value={data.confirmedPasswordd}
                placeholder="Confirmed Password"
                autoComplete="new-password"
              />
              <label className="field-label">Confirmed Password</label>
            </div>
          </div>
        </div>

        <div className="address-wrapper">
          <div className="add-address">
            <span onClick={() => { handleShowAddress(); }}>
              <i className={showAddress ? "minus": "" }>
                {
                  showAddress && 
                  <FontAwesomeIcon icon={faMinus} />
                }
                {
                  !showAddress && 
                  <FontAwesomeIcon icon={faPlus} />
                }
              </i>
            </span>
            <p>
              Add Address (If different from Child)
            </p>
          </div>
        </div>

        <div className={showAddress ? "grid-2 address-field-wrapper show": "grid-2 address-field-wrapper"}>
          <div className="form-group">
            <div className="field">
              <input
                name="parentAddress"
                className="field-input"
                value={data.parentAddress}
                placeholder="Address"
              />
              <label className="field-label">Address</label>
            </div>
          </div>

          <div className="form-group">
            <div className="field">
              <input
                name="parentCity"
                className="field-input"
                value={data.parentCity}
                placeholder="City"
              />
              <label className="field-label">City</label>
            </div>
          </div>
        </div>

        <div className={showAddress ? "grid-2 address-field-wrapper show": "grid-2 address-field-wrapper"}>
          <div className="form-group">
            <div className="field">
              <select
                name="parentstate"
                className="field-input"
                value={data.parentState}>
                {STATES.map((opt, index) => (
                  <option key={index + 1} value={opt.abbreviation}>
                    {opt.name}
                  </option>
                ))}
                </select>
              <label className="field-label">State</label>
            </div>
          </div>
          <div className="form-group">
            <div className="field">
              <input
                name="parentzipcode"
                className="field-input"
                value={data.parentZipCode}
                placeholder="Zip Code"
                maxLength="5"
              />
              <label className="field-label">Zip Code</label>
            </div>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <div className="field">
              <input
                name="parentoccupation"
                className="field-input"
                value={data.parentOccupation}
                placeholder="Occupation"
              />
              <label className="field-label">Occupation</label>
            </div>
          </div>

          <div className="form-group">
            <div className="field">
              <input
                name="parentemployer"
                className="field-input"
                value={data.parentEmployer}
                placeholder="Employer's Name"
              />
              <label className="field-label">Employer's Name</label>
            </div>
          </div>
        </div>

        <div>
          <div className="form-group">
            <label className="field-label-simple">
              What are your goals for our program?
            </label>
            <textarea 
              className="form-control"
              rows="4"
              placeholder="Explain">
            </textarea>
          </div>
        </div>

        <div>
          <div className="form-group">
            <label className="field-label-simple">
              What goals do you have for your child in our program?
            </label>
            <textarea 
              className="form-control"
              rows="4"
              placeholder="Explain">
            </textarea>
          </div>
        </div>

        <div className="agree-text">
          How long have you live in this area?
        </div>

        <div className="form-group">
          <label className="cus-select-container">
            1 - 5 Year
            <input type="radio" onChange={handleYearLivedStatus} value="1" checked={yearLivedStatus == 1}/>
            <span className="checkmark"></span>
          </label>
          <label className="cus-select-container">
            5 - 10 Year
            <input type="radio" onChange={handleYearLivedStatus} value="2" checked={yearLivedStatus == 2}/>
            <span className="checkmark"></span>
          </label>
          <label className="cus-select-container">
            More than 10 Year
            <input type="radio" onChange={handleYearLivedStatus} value="3" checked={yearLivedStatus == 3}/>
            <span className="checkmark"></span>
          </label>
        </div>

        <div className="agree-text">
          What is your highest level of education?
        </div>

        <div>
          <div className="form-group">
            <div className="field">
              <select
                name="parenteducationlevel"
                className="field-input"
                value={data.parentEducationLevel}>
                  <option value="">Select Type</option>
                {EDUCATION_LEVEL_OPTIONS.map((opt, index) => (
                  <option key={index + 1} value={opt.abbreviation}>
                    {opt.name}
                  </option>
                ))}
                </select>
            </div>
          </div>
        </div>

        <div className="agree-text">
          How important is it to you that your child graduates from high school?
        </div>

        <div>
          <div className="form-group">
            <div className="field">
              <select
                name="childgradimportance"
                className="field-input"
                value={data.childsGradImportance}>
                  <option value="">Select Type</option>
                {IMPORTANCE_OPTIONS.map((opt, index) => (
                  <option key={index + 1} value={opt.abbreviation}>
                    {opt.name}
                  </option>
                ))}
                </select>
            </div>
          </div>
        </div>

        <div className="agree-text">
          How important is it to you that your child attends college?
        </div>

        <div>
          <div className="form-group">
            <div className="field">
              <select
                name="childattendscollege"
                className="field-input"
                value={data.childAttendsColImportance}>
                  <option value="">Select Type</option>
                {IMPORTANCE_OPTIONS.map((opt, index) => (
                  <option key={index + 1} value={opt.abbreviation}>
                    {opt.name}
                  </option>
                ))}
                </select>
            </div>
          </div>
        </div>

      </div>
    </ParentInformationStyled>
  )
}