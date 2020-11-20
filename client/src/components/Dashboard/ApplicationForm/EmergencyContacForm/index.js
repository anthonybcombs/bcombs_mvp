import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import NumberFormat from "react-number-format";
import { registerLocale } from "react-datepicker";

import ErrorMessage from "../../../../helpers/ErrorMessage";

import {
  OPTION_CUSTOM_RELATIONSHIPS,
  OPTION_MALE_RELATIONSHIPS,
  OPTION_FEMALE_RELATIONSHIPS
} from "../../../../constants/options";

const EmergencyContactFormStyled = styled.div`
  position: relative;

  #contacts {
    width: 100%;
    border-collapse: collapse;
    border: 0;
    margin-bottom: 20px;
    table-layout: auto;
  }

  #contacts th {
    background-color: #f26e21;
    color: white;
    font-weight: normal;
    font-size: 18px;
  }

  #contacts td,
  #contacts th {
    border: 0;
    padding: 10px;
    text-align: center;
    position: relative;
  }

  #contacts td {
    border-top: 1px solid #eaedf1;
    padding: 10px;
  }

  #contacts .select-field-wrapper:after {
    bottom: 10px;
  }

  #contacts .input-field {
    // width: 150px;
    text-align: start;
    font-size: 18px;
    border: 0;
    border-bottom: 1px solid #ccc;
    font-family: inherit;
    -webkit-appearance: none;
    -moz-appearance: none;
    border-radius: 0;
    cursor: text;
    padding: 5px 0;
    display: block;
    text-indent: 5px;
    margin: auto;
    margin-bottom: 10px;
  }

  #contacts select.input-field {
    width: 100%;
    min-width: 150px;
  }

  #contacts .required {
    left: 5px;
    top: 15px;
    position: absolute;
  }

  .error {
    margin: 0;
  }

  @media (max-width: 600px) {
    .emergency-contact-wrapper > div {
      padding: 0;
    }
  }

  @media print {
  }
`;

export default function index({
  handleParentFormDetailsChange,
  parentEmergencyContacts,
  isReadonly = false,
  register,
  errors,
  pastEmergencyContacts = [],
  isVendorView
}) {
  const GENDER_OPTIONS = [
    { id: 1, value: "Male", name: "Male" },
    { id: 2, value: "Female", name: "Female" }
  ];

  const CUSTOM_GENDER_OPTIONS = [
    { id: 1, value: "He", name: "He" },
    { id: 2, value: "She", name: "She" },
    { id: 3, value: "They", name: "They" }
  ];

  const RELATION_TO_CHILD_OPTIONS = [
    { id: 1, value: "Mother / Father", name: "Mother / Father" },
    { id: 2, value: "Grandparent", name: "Grandparent" },
    { id: 3, value: "Aunt / Uncle", name: "Aunt / Uncle" },
    { id: 4, value: "Sibling", name: "Sibling" },
    { id: 5, value: "Other", name: "Other" }
  ];

  const renderTableData = () => {
    let rows = [];

    for (let i = 0; i < 4; i++) {
      let row = (
        <tr key={i}>
          <td>
            {!isReadonly && i <= 1 && <span className="required">*</span>}
            <input
              name={"ec_firstname_" + i}
              className={
                isReadonly &&
                !isVendorView &&
                pastEmergencyContacts &&
                pastEmergencyContacts.length > 0 &&
                (pastEmergencyContacts[i].first_name || pastEmergencyContacts[i].first_name == "") &&
                pastEmergencyContacts[i].first_name != parentEmergencyContacts[i].first_name ?
                "field-input highlights" : "field-input"
              }
              onChange={({ target }) => {
                handleParentFormDetailsChange(
                  i,
                  "emergency_contacts",
                  "first_name",
                  target.value
                );
              }}
              defaultValue={parentEmergencyContacts[i].first_name}
              readOnly={isReadonly}
              ref={register({
                required: i <= 1
              })}
            />
            <ErrorMessage
              field={errors["ec_firstname_" + i]}
              errorType="required"
              message="First Name is required."
            />
          </td>
          <td>
            {!isReadonly && i <= 1 && <span className="required">*</span>}
            <input
              name={"ec_lastname_" + i}
              className={
                isReadonly &&
                !isVendorView &&
                pastEmergencyContacts &&
                pastEmergencyContacts.length > 0 &&
                (pastEmergencyContacts[i].last_name || pastEmergencyContacts[i].last_name == "") &&
                pastEmergencyContacts[i].last_name != parentEmergencyContacts[i].last_name ?
                "field-input highlights" : "field-input"
              }
              onChange={({ target }) => {
                handleParentFormDetailsChange(
                  i,
                  "emergency_contacts",
                  "last_name",
                  target.value
                );
              }}
              defaultValue={parentEmergencyContacts[i].last_name}
              readOnly={isReadonly}
              ref={register({
                required: i <= 1
              })}
            />
            <ErrorMessage
              field={errors["ec_lastname_" + i]}
              errorType="required"
              message="Last Name is required."
            />
          </td>
          <td>
            {!isReadonly && i <= 1 && <span className="required">*</span>}
            {!isReadonly ? (
              <div className="select-field-wrapper">
                <select
                  name={"ec_gender_" + i}
                  className="input-field"
                  onChange={({ target }) => {
                    handleParentFormDetailsChange(
                      i,
                      "emergency_contacts",
                      "gender",
                      target.value
                    );
                  }}
                  defaultValue={parentEmergencyContacts[i].gender}
                  ref={register({
                    required: i <= 1
                  })}>
                  <option value="">Select Type</option>
                  <optgroup label="Gender">
                    {GENDER_OPTIONS.map(opt => (
                      <option key={opt.id} value={opt.name}>
                        {opt.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Custom">
                    {CUSTOM_GENDER_OPTIONS.map(opt => (
                      <option key={opt.id} value={opt.name}>
                        {opt.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            ) : (
              <input
                type="text"
                name={"ec_gender_" + i}
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastEmergencyContacts &&
                  pastEmergencyContacts.length > 0 &&
                  (pastEmergencyContacts[i].gender || pastEmergencyContacts[i].gender == "") &&
                  pastEmergencyContacts[i].gender != parentEmergencyContacts[i].gender ?
                  "field-input highlights" : "field-input"
                }
                defaultValue={parentEmergencyContacts[i].gender}
                readOnly={isReadonly}
              />
            )}
            <ErrorMessage
              field={errors["ec_gender_" + i]}
              errorType="required"
              message="Gender is required."
            />
          </td>
          <td>
            {!isReadonly && i <= 1 && <span className="required">*</span>}
            {!isReadonly ? (
              <NumberFormat
                name={"mobile_phone_" + i}
                className="input-field"
                onChange={({ target }) => {
                  handleParentFormDetailsChange(
                    i,
                    "emergency_contacts",
                    "mobile_phone",
                    target.value
                  );
                }}
                defaultValue={parentEmergencyContacts[i].mobile_phone}
                format="(###) ###-####"
                mask="_"
                getInputRef={register({
                  required: i <= 1,
                  validate: {
                    completed: value => {
                      if (value) {
                        return value.match(/\d/g).length === 10;
                      } else {
                        return true;
                      }
                    }
                  }
                })}
              />
            ) : (
              <input
                name={"mobile_phone_" + i}
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastEmergencyContacts &&
                  pastEmergencyContacts.length > 0 &&
                  (pastEmergencyContacts[i].mobile_phone || pastEmergencyContacts[i].mobile_phone == "") &&
                  pastEmergencyContacts[i].mobile_phone != parentEmergencyContacts[i].mobile_phone ?
                  "field-input highlights" : "field-input"
                }
                onChange={({ target }) => {
                  handleParentFormDetailsChange(
                    i,
                    "emergency_contacts",
                    "mobile_phone",
                    target.value
                  );
                }}
                defaultValue={parentEmergencyContacts[i].mobile_phone}
                readOnly={isReadonly}
              />
            )}
            <ErrorMessage
              field={errors["mobile_phone_" + i]}
              errorType="required"
              message="Mobile is required."
            />
            <ErrorMessage
              field={errors["mobile_phone_" + i]}
              errorType="completed"
              message="Phone Number must be consist of 10 digits."
            />
          </td>
          <td>
          {/* {!isReadonly && i <= 1 && <span className="required">*</span>} */}
            {!isReadonly ? (
              <NumberFormat
                name={"work_phone_" + i}
                className="input-field"
                onChange={({ target }) => {
                  handleParentFormDetailsChange(
                    i,
                    "emergency_contacts",
                    "work_phone",
                    target.value
                  );
                }}
                defaultValue={parentEmergencyContacts[i].work_phone}
                format="(###) ###-####"
                mask="_"
                getInputRef={register({
                  //required: i <= 1,
                  validate: {
                    completed: value => {
                      if (value) {
                        return value.match(/\d/g).length === 10;
                      } else {
                        return true;
                      }
                    }
                  }
                })}
              />
            ) : (
              <input
                name={"work_phone_" + i}
                name={"mobile_phone_" + i}
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastEmergencyContacts &&
                  pastEmergencyContacts.length > 0 &&
                  (pastEmergencyContacts[i].work_phone || pastEmergencyContacts[i].work_phone == "") &&
                  pastEmergencyContacts[i].work_phone != parentEmergencyContacts[i].work_phone ?
                  "field-input highlights" : "field-input"
                }
                onChange={({ target }) => {
                  handleParentFormDetailsChange(
                    i,
                    "emergency_contacts",
                    "work_phone",
                    target.value
                  );
                }}
                defaultValue={parentEmergencyContacts[i].work_phone}
                readOnly={isReadonly}
              />
            )}
            {/* <ErrorMessage
              field={errors["work_phone_" + i]}
              errorType="required"
              message="Work phone no is required."
            /> */}
            <ErrorMessage
              field={errors["work_phone_" + i]}
              errorType="completed"
              message="Phone Number must be consist of 10 digits."
            />     
          </td>
          <td>
            {!isReadonly && i <= 1 && <span className="required">*</span>}
            {!isReadonly ? (
              <div className="select-field-wrapper">
                <select
                  name={"relationship_to_child_" + i}
                  className="input-field"
                  onChange={({ target }) => {
                    handleParentFormDetailsChange(
                      i,
                      "emergency_contacts",
                      "relationship_to_child",
                      target.value
                    );
                  }}
                  defaultValue={
                    parentEmergencyContacts[i].relationship_to_child
                  }
                  ref={register({
                    required: i <= 1
                  })}>
                  <option value="">Select Type</option>
                  {/* {RELATION_TO_CHILD_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.name}>
                      {opt.name}
                    </option>
                  ))} */}
                  {(parentEmergencyContacts[i].gender === "Female" ||
                    parentEmergencyContacts[i].gender === "She") &&
                    OPTION_FEMALE_RELATIONSHIPS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {" "}
                        {opt.label}
                      </option>
                    ))}

                  {(parentEmergencyContacts[i].gender === "Male" ||
                    parentEmergencyContacts[i].gender === "He") &&
                    OPTION_MALE_RELATIONSHIPS.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {" "}
                        {opt.label}
                      </option>
                    ))}

                  {(parentEmergencyContacts[i].gender === "Custom" ||
                    parentEmergencyContacts[i].gender === "They") &&
                    OPTION_CUSTOM_RELATIONSHIPS.map(opt => (
                      <option key={opt.key} value={opt.value}>
                        {" "}
                        {opt.label}
                      </option>
                    ))}
                </select>
              </div>
            ) : (
              <input
                name={"relationship_to_child_" + i}
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastEmergencyContacts &&
                  pastEmergencyContacts.length > 0 &&
                  (pastEmergencyContacts[i].relationship_to_child || pastEmergencyContacts[i].relationship_to_child == "") &&
                  pastEmergencyContacts[i].relationship_to_child != parentEmergencyContacts[i].relationship_to_child ?
                  "field-input highlights" : "field-input"
                }
                defaultValue={parentEmergencyContacts[i].relationship_to_child}
                readOnly={isReadonly}
              />
            )}
            <ErrorMessage
              field={errors["relationship_to_child_" + i]}
              errorType="required"
              message="Relationship to child is required."
            />
          </td>
        </tr>
      );

      rows.push(row);
    }
    return rows;
  };

  return (
    <EmergencyContactFormStyled>
      <h3 className="heading">Emergency Contact</h3>
      <div className="emergency-contact-wrapper">
        <div>
          <table id="contacts">
            <tbody>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Gender</th>
                <th>Mobile Phone #</th>
                <th>Work Phone #</th>
                <th>Relationship To Child</th>
              </tr>
              {renderTableData()}
            </tbody>
          </table>
        </div>
      </div>
    </EmergencyContactFormStyled>
  );
}
