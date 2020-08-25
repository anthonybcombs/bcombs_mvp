import React, { useEffect, useState, useContext } from "react";
import { format, isFuture, parseISO } from "date-fns";
import styled, { ThemeContext } from "styled-components";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

import ErrorMessage from "../../../../../helpers/ErrorMessage";
import { isValidDate } from "../../../../../helpers/Date";

import {
  OPTION_CUSTOM_RELATIONSHIPS,
  OPTION_MALE_RELATIONSHIPS,
  OPTION_FEMALE_RELATIONSHIPS
} from "../../../../../constants/options";

import "./CreateProfileForm.css";

const CreateProfileStyled = styled.form`
  input:required {
    box-shadow: none;
  }
  input:invalid {
    box-shadow: none;
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
    margin-bottom: 1em;
  }
  input:focus {
    border-color: ${({ theme }) => theme.input.focus.border.color};
    transition: 3s;
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

    display: block;
    margin: 10px auto;
    border: none;
  }
  .datepicker-btn {
    padding: 0;
    width: 32px;
    height: 32px;
    margin: 0 5px;
    box-shadow: none;
    background: transparent;
    font-size: unset !important;
    border-radius: 100% !important;
  }
  .datepicker-btn svg {
    width: 100%;
    height: 75%;
  }
  .datepicker-btn:hover {
    background: rgb(255 255 255 / 20%);
    transition: .15s ease-in-out;
  }
  select {
    font-size: ${({ theme }) => theme.input.fontSize};
    display: block;
    border: none;
    margin: 0 5px;
    cursor: pointer;
    width: 100% !important;
    background: rgb(255 255 255 / 15%);
  }
  option:not([value=""]) {
    color: black !important;
  }
  .react-datepicker__header {
    padding-top: 0;
    border-bottom: none;
  }
  .react-datepicker__header select {
    color: #fff;
  }
  .react-datepicker {
    border: 1px solid #ddd;
  }
  .react-datepicker__triangle {
    border-bottom-color: #f46d22 !important;
  }
  .react-datepicker__day-names,
  .react-datepicker__week {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .react-datepicker__day-names {
    padding: 5px 0;
  }
  .react-datepicker__day,
  .react-datepicker__day-name,
  .react-datepicker__time-name {
    color: rgb(0 0 0 / 75%);
  }
  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    color: #fff !important;
  }
  .react-datepicker__day--outside-month {
    color: rgb(0 0 0 / 35%);
  }
  h3 {
    text-align: center;
  }
  [hidden] {
    display: none;
  }
  p.error {
    margin: 0 !important;
    font-size: 14px !important;
  }
  @media (min-width: 600px) {
    .grid {
      grid-template-columns: 50% 50%;
      grid-gap: 1%;
    }
    button[type="submit"] {
      width: ${({ theme }) => theme.button.width.primary};
    }
  }
  input:required {
    box-shadow: none;
  }
  input:invalid {
    box-shadow: none;
  }

  input:focus {
    border-color: ${({ theme }) => theme.input.focus.border.color};
  }

  .form-group .form-control {
    font-size: 18px;
    border: 0;
    border-bottom: 2px solid #ccc;
    -webkit-appearance: none;
    -moz-appearance: none;
    border-radius: 0;
    padding: 10px;
  }

  .field {
    display: flex;
    flex-flow: column-reverse;
    margin-bottom: 1em;
  }

  .field-label,
  .field-input {
    transition: all 0.2s;
    touch-action: manipulation;
  }
  .field-input {
    font-size: 18px;
    border: 0;
    border-bottom: 2px solid #ccc;
    font-family: inherit;
    // -webkit-appearance: none;
    // -moz-appearance: none;
    border-radius: 0;
    padding: 5px;
    cursor: text;
    line-height: 1.8;

    padding: 5px 0;
    width: 100%;
    display: block;
    text-indent: 5px;
    margin-top: 8px;
    margin-bottom: -5px;
  }

  .field-label {
    font-size: 14px;
    color: #4b525a;
  }

  .field-input:placeholder-shown + .field-label {
    transform-origin: left bottom;
    transform: translate(0, 2.125rem) scale(1.4);
  }

  .field-input.select-empty {
    color: #4b525a;
  }

  .field-input::placeholder {
    opacity: 0;
    transition: inherit;
    font-size: 12px;
  }

  .field-input:focus::placeholder {
    opacity: 1;
  }

  .field-input:focus + .field-label {
    transform: translate(0, 0) scale(1);
    cursor: pointer;
    margin-bottom: 5px;
    font-weight: bold;
  }
  .required {
    color: red;
  }
`;

const range = (start, end) => {
  let arr = [];

  for (let i = start; i <= end; i++) {
    arr.push(i);
  }

  return arr;
};

const years = range(1900, new Date().getFullYear());
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const CUSTOM_GENDER_OPTIONS = [
  { id: 1, value: "He", name: "He" },
  { id: 2, value: "She", name: "She" },
  { id: 3, value: "They", name: "They" }
];
export default function CreateProfileForm({
  data,
  onSubmit,
  handleInputChange,
  userType
}) {
  const [showWarningFutureDate, setShowWarningFutureDate] = useState(false);
  const [dateOfBirthElementType, setDateOfBirthElementType] = useState("text");
  const theme = useContext(ThemeContext);

  console.log("Dataaaaa", data);
  const {
    register,
    handleSubmit,
    errors,
    watch,
    setValue,
    unregister
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      firstname: data.firstname,
      lastname: data.lastname
    }
  });
  const maxDate = format(new Date(), "yyyy-MM-dd");
  useEffect(() => {
    register({ name: "zipcode" }, { required: true });
    register({ name: "dateofbirth" }, { required: true });
  }, []);

  useEffect(() => {
    register({ name: "lastname" }, { required: true });
    register({ name: "firstname" }, { required: true });
  }, [data]);

  const handleDateOfBirthElementTypeChange = value => {
    setDateOfBirthElementType(value);
  };
  const gender = watch("gender");
  if (data && data.hasOwnProperty("unrequiredFields")) {
    let unrequiredFields = data.unrequiredFields;
    unrequiredFields.forEach(item => unregister(item));
  }
  if (userType === "VENDOR") {
    unregister("dateofbirth");
  }
  const isRequiredField = field => {
    return !(
      data &&
      data.hasOwnProperty("unrequiredFields") &&
      data.unrequiredFields.indexOf(field) > -1
    );
  };

  // Check the length of number
  const maxLengthCheck = object => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(
        0,
        object.target.maxLength
      );
    }
  };

  const CustomDatePicker = ({ value, onClick, name, className }) => (
    <div className="field">
      <input
        id="dob"
        defaultValue={value}
        onClick={onClick}
        name={name}
        className={className}
        placeholder="mm/dd/yyyy"
        readOnly={true}
        ref={register({ required: true })}
      />
      <label className="field-label" for="dob">
        <span className="required">*</span> Date of Birth
      </label>
    </div>
  );

  console.log("gender", gender);
  return (
    <CreateProfileStyled
      data-testid="app-create-profile-form"
      method="POST"
      theme={theme}
      onSubmit={handleSubmit(onSubmit)}>
      <h3>Create my profile</h3>
      <div className="form-group">
        <div className="field">
          <input
            id="firstname"
            className="field-input"
            data-testid="app-profile-input-firstname"
            name="firstname"
            placeholder="First name"
            onChange={({ target }) => {
              handleInputChange("firstname", target.value);
            }}
            ref={register({ required: true })}
            defaultValue={data.firstname}
          />
          <label className="field-label" for='firstname'>
            <span className="required">*</span> First Name
          </label>
        </div>
        <ErrorMessage
          field={errors.firstname}
          errorType="required"
          message="Firstname is required."
        />
      </div>
      <div className="form-group">
        <div className="field">
          <input
            id="lastname"
            className="field-input"
            data-testid="app-profile-input-lastname"
            name="lastname"
            placeholder="Last name"
            onChange={({ target }) => {
              handleInputChange("lastname", target.value);
            }}
            ref={register({ required: true })}
            defaultValue={data.lastname}
          />
          <label className="field-label" for="lastname">
            <span className="required">*</span> Last Name
          </label>
        </div>
        <ErrorMessage
          field={errors.lastname}
          errorType="required"
          message="Lastname is required."
        />
      </div>

      <div className="form-group">
        {
          userType !== "VENDOR" && (
            <>
              <div className="field">
                <select
                  className={`field-input${!data.gender ? " select-empty" : ""}`}
                  data-testid="app-profile-select-gender"
                  name="gender"
                  onChange={({ target }) => {
                    if (target.value === "female" || target.value === "She") {
                      setValue("familyrelationship", "mother");
                    } else if (target.value === "male" || target.value === "He") {
                      setValue("familyrelationship", "father");
                    } else {
                      setValue("familyrelationship", "Other");
                    }
                    handleInputChange("gender", target.value);
                  }}
                  ref={register({ required: false })}>
                  <option value="" disabled selected={!data.gender}>
                    Select Gender
                  </option>
                  <optgroup label="Gender">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </optgroup>
                  <optgroup label="Custom">
                    {CUSTOM_GENDER_OPTIONS.map(opt => (
                      <option key={opt.id} value={opt.value}>
                        {opt.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <label className="field-label">{!data.gender ? '' : 'Select Gender'}</label>
              </div>
              {/* <ErrorMessage
                field={errors.gender}
                errorType="required"
                message="Gender is required."
              /> */}
            </>
          )
        }
        {gender === "custom" && (
          <>
            <select
              className="field-input"
              data-testid="app-profile-select-custom-gender"
              name="customgender"
              onChange={({ target }) => {
                handleInputChange("customgender", target.value);
              }}
              ref={register({ required: true })}>
              <option value="">
                Select Customer Gender
              </option>
              <option value="She">She</option>
              <option value="He">He</option>
              <option value="They">They</option>
            </select>
            <ErrorMessage
              field={errors.customgender}
              errorType="required"
              message="Custom Gender is required."
            />
          </>
        )}
      </div>
      {/* <div className="form-group"> */}
        {
          // userType !== "VENDOR" && (
          //   <>
          //     <div className="field">
          //       <select
          //         className={`field-input${!data.familyrelationship ? " select-empty" : ""}`}
          //         data-testid="app-profile-select-family-relationship"
          //         name="familyrelationship"
          //         onChange={({ target }) => {
          //           handleInputChange("familyrelationship", target.value);
          //         }}
          //         ref={register({ required: true })}
          //         // style={{ lineHeight: 1, height: 56 }}
          //       >
          //         <option value="" disabled selected={!data.familyrelationship}>
          //           Select Family Relationship
          //         </option>
          //         {/* <option value="default">Default</option>
          //         <option value="father">Father</option>
          //         <option value="mother">Mother</option>
          //         <option value="sibling">Sibling</option> */}

          //         {gender === "female" || gender === "She"
          //           ? OPTION_FEMALE_RELATIONSHIPS.map(opt => (
          //               <option key={opt.value} value={opt.value}>
          //                 {opt.label}
          //               </option>
          //             ))
          //           : gender === "male" || gender === "He"
          //           ? OPTION_MALE_RELATIONSHIPS.map(opt => (
          //               <option key={opt.value} value={opt.value}>
          //                 {opt.label}
          //               </option>
          //             ))
          //           : OPTION_CUSTOM_RELATIONSHIPS.map(opt => (
          //               <option key={opt.key} value={opt.value}>
          //                 {opt.label}
          //               </option>
          //             ))}
          //       </select>
          //       <label className="field-label">{!data.familyrelationship ? '' : 'Select Family Relationship'}</label>
          //     </div>
          //     <ErrorMessage
          //       field={errors.familyrelationship}
          //       errorType="required"
          //       message="Family relationship is required."
          //     />
          //   </>
          // )
        }
      {/* </div> */}
      {/* <div>
          <select
            data-testid="app-profile-select-gender"
            name="gender"
            onChange={({ target }) => {
              handleInputChange("gender", target.value);
            }}
            ref={register({ required: true })}>
            <option value="" disabled>
              Select Gender
            </option>
            <option value="default">Default</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="custom">Custom</option>
          </select>
          <ErrorMessage
            field={errors.gender}
            errorType="required"
            message="Gender is required."
          />
          {gender === "custom" && (
            <>
              <select
                data-testid="app-profile-select-custom-gender"
                name="customgender"
                onChange={({ target }) => {
                  handleInputChange("customgender", target.value);
                }}
                ref={register({ required: true })}>
                <option value="" disabled>
                  Select Customer Gender
                </option>
                <option value="she">She</option>
                <option value="he">He</option>
                <option value="they">They</option>
              </select>
              <ErrorMessage
                field={errors.customgender}
                errorType="required"
                message="Custom Gender is required."
              />
            </>
          )}
        </div> */}

      {userType === "USER" && (
        // <div>
        //   <input
        //     data-testid="app-profile-input-date-of-birth"
        //     name="dateofbirth"
        //     type={dateOfBirthElementType}
        //     placeholder={`${
        //       isRequiredField("dateofbirth") ? "* " : ""
        //     }Date of Birth`}
        //     min="1900-01-01"
        //     max={maxDate}
        //     onFocus={() => {
        //       handleDateOfBirthElementTypeChange("date");
        //     }}
        //     onBlur={() => {
        //       handleDateOfBirthElementTypeChange("text");
        //     }}
        //     onChange={({ target }) => {
        //       //setShowWarningFutureDate(isFuture(parseISO(target.value)));
        //       if (!isFuture(parseISO(target.value))) {
        //         setValue("dateofbirth", target.value);
        //         handleInputChange("dateofbirth", target.value);
        //       }
        //     }}
        //   />
        //   <ErrorMessage
        //     field={errors.dateofbirth}
        //     errorType="required"
        //     message="Date of Birth is required."
        //   />
        //   {/* {showWarningFutureDate && <>
        //       <p className="error">Date of Birth is in future.</p>
        //     </>
        //   } */}
        // </div>

        <div className="form-group" style={{ marginTop: 12 }}>
          <div className="field">
            <DatePicker
              readOnly={false}
              renderCustomHeader={({
                date,
                changeYear,
                changeMonth,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled
              }) => (
                <div
                  style={{
                    margin: 0,
                    display: "flex",
                    alignCenter: "center",
                    justifyContent: "center",
                    background: "#f36e22",
                    padding: "5px 3px"
                  }}>
                  <button className="datepicker-btn">
                    <FontAwesomeIcon
                      icon={faAngleLeft}
                      onClick={decreaseMonth}
                      disabled={prevMonthButtonDisabled}
                    />
                  </button>
                  <select
                    value={new Date(date).getFullYear()}
                    onChange={({ target: { value } }) => changeYear(value)}>
                    {years.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  <select
                    value={months[date.getMonth()]}
                    onChange={({ target: { value } }) =>
                      changeMonth(months.indexOf(value))
                    }>
                    {months.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <button className="datepicker-btn">
                    <FontAwesomeIcon
                      icon={faAngleRight}
                      onClick={increaseMonth}
                      disabled={nextMonthButtonDisabled}
                    />
                  </button>
                </div>
              )}
              disabled={false}
              selected={
                isValidDate(data.dateofbirth) && new Date(data.dateofbirth)
              }
              onChange={date => {
                handleInputChange("dateofbirth", format(date, "yyyy-MM-dd"));
              }}
              name={"dateofbirth"}
              customInput={
                <CustomDatePicker className="field-input birthdate-field" />
              }
            />
          </div>
        </div>
      )}

      <div className="field-group" style={{ marginTop: 5 }}>
        <div className="field">
          <input
            id="zipCode"
            className="field-input"
            data-testid="app-profile-input-zip-code"
            name="zipcode"
            type="number"
            placeholder="Zip Code"
            onChange={({ target }) => {
              setValue("zipcode", target.value);
              handleInputChange("zipcode", target.value);
            }}
            ref={register({
              minLength: 5
            })}
            maxLength="5"
            onInput={maxLengthCheck}
          />
          <label className="field-label" for="zipCode">
            <span className="required">*</span> Zip Code
          </label>
        </div>
        <ErrorMessage
          field={errors.zipcode}
          errorType="required"
          message="Zip code is required."
        />
        <ErrorMessage
          field={errors.zipcode}
          errorType="minLength"
          message="Zip code minimum length must be at least 5 characters."
        />
      </div>

      <button data-testid="app-profile-submit-button" type="submit">
        Save and Continue
      </button>
    </CreateProfileStyled>
  );
}
