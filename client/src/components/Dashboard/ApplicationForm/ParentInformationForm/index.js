import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faPlusCircle,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";

import ErrorMessage from "../../../../helpers/ErrorMessage";
import STATES from "../states.json";
import NumberFormat from "react-number-format";

const ParentInformationStyled = styled.div`
  position: relative;
  margin-top: 12px !important;
  .parent-info-wrapper {
    padding-bottom: 45px !important;
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

  .parent-info-wrapper .grid-4 {
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
    background: #d33125 !important;
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

  @media (max-width: 768px) {
    .parent-info-wrapper .grid-2 {
      grid-gap: 0;
      grid-template-columns: 100%;
    }
    #multiselectContainerReact {
      position: relative;
      top: 0;
    }
    .field-input:placeholder-shown + .field-label {
      max-width: calc(100% - 30%) !important;
    }
  }

  @media (max-width: 600px) {
    .parent-info-wrapper .grid-2,
    .parent-info-wrapper > div {
      padding: 0;
    }
  }
`;

export default function index({
  handleParentFormDetailsChange,
  parentProfile,
  counter,
  register,
  errors,
  isReadonly = false,
  isUpdate = false,
  ProfileImg,
  pastParentInformation = {},
  isVendorView
}) {
  let confirmed_passwords = [];

  const PHONE_OPTIONS = [
    { id: 1, value: "Cell", name: "Cell" },
    { id: 2, value: "Home", name: "Home" },
    { id: 3, value: "Work", name: "Work" }
  ];

  const EDUCATION_LEVEL_OPTIONS = [
    { id: 1, value: "Some High School", name: "Some High School" },
    { id: 2, value: "High School Graduate", name: "High School Graduate" },
    { id: 3, value: "Some College", name: "Some College" },
    { id: 4, value: "Associates Degree", name: "Associates Degree" },
    { id: 5, value: "Bachelors Degree", name: "Bachelors Degree" },
    { id: 6, value: "Masters Degree", name: "Masters Degree" },
    {
      id: 7,
      value: "Doctoral of Professional Degree",
      name: "Doctoral or Professional Degree"
    }
  ];

  const EMAIL_OPTIONS = [
    { id: 1, value: "Personal", name: "Personal" },
    { id: 2, value: "Work", name: "Work" }
  ];

  const IMPORTANCE_OPTIONS = [
    { id: 1, value: "Not Important", name: "Not Important" },
    { id: 2, value: "SomeWhat Important", name: "Somewhat Important" },
    { id: 3, value: "Important", name: "Important" },
    { id: 4, value: "Very Important", name: "Very Important" }
  ];

  const CHILD_LIVES_OPTION = [
    { id: 1, value: "Father" },
    { id: 2, value: "Mother" },
    { id: 3, value: "Brother" },
    { id: 4, value: "Sister" },
    { id: 5, value: "Uncle" },
    { id: 6, value: "Aunt" },
    { id: 7, value: "Cousin (Male)" },
    { id: 8, value: "Grandfather" },
    { id: 9, value: "Grandmother" },
    { id: 10, value: "Stepbrother" },
    { id: 11, value: "Stepsister" },
    { id: 12, value: "Stepfather" },
    { id: 13, value: "Stepmother" },
    { id: 14, value: "Stepson" },
    { id: 15, value: "Stepdaughter" },
    { id: 16, value: "Brother-in-law" },
    { id: 17, value: "Sister-in-law" },
    { id: 18, value: "Father-in-law" },
    { id: 19, value: "Mother-in-law" },
    { id: 20, value: "Family Friend" },
    { id: 21, value: "Other relatives" },
    { id: 22, value: "Others" }
  ];

  const [showAddress, setShowAddress] = useState(isReadonly ? true : false);

  const [yearLivedStatus, setYearLivedStatus] = useState();

  const handleShowAddress = () => {
    setShowAddress(!showAddress);
  };

  const handleYearLivedStatus = e => {
    setYearLivedStatus(e.target.value);
  };

  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const handleOtherPhone = () => {
    if (isReadonly) return;
    setShowPhone(!showPhone);
  };

  const handleOtherEmail = () => {
    if (isReadonly) return;
    setShowEmail(!showEmail);
  };

  return (
    <ParentInformationStyled>
      <h3 className="heading">
        Family Information {counter > 1 ? `(${counter})` : ""}
      </h3>
      <div className="parent-info-wrapper">
        {/* <div className="img-profile-wrapper">
          <img src={ProfileImg} width="80" height="80" />
          {!isReadonly && <input name={"ch_img" + (counter - 1)} type="file" />}
        </div> */}
        <div className="grid-2">
          <div className="form-group">
            <div className="field">
              <input
                id={`parent_firstname_${counter - 1}`}
                name={"parent_firstname" + (counter - 1)}
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastParentInformation && 
                  (pastParentInformation.firstname || pastParentInformation.firstname == "") &&
                  pastParentInformation.firstname != parentProfile.first_name ?
                  "field-input highlights" : "field-input"
                }
                placeholder="First Name"
                onChange={({ target }) => {
                  handleParentFormDetailsChange(
                    counter - 1,
                    "profile",
                    "first_name",
                    target.value
                  );
                }}
                ref={register({ required: true })}
                defaultValue={parentProfile?.first_name}
                readOnly={isReadonly}
              />
              <label
                className="field-label"
                for={`parent_firstname_${counter - 1}`}>
                <span className="required">*</span> First Name
              </label>
            </div>
            <ErrorMessage
              field={errors["parent_firstname" + (counter - 1)]}
              errorType="required"
              message="First Name is required."
            />
          </div>

          <div className="form-group">
            <div className="field">
              <input
                id={`parent_lastname+${counter - 1}`}
                name={"parent_lastname" + (counter - 1)}
                className={
                  isReadonly &&
                  pastParentInformation && 
                  !isVendorView &&
                  (pastParentInformation.lastname || pastParentInformation.lastname == "") &&
                  pastParentInformation.lastname != parentProfile.last_name ?
                  "field-input highlights" : "field-input"
                }
                placeholder="Last Name"
                onChange={({ target }) => {
                  handleParentFormDetailsChange(
                    counter - 1,
                    "profile",
                    "last_name",
                    target.value
                  );
                }}
                ref={register({ required: true })}
                defaultValue={parentProfile?.last_name}
                readOnly={isReadonly}
              />
              <label
                className="field-label"
                for={`parent_lastname+${counter - 1}`}>
                <span className="required">*</span> Last Name
              </label>
            </div>
            <ErrorMessage
              field={errors["parent_lastname" + (counter - 1)]}
              errorType="required"
              message="Last Name is required."
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <div className="field select-field-wrapper">
              {!isReadonly ? (
                <select
                  defaultValue={parentProfile?.phone_type}
                  name="parent_phonetype"
                  className="field-input"
                  onChange={({ target }) => {
                    handleParentFormDetailsChange(
                      counter - 1,
                      "profile",
                      "phone_type",
                      target.value
                    );
                  }}>
                  <option value="">Select Type</option>
                  {PHONE_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.name}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name="parent_phonetype"
                  className={
                    isReadonly &&
                    pastParentInformation && 
                    !isVendorView &&
                    (pastParentInformation.phone_type || pastParentInformation.phone_type == "") &&
                    pastParentInformation.phone_type != parentProfile.phone_type ?
                    "field-input highlights" : "field-input"
                  }
                  placeholder="Type"
                  defaultValue={parentProfile?.phone_type}
                  readOnly={isReadonly}
                />
              )}
              <label className="field-label">
                {!showPhone ? (
                  <span className="add" onClick={e => handleOtherPhone()}>
                    <FontAwesomeIcon size="lg" icon={faPlusCircle} />
                  </span>
                ) : (
                  <span className="remove" onClick={e => handleOtherPhone()}>
                    <FontAwesomeIcon size="lg" icon={faTimesCircle} />
                  </span>
                )}
                &nbsp; Type
              </label>
            </div>
          </div>

          <div className="form-group">
            <div className="field">
              {!isReadonly ? (
                <NumberFormat
                  id={`parent_phonenumber_${counter - 1}`}
                  name={"parent_phonenumber" + (counter - 1)}
                  className="field-input"
                  placeholder="Phone Number"
                  onChange={({ target }) => {
                    handleParentFormDetailsChange(
                      counter - 1,
                      "profile",
                      "phone_number",
                      target.value
                    );
                  }}
                  defaultValue={parentProfile?.phone_number}
                  format="(###) ###-####"
                  mask="_"
                  getInputRef={register({
                    required: true,
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
                  required
                />
              ) : (
                <input
                  id={`parent_phonenumber_${counter - 1}`}
                  defaultValue={parentProfile?.phone_number}
                  readOnly={isReadonly}
                  name={"parent_phonenumber" + (counter - 1)}
                  className={
                    isReadonly &&
                    pastParentInformation && 
                    !isVendorView &&
                    (pastParentInformation.phone_number || pastParentInformation.phone_number == "") &&
                    pastParentInformation.phone_number != parentProfile.phone_number ?
                    "field-input highlights" : "field-input"
                  }
                  placeholder="Phone Number"
                />
              )}
              <label
                className="field-label"
                for={`parent_phonenumber_${counter - 1}`}>
                <span className="required">*</span> Phone Number
              </label>
            </div>
            <ErrorMessage
              field={errors["parent_phonenumber" + (counter - 1)]}
              errorType="required"
              message="Phone Number is required."
            />
            <ErrorMessage
              field={errors["parent_phonenumber" + (counter - 1)]}
              errorType="completed"
              message="Phone Number must be consist of 10 digits."
            />
          </div>
        </div>

        {showPhone && (
          <div className="grid-2">
            <div className="form-group">
              <div className="field select-field-wrapper">
                {!isReadonly ? (
                  <select
                    defaultValue={parentProfile?.phone_type}
                    name="parent_phonetype2"
                    className="field-input"
                    onChange={({ target }) => {
                      handleParentFormDetailsChange(
                        counter - 1,
                        "profile",
                        "phone_type2",
                        target.value
                      );
                    }}>
                    <option value="">Select Type</option>
                    {PHONE_OPTIONS.map(opt => (
                      <option key={opt.id} value={opt.name}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    name="parent_phonetype"
                    className={
                      isReadonly &&
                      pastParentInformation && 
                      !isVendorView &&
                      (pastParentInformation.phone_type2 || pastParentInformation.phone_type2 == "") &&
                      pastParentInformation.phone_type2 != parentProfile.phone_type2 ?
                      "field-input highlights" : "field-input"
                    }
                    placeholder="Type"
                    defaultValue={parentProfile?.phone_type2}
                    readOnly={isReadonly}
                  />
                )}
                <label className="field-label">Type</label>
              </div>
            </div>

            <div className="form-group">
              <div className="field">
                {!isReadonly ? (
                  <NumberFormat
                    id={`parent_phonenumber2_${counter - 1}`}
                    name={"parent_phonenumber2" + (counter - 1)}
                    className="field-input"
                    placeholder="Phone Number"
                    onChange={({ target }) => {
                      handleParentFormDetailsChange(
                        counter - 1,
                        "profile",
                        "phone_number2",
                        target.value
                      );
                    }}
                    defaultValue={parentProfile?.phone_number2}
                    format="(###) ###-####"
                    mask="_"
                    getInputRef={register({
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
                    id={`parent_phonenumber2_${counter - 1}`}
                    defaultValue={parentProfile?.phone_number2}
                    readOnly={isReadonly}
                    name={"parent_phonenumber2" + (counter - 1)}
                    className={
                      isReadonly &&
                      pastParentInformation && 
                      !isVendorView &&
                      (pastParentInformation.phone_number2 || pastParentInformation.phone_number2 == "") &&
                      pastParentInformation.phone_number2 != parentProfile.phone_number2 ?
                      "field-input highlights" : "field-input"
                    }
                    placeholder="Phone Number"
                  />
                )}
                <label
                  className="field-label"
                  for={`parent_phonenumber2_${counter - 1}`}>
                  Phone Number
                </label>
              </div>
              <ErrorMessage
                field={errors["parent_phonenumber2" + (counter - 1)]}
                errorType="completed"
                message="Phone Number must be consist of 10 digits."
              />
            </div>
          </div>
        )}
        <div className="grid-2">
          <div className="form-group">
            <div className="field select-field-wrapper">
              {!isReadonly ? (
                <select
                  defaultValue={parentProfile?.email_type}
                  name="parent_emailtype"
                  className="field-input"
                  onChange={({ target }) => {
                    handleParentFormDetailsChange(
                      counter - 1,
                      "profile",
                      "email_type",
                      target.value
                    );
                  }}>
                  <option value="">Select Type</option>
                  {EMAIL_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.name}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  defaultValue={parentProfile?.email_type}
                  readOnly={isReadonly}
                  name="parent_emailtype"
                  className={
                    isReadonly &&
                    pastParentInformation && 
                    !isVendorView &&
                    (pastParentInformation.email_type || pastParentInformation.email_type == "") &&
                    pastParentInformation.email_type != parentProfile.email_type ?
                    "field-input highlights" : "field-input"
                  }
                  placeholder="Type"
                  type="text"
                />
              )}
              <label className="field-label">
                {!showEmail ? (
                  <span className="add" onClick={e => handleOtherEmail()}>
                    <FontAwesomeIcon size="lg" icon={faPlusCircle} />
                  </span>
                ) : (
                  <span className="remove" onClick={e => handleOtherEmail()}>
                    <FontAwesomeIcon size="lg" icon={faTimesCircle} />
                  </span>
                )}
                &nbsp; Type
              </label>
            </div>
          </div>

          <div className="form-group">
            <div className="field">
              <input
                type="text"
                id={`parent_emailaddress_${counter - 1}`}
                defaultValue={parentProfile.email_address}
                defaultValue={parentProfile?.email_address}
                readOnly={isReadonly}
                name={"parent_emailaddress" + (counter - 1)}
                className={
                  isReadonly &&
                  pastParentInformation && 
                  !isVendorView &&
                  (pastParentInformation.email_address || pastParentInformation.email_address == "") &&
                  pastParentInformation.email_address != parentProfile.email_address ?
                  "field-input highlights" : "field-input"
                }
                placeholder="Email Address"
                onChange={({ target }) => {
                  handleParentFormDetailsChange(
                    counter - 1,
                    "profile",
                    "email_address",
                    target.value
                  );
                }}
                ref={register({
                  required: true,
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
              <label
                className="field-label"
                for={`parent_emailaddress_${counter - 1}`}>
                <span className="required">*</span> Email Address
              </label>
            </div>
            <ErrorMessage
              field={errors["parent_emailaddress" + (counter - 1)]}
              errorType="required"
              message="Email Address is required."
            />
            <ErrorMessage
              field={errors["parent_emailaddress" + (counter - 1)]}
              errorType="pattern"
              message="Invalid email address"
            />
          </div>
        </div>
        {showEmail && (
          <div className="grid-2">
            <div className="form-group">
              <div className="field select-field-wrapper">
                {!isReadonly ? (
                  <select
                    defaultValue={parentProfile?.email_type2}
                    name="parent_emailtype2"
                    className="field-input"
                    onChange={({ target }) => {
                      handleParentFormDetailsChange(
                        counter - 1,
                        "profile",
                        "email_type2",
                        target.value
                      );
                    }}>
                    <option value="">Select Type</option>
                    {EMAIL_OPTIONS.map(opt => (
                      <option key={opt.id} value={opt.name}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    defaultValue={parentProfile?.email_type2}
                    readOnly={isReadonly}
                    name="parent_emailtype"
                    className={
                      isReadonly &&
                      pastParentInformation && 
                      !isVendorView &&
                      (pastParentInformation.email_type2 || pastParentInformation.email_type2 == "") &&
                      pastParentInformation.email_type2 != parentProfile.email_type2 ?
                      "field-input highlights" : "field-input"
                    }
                    placeholder="Type"
                    type="text"
                  />
                )}
                <label className="field-label">Type</label>
              </div>
            </div>

            <div className="form-group">
              <div className="field">
                <input
                  type="text"
                  id={`parent_emailaddress2_${counter - 1}`}
                  defaultValue={parentProfile?.email_address2}
                  readOnly={isReadonly}
                  name={"parent_emailaddress2" + (counter - 1)}
                  className={
                    isReadonly &&
                    pastParentInformation && 
                    !isVendorView &&
                    (pastParentInformation.email_address2 || pastParentInformation.email_address2 == "") &&
                    pastParentInformation.email_address2 != parentProfile.email_address2 ?
                    "field-input highlights" : "field-input"
                  }
                  placeholder="Email Address"
                  onChange={({ target }) => {
                    handleParentFormDetailsChange(
                      counter - 1,
                      "profile",
                      "email_address2",
                      target.value
                    );
                  }}
                  ref={register({
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
                <label
                  className="field-label"
                  for={`parent_emailaddress2_${counter - 1}`}>
                  {" "}
                  Email Address
                </label>
              </div>
              <ErrorMessage
                field={errors["parent_emailaddress2" + (counter - 1)]}
                errorType="pattern"
                message="Invalid email address"
              />
            </div>
          </div>
        )}

        {!isUpdate && (
          <div className="grid-2">
            <div className="form-group">
              <div className="field">
                <input
                  type="password"
                  id={`password_${counter - 1}`}
                  name={"parent_password" + (counter - 1)}
                  className="field-input"
                  placeholder="Password"
                  autoComplete="new-password"
                  onChange={({ target }) => {
                    handleParentFormDetailsChange(
                      counter - 1,
                      "profile",
                      "password",
                      target.value
                    );
                  }}
                  ref={register({
                    required: true,
                    minLength: 8,
                    validate: {
                      containsOneUpperCase: value => {
                        const oneUpperCaseRegex = /(?=.*[A-Z])/;
                        return oneUpperCaseRegex.test(value);
                      },
                      containsOneLowerCase: value => {
                        const oneLowerCaseRegex = /(?=.*[a-z])/;
                        return oneLowerCaseRegex.test(value);
                      },
                      containsOneNumber: value => {
                        const oneNumberRegex = /(?=.*\d)/;
                        return oneNumberRegex.test(value);
                      },
                      containsOneSpecialCharacter: value => {
                        const oneSpecialCharacterRegex = /(?=.*[@#$%^&+=!])/;
                        return oneSpecialCharacterRegex.test(value);
                      }
                    }
                  })}
                />
                <label className="field-label" for={`password_${counter - 1}`}>
                  <span className="required">*</span> Password
                </label>
              </div>
              <ErrorMessage
                field={errors["parent_password" + (counter - 1)]}
                errorType="required"
                message={
                  <>
                    <p className="error error-size">
                      Password is required.
                      <br />
                      Password minimum length must be at least 8 characters.{" "}
                      <br />
                      Must contain atleast one upper case.
                      <br />
                      Must contain atleast one lower case.
                      <br />
                      Must contain atleast one number.
                      <br />
                      Must contain atleast one special character.
                      <br />
                    </p>
                  </>
                }
              />
            </div>

            <div className="form-group">
              <div className="field">
                <input
                  type="password"
                  id={`parent_confirmed_paswword_${counter - 1}`}
                  name={`parent_confirmed_paswword${counter - 1}`}
                  className="field-input"
                  placeholder="Confirmed Password"
                  autoComplete="new-password"
                  onChange={({ target }) => {
                    handleParentFormDetailsChange(
                      counter - 1,
                      "profile",
                      "confirmed_password",
                      target.value
                    );
                  }}
                  ref={register({
                    required: true,
                    minLength: 8,
                    validate: {
                      sameConfirmPassword: value => {
                        confirmed_passwords[counter - 1] =
                          parentProfile.password;
                        return value === confirmed_passwords[counter - 1];
                      }
                    }
                  })}
                />
                <label
                  className="field-label"
                  for={`parent_confirmed_paswword_${counter - 1}`}>
                  <span className="required">*</span> Confirmed Password
                </label>
              </div>
              <ErrorMessage
                field={errors[`parent_confirmed_paswword${counter - 1}`]}
                errorType="required"
                message="Confirm password is required."
              />
              <ErrorMessage
                field={errors[`parent_confirmed_paswword${counter - 1}`]}
                errorType="minLength"
                message="Confirm password minimum length must be at least 8 characters."
              />
              <ErrorMessage
                field={errors[`parent_confirmed_paswword${counter - 1}`]}
                errorType="sameConfirmPassword"
                message="The passwords do not match."
              />
            </div>
          </div>
        )}

        {!isReadonly && (
          <div className="address-wrapper">
            <div className="add-address">
              <span
                onClick={() => {
                  handleShowAddress();
                }}>
                <i className={showAddress ? "minus" : ""}>
                  {showAddress && <FontAwesomeIcon icon={faMinus} />}
                  {!showAddress && <FontAwesomeIcon icon={faPlus} />}
                </i>
              </span>
              <p>Add Address (If different from Child)</p>
            </div>
          </div>
        )}

        <div
          className={
            showAddress
              ? "grid-2 address-field-wrapper show"
              : "grid-2 address-field-wrapper"
          }>
          <div className="form-group">
            <div className="field">
              <input
                name="parentAddress"
                className={
                  isReadonly &&
                  pastParentInformation && 
                  !isVendorView &&
                  (pastParentInformation.address || pastParentInformation.address == "") &&
                  pastParentInformation.address != parentProfile.address ?
                  "field-input highlights" : "field-input"
                }
                placeholder="Address"
                id={`parentAddress_${counter - 1}`}
                onChange={({ target }) => {
                  handleParentFormDetailsChange(
                    counter - 1,
                    "profile",
                    "address",
                    target.value
                  );
                }}
                readOnly={isReadonly}
                defaultValue={parentProfile?.address}
              />
              <label
                className="field-label"
                for={`parentAddress_${counter - 1}`}>
                Address
              </label>
            </div>
          </div>

          <div className="form-group">
            <div className="field">
              <input
                name="parentCity"
                className={
                  isReadonly &&
                  pastParentInformation && 
                  !isVendorView &&
                  (pastParentInformation.city || pastParentInformation.city == "") &&
                  pastParentInformation.city != parentProfile.city ?
                  "field-input highlights" : "field-input"
                }
                placeholder="City"
                id={`parentCity_${counter - 1}`}
                onChange={({ target }) => {
                  handleParentFormDetailsChange(
                    counter - 1,
                    "profile",
                    "city",
                    target.value
                  );
                }}
                readOnly={isReadonly}
                defaultValue={parentProfile?.city}
              />
              <label className="field-label" for={`parentCity_${counter - 1}`}>
                City
              </label>
            </div>
          </div>
        </div>

        <div
          className={
            showAddress
              ? "grid-2 address-field-wrapper show"
              : "grid-2 address-field-wrapper"
          }>
          <div className="form-group">
            <div className="field select-field-wrapper">
              {!isReadonly ? (
                <select
                  name="parentstate"
                  className="field-input"
                  onChange={({ target }) => {
                    handleParentFormDetailsChange(
                      counter - 1,
                      "profile",
                      "state",
                      target.value
                    );
                  }}
                  defaultValue={parentProfile?.state}>
                  <option value="">Select</option>
                  {STATES.map((opt, index) => (
                    <option key={index + 1} value={opt.abbreviation}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className={
                    isReadonly &&
                    pastParentInformation && 
                    !isVendorView &&
                    (pastParentInformation.state || pastParentInformation.state == "") &&
                    pastParentInformation.state != parentProfile.state ?
                    "field-input highlights" : "field-input"
                  }
                  defaultValue={parentProfile?.state}
                  readOnly={isReadonly}
                  placeholder="State"
                  name="parentstate"
                />
              )}

              <label className="field-label">State</label>
            </div>
          </div>
          <div className="form-group">
            <div className="field">
              <input
                name="parentzipcode"
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastParentInformation && 
                  (pastParentInformation.zip_code || pastParentInformation.zip_code == "") &&
                  pastParentInformation.zip_code != parentProfile.zip_code ?
                  "field-input highlights" : "field-input"
                }
                placeholder="Zip Code"
                id={`parentzipcode_${counter - 1}`}
                onChange={({ target }) => {
                  handleParentFormDetailsChange(
                    counter - 1,
                    "profile",
                    "zip_code",
                    target.value
                  );
                }}
                ref={register({ maxLength: 5 })}
                readOnly={isReadonly}
                defaultValue={parentProfile?.zip_code}
              />
              <label
                className="field-label"
                for={`parentzipcode_${counter - 1}`}>
                Zip Code
              </label>
            </div>
          </div>
        </div>

        <div className="grid-2">
          <div className="form-group">
            <div className="field">
              <input
                name="parentoccupation"
                className={
                  isReadonly &&
                  pastParentInformation && 
                  (pastParentInformation.occupation || pastParentInformation.occupation == "") &&
                  pastParentInformation.occupation != parentProfile.occupation ?
                  "field-input highlights" : "field-input"
                }
                placeholder="Occupation"
                id={`parentoccupation_${counter - 1}`}
                onChange={({ target }) => {
                  handleParentFormDetailsChange(
                    counter - 1,
                    "profile",
                    "occupation",
                    target.value
                  );
                }}
                readOnly={isReadonly}
                defaultValue={parentProfile?.occupation}
              />
              <label
                className="field-label"
                for={`parentoccupation_${counter - 1}`}>
                Occupation
              </label>
            </div>
          </div>

          <div className="form-group">
            <div className="field">
              <input
                name="parentemployer"
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastParentInformation && 
                  (pastParentInformation.employers_name || pastParentInformation.employers_name == "") &&
                  pastParentInformation.employers_name != parentProfile.employer_name ?
                  "field-input highlights" : "field-input"
                }
                placeholder="Employer's Name"
                id={`parentemployer_${counter - 1}`}
                onChange={({ target }) => {
                  handleParentFormDetailsChange(
                    counter - 1,
                    "profile",
                    "employer_name",
                    target.value
                  );
                }}
                readOnly={isReadonly}
                defaultValue={parentProfile?.employer_name}
              />
              <label
                className="field-label"
                for={`parentemployer_${counter - 1}`}>
                Employer's Name
              </label>
            </div>
          </div>
        </div>

        <div>
          <div className="form-group">
            <div>
              <label className="field-label-simple">
                <span className="required">*</span> What are some of your
                expectations from the Mentoring Program?
              </label>
              <textarea
                name={`parent_goals${counter - 1}`}
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastParentInformation && 
                  (pastParentInformation.parent_goals || pastParentInformation.parent_goals == "") &&
                  pastParentInformation.parent_goals != parentProfile.goals_parent_program ?
                  "form-control highlights-textarea" : "form-control"
                }
                rows="4"
                placeholder="Explain"
                onChange={({ target }) => {
                  handleParentFormDetailsChange(
                    counter - 1,
                    "profile",
                    "goals_parent_program",
                    target.value
                  );
                }}
                ref={register({ required: true })}
                readOnly={isReadonly}
                defaultValue={parentProfile?.goals_parent_program}></textarea>
            </div>
            <ErrorMessage
              field={errors["parent_goals" + (counter - 1)]}
              errorType="required"
              message="Reason is required."
            />
          </div>
        </div>

        <div>
          <div className="form-group">
            <div>
              <label className="field-label-simple">
                <span className="required">*</span> Why are you referring your
                child to the program?
              </label>
              <textarea
                name={`parent_child_goals${counter - 1}`}
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastParentInformation && 
                  (pastParentInformation.parent_child_goals || pastParentInformation.parent_child_goals == "") &&
                  pastParentInformation.parent_child_goals != parentProfile.goals_child_program ?
                  "form-control highlights-textarea" : "form-control"
                }
                rows="4"
                placeholder="Explain"
                onChange={({ target }) => {
                  handleParentFormDetailsChange(
                    counter - 1,
                    "profile",
                    "goals_child_program",
                    target.value
                  );
                }}
                ref={register({ required: true })}
                readOnly={isReadonly}
                defaultValue={parentProfile?.goals_child_program}></textarea>
            </div>
            <ErrorMessage
              field={errors["parent_child_goals" + (counter - 1)]}
              errorType="required"
              message="Reason is required."
            />
          </div>
        </div>

        <div className="agree-text">How long have you lived in this area?</div>

        <div className="form-group">
          <label className="cus-select-container">
            1 - 5 Years
            <input
              type="radio"
              onChange={({ target }) => {
                handleParentFormDetailsChange(
                  counter - 1,
                  "profile",
                  "live_area",
                  target.value
                );
              }}
              value="1"
              checked={parentProfile?.live_area == 1}
              readOnly={isReadonly}
            />
            <span className="checkmark"></span>
          </label>
          <label className="cus-select-container">
            5 - 10 Years
            <input
              type="radio"
              onChange={({ target }) => {
                handleParentFormDetailsChange(
                  counter - 1,
                  "profile",
                  "live_area",
                  target.value
                );
              }}
              value="2"
              checked={parentProfile?.live_area == 2}
            />
            <span className="checkmark"></span>
          </label>
          <label className="cus-select-container">
            More than 10 Years
            <input
              type="radio"
              onChange={({ target }) => {
                handleParentFormDetailsChange(
                  counter - 1,
                  "profile",
                  "live_area",
                  target.value
                );
              }}
              value="3"
              checked={parentProfile?.live_area == 3}
              readOnly={isReadonly}
            />
            <span className="checkmark"></span>
          </label>
        </div>

        <div className="agree-text">
          What is your highest level of education?
        </div>

        <div>
          <div className="form-group">
            <div className="field select-field-wrapper">
              {!isReadonly ? (
                <select
                  defaultValue={parentProfile?.level_education}
                  name="parent_educationlevel"
                  className={
                    isReadonly &&
                    !isVendorView &&
                    pastParentInformation && 
                    (pastParentInformation.level_of_education || pastParentInformation.level_of_education == "") &&
                    pastParentInformation.level_of_education != parentProfile.level_education ?
                    "field-input highlights" : "field-input"
                  }
                  onChange={({ target }) => {
                    handleParentFormDetailsChange(
                      counter - 1,
                      "profile",
                      "level_education",
                      target.value
                    );
                  }}>
                  <option value="">Select Type</option>
                  {EDUCATION_LEVEL_OPTIONS.map((opt, index) => (
                    <option key={index + 1} value={opt.name}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name="parent_educationlevel"
                  className={
                    isReadonly &&
                    !isVendorView &&
                    pastParentInformation && 
                    (pastParentInformation.level_of_education || pastParentInformation.level_of_education == "") &&
                    pastParentInformation.level_of_education != parentProfile.level_education ?
                    "field-input highlights" : "field-input"
                  }
                  defaultValue={parentProfile?.level_education}
                  readOnly={isReadonly}
                  placeholder="level of education"
                  type="text"
                />
              )}
            </div>
          </div>
        </div>

        <div className="agree-text">
          How important is it to you that your child graduates from high school?
        </div>

        <div>
          <div className="form-group">
            <div className="field select-field-wrapper">
              {!isReadonly ? (
                <select
                  defaultValue={parentProfile?.child_importance_hs}
                  name="child_importance_hs"
                  className={
                    isReadonly &&
                    !isVendorView &&
                    pastParentInformation && 
                    (pastParentInformation.child_hs_grad || pastParentInformation.child_hs_grad == "") &&
                    pastParentInformation.child_hs_grad != parentProfile.child_importance_hs ?
                    "field-input highlights" : "field-input"
                  }
                  onChange={({ target }) => {
                    handleParentFormDetailsChange(
                      counter - 1,
                      "profile",
                      "child_importance_hs",
                      target.value
                    );
                  }}>
                  <option value="">Select Type</option>
                  {IMPORTANCE_OPTIONS.map((opt, index) => (
                    <option key={index + 1} value={opt.name}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name="child_importance_hs"
                  className={
                    isReadonly &&
                    !isVendorView &&
                    pastParentInformation && 
                    (pastParentInformation.child_hs_grad || pastParentInformation.child_hs_grad == "") &&
                    pastParentInformation.child_hs_grad != parentProfile.child_importance_hs ?
                    "field-input highlights" : "field-input"
                  }
                  defaultValue={parentProfile?.child_importance_hs}
                  readOnly={isReadonly}
                  placeholder="Explain"
                />
              )}
            </div>
          </div>
        </div>

        <div className="agree-text">
          How important is it to you that your child attends college?
        </div>

        <div>
          <div className="form-group">
            <div className="field select-field-wrapper">
              {!isReadonly ? (
                <select
                  name="childattendscollege"
                  className="field-input"
                  onChange={({ target }) => {
                    handleParentFormDetailsChange(
                      counter - 1,
                      "profile",
                      "child_importance_col",
                      target.value
                    );
                  }}
                  defaultValue={parentProfile?.child_importance_col}>
                  <option value="">Select Type</option>
                  {IMPORTANCE_OPTIONS.map((opt, index) => (
                    <option key={index + 1} value={opt.name}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className={
                    isReadonly &&
                    !isVendorView &&
                    pastParentInformation && 
                    (pastParentInformation.child_col_grad || pastParentInformation.child_col_grad == "") &&
                    pastParentInformation.child_col_grad != parentProfile.child_importance_col ?
                    "field-input highlights" : "field-input"
                  }
                  defaultValue={parentProfile?.child_importance_col}
                  readOnly={isReadonly}
                  placeholder="Explain"
                />
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="form-group">
            <div>
              <label
                className="field-label-simple"
                for={`parent_person_recommend_${counter - 1}`}>
                <span className="required">*</span> How did you find us?
              </label>
              <input
                readOnly={isReadonly}
                id={`parent_person_recommend_${counter - 1}`}
                name={"parent_person_recommend" + (counter - 1)}
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastParentInformation && 
                  (pastParentInformation.person_recommend || pastParentInformation.person_recommend == "") &&
                  pastParentInformation.person_recommend != parentProfile.person_recommend ?
                  "field-input highlights" : "field-input"
                }
                onChange={({ target }) => {
                  if (target.value === "Others") {
                    console.log("Show Text box");
                  } else {
                    handleParentFormDetailsChange(
                      counter - 1,
                      "profile",
                      "person_recommend",
                      target.value
                    );
                  }
                }}
                ref={register({ required: true })}
                defaultValue={parentProfile?.person_recommend}
              />
            </div>
            <ErrorMessage
              field={errors["parent_person_recommend" + (counter - 1)]}
              errorType="required"
              message="This field is required"
            />
          </div>
        </div>
      </div>
    </ParentInformationStyled>
  );
}
