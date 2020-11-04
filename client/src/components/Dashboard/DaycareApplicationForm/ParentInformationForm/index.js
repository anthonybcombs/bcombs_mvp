import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faPlusCircle,
  faTimesCircle,
  faAngleRight,
  faAngleLeft
} from "@fortawesome/free-solid-svg-icons";
import { Multiselect } from "multiselect-react-dropdown";
import DatePicker from "react-datepicker";
import ErrorMessage from "../../../../helpers/ErrorMessage";
import STATES from "../../ApplicationForm/states.json";
import NumberFormat from "react-number-format";

const ParentInformationStyled = styled.div`
  position: relative;
  margin-top: 12px !important;
  .parent-info-wrapper {
    padding-bottom: 45px !important;
    overflow: revert;
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
    transition: 0.15s ease-in-out;
  }

  .react-datepicker-wrapper {
    margin: 0;
  }

  .react-datepicker__input-container .field {
    margin: 0 !important;
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
  
  @media (max-width: 768px) {
    .parent-info-wrapper .grid-2,
    .parent-info-wrapper .grid-1 {
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
  childProfile = {},
  isVendorView
}) {
  let confirmed_passwords = [];

  const hasSelectAll = false;

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
    setIsParentAddressRequired(!showAddress)
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

  const GENDER_OPTIONS = [
    { id: 1, value: "Male", name: "Male" },
    { id: 2, value: "Female", name: "Female" }
  ];

  const CUSTOM_GENDER_OPTIONS = [
    { id: 1, value: "He", name: "He" },
    { id: 2, value: "She", name: "She" },
    { id: 3, value: "They", name: "They" }
  ];

  const ETHINICITY_OPTIONS = !isReadonly
  ? [
      { id: 1, name: "Asian", label: "Asian" },
      {
        id: 2,
        name: "Black or African American",
        label: "Black or African American"
      },
      { id: 3, name: "Hispanic or Latino", label: "AsiHispanic or Latinoan" },
      {
        id: 4,
        name: "Native American or American Indian",
        label: "Native American or American Indian"
      },
      {
        id: 5,
        name: "Native Hawaiian & Other Pacific Islander",
        label: "Native Hawaiian & Other Pacific Islander"
      },
      { id: 6, name: "White", label: "White" },
      { id: 7, name: "Other", label: "Other" },
      { id: 8, name: "Prefer not to answer", label: "Prefer not to answer" }
    ]
  : [];

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

  const BirthdateCustomInput = ({
    value,
    onClick,
    name,
    className,
    placeholder
  }) => (
    <div className="field">
      <input
        defaultValue={value}
        onClick={onClick}
        name={name}
        className={className}
        placeholder="mm/dd/yyyy"
        readOnly={true}
        id={`parent_date_of_birth_${counter - 1}`}
        ref={register({required: true})}
      />
      <label className="field-label" htmlFor={`parent_date_of_birth_${counter - 1}`}>
        <span className="required">*</span> Date of Birth
      </label>
    </div>
  );

  let readOnlyEthinicity = "";

  if (
    parentProfile.ethinicity &&
    parentProfile.ethinicity.length > 0 &&
    isReadonly
  ) {
    parentProfile.ethinicity.forEach(item => {
      readOnlyEthinicity += item.name + "\n";
    });

    readOnlyEthinicity = readOnlyEthinicity.slice(0, -1);
  }

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
                ref={register({ required: true, maxLength:5})}
                defaultValue={parentProfile?.first_name}
                readOnly={isReadonly}
              />
              <label
                className="field-label"
                htmlFor={`parent_firstname_${counter - 1}`}>
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
                htmlFor={`parent_lastname+${counter - 1}`}>
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

        <div className="grid-1">
          <div className="form-group">
            <div className="field">
              <DatePicker
                readOnly={isReadonly}
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
                    <button
                      className="datepicker-btn"
                      onClick={e => {
                        e.preventDefault();
                      }}>
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
                    <button
                      className="datepicker-btn"
                      onClick={e => {
                        e.preventDefault();
                      }}>
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        onClick={increaseMonth}
                        disabled={nextMonthButtonDisabled}
                      />
                    </button>
                  </div>
                )}
                selected={parentProfile.date_of_birth}
                disabled={isReadonly}
                onChange={date => {
                  handleParentFormDetailsChange(
                    counter - 1,
                    "profile",
                    "date_of_birth",
                    date
                  );
                }}
                name={"parent_birthdate" + (counter - 1)}
                customInput={
                  <BirthdateCustomInput
                    className={
                      isReadonly &&
                      !isVendorView &&
                      pastParentInformation &&
                      (pastParentInformation.date_of_birth ||
                        pastParentInformation.date_of_birth == "") &&
                      parentProfile.date_of_birth.toString() !=
                        new Date(pastParentInformation.birthdate).toString()
                        ? "field-input birthdate-field highlights"
                        : "field-input birthdate-field"
                    }
                  />
                }
              />
            </div>
            <ErrorMessage
              field={errors["parent_birthdate" + (counter - 1)]}
              errorType="required"
              message="Date of Birth is required."
            />
          </div>
          <div className="form-group">
            <div className="field select-field-wrapper">
              <select
                disabled={isReadonly}
                readOnly={isReadonly}
                name={"parent_gender" + (counter - 1)}
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastParentInformation &&
                  (pastParentInformation.gender ||
                    pastParentInformation.gender == "") &&
                  pastParentInformation.gender != parentProfile.gender
                    ? "field-input highlights"
                    : "field-input"
                }
                onChange={({ target }) => {
                  handleParentFormDetailsChange(
                    counter - 1,
                    "profile",
                    "gender",
                    target.value
                  );
                }}
                ref={register({ required: true })}
                defaultValue={parentProfile.gender}>
                <option value="">Select</option>
                <optgroup label="Gender">
                  {GENDER_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.value}>
                      {opt.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Custom">
                  {CUSTOM_GENDER_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.value}>
                      {opt.name}
                    </option>
                  ))}
                </optgroup>
              </select>
              <label className="field-label">
                <span className="required">*</span> Gender
              </label>
            </div>
            <ErrorMessage
              field={errors["parent_gender" + (counter - 1)]}
              errorType="required"
              message="Gender is required"
            />
          </div>
          <div className="form-group  ethnicity-form">
            <div className="field">
              {isReadonly ? (
                <>
                  <p
                    className={`${
                      isReadonly &&
                      !isVendorView &&
                      pastParentInformation &&
                      (pastParentInformation.ethnicities ||
                        pastParentInformation.ethnicities == "") &&
                      pastParentInformation.ethnicities !=
                        readOnlyEthinicity.split("\n").join(",")
                        ? "field-input readonly ethnicity-labels  highlights"
                        : "field-input ethnicity-labels readonly"
                    } `}
                    name={"ethinicity_" + (counter - 1)}
                    style={{
                      //background: "white",
                      borderBottom: "2px solid rgb(204, 204, 204) !important",
                      resize: "none",
                      margin: "0px 0px 15px 0px",
                      textIndent: "0",
                      // whiteSpace: "pre-wrap",
                      position: "absolute",
                      top: "27px"
                    }}>
                    {readOnlyEthinicity}
                  </p>
                </>
              ) : (
                <Multiselect
                  readOnly={isReadonly}
                  disabled={isReadonly}
                  id={"parent_ethinicity_" + (counter - 1)}
                  className="field-input"
                  options={ETHINICITY_OPTIONS}
                  hasSelectAll={hasSelectAll}
                  onSelect={selectedList => {
                    handleParentFormDetailsChange(
                      counter - 1,
                      "profile",
                      "ethinicity",
                      selectedList
                    );
                  }}
                  onRemove={selectedList => {
                    handleParentFormDetailsChange(
                      counter - 1,
                      "profile",
                      "ethinicity",
                      selectedList
                    );
                  }}
                  placeholder="Select all that apply"
                  displayValue="name"
                  closeIcon="cancel"
                  name={"parent_ethinicity_" + (counter - 1)}
                  closeOnSelect={false}
                  showCheckbox={true}
                  autcomplete="false"
                  selectedValues={parentProfile.ethinicity}
                />
              )}
              <label className="field-label">
                Ethinicity (select all choices that apply)
              </label>
            </div>
            <br />
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
                htmlFor={`parent_phonenumber_${counter - 1}`}>
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
                  htmlFor={`parent_phonenumber2_${counter - 1}`}>
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
                htmlFor={`parent_emailaddress_${counter - 1}`}>
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
                  htmlFor={`parent_emailaddress2_${counter - 1}`}>
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
                <label className="field-label" htmlFor={`password_${counter - 1}`}>
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
                  htmlFor={`parent_confirmed_paswword_${counter - 1}`}>
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
              {
                parentProfile.address ? (
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
                ) :
                (
                  <input
                  name="parentAddress"
                  className="field-input"
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
                  defaultValue={childProfile?.address}
                  ref={register({
                    required: showAddress
                  })}
                />
                )
              }

              <label
                className="field-label"
                htmlFor={`parentAddress_${counter - 1}`}>
                Address
              </label>
            </div>

              <ErrorMessage
                field={errors[`parentAddress`]}
                errorType="required"
                message="Address is required."
              />
          </div>

          <div className="form-group">
            <div className="field">
              {
                parentProfile.city ? (
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
                ) : (
                  <input
                    name="parentCity"
                    className="field-input"
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
                    defaultValue={childProfile?.city}
                    ref={register({
                      required: showAddress
                    })}
                  />
                )
              }

              <label className="field-label" htmlFor={`parentCity_${counter - 1}`}>
                City
              </label>
            </div>
              <ErrorMessage
                field={errors["parentCity"]}
                errorType="required"
                message="City is Required"
              />
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
              ) : parentProfile.state ? (
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
              ) : (
                <input
                  type="text"
                  className="field-input"
                  defaultValue={childProfile?.state}
                  readOnly={isReadonly}
                  placeholder="State"
                  name="parentstate"
                />
              )}

              <label className="field-label">State</label>
            </div>

              <ErrorMessage
                field={errors["parentstate"]}
                errorType="required"
                message="State is Required"
              />
          </div>
          <div className="form-group">
            <div className="field">
              {
                parentProfile.zip_code ? (
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
                      if (target.value.match(/^-{0,1}\d+$/)) {
                        handleParentFormDetailsChange(
                          counter - 1,
                          "profile",
                          "zip_code",
                          target.value
                        );
                      } else {
                        target.value = target.value.slice(0, -1);
                      }
                    }}
                    ref={register({ minLength: 5 })}
                    maxLength="5"
                    readOnly={isReadonly}
                    defaultValue={parentProfile?.zip_code}
                  />
                ) : (
                  <input
                  name="parentzipcode"
                    className="field-input"
                    placeholder="Zip Code"
                    id={`parentzipcode_${counter - 1}`}
                    onChange={({ target }) => {
                      if (target.value.match(/^-{0,1}\d+$/)) {
                        handleParentFormDetailsChange(
                          counter - 1,
                          "profile",
                          "zip_code",
                          target.value
                        );
                      } else {
                        target.value = target.value.slice(0, -1);
                      }
                    }}
                    ref={register({ minLength: 5,required: showAddress })}
                    maxLength="5"
                    readOnly={isReadonly}
                    defaultValue={childProfile?.zip_code}
                  />
                )
              }
              <label
                className="field-label"
                htmlFor={`parentzipcode_${counter - 1}`}>
                Zip Code
              </label>
            </div>

              <ErrorMessage
                field={errors["parentzipcode"]}
                errorType="required"
                message="Zip Code is Required"
              />
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
                htmlFor={`parentoccupation_${counter - 1}`}>
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
                htmlFor={`parentemployer_${counter - 1}`}>
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
{/* 
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
                htmlFor={`parent_person_recommend_${counter - 1}`}>
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
        </div> */}
      </div>
    </ParentInformationStyled>
  );
}
