import React, { useState } from "react";
import styled from "styled-components";

import GeneralInformationFormStyled from "../GeneralInformationForm";

import ProfileImg from "../../../../images/profile.png";
import DatePicker from 'react-datepicker';
import { Multiselect } from 'multiselect-react-dropdown';

import "react-datepicker/dist/react-datepicker.css";

import STATES from "../states.json";

const ChildInfomationFormStyled = styled.div`
  position: relative;

  .img-profile-wrapper {
    width: 17%;
    margin-bottom: 30px;
  }

  .child-info-wrapper .grid {
    display: grid;
    grid-template-columns: 31% 31% 31%;
    grid-gap: 3.33333333%;
  }

  #multiselectContainerReact .optionContainer li:hover,
  #multiselectContainerReact .optionContainer li.highlight {
    background: #f26e21;
  }

  #multiselectContainerReact div:first-child {
    border: 0;
    border-bottom: 2px solid #ccc;
    border-radius: 0
  }

  #multiselectContainerReact .searchBox {
    font-size: 18px;
    padding: 5px 0;
    margin: 0;
    margin-top: 2px;
  }

  #multiselectContainerReact .searchBox::placeholder {
    font-size:12px;
  }

  #multiselectContainerReact .chip {
    background: #f26e21;
  }
`;

export default function index() {

  const data = {};

  const hasSelectAll = false;

  const GENDER_OPTIONS = [
    { id: 1, value: "Male", name: "Male" },
    { id: 2, value: "Female", name: "Female" }
  ];

  const PHONE_OPTIONS = [
    { id: 1, value: "Cell", name: "Cell"},
    { id: 2, value: "Home", name: "Home"},
    { id: 3, value: "Work", name: "Work"}
  ];

  const ETHINICITY_OPTIONS = [
    { id: 1, name:"Asian", label:"Asian" },
    { id: 2, name:"Black or African American", label:"Black or African American" },
    { id: 3, name:"Hispanic or Latino", label:"AsiHispanic or Latinoan" },
    { id: 4, name:"Native American or American Indian", label:"Native American or American Indian" },
    { id: 5, name:"Native Hawaiian & Other Pacific Islander", label:"Native Hawaiian & Other Pacific Islander" },
    { id: 6, name:"White", label:"White" },
    { id: 7, name:"Other", label:"Other" },
    { id: 8, name:"Prefer not to answer", label:"Prefer not to answer" }
  ];

  const PROGRAMS_OPTIONS = [
    { id: 1, name:"Saturday Academy", label: "Satuday Academy" },
    { id: 2, name:"In school", label: "In school" },
  ];

  const LOCATION_SITE_OPTIONS = [
    { name: "Raleigh", value: "Raleigh" },
    { name: "Durham", value: "Durham" }
  ];

  const EMAIL_OPTIONS = [
    { id: 1, value: "Personal", name: "Personal"},
    { id: 2, value: "Work", name: "Work"}
  ];

  const [childBirthDate, setChildBirthDate] = useState();
  const [ethinicitySelected, setEthinicitySelected] = useState([]);
  const [schoolProgramSelected, setSchoolProgramSelected] = useState([]);

  return (
    <ChildInfomationFormStyled>
      <h3 className="heading">Child Information</h3>
      <div className="child-info-wrapper">
        <div className="img-profile-wrapper">
          <img src={ProfileImg} width="80" height="80" />
          <input type="file" name="file"/>
        </div>
        <div className="grid">
          <div className="form-group">
            <div className="field">
              <input
                name="firstname"
                className="field-input"
                value={data.firstname}
                placeholder="First Name"
              />
              <label className="field-label">First Name</label>
            </div>
          </div>
          <div className="form-group">
            <div className="field">
              <input
                name="lastname"
                className="field-input"
                value={data.firstname}
                placeholder="Last Name"
              />
              <label className="field-label">Last Name</label>
            </div>
          </div>
          <div className="form-group">
            <div className="field">
              <input
                name="nickname"
                className="field-input"
                value={data.nickname}
                placeholder="Nick Name"
              />
              <label className="field-label">Nick Name</label>
            </div>
          </div>
        </div>

        <div className="grid">
          <div className="form-group">
            <div className="field">
              <DatePicker 
                className="field-input" 
                placeholderText="mm/dd/yyyy"
                selected={childBirthDate}
                onChange={date => setChildBirthDate(date)}
              />
              <label className="field-label">Date of Birth</label>
            </div>
          </div>
          <div className="form-group">
            <div className="field">
              <select
                name="gender"
                className="field-input"
                value={data.selectedGender}>
                  <option value="">Select</option>
                {GENDER_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <label className="field-label">Gender</label>
            </div>
          </div>
          <div className="form-group">
            <div className="field">
              <Multiselect
                className="field-input"
                options={ETHINICITY_OPTIONS}
                hasSelectAll={hasSelectAll}
                onSelect={setEthinicitySelected}
                placeholder="Select all that apply"
                displayValue="name"
                closeIcon="cancel"
              />
              <label className="field-label">Ethinicity (select all choices that apply)</label>
            </div>
          </div>
        </div>

        <div className="grid">
          <div className="form-group">
            <div className="field">
              <select
                name="phonetype1"
                className="field-input"
                value={data.selectedPhoneType1}>
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
                name="phone1"
                className="field-input"
                value={data.phone}
                placeholder="Phone"
              />
              <label className="field-label">Phone</label>
            </div>
          </div>
        </div>

        <div className="grid">
          <div className="form-group">
            <div className="field">
              <select
                name="childemailtype1"
                className="field-input"
                value={data.selectedChildEmailType1}>
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
                name="childEmail1"
                className="field-input"
                value={data.childEmail1}
                placeholder="Email Address"
              />
              <label className="field-label">Email Address</label>
            </div>
          </div>
        </div>

        <div className="grid">
          <div className="form-group">
            <div className="field">
              <input
                name="address1"
                className="field-input"
                value={data.address1}
                placeholder="Address"
              />
              <label className="field-label">Address</label>
            </div>
          </div>
          <div className="form-group">
            <div className="field">
              <input
                name="city"
                className="field-input"
                value={data.city}
                placeholder="City"
              />
              <label className="field-label">City</label>
            </div>
          </div>
        </div>

        <div className="grid">
          <div className="form-group">
            <div className="field">
              <select
                name="state"
                className="field-input"
                value={data.state}>
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
                name="zipCode"
                className="field-input"
                value={data.city}
                placeholder="Zip Code"
                maxLength="5"
              />
              <label className="field-label">Zip Code</label>
            </div>
          </div>
        </div>

        <div className="grid">
          <div className="form-group">
            <div className="field">
              <select
                name="locationSite"
                className="field-input"
                value={data.locationSite}>
                  <option value="">Select</option>
                {LOCATION_SITE_OPTIONS.map((opt, index) => (
                  <option key={index + 1} value={opt.value}>
                    {opt.name}
                  </option>
                ))}
                </select>
              <label className="field-label">Location Site</label>
            </div>
          </div>
          <div className="form-group">
            <div className="field">
              <Multiselect
                  className="field-input"
                  options={PROGRAMS_OPTIONS}
                  hasSelectAll={hasSelectAll}
                  onSelect={setSchoolProgramSelected}
                  placeholder="Choose Multiple"
                  displayValue="name"
                  closeIcon="cancel"
                  id="programSelectInput"
              />
              <label className="field-label">Program (select all choices that apply)</label>
            </div>
          </div>
        </div>
      </div>
    </ChildInfomationFormStyled>
  )
}