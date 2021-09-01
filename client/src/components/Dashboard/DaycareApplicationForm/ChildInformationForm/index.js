import React, { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimesCircle,
  faPlusCircle,
  faMinusCircle,
  faAngleRight,
  faAngleLeft
} from "@fortawesome/free-solid-svg-icons";
import ErrorMessage from "../../../../helpers/ErrorMessage";
import DatePicker from "react-datepicker";
import { Multiselect } from "multiselect-react-dropdown";
import "react-datepicker/dist/react-datepicker.css";
import "../../ArchivedApplication/SearchDate.css";
import "font-awesome/css/font-awesome.min.css";
import STATES from "../../ApplicationForm/states.json";

import NumberFormat from "react-number-format";

const ChildInformationFormStyled = styled.div`
  position: relative;

  .form-group.ethnicity-form {
    margin-bottom: 20px !important;
  }

  .img-profile-wrapper {
    width: 17%;
    margin-bottom: 30px;
  }

  .img-profile-wrapper img {
    border-radius: 50%;
  }

  .child-info-wrapper {
    overflow: revert;
  }

  .child-info-wrapper .grid {
    display: grid;
    grid-template-columns: 31% 31% 31%;
    grid-gap: 3.33333333%;
  }

  .child-info-wrapper .customMultiselect #multiselectContainerReact {
    position: relative;
    top: 0;
  }

  #multiselectContainerReact {
    position: relative;
    bottom: 0;
  }

  #multiselectContainerReact .optionContainer li:hover,
  #multiselectContainerReact .optionContainer li.highlight {
    background: #f26e21;
  }

  #multiselectContainerReact div:first-child {
    border: 0;
    border-bottom: 2px solid #ccc;
    border-radius: 0;
    overflow-y: auto;
    max-height: 250px;
  }

  #multiselectContainerReact .searchBox {
    font-size: 18px;
    padding: 5px 0;
    margin: 0;
    margin-top: 2px;
  }

  #multiselectContainerReact .searchBox::placeholder {
    font-size: 12px;
  }

  #multiselectContainerReact .chip {
    background: #f26e21;
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
  @media print {
    .highlights {
      border-color: #f26e21 !important;
    }
  }

  .ethnicity-labels {
    white-space: none !important;
    font-size: 12px !important;
    margin-top: -5px !important;
  }

  @media (max-width: 768px) {
    .child-info-wrapper .grid {
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
    #multiselectContainerReact .optionListContainer {
      position: relative;
    }
    #multiselectContainerReact .optionListContainer:before {
      content: "\f057";
      position: absolute;
      top: -8px;
      color: red;
      right: -10px;
      width: auto;
      height: 25px;
      font-size: 28px;
      cursor: pointer;
      background: #fff;
      border-radius: 100%;
      font-family: "fontawesome";
    }
  }

  @media (max-width: 600px) {
    .child-info-wrapper .grid {
      padding: 0;
    }
  }
`;

export default function index({
  counter,
  childProfile,
  handleChildFormDetailsChange,
  register,
  errors,
  isReadonly = false,
  ProfileImg,
  app_programs = [],
  location_sites = [],
  pastChildInformation = {},
  isVendorView = false
}) {
  const hasSelectAll = false;

  console.log("pastChildInformation", pastChildInformation);

  const [ neededDaysCheck, setNeededDaysCheck ] = useState({
    option1: childProfile?.needed_days ? (childProfile.needed_days == "M,T,W,TH,F,") : false,
    option2: childProfile?.needed_days ? childProfile.needed_days.includes('M,') : false,
    option3: childProfile?.needed_days ? childProfile.needed_days.includes('T,') : false,
    option4: childProfile?.needed_days ? childProfile.needed_days.includes('W,') : false,
    option5: childProfile?.needed_days ? childProfile.needed_days.includes('TH,') : false,
    option6: childProfile?.needed_days ? childProfile.needed_days.includes('F,') : false
  })

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

  const PROGRAMS_OPTIONS =
    app_programs.length > 0
      ? app_programs
      : [
          { id: 1, name: "Daycare", label: "Daycare" },
          { id: 2, name: "Before/After Care", label: "Before/After Care" },
          { id: 3, name: "Summer Camp", label: "Summer Camp" }
        ];

  const LANGUAGES_OPTIONS = [
    { id: 1, name: "English", label: "English" },
    { id: 2, name: "Spanish", label: "Spanish" },
  ];

  const SCHEDULE_TOUR_OPTIONS = [
    { id: 1, name: "Currently Enrolled", label: "Currently Enrolled" },
    { id: 2, name: "Yes", label: "Yes" },
    { id: 3, name: "No", label: "Yes" }
  ]

  const VOUCHER_OPTIONS = [
    { id: 1, name: "Yes", label: "Yes" },
    { id: 2, name: "No", label: "Yes" }
  ]

  let CHILD_LIVES_OPTION = [
    { id: 1, name: "Father", label: "Father" },
    { id: 2, name: "Mother", label: "Mother" },
    { id: 3, name: "Brother", label: "Brother" },
    { id: 4, name: "Sister", label: "Sister" },
    { id: 5, name: "Uncle", label: "Uncle" },
    { id: 6, name: "Aunt", label: "Aunt" },
    { id: 7, name: "Cousin (Male)", label: "Cousin (Male)" },
    { id: 23, name: "Cousin (Female)", label: "Cousin (Female)" },
    { id: 8, name: "Grandfather", label: "Grandfather" },
    { id: 9, name: "Grandmother", label: "Grandmother" },
    { id: 10, name: "Stepbrother", label: "Stepbrother" },
    { id: 11, name: "Stepsister", label: "Stepsister" },
    { id: 12, name: "Stepfather", label: "Stepfather" },
    { id: 13, name: "Stepmother", label: "Stepmother" },
    { id: 18, name: "Father-in-law", label: "Father-in-law" },
    { id: 19, name: "Mother-in-law", label: "Mother-in-law" },
    { id: 20, name: "Family Friend", label: "Family Friend" },
    { id: 22, name: "Others", label: "Others" }
  ];

  const CLASSROOMS_OPTIONS = [
    { id: 1, name: "YB", label: "YB"},
    { id: 2, name: "MB", label: "MB"},
    { id: 3, name: "OB", label: "OB"},
    { id: 4, name: "Y1", label: "Y1"},
    { id: 5, name: "M1", label: "M1"},
    { id: 6, name: "O1", label: "O1"},
    { id: 7, name: "Y2", label: "Y2"},
    { id: 8, name: "M2", label: "M2"},
    { id: 9, name: "O2", label: "O2"},
    { id: 10, name: "Y3", label: "Y3"},
    { id: 11, name: "M3", label: "M3"},
    { id: 12, name: "O3", label: "O3"},
    { id: 13, name: "Y4", label: "Y4"},
    { id: 14, name: "O4", label: "O4"},
    { id: 15, name: "K", label: "K"},
    { id: 16, name: "Middle School", label: "Middle School"},
    { id: 17, name: "Freshmen", label: "Freshmen"},
    { id: 18, name: "Sophomores", label: "Sophomores"},
    { id: 19, name: "Juniors", label: "Juniors"},
  ]

  let readOnlyChildLivesWith = "";

  if (
    childProfile?.child_lives_with &&
    childProfile?.child_lives_with.length > 0 &&
    isReadonly
  ) {
    childProfile?.child_lives_with.forEach(item => {
      readOnlyChildLivesWith += item.name + "\n";
    });

    readOnlyChildLivesWith = readOnlyChildLivesWith.slice(0, -1);
  }

  let readOnlyProgram = "";

  if (childProfile?.program && childProfile?.program?.length > 0 && isReadonly) {
    childProfile?.program.forEach(item => {
      readOnlyProgram += item.name + "\n";
    });

    readOnlyProgram = readOnlyProgram.slice(0, -1);
  }

  let readOnlyEthinicity = "";

  if (
    childProfile?.ethinicity &&
    childProfile?.ethinicity?.length > 0 &&
    isReadonly
  ) {
    childProfile?.ethinicity.forEach(item => {
      readOnlyEthinicity += item.name + "\n";
    });

    readOnlyEthinicity = readOnlyEthinicity.slice(0, -1);
  }

  const range = (start, end) => {
    let arr = [];

    for (let i = start; i <= end; i++) {
      arr.push(i);
    }

    return arr;
  };

  const [imagePreview, setImagePreview] = useState(ProfileImg);

  const handleFileChange = event => {
    let reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(event.target.files[0]);
  };

  const [isUploadPhotoVisible, setUploadPhotoVisible] = useState(false);

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
        placeholder="MM/dd/yyyy"
        readOnly={true}
        id={`date_of_birth_${counter - 1}`}
        ref={register({ required: true })}
      />
      <label className="field-label" htmlFor={`date_of_birth_${counter - 1}`}>
        <span className="required">*</span> Date of Birth
      </label>
    </div>
  );

  const PrefferedDateCustomInput = ({
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
        placeholder="MM/dd/yyyy"
        readOnly={true}
        id={`preffered_start_date${counter - 1}`}
        ref={register({ required: true })}
      />
      <label className="field-label" htmlFor={`preffered_start_date${counter - 1}`}>
        <span className="required">*</span> Preffered Start Date
      </label>
    </div>
  );

  return (
    <ChildInformationFormStyled>
      <h3 className="heading">
        Child Information {counter > 1 ? `(${counter})` : ``}
      </h3>
      <div className="child-info-wrapper">
        <div className="img-profile-wrapper">
          <img src={imagePreview} width="80" height="80" />
          {!isReadonly && (
            <input
              name={"ch_img" + (counter - 1)}
              onChange={handleFileChange}
              type="file"
            />
          )}
        </div>
        <div className="grid">
          <div className="form-group">
            <div className="field">
              <input
                readOnly={isReadonly}
                id={`ch_first_name_${counter - 1}`}
                name={"ch_first_name" + (counter - 1)}
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastChildInformation &&
                  (pastChildInformation.firstname ||
                    pastChildInformation.firstname == "") &&
                  pastChildInformation.firstname != childProfile?.first_name
                    ? "field-input highlights"
                    : "field-input"
                }
                placeholder="First Name"
                onChange={({ target }) => {
                  handleChildFormDetailsChange(
                    counter - 1,
                    "profile",
                    "first_name",
                    target.value
                  );
                }}
                ref={register({ required: true })}
                defaultValue={childProfile?.first_name}
              />
              <label className="field-label" htmlFor={`ch_first_name_${counter - 1}`}>
                <span className="required">*</span> First Name
              </label>
            </div>
            <ErrorMessage
              field={errors["ch_first_name" + (counter - 1)]}
              errorType="required"
              message="First Name is required."
            />
          </div>
          <div className="form-group">
            <div className="field">
              <input
                readOnly={isReadonly}
                id={`ch_last_name_${counter - 1}`}
                name={"ch_last_name" + (counter - 1)}
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastChildInformation &&
                  (pastChildInformation.lastname ||
                    pastChildInformation.lastname == "") &&
                  pastChildInformation.lastname != childProfile?.last_name
                    ? "field-input highlights"
                    : "field-input"
                }
                placeholder="Last Name"
                onChange={({ target }) => {
                  handleChildFormDetailsChange(
                    counter - 1,
                    "profile",
                    "last_name",
                    target.value
                  );
                }}
                ref={register({ required: true })}
                defaultValue={childProfile?.last_name}
              />
              <label className="field-label" htmlFor={`ch_last_name_${counter - 1}`}>
                <span className="required">*</span> Last Name
              </label>
            </div>
            <ErrorMessage
              field={errors["ch_last_name" + (counter - 1)]}
              errorType="required"
              message="Last Name is required."
            />
          </div>
          <div className="form-group">
            <div className="field">
              <input
                id={`ch_nick_name_${counter - 1}`}
                name={`ch_nick_name_${counter - 1}`}
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastChildInformation &&
                  (pastChildInformation.nickname ||
                    pastChildInformation.nickname == "") &&
                  pastChildInformation.nickname != childProfile?.nick_name
                    ? "field-input highlights"
                    : "field-input"
                }
                placeholder="Nick Name"
                onChange={({ target }) => {
                  handleChildFormDetailsChange(
                    counter - 1,
                    "profile",
                    "nick_name",
                    target.value
                  );
                }}
                readOnly={isReadonly}
                ref={register()}
                defaultValue={childProfile?.nick_name}
              />
              <label className="field-label" htmlFor={`ch_nick_name_${counter - 1}`}>Nick Name</label>
            </div>
          </div>
        </div>

        <div className="grid">
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
                selected={childProfile?.date_of_birth}
                disabled={isReadonly}
                onChange={date => {
                  handleChildFormDetailsChange(
                    counter - 1,
                    "profile",
                    "date_of_birth",
                    date
                  );
                }}
                name={"ch_birthdate" + (counter - 1)}
                customInput={
                  <BirthdateCustomInput
                    className={
                      isReadonly &&
                      !isVendorView &&
                      pastChildInformation &&
                      (pastChildInformation.birthdate ||
                        pastChildInformation.birthdate == "") &&
                      childProfile?.date_of_birth.toString() !=
                        new Date(pastChildInformation.birthdate).toString()
                        ? "field-input birthdate-field highlights"
                        : "field-input birthdate-field"
                    }
                  />
                }
              />
            </div>
            <ErrorMessage
              field={errors["ch_birthdate" + (counter - 1)]}
              errorType="required"
              message="Date of Birth is required."
            />
          </div>
          <div className="form-group">
            <div className="field select-field-wrapper">
              <select
                disabled={isReadonly}
                readOnly={isReadonly}
                name={"ch_gender" + (counter - 1)}
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastChildInformation &&
                  (pastChildInformation.gender ||
                    pastChildInformation.gender == "") &&
                  pastChildInformation.gender != childProfile?.gender
                    ? "field-input highlights"
                    : "field-input"
                }
                onChange={({ target }) => {
                  handleChildFormDetailsChange(
                    counter - 1,
                    "profile",
                    "gender",
                    target.value
                  );
                }}
                ref={register({ required: true })}
                defaultValue={childProfile?.gender}>
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
              field={errors["ch_gender" + (counter - 1)]}
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
                      pastChildInformation &&
                      (pastChildInformation.ethnicities ||
                        pastChildInformation.ethnicities == "") &&
                      pastChildInformation.ethnicities !=
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
                  id={"ethinicity_" + (counter - 1)}
                  className="field-input"
                  options={ETHINICITY_OPTIONS}
                  hasSelectAll={hasSelectAll}
                  onSelect={selectedList => {
                    handleChildFormDetailsChange(
                      counter - 1,
                      "profile",
                      "ethinicity",
                      selectedList
                    );
                  }}
                  onRemove={selectedList => {
                    handleChildFormDetailsChange(
                      counter - 1,
                      "profile",
                      "ethinicity",
                      selectedList
                    );
                  }}
                  placeholder="Select all that apply"
                  displayValue="name"
                  closeIcon="cancel"
                  name={"ethinicity_" + (counter - 1)}
                  closeOnSelect={false}
                  showCheckbox={true}
                  autcomplete="false"
                  selectedValues={childProfile?.ethinicity}
                />
              )}
              <label className="field-label">
                Ethinicity (select all choices that apply)
              </label>
            </div>
            <br />
          </div>
        </div>

        <div className="grid">
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
                    selected={childProfile?.preffered_start_date}
                    disabled={isReadonly}
                    onChange={date => {
                    handleChildFormDetailsChange(
                        counter - 1,
                        "profile",
                        "preffered_start_date",
                        date
                    );
                    }}
                    name={"ch_pref_start_date" + (counter - 1)}
                    customInput={
                    <PrefferedDateCustomInput
                        className={
                        isReadonly &&
                        !isVendorView &&
                        pastChildInformation &&
                        (pastChildInformation.preffered_start_date ||
                            pastChildInformation.preffered_start_date == "") &&
                        childProfile?.preffered_start_date.toString() !=
                            new Date(pastChildInformation.preffered_start_date).toString()
                            ? "field-input birthdate-field highlights"
                            : "field-input birthdate-field"
                        }
                    />
                    }
                />
            </div>
            <ErrorMessage
              field={errors["ch_preffered_start_date" + (counter - 1)]}
              errorType="required"
              message="Preffered Start Date is required."
            />
          </div>

          <div className="form-group">
            <div className="field select-field-wrapper">
              <select
                disabled={isReadonly}
                readOnly={isReadonly}
                name={"ch_current_classroom" + (counter - 1)}
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastChildInformation &&
                  (pastChildInformation.current_classroom ||
                    pastChildInformation.current_classroom == "") &&
                  pastChildInformation.current_classroom != childProfile?.current_classroom
                    ? "field-input highlights"
                    : "field-input"
                }
                onChange={({ target }) => {
                  handleChildFormDetailsChange(
                    counter - 1,
                    "profile",
                    "current_classroom",
                    target.value
                  );
                }}
                ref={register({ required: true })}
                defaultValue={childProfile?.current_classroom}>
                <option value="">Select</option>
                {CLASSROOMS_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.value}>
                        {opt.name}
                    </option>
                ))}
              </select>
              <label className="field-label">
                <span className="required">*</span> Current Classroom
              </label>
            </div>
            <ErrorMessage
              field={errors["ch_current_classroom" + (counter - 1)]}
              errorType="required"
              message="Current Classroom is required"
            />
          </div>

          <div className="form-group">
            <div className="field select-field-wrapper">
              <select
                disabled={isReadonly}
                readOnly={isReadonly}
                name={"ch_primary_language" + (counter - 1)}
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastChildInformation &&
                  (pastChildInformation.primary_language ||
                    pastChildInformation.primary_language == "") &&
                  pastChildInformation.primary_language != childProfile?.primary_language
                    ? "field-input highlights"
                    : "field-input"
                }
                onChange={({ target }) => {
                  handleChildFormDetailsChange(
                    counter - 1,
                    "profile",
                    "primary_language",
                    target.value
                  );
                }}
                ref={register({ required: true })}
                defaultValue={childProfile?.primary_language}>
                <option value="">Select</option>
                {LANGUAGES_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.value}>
                        {opt.name}
                    </option>
                ))}
              </select>
              <label className="field-label">
                <span className="required">*</span> Primary Language
              </label>
            </div>
            <ErrorMessage
              field={errors["ch_primary_language" + (counter - 1)]}
              errorType="required"
              message="Primary Language is required"
            />
          </div>
        </div>

        <div className="grid">
          <div style={{marginBottom: "20px"}}>
            <label style={{marginBottom: "20px", width:"100%"}}>
              <span className="required" style={{marginRight: "5px"}}>*</span>Needed Days
            </label>
            <div
              style={{
                padding: "5px",
                border: "1px solid #ccc",
                paddingBottom: "0"
              }}
              className={
                isReadonly &&
                !isVendorView &&
                pastChildInformation &&
                (pastChildInformation.needed_days || 
                  pastChildInformation.needed_days == "") &&
                pastChildInformation.needed_days != childProfile?.needed_days
                  ? "highlights" : ""
              }
            >
              <span style={{marginRight: "10px"}}>
                <input
                  name={"ch_needed_days" + (counter - 1)}
                  type="checkbox" 
                  checked={neededDaysCheck.option1}
                  onChange={({ target }) => {
                    console.log("needed days", !neededDaysCheck?.option1);
                    if(!neededDaysCheck?.option1) {
                      handleChildFormDetailsChange(
                        counter - 1,
                        "profile",
                        "needed_days",
                        "M,T,W,TH,F,")
                        setNeededDaysCheck({
                          option1: true,
                          option2: true,
                          option3: true,
                          option4: true,
                          option5: true,
                          option6: true
                        })
                    } else {
                      handleChildFormDetailsChange(
                        counter - 1,
                        "profile",
                        "needed_days",
                        "")
                      setNeededDaysCheck({
                        option1: false,
                        option2: false,
                        option3: false,
                        option4: false,
                        option5: false,
                        option6: false
                      })
                    }
                  }}
                  ref={register({
                    validate: {
                      otherCBChecked: value => {
                        if(neededDaysCheck.option1 ||
                          neededDaysCheck.option2 ||
                          neededDaysCheck.option3 ||
                          neededDaysCheck.option4 ||
                          neededDaysCheck.option5 ||
                          neededDaysCheck.option6) {
                            return true
                          }
                        return false
                      }
                    }
                  })}
                  disabled={isReadonly}
                />
                <label htmlFor={"ch_needed_days" + (counter - 1)}>M-F</label>
              </span>
              <span style={{marginRight: "10px"}}>
                <input
                  name={"ch_needed_days" + (counter - 1)}
                  type="checkbox" 
                  checked={neededDaysCheck.option2}
                  onChange={({ target }) => {
                    if(!neededDaysCheck.option2) {
                      if(neededDaysCheck.option1) return;

                      handleChildFormDetailsChange(
                        counter - 1,
                        "profile",
                        "needed_days",
                        childProfile?.needed_days+ "M,")
                      setNeededDaysCheck({...neededDaysCheck, ['option2']: true})
                    } else {
                      handleChildFormDetailsChange(
                        counter - 1,
                        "profile",
                        "needed_days",
                        childProfile?.needed_days.replace("M,", "")) 
                      setNeededDaysCheck({...neededDaysCheck, ['option1']: false, ['option2']: false})
                    }
                  }}
                  ref={register({
                    validate: {
                      otherCBChecked: value => {
                        if(neededDaysCheck.option1 ||
                          neededDaysCheck.option2 ||
                          neededDaysCheck.option3 ||
                          neededDaysCheck.option4 ||
                          neededDaysCheck.option5 ||
                          neededDaysCheck.option6) {
                            return true
                          }
                        return false
                      }
                    }
                  })}
                  disabled={isReadonly}
                />
                <label htmlFor={"ch_needed_days" + (counter - 1)}>M</label>
              </span>
              <span style={{marginRight: "10px"}}>
                <input
                  name={"ch_needed_days" + (counter - 1)}
                  type="checkbox" 
                  checked={neededDaysCheck.option3}
                  onChange={({ target }) => {
                    if(!neededDaysCheck.option3) {
                      if(neededDaysCheck.option1) return;

                      handleChildFormDetailsChange(
                        counter - 1,
                        "profile",
                        "needed_days",
                        childProfile?.needed_days+ "T,")
                      setNeededDaysCheck({...neededDaysCheck, ['option3']: true})
                    } else {
                      handleChildFormDetailsChange(
                        counter - 1,
                        "profile",
                        "needed_days",
                        childProfile?.needed_days.replace("T,", "")) 
                      setNeededDaysCheck({...neededDaysCheck, ['option1']: false, ['option3']: false})
                    }
                  }}
                  ref={register({
                    validate: {
                      otherCBChecked: value => {
                        if(neededDaysCheck.option1 ||
                          neededDaysCheck.option2 ||
                          neededDaysCheck.option3 ||
                          neededDaysCheck.option4 ||
                          neededDaysCheck.option5 ||
                          neededDaysCheck.option6) {
                            return true
                          }
                        return false
                      }
                    }
                  })}
                  disabled={isReadonly}
                />
                <label htmlFor={"ch_needed_days" + (counter - 1)}>T</label>
              </span>
              <span style={{marginRight: "10px"}}>
                <input
                  name={"ch_needed_days" + (counter - 1)}
                  type="checkbox" 
                  checked={neededDaysCheck.option4}
                  onChange={({ target }) => {
                    if(!neededDaysCheck.option4) {
                      if(neededDaysCheck.option1) return;

                      handleChildFormDetailsChange(
                        counter - 1,
                        "profile",
                        "needed_days",
                        childProfile?.needed_days+ "W,")
                      setNeededDaysCheck({...neededDaysCheck, ['option4']: true})
                    } else {
                      handleChildFormDetailsChange(
                        counter - 1,
                        "profile",
                        "needed_days",
                        childProfile?.needed_days.replace("W,", "")) 
                      setNeededDaysCheck({...neededDaysCheck, ['option1']: false, ['option4']: false})
                    }
                  }}
                  ref={register({
                    validate: {
                      otherCBChecked: value => {
                        if(neededDaysCheck.option1 ||
                          neededDaysCheck.option2 ||
                          neededDaysCheck.option3 ||
                          neededDaysCheck.option4 ||
                          neededDaysCheck.option5 ||
                          neededDaysCheck.option6) {
                            return true
                          }
                        return false
                      }
                    }
                  })}
                  disabled={isReadonly}
                />
                <label htmlFor={"ch_needed_days" + (counter - 1)}>W</label>
              </span>
              <span style={{marginRight: "10px"}}>
                <input
                  name={"ch_needed_days" + (counter - 1)}
                  type="checkbox" 
                  checked={neededDaysCheck.option5}
                  onChange={({ target }) => {
                    if(!neededDaysCheck.option5) {
                      if(neededDaysCheck.option1) return;

                      handleChildFormDetailsChange(
                        counter - 1,
                        "profile",
                        "needed_days",
                        childProfile?.needed_days+ "TH,")
                      setNeededDaysCheck({...neededDaysCheck, ['option5']: true})
                    } else {
                      handleChildFormDetailsChange(
                        counter - 1,
                        "profile",
                        "needed_days",
                        childProfile?.needed_days.replace("TH,", "")) 
                      setNeededDaysCheck({...neededDaysCheck, ['option1']: false, ['option5']: false})
                    }
                  }}
                  ref={register({
                    validate: {
                      otherCBChecked: value => {
                        if(neededDaysCheck.option1 ||
                          neededDaysCheck.option2 ||
                          neededDaysCheck.option3 ||
                          neededDaysCheck.option4 ||
                          neededDaysCheck.option5 ||
                          neededDaysCheck.option6) {
                            return true
                          }
                        return false
                      }
                    }
                  })}
                  disabled={isReadonly}
                />
                <label htmlFor={"ch_needed_days" + (counter - 1)}>TH</label>
              </span>
              <span style={{marginRight: "10px"}}>
                <input
                  name={"ch_needed_days" + (counter - 1)}
                  type="checkbox" 
                  checked={neededDaysCheck.option6}
                  onChange={({ target }) => {
                    if(!neededDaysCheck.option6) {
                      if(neededDaysCheck.option1) return;

                      handleChildFormDetailsChange(
                        counter - 1,
                        "profile",
                        "needed_days",
                        childProfile?.needed_days + "F,")
                      setNeededDaysCheck({...neededDaysCheck, ['option6']: true})
                    } else {
                      handleChildFormDetailsChange(
                        counter - 1,
                        "profile",
                        "needed_days",
                        childProfile?.needed_days.replace("F,", ""))
                      setNeededDaysCheck({...neededDaysCheck, ['option1']: false, ['option6']: false})
                    } 
                  }}
                  ref={register({
                    validate: {
                      otherCBChecked: value => {
                        if(neededDaysCheck.option1 ||
                          neededDaysCheck.option2 ||
                          neededDaysCheck.option3 ||
                          neededDaysCheck.option4 ||
                          neededDaysCheck.option5 ||
                          neededDaysCheck.option6) {
                            return true
                          }
                        return false
                      }
                    }
                  })}
                  disabled={isReadonly}
                />
                <label htmlFor={"ch_needed_days" + (counter - 1)}>F</label>
              </span>
            </div>
            <ErrorMessage
              field={errors["ch_needed_days" + (counter - 1)]}
              errorType="otherCBChecked"
              message="Needed days is required"
            />
          </div>

          <div className="form-group">
            <div className="field select-field-wrapper">
              <select
                disabled={isReadonly}
                readOnly={isReadonly}
                name={"ch_schedule_tour" + (counter - 1)}
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastChildInformation &&
                  (pastChildInformation.schedule_tour ||
                    pastChildInformation.schedule_tour == "") &&
                  pastChildInformation.schedule_tour != childProfile?.schedule_tour
                    ? "field-input highlights"
                    : "field-input"
                }
                onChange={({ target }) => {
                  handleChildFormDetailsChange(
                    counter - 1,
                    "profile",
                    "schedule_tour",
                    target.value
                  );
                }}
                ref={register({
                  validate: {
                    otherCBChecked: value => {
                      if(neededDaysCheck.option1 ||
                        neededDaysCheck.option2 ||
                        neededDaysCheck.option3 ||
                        neededDaysCheck.option4 ||
                        neededDaysCheck.option5 ||
                        neededDaysCheck.option6) {
                          return true
                        }
                      return false
                    }
                  }
                })}
                defaultValue={childProfile?.schedule_tour}>
                <option value="">Select</option>
                {SCHEDULE_TOUR_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.value}>
                        {opt.name}
                    </option>
                ))}
              </select>
              <label className="field-label">
                Taking/Schedule a Tour
              </label>
            </div>
          </div>

          <div className="form-group">
            <div className="field select-field-wrapper">
              <select
                disabled={isReadonly}
                readOnly={isReadonly}
                name={"ch_voucher" + (counter - 1)}
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastChildInformation &&
                  (pastChildInformation.voucher ||
                    pastChildInformation.voucher == "") &&
                  pastChildInformation.voucher != childProfile?.voucher
                    ? "field-input highlights"
                    : "field-input"
                }
                onChange={({ target }) => {
                  handleChildFormDetailsChange(
                    counter - 1,
                    "profile",
                    "voucher",
                    target.value
                  );
                }}
                ref={register({required: true})}
                defaultValue={childProfile?.voucher}>
                <option value="">Select</option>
                {VOUCHER_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.value}>
                        {opt.name}
                    </option>
                ))}
              </select>
              <label className="field-label">
                <span className="required">*</span> Voucher
              </label>
            </div>
            <ErrorMessage
              field={errors["ch_voucher" + (counter - 1)]}
              errorType="required"
              message="Voucher is required"
            />
          </div>
        </div>

        <div className="grid">
          <div className="form-group">
            <div className="field">
              <input
                id={`ch_address_${counter - 1}`}
                name={"ch_address" + (counter - 1)}
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastChildInformation &&
                  (pastChildInformation.address ||
                    pastChildInformation.address == "") &&
                  pastChildInformation.address != childProfile?.address
                    ? "field-input highlights"
                    : "field-input"
                }
                placeholder="Address"
                onChange={({ target }) => {
                  handleChildFormDetailsChange(
                    counter - 1,
                    "profile",
                    "address",
                    target.value
                  );
                }}
                readOnly={isReadonly}
                ref={register({ required: true })}
                defaultValue={childProfile?.address}
              />
              <label className="field-label" htmlFor={`ch_address_${counter - 1}`}>
                <span className="required">*</span> Address
              </label>
            </div>
            <ErrorMessage
              field={errors["ch_address" + (counter - 1)]}
              errorType="required"
              message="Address is required"
            />
          </div>
          <div className="form-group">
            <div className="field">
              <input
                id={`ch_city_${counter - 1}`}
                name={"ch_city" + (counter - 1)}
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastChildInformation &&
                  (pastChildInformation.city ||
                    pastChildInformation.city == "") &&
                  pastChildInformation.city != childProfile?.city
                    ? "field-input highlights"
                    : "field-input"
                }
                placeholder="City"
                onChange={({ target }) => {
                  handleChildFormDetailsChange(
                    counter - 1,
                    "profile",
                    "city",
                    target.value
                  );
                }}
                readOnly={isReadonly}
                defaultValue={childProfile?.city}
                ref={register({ required: true })}
              />
              <label className="field-label" htmlFor={`ch_city_${counter - 1}`}>
                <span className="required">*</span> City
              </label>
            </div>
            <ErrorMessage
              field={errors["ch_city" + (counter - 1)]}
              errorType="required"
              message="City is required"
            />
          </div>
        </div>

        <div className="grid">
          <div className="form-group">
            <div className="field select-field-wrapper">
              <select
                disabled={isReadonly}
                name={"ch_state" + (counter - 1)}
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastChildInformation &&
                  (pastChildInformation.state ||
                    pastChildInformation.state == "") &&
                  pastChildInformation.state != childProfile?.state
                    ? "field-input highlights"
                    : "field-input"
                }
                onChange={({ target }) => {
                  handleChildFormDetailsChange(
                    counter - 1,
                    "profile",
                    "state",
                    target.value
                  );
                }}
                readOnly={isReadonly}
                defaultValue={childProfile?.state}
                ref={register({ required: true })}>
                <option value="">Select</option>
                {STATES.map((opt, index) => (
                  <option key={index + 1} value={opt.abbreviation}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <label className="field-label">
                <span className="required">*</span> State
              </label>
            </div>
            <ErrorMessage
              field={errors["ch_state" + (counter - 1)]}
              errorType="required"
              message="State is required"
            />
          </div>
          <div className="form-group">
            <div className="field">
              <input
                type="text"
                readOnly={isReadonly}
                id={`ch_zip_code_${counter - 1}`}
                name={"ch_zip_code" + (counter - 1)}
                className={
                  isReadonly &&
                  !isVendorView &&
                  pastChildInformation &&
                  (pastChildInformation.zip_code ||
                    pastChildInformation.zip_code == "") &&
                  pastChildInformation.zip_code != childProfile?.zip_code
                    ? "field-input highlights"
                    : "field-input"
                }
                onChange={({ target }) => {
                  if (target.value.match(/^-{0,1}\d+$/)) {
                    handleChildFormDetailsChange(
                      counter - 1,
                      "profile",
                      "zip_code",
                      target.value
                    );
                  } else {
                    target.value = target.value.slice(0, -1);
                  }
                }}
                defaultValue={childProfile?.zip_code}
                placeholder="Zip Code"
                ref={register({ required: true, minLength: 5 })}
                maxLength="5"
              />
              <label className="field-label" htmlFor={`ch_zip_code_${counter - 1}`}>
                <span className="required">*</span> Zip Code
              </label>
            </div>
            <ErrorMessage
              field={errors["ch_zip_code" + (counter - 1)]}
              errorType="required"
              message="Zip Code is required"
            />
            <ErrorMessage
              field={errors["ch_zip_code" + (counter - 1)]}
              errorType="minLength"
              message="Zip Code must be of 5 digits"
            />
          </div>
        </div>

        <div className="grid">
          <div className="form-group">
            <div className="field">
              {isReadonly ? (
                <p
                  className={
                    isReadonly &&
                    !isVendorView &&
                    pastChildInformation &&
                    (pastChildInformation.programs ||
                      pastChildInformation.programs == "") &&
                    pastChildInformation.programs !=
                      readOnlyProgram.split("\n").join(",")
                      ? "field-input readonly highlights"
                      : "field-input readonly"
                  }
                  name={"program_" + (counter - 1)}
                  style={{
                    //background: "white",
                    borderBottom: "2px solid rgb(204, 204, 204) !important",
                    resize: "none",
                    whiteSpace: "pre-wrap",
                    textIndent: "0",
                    margin: "0"
                  }}>
                  {readOnlyProgram}
                </p>
              ) : (
                <Multiselect
                  selectedValues={childProfile?.program}
                  className="field-input"
                  options={PROGRAMS_OPTIONS}
                  hasSelectAll={hasSelectAll}
                  placeholder="Choose Multiple"
                  displayValue="name"
                  closeIcon="cancel"
                  id={"program_" + (counter - 1)}
                  name={"program_" + (counter - 1)}
                  closeOnSelect={false}
                  showCheckbox={true}
                  onSelect={selectedList => {
                    handleChildFormDetailsChange(
                      counter - 1,
                      "profile",
                      "program",
                      selectedList
                    );
                  }}
                  onRemove={selectedList => {
                    handleChildFormDetailsChange(
                      counter - 1,
                      "profile",
                      "program",
                      selectedList
                    );
                  }}
                />
              )}
              <label className="field-label">
                Program (select all choices that apply)
              </label>
            </div>
          </div>
          <div className="form-group">
            <div className="field customMultiselect">
              {isReadonly ? (
                <p
                  className={
                    isReadonly &&
                    !isVendorView &&
                    pastChildInformation &&
                    (pastChildInformation.child_lives_with ||
                      pastChildInformation.child_lives_with == "") &&
                    pastChildInformation.child_lives_with !=
                      readOnlyChildLivesWith.split("\n").join(",")
                      ? "field-input readonly highlights"
                      : "field-input readonly"
                  }
                  style={{
                    //background: "white",
                    borderBottom: "2px solid rgb(204, 204, 204) !important",
                    resize: "none",
                    whiteSpace: "pre-wrap",
                    textIndent: "0",
                    margin: "0"
                  }}
                  name={"ch_lives_with" + (counter - 1)}>
                  {readOnlyChildLivesWith}
                </p>
              ) : (
                <Multiselect
                  selectedValues={childProfile?.child_lives_with}
                  className="field-input"
                  options={CHILD_LIVES_OPTION}
                  hasSelectAll={hasSelectAll}
                  placeholder="Choose Multiple"
                  displayValue="name"
                  closeIcon="cancel"
                  id={"ch_lives_with" + (counter - 1)}
                  name={"ch_lives_with" + (counter - 1)}
                  closeOnSelect={false}
                  showCheckbox={true}
                  onSelect={selectedList => {
                    handleChildFormDetailsChange(
                      counter - 1,
                      "profile",
                      "child_lives_with",
                      selectedList
                    );
                  }}
                  onRemove={selectedList => {
                    handleChildFormDetailsChange(
                      counter - 1,
                      "profile",
                      "child_lives_with",
                      selectedList
                    );
                  }}
                />
              )}

              <label className="field-label">
                <span className="required">*</span> Child lives with
              </label>
            </div>
            <ErrorMessage
              field={errors["ch_lives_with" + (counter - 1)]}
              errorType="required"
              message="Child lives with is required"
            />
          </div>
        </div>

        {/* <div className="grid" style={{marginTop: "40px"}}>

        </div> */}
      </div>
    </ChildInformationFormStyled>
  );
}
