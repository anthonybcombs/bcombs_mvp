import React, { useState } from "react";
import styled from "styled-components";
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
import STATES from "../states.json";
import NumberFormat from "react-number-format";
import UploadPhotoForm from "../../MyProfile/forms/UploadPhotoForm";

const ChildInfomationFormStyled = styled.div`
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
    height: 100px;
    width: 100px;
    box-shadow: 0 0 5px #716464;
    cursor: pointer;
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
    position: absolute;
    top: 21px;
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
  isVendorView = false,
  isLot = 0,
  printPageClassname,
  emptyFields = {}
}) {
  const hasSelectAll = false;

  const GENDER_OPTIONS = [
    { id: 1, value: "Male", name: "Male" },
    { id: 2, value: "Female", name: "Female" }
  ];

  const CUSTOM_GENDER_OPTIONS = [
    { id: 1, value: "He", name: "He" },
    { id: 2, value: "She", name: "She" },
    { id: 3, value: "They", name: "They" }
  ];

  const PHONE_OPTIONS = [
    { id: 1, value: "Cell", name: "Cell" },
    { id: 2, value: "Home", name: "Home" },
    { id: 3, value: "Work", name: "Work" }
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
      : isLot ? [
        { id: 3, name: "Leaders of Tomorrow® (LOT®)", label: `Leaders of Tomorrow® (LOT®)` }
      ] :
        [
          { id: 1, name: "Saturday Academy", label: "Satuday Academy" },
          { id: 2, name: "In school", label: "In school" }
        ];


  const LOCATION_SITE_OPTIONS =
    location_sites.length > 0
      ? location_sites
      : [
        { name: "Atlanta", value: "Atlanta" },
        { name: "Austin", value: "Austin" },
        { name: "Boston", value: "Bostonnnn" },
        { name: "Central Florida ", value: "Central Florida " },
        { name: "Charlotte", value: "Charlotte " },
        { name: "Chicago", value: "Chicago " },
        { name: "Cincinnati", value: "Cincinnati" },
        { name: "Cleveland", value: "Cleveland" },
        { name: " Community College of Allegheny County", value: "Community College of Allegheny County" },
        { name: "Columbus", value: "Columbus" },
        { name: "Dallas", value: "Dallas" },
        { name: "Dayton", value: "Dayton " },
        { name: "Detroit", value: "Detroit " },
        { name: "Greater Hartford", value: "Greater Hartford" },
        { name: "Houston", value: "Houston" },
        { name: "Indianapolis", value: "Indianapolis" },
        { name: "Kansas City", value: "Kansas City" },
        { name: "Kentucky", value: "Kentucky" },
        { name: "Los Angeles", value: "Los Angeles" },
        { name: "Greater Maryland", value: "Greater Maryland  " },
        { name: "Memphis", value: "Memphis" },
        { name: "Milwaukee", value: "Milwaukee" },
        { name: "New Jersey", value: "New Jersey" },
        { name: "New Orleans", value: "New Orleans" },
        { name: "New York", value: "New York" },
        { name: "Northwest Arkansas", value: "Northwest Arkansas" },
        { name: "Philadelphia ", value: "Philadelphia " },
        { name: "Phoenix ", value: "Phoenix " },
        { name: "Pittsburgh ", value: "Pittsburgh" },
        { name: "Raleigh Durham", value: "Raleigh Durham" },
        { name: "Saint Louis ", value: "Saint Louis" },
        { name: "San Francisco ", value: "San Francisco" },
        { name: "Seattle", value: "Seattle" },
        { name: "South Florida", value: "South Florida" },
        { name: "Syracuse, NY", value: "Syracuse, NY" },
        { name: "Tampa Bay", value: "Tampa Bay" },
        { name: "Twin Cities", value: "Twin Cities" },
        { name: "Washington DC", value: "Washington DC" },
        { name: "Western New York", value: "Western New York" },


      ];




  const EMAIL_OPTIONS = [
    { id: 1, value: "Personal", name: "Personal" },
    { id: 2, value: "Work", name: "Work" }
  ];

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

  let readOnlyChildLivesWith = "";

  if (
    childProfile.child_lives_with &&
    childProfile.child_lives_with.length > 0 &&
    isReadonly
  ) {
    childProfile.child_lives_with.forEach(item => {
      readOnlyChildLivesWith += item.name + "\n";
    });

    readOnlyChildLivesWith = readOnlyChildLivesWith.slice(0, -1);

    console.log("childProfile.child_lives_with", readOnlyChildLivesWith);
  }

  let readOnlyProgram = "";

  if (childProfile.program && childProfile.program.length > 0 && isReadonly) {
    childProfile.program.forEach(item => {
      readOnlyProgram += item.name + "\n";
    });

    readOnlyProgram = readOnlyProgram.slice(0, -1);
  }

  let readOnlyEthinicity = "";

  if (
    childProfile.ethinicity &&
    childProfile.ethinicity.length > 0 &&
    isReadonly
  ) {
    childProfile.ethinicity.forEach(item => {
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

  const [imagePreview, setImagePreview] = useState('');
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
    placeholder,
    required = false
  }) => (
    <div className="field">
      <input
        required={required}
        defaultValue={value}
        onClick={onClick}
        name={name}
        className={className}
        placeholder="MM/dd/yyyy"
        readOnly={true}
        id={`date_of_birth_${counter - 1}`}
        ref={register({ required: true })}
      />
      <label className="field-label" for={`date_of_birth_${counter - 1}`}>
        <span className="required">*</span> Date of Birth
      </label>
    </div>
  );

  const registeredIcon = () => {
    return <span style={{ fontSize: 14, position: 'relative', top: -10 }}>®</span>
  }

  console.log('childProfile',childProfile)
  let profile = pastChildInformation?.image || childProfile?.image || ''
  if (profile) {
    profile = profile.includes('file/') ? 'https://bcombs.s3.amazonaws.com/' + profile : profile;
  }


  return (
    <ChildInfomationFormStyled className={printPageClassname}>
      <h3 className="heading">
        {isLot ? <div>
          Leaders of Tomorrow{registeredIcon()} (LOT{registeredIcon()}) Information</div> : 'Child Information'} {counter > 1 ? `(${counter})` : ``}
      </h3>
      <div className="child-info-wrapper">
        <div className="img-profile-wrapper">
          <img src={imagePreview || profile || ProfileImg} width="80" height="80" onClick={() => setUploadPhotoVisible(true)} />
          {!isReadonly && (
            <UploadPhotoForm
              auth={profile ? { profile_img: profile } : ''}
              isVisible={isUploadPhotoVisible}
              toggleProfilePhotoVisible={setUploadPhotoVisible}
              onSubmit={(image) => {
                setUploadPhotoVisible(false)
                setImagePreview(image);
                handleChildFormDetailsChange(
                  counter - 1,
                  "profile",
                  "image",
                  image
                )
              }}
            />
          )}
        </div>
        <div className="grid">
          <div className="form-group">
            <div className="field">
              <input
                required={true}
                readOnly={isReadonly}
                id={`ch_first_name_${counter - 1}`}
                name={"ch_first_name" + (counter - 1)}
                className={
                  `${(emptyFields.first_name && !childProfile.first_name) && 'highlights'} ${isReadonly &&
                    !isVendorView &&
                    pastChildInformation &&
                    (pastChildInformation.firstname ||
                      pastChildInformation.firstname == "") &&
                    pastChildInformation.firstname != childProfile.first_name
                    ? "field-input highlights"
                    : "field-input"}`
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
                defaultValue={childProfile.first_name}
              />
              <label className="field-label" for={`ch_first_name_${counter - 1}`}>
                <span className="required">*</span> First Name
              </label>
            </div>
            <ErrorMessage
              field={errors["ch_first_name" + (counter - 1)] || emptyFields.first_name && !childProfile.first_name}
              errorType="required"
              message="First Name is required."
            />
          </div>
          <div className="form-group">
            <div className="field">
              <input
                required={true}
                readOnly={isReadonly}
                id={`ch_last_name_${counter - 1}`}
                name={"ch_last_name" + (counter - 1)}
                // className={
                // isReadonly &&
                //   !isVendorView &&
                // ((  pastChildInformation &&
                //   (pastChildInformation.lastname ||
                //     pastChildInformation.lastname == "") &&
                //   pastChildInformation.lastname != childProfile.last_name) || !childProfile.last_name)
                //   ? "field-input highlights"
                //   : "field-input"
                // }

                className={`${(emptyFields.last_name && !childProfile.last_name) && 'highlights'} 
                ${isReadonly &&
                    !isVendorView &&
                    ((pastChildInformation &&
                      (pastChildInformation.lastname ||
                        pastChildInformation.lastname == "") &&
                      pastChildInformation.lastname != childProfile.last_name) || !childProfile.last_name)
                    ? "field-input highlights"
                    : "field-input"}`
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
                defaultValue={childProfile.last_name}
              />
              <label className="field-label" for={`ch_last_name_${counter - 1}`}>
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
                    pastChildInformation.nickname != childProfile.nick_name
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
                defaultValue={childProfile.nick_name}
              />
              <label className="field-label" for={`ch_nick_name_${counter - 1}`}>Nick Name</label>
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
                selected={childProfile.date_of_birth}
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
                    required={true}
                    // className={
                    // isReadonly &&
                    //   !isVendorView &&
                    //   pastChildInformation &&
                    //   (pastChildInformation.birthdate ||
                    //     pastChildInformation.birthdate == "") &&
                    //   childProfile.date_of_birth.toString() !=
                    //   new Date(pastChildInformation.birthdate).toString()
                    //   ? "field-input birthdate-field highlights"
                    //   : "field-input birthdate-field"
                    // }
                    className={`${(emptyFields.date_of_birth && !childProfile.date_of_birth) && 'highlights'} 
                  ${isReadonly &&
                        !isVendorView &&
                        pastChildInformation &&
                        (pastChildInformation.birthdate ||
                          pastChildInformation.birthdate == "") &&
                        childProfile.date_of_birth.toString() !=
                        new Date(pastChildInformation.birthdate).toString()
                        ? "field-input birthdate-field highlights"
                        : "field-input birthdate-field"}
                    }`
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
                required={true}
                disabled={isReadonly}
                readOnly={isReadonly}
                name={"ch_gender" + (counter - 1)}
                // className={
                // isReadonly &&
                //   !isVendorView &&
                //   pastChildInformation &&
                //   (pastChildInformation.gender ||
                //     pastChildInformation.gender == "") &&
                //   pastChildInformation.gender != childProfile.gender
                //   ? "field-input highlights"
                //   : "field-input"
                // }

                className={`${(emptyFields.gender && !childProfile.gender) && 'dropdown-highlights'} 
                ${isReadonly &&
                    !isVendorView &&
                    pastChildInformation &&
                    (pastChildInformation.gender ||
                      pastChildInformation.gender == "") &&
                    pastChildInformation.gender != childProfile.gender
                    ? "field-input highlights"
                    : "field-input"
                  }`
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
                defaultValue={childProfile.gender}>
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
                // <input
                //   readOnly={isReadonly}
                //   name={"ethinicity_" + (counter - 1)}
                //   className="field-input"
                //   placeholder="First Name"
                //   onChange={({ target }) => {
                //   }}
                //   ref={register({ required: true })}
                //   defaultValue={readOnlyEthinicity}
                // />
                <>
                  <p
                    className={`${isReadonly &&
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
                <>
                  <Multiselect
                    readOnly={isReadonly}
                    disabled={isReadonly}
                    id={"ethinicity_" + (counter - 1)}
                    className="field-input"
                    options={ETHINICITY_OPTIONS}
                    hasSelectAll={true}
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
                    selectedValues={childProfile.ethinicity}
                  />

                </>
              )}
              <label className="field-label">
                Ethnicity (select all choices that apply)
              </label>
            </div>
            <br />
            <br />
            {/* <input
              type="checkbox"
              name="ethnicity_select_all"
              onChange={e => {

                if (e.target.checked) {
                  handleChildFormDetailsChange(
                    counter - 1,
                    "profile",
                    "ethinicity",
                    ETHINICITY_OPTIONS
                  );
                }
                else {
                  handleChildFormDetailsChange(
                    counter - 1,
                    "profile",
                    "ethinicity",
                    []
                  );
                }
              }}

            /> Select All

            <br /> */}
          </div>
        </div>

        <div className="grid">
          <div className="form-group">
            <div className="field select-field-wrapper">
              <select
                disabled={isReadonly}
                name="ch_phone_type"
                className={
                  isReadonly &&
                    !isVendorView &&
                    pastChildInformation &&
                    (pastChildInformation.phone_type ||
                      pastChildInformation.phone_type == "") &&
                    pastChildInformation.phone_type != childProfile.phone_type
                    ? "field-input highlights"
                    : "field-input"
                }
                onChange={({ target }) => {
                  handleChildFormDetailsChange(
                    counter - 1,
                    "profile",
                    "phone_type",
                    target.value
                  );
                }}
                readOnly={isReadonly}
                defaultValue={childProfile.phone_type}>
                <option value="">Select Type</option>
                {PHONE_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.value}>
                    {opt.name}
                  </option>
                ))}
              </select>
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
                  id={`ch_phone_number_${counter - 1}`}
                  name={"ch_phone_number" + (counter - 1)}
                  className={
                    `${isReadonly &&
                      !isVendorView &&
                      pastChildInformation &&
                      pastChildInformation.phone_number &&
                      pastChildInformation.phone_number !=
                      childProfile.phone_number
                      ? "field-input highlights"
                      : "field-input"}
                    ${emptyFields.child_phone_invalid && childProfile.phone_number.includes('_') && 'highlights'}
                    `
                  }
                  placeholder="Phone"
                  onChange={({ target }) => {
                    handleChildFormDetailsChange(
                      counter - 1,
                      "profile",
                      "phone_number",
                      target.value
                    );
                  }}
                  defaultValue={childProfile.phone_number}
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
                  name="ch_phone_number"
                  className={`${isReadonly &&
                      !isVendorView &&
                      pastChildInformation &&
                      pastChildInformation.phone_number &&
                      pastChildInformation.phone_number !=
                      childProfile.phone_number
                      ? "field-input highlights"
                      : "field-input"
                    } ${emptyFields.child_phone_invalid && childProfile.phone_number.includes('_') && 'highlights'}`}
                  placeholder="Phone"
                  readOnly={isReadonly}
                  id={`ch_phone_number_${counter - 1}`}
                  defaultValue={childProfile.phone_number}
                />
              )}

              <label className="field-label" for={`ch_phone_number_${counter - 1}`}>
                Phone Number
              </label>
            </div>
            <ErrorMessage
              field={errors["ch_phone_number" + (counter - 1)]}
              errorType="completed"
              message="Phone Number must be consist of 10 digits."
            />
          </div>
        </div>
        {showPhone && (
          <div className="grid">
            <div className="form-group">
              <div className="field select-field-wrapper">
                <select
                  disabled={isReadonly}
                  name="ch_phone_type2"
                  className={
                    isReadonly &&
                      !isVendorView &&
                      pastChildInformation &&
                      (pastChildInformation.phone_type2 ||
                        pastChildInformation.phone_type2 == "") &&
                      pastChildInformation.phone_type2 != childProfile.phone_type2
                      ? "field-input highlights"
                      : "field-input"
                  }
                  onChange={({ target }) => {
                    handleChildFormDetailsChange(
                      counter - 1,
                      "profile",
                      "phone_type2",
                      target.value
                    );
                  }}
                  readOnly={isReadonly}
                  defaultValue={childProfile.phone_type2}>
                  <option value="">Select Type</option>
                  {PHONE_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.value}>
                      {opt.name}
                    </option>
                  ))}
                </select>
                <label className="field-label">Type</label>
              </div>
            </div>
            <div className="form-group">
              <div className="field">
                {!isReadonly ? (
                  <NumberFormat
                    id={`ch_phone_number2_${counter - 1}`}
                    name={"ch_phone_number2" + (counter - 1)}
                    className={
                      isReadonly &&
                        !isVendorView &&
                        pastChildInformation &&
                        (pastChildInformation.phone_number2 ||
                          pastChildInformation.phone_number2 == "") &&
                        pastChildInformation.phone_number2 !=
                        childProfile.phone_number2
                        ? "field-input highlights"
                        : "field-input"
                    }
                    placeholder="Phone"
                    onChange={({ target }) => {
                      handleChildFormDetailsChange(
                        counter - 1,
                        "profile",
                        "phone_number2",
                        target.value
                      );
                    }}
                    defaultValue={childProfile.phone_number2}
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
                    name="ch_phone_number2"
                    className={`field-input  ${emptyFields.child_phone_invalid && childProfile.phone_number !== '' && 'highlights'}`}
                    placeholder="Phone"
                    id={`ch_phone_number2_${counter - 1}`}
                    defaultValue={childProfile.phone_number}
                  />
                )}
                <label className="field-label" for={`ch_phone_number2_${counter - 1}`}>
                  Phone Number
                </label>
              </div>
              <ErrorMessage
                field={errors["ch_phone_number2" + (counter - 1)]}
                errorType="completed"
                message="Phone Number must be consist of 10 digits."
              />
            </div>
          </div>
        )}
        <div className="grid">
          <div className="form-group">
            <div className="field select-field-wrapper">
              <select
                disabled={isReadonly}
                name="ch_email_type"
                className={
                  isReadonly &&
                    !isVendorView &&
                    pastChildInformation &&
                    (pastChildInformation.email_type ||
                      pastChildInformation.email_type == "") &&
                    pastChildInformation.email_type != childProfile.email_type
                    ? "field-input highlights"
                    : "field-input"
                }
                onChange={({ target }) => {
                  handleChildFormDetailsChange(
                    counter - 1,
                    "profile",
                    "email_type",
                    target.value
                  );
                }}
                readOnly={isReadonly}
                defaultValue={childProfile.email_type}>
                <option value="">Select Type</option>
                {EMAIL_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.name}>
                    {opt.name}
                  </option>
                ))}
              </select>
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
                id={`ch_email_address_${counter - 1}`}
                name={"ch_email_address" + (counter - 1)}
                className={`${isReadonly &&
                    !isVendorView &&
                    pastChildInformation &&
                    (pastChildInformation.email_address ||
                      pastChildInformation.email_address == "") &&
                    pastChildInformation.email_address !=
                    childProfile.email_address
                    ? "field-input highlights"
                    : "field-input"
                  } ${emptyFields.child_email_invalid && childProfile.email_address !== '' && 'highlights'}`}
                placeholder="Email Address"
                onChange={({ target }) => {
                  handleChildFormDetailsChange(
                    counter - 1,
                    "profile",
                    "email_address",
                    target.value
                  );
                }}
                readOnly={isReadonly}
                defaultValue={childProfile.email_address}
                ref={register({
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
              <label className="field-label" for={`ch_email_address_${counter - 1}`}>
                Email Address (Child only, if applicable)
              </label>
            </div>
            <ErrorMessage
              field={errors["ch_email_address" + (counter - 1)] || (emptyFields.child_email_invalid && childProfile.email_address !== '')}
              errorType="pattern"
              message="Invalid email address"
            />
          </div>
        </div>

        {showEmail && (
          <div className="grid">
            <div className="form-group">
              <div className="field select-field-wrapper">
                <select
                  disabled={isReadonly}
                  name="ch_email_type2"
                  className={
                    isReadonly &&
                      !isVendorView &&
                      pastChildInformation &&
                      (pastChildInformation.email_type2 ||
                        pastChildInformation.email_type2 == "") &&
                      pastChildInformation.email_type2 != childProfile.email_type2
                      ? "field-input highlights"
                      : "field-input"
                  }
                  onChange={({ target }) => {
                    handleChildFormDetailsChange(
                      counter - 1,
                      "profile",
                      "email_type2",
                      target.value
                    );
                  }}
                  readOnly={isReadonly}
                  defaultValue={childProfile.email_type2}>
                  <option value="">Select Type</option>
                  {EMAIL_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.name}>
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
                  type="text"
                  id={`ch_email_address2_${counter - 1}`}
                  name={"ch_email_address2" + (counter - 1)}
                  className={
                    isReadonly &&
                      !isVendorView &&
                      pastChildInformation &&
                      (pastChildInformation.email_address2 ||
                        pastChildInformation.email_address2 == "") &&
                      pastChildInformation.email_address2 !=
                      childProfile.email_address2
                      ? "field-input highlights"
                      : "field-input"
                  }
                  placeholder="Email Address"
                  onChange={({ target }) => {
                    handleChildFormDetailsChange(
                      counter - 1,
                      "profile",
                      "email_address2",
                      target.value
                    );
                  }}
                  readOnly={isReadonly}
                  defaultValue={childProfile.email_address2}
                  ref={register({
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
                <label className="field-label" for={`ch_email_address2_${counter - 1}`}>
                  Email Address (Child only, if applicable)
                </label>
              </div>
              <ErrorMessage
                field={errors["ch_email_address2" + (counter - 1)]}
                errorType="pattern"
                message="Invalid email address"
              />
            </div>
          </div>
        )}

        <div className="grid">
          <div className="form-group">
            <div className="field">
              <input
                required={true}
                id={`ch_address_${counter - 1}`}
                name={"ch_address" + (counter - 1)}
                // className={
                // isReadonly &&
                //   !isVendorView &&
                //   pastChildInformation &&
                //   pastChildInformation.address &&
                //   pastChildInformation.address != childProfile.address
                //   ? "field-input highlights"
                //   : "field-input"
                // }

                className={`${(emptyFields.address && !childProfile.address) && 'highlights'} 
                ${isReadonly &&
                    !isVendorView &&
                    pastChildInformation &&
                    pastChildInformation.address &&
                    pastChildInformation.address != childProfile.address
                    ? "field-input highlights"
                    : "field-input"}
                  `
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
                defaultValue={childProfile.address}
              />
              <label className="field-label" for={`ch_address_${counter - 1}`}>
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
                required={true}
                id={`ch_city_${counter - 1}`}
                name={"ch_city" + (counter - 1)}
                // className={
                //   isReadonly &&
                //     !isVendorView &&
                //     pastChildInformation &&
                //     (pastChildInformation.city ||
                //       pastChildInformation.city == "") &&
                //     pastChildInformation.city != childProfile.city
                //     ? "field-input highlights"
                //     : "field-input"
                // }

                className={`${(emptyFields.city && !childProfile.city) && 'highlights'} 
                 ${isReadonly &&
                    !isVendorView &&
                    pastChildInformation &&
                    (pastChildInformation.city ||
                      pastChildInformation.city == "") &&
                    pastChildInformation.city != childProfile.city
                    ? "field-input highlights"
                    : "field-input"}
                  `
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
                defaultValue={childProfile.city}
                ref={register({ required: true })}
              />
              <label className="field-label" for={`ch_city_${counter - 1}`}>
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
                required={true}
                disabled={isReadonly}
                name={"ch_state" + (counter - 1)}
                // className={
                // isReadonly &&
                //   !isVendorView &&
                //   pastChildInformation &&
                //   (pastChildInformation.state ||
                //     pastChildInformation.state == "") &&
                //   pastChildInformation.state != childProfile.state
                //   ? "field-input highlights"
                //   : "field-input"
                // }
                className={`${(emptyFields.state && !childProfile.state) && 'dropdown-highlights'} 
                ${isReadonly &&
                    !isVendorView &&
                    pastChildInformation &&
                    (pastChildInformation.state ||
                      pastChildInformation.state == "") &&
                    pastChildInformation.state != childProfile.state
                    ? "field-input highlights"
                    : "field-input"}
                 `
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
                defaultValue={childProfile.state}
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
                required={true}
                type="text"
                readOnly={isReadonly}
                id={`ch_zip_code_${counter - 1}`}
                name={"ch_zip_code" + (counter - 1)}
                // className={
                // isReadonly &&
                //   !isVendorView &&
                //   pastChildInformation &&
                //   (pastChildInformation.zip_code ||
                //     pastChildInformation.zip_code == "") &&
                //   pastChildInformation.zip_code != childProfile.zip_code
                //   ? "field-input highlights"
                //   : "field-input"
                // }
                className={`${(emptyFields.zip_code && (!childProfile.zip_code || childProfile.zip_code.length < 5)) && 'highlights'} 
                ${isReadonly &&
                    !isVendorView &&
                    pastChildInformation &&
                    (pastChildInformation.zip_code ||
                      pastChildInformation.zip_code == "") &&
                    pastChildInformation.zip_code != childProfile.zip_code
                    ? "field-input highlights"
                    : "field-input"}
                 `
                }
                onChange={({ target }) => {

                  if (target.value && target.value.match(/^-{0,1}\d+$/)) {
                    handleChildFormDetailsChange(
                      counter - 1,
                      "profile",
                      "zip_code",
                      target.value
                    );
                  } else {
                    target.value = target.value ? target.value.slice(0, -1) : '';
                    handleChildFormDetailsChange(
                      counter - 1,
                      "profile",
                      "zip_code",
                      target.value
                    );

                  }
                }}
                value={childProfile.zip_code}
                placeholder="Zip Code"
                ref={register({ required: true, minLength: 5 })}
                maxLength="5"
              />
              <label className="field-label" for={`ch_zip_code_${counter - 1}`}>
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

        {!isLot ?
          <div className="grid">
            <div className="form-group">
              <div className="field select-field-wrapper">
                {isReadonly ? (
                  <p
                    className={
                      isReadonly &&
                        !isVendorView &&
                        pastChildInformation &&
                        (pastChildInformation.location_site ||
                          pastChildInformation.location_site == "") &&
                        pastChildInformation.location_site !=
                        childProfile.location_site
                        ? "field-input highlights"
                        : "field-input"
                    }
                    name={"ch_location_site" + (counter - 1)}
                    style={{
                      // background: "white",
                      borderBottom: "2px solid rgb(204, 204, 204) !important",
                      resize: "none",
                      whiteSpace: "pre-wrap",
                      textIndent: "0",
                      margin: "0"
                    }}>
                    {childProfile.location_site}
                  </p>
                ) : (
                  <select
                    readOnly={isReadonly}
                    disabled={isReadonly}
                    name={"ch_location_site" + (counter - 1)}
                    //   className="field-input"

                    className={`${(emptyFields.location_site && !childProfile.location_site && !isLot) && 'dropdown-highlights'} field-input `}
                    onChange={({ target }) => {
                      handleChildFormDetailsChange(
                        counter - 1,
                        "profile",
                        "location_site",
                        target.value
                      );
                    }}
                    ref={register({ required: true, minLength: 5 })}
                    value={childProfile.location_site}>
                    <option value="">Select</option>
                    {LOCATION_SITE_OPTIONS.map((opt, index) => (
                      <option key={index + 1} value={opt.value}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                )}

                <label className="field-label">
                  <span className="required">*</span> Location
                </label>
              </div>
              <ErrorMessage
                field={errors["ch_location_site" + (counter - 1)]}
                errorType="required"
                message="Location is required"
              />
            </div>
            <div className="form-group">
              <div className="field">
                {isReadonly ? (
                  // <input
                  //   readOnly={isReadonly}
                  //   name={"program_" + (counter - 1)}
                  //   className="field-input"
                  //   placeholder="First Name"
                  //   onChange={({ target }) => {}}
                  //   ref={register({ required: true })}
                  //   defaultValue={readOnlyProgram}
                  // />

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
                    selectedValues={childProfile.program}
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
                  Program
                </label>
              </div>
              {/* <input
               name="prrogram_select_all"
                  type="checkbox"
               onChange={e => {

                  if (e.target.checked) {
                    handleChildFormDetailsChange(
                      counter - 1,
                      "profile",
                      "program",
                      PROGRAMS_OPTIONS
                    );
                  }
                  else {
                    handleChildFormDetailsChange(
                      counter - 1,
                      "profile",
                      "program",
                      []
                    );
                  }
                }}

              /> Select All */}
            </div>
          </div>
          : <span />}
        <div className="grid">
          <div className="form-group">
            <div className="field customMultiselect">
              {isReadonly ? (
                <p
                  className={`${
                    
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
                  ${(emptyFields.child_lives_with && (!childProfile.child_lives_with)) && 'highlights'}
                  
                  `}
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
                  selectedValues={childProfile.child_lives_with}
                  className={`${(emptyFields.child_lives_with && (!childProfile.child_lives_with )) && 'highlights'} field-input`}
                  options={CHILD_LIVES_OPTION}
                  hasSelectAll={hasSelectAll}
                  placeholder="Choose Multiple"
                  displayValue="name"
                  style={{
                    multiselectContainer: {
                      backgroundColor:emptyFields.child_lives_with && (!childProfile.child_lives_with || (Array.isArray(childProfile.child_lives_with) && childProfile.child_lives_with.length === 0)) && '#f26e21'
                    }
                   
                  }}
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
            <input
              type="checkbox"
              name="child_select_all"
              onChange={e => {

                if (e.target.checked) {
                  handleChildFormDetailsChange(
                    counter - 1,
                    "profile",
                    "child_lives_with",
                    CHILD_LIVES_OPTION
                  );
                }
                else {
                  handleChildFormDetailsChange(
                    counter - 1,
                    "profile",
                    "child_lives_with",
                    []
                  );
                }
              }}

            /> Select All
            <ErrorMessage
              field={errors["ch_lives_with" + (counter - 1)]}
              errorType="required"
              message="Child lives with is required"
            />
          </div>
        </div>
      </div>
    </ChildInfomationFormStyled>
  );
}
