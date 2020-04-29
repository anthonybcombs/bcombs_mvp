import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import styled, { ThemeContext } from "styled-components";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addHours, addMinutes, addSeconds, toDate, format } from "date-fns";

import ErrorMessage from "../../../../helpers/ErrorMessage";

const EditProfileModal = styled.form`
  input:required {
    box-shadow: none;
  }
  input:invalid {
    box-shadow: none;
  }
  input[type="checkbox"] {
    display: inline-block;
    width: initial;
    vertical-align: middle;
    margin: 0 10px 0 0 !important;
  }
  input {
    background: none;
    width: 100%;
    color: black;
    font-size: ${({ theme }) => theme.input.fontSize} !important;
    display: block;
    border: none;
    border-radius: 1;
    border: none;
    outline: 0;
    border-bottom: 2px solid lightgrey;
    margin-top: 2.5em;
    margin-bottom: 2.5em;
  }
  input:focus {
    border-color: ${({ theme }) => theme.input.focus.border.color};
    transition: 3s;
  }
  select {
    font-size: ${({ theme }) => theme.input.fontSize};
    display: block;
    width: 50% !important;
    border: none;
    margin: 2.5em auto 2.5em auto;
  }
  button {
    color: ${({ theme }) => theme.button.textColor.primary};
    font-size: ${({ theme }) => theme.button.fontSize} !important;
    background-color: lightgrey;
    border: none;
    box-shadow: 0px 3px 6px #908e8e;
    border-radius: ${({ theme }) => theme.button.borderRadius} !important;
  }
  button[type="submit"] {
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    padding: 10px;
    display: block;
    margin: 10px auto;
    width: 100%;
    border: none;
    margin-top: 15em;
  }
  .modal-content {
    width: 30%;
  }
  @media (min-width: 600px) {
    button[type="submit"] {
      width: ${({ theme }) => theme.button.width.primary};
    }
    input,
    p.error {
      width: 50%;
      margin: 2.5em auto 2.5em auto;
    }
    div {
      width: 50%;
      margin: 2.5em auto 2.5em auto;
    }
  }
`;

export default function index({
  isVisible = true,
  toggleProfileVisible,
  data,
  onSubmit,
  handleInputChange
}) {
  const theme = useContext(ThemeContext);
  const [currentUserData, setCurrentUserData] = useState(null);
  const { handleSubmit, errors } = useForm();
  const { register } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });
  const dispatch = useDispatch();
  const formattedDateOfBirth = new Date(data.dateofbirth);
  // let month = "" + (formattedDateOfBirth.getMonth() + 1),
  //   day = "" + formattedDateOfBirth.getDate(),
  //   year = formattedDateOfBirth.getFullYear();


  if (!isVisible) {
    return <></>;
  }

  return ReactDOM.createPortal(
    <EditProfileModal
      data-testid="app-dashboard-my-events-new-event"
      className="modal"
      theme={theme}
      onSubmit={handleSubmit(onSubmit)}>
      <div className="modal-content">
        <span
          className="close"
          onClick={() => {
            toggleProfileVisible(false);
          }}>
          &times;
        </span>

        <input
          data-testid="app-profile-input-firstname"
          name="firstname"
          placeholder="First name"
          onChange={({ target }) => {
            handleInputChange("firstname", target.value);
          }}
          ref={register}
          value={data.firstname}
        />
        <ErrorMessage
          field={errors.firstname}
          errorType="required"
          message="Firstname is required."
        />

        <input
          data-testid="app-profile-input-lastname"
          name="lastname"
          placeholder="Last name"
          onChange={({ target }) => {
            handleInputChange("lastname", target.value);
          }}
          ref={register}
          value={data.lastname}
        />
        <ErrorMessage
          field={errors.lastname}
          errorType="required"
          message="Lastname is required."
        />
        {/* <span>Family Relationship</span>
        <select
          data-testid="app-profile-select-family-relationship"
          name="familyrelationship"
          onChange={({ target }) => {
            handleInputChange("familyrelationship", target.value);
          }}
          ref={register}>
          <option value="" disabled hidden>
            Family relationship
          </option>
          <option value="father">Father</option>
          <option value="mother">Mother</option>
          <option value="sibling">Sibling</option>
        </select> */}
        <ErrorMessage
          field={errors.familyrelationship}
          errorType="required"
          message="Family relationship is required."
        />

        <select
          data-testid="app-profile-select-gender"
          name="gender"
          onChange={({ target }) => {
            handleInputChange("gender", target.value);
          }}
          ref={register}
          value={data.gender}>
          <option value="" disabled hidden>
            Gender
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <ErrorMessage
          field={errors.gender}
          errorType="required"
          message="Gender is required."
        />

        <input
          data-testid="app-profile-input-zip-code"
          name="zipcode"
          type="number"
          placeholder="Zip code"
          onChange={({ target }) => {
            handleInputChange("zipcode", target.value);
          }}
          ref={register}
          value={data.zipcode}
        />
        <ErrorMessage
          field={errors.zipcode}
          errorType="required"
          message="Zip code is required."
        />
        <input
          //data-testid="app-profile-input-date-of-birth"
          name="dateofbirth"
          type="date"
          placeholder="Date of Birth"
          onChange={({ target }) => {
            handleInputChange("dateofbirth", target.value);
          }}
          ref={register}
        />
        <ErrorMessage
          field={errors.dateofbirth}
          errorType="required"
          message="Date of Birth is required."
        />

        <button data-testid="app-profile-submit-button" type="submit">
          Save
        </button>
      </div>
    </EditProfileModal>,
    document.getElementById("modal")
  );
}
