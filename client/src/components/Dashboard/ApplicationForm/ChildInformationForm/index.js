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
import STATES from "../states.json";
import NumberFormat from "react-number-format";

const ChildInfomationFormStyled = styled.div`
  position: relative;

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
    width: 85px;
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
}) {
  const hasSelectAll = false;

  const GENDER_OPTIONS = [
    { id: 1, value: "Male", name: "Male" },
    { id: 2, value: "Female", name: "Female" },
  ];

  const CUSTOM_GENDER_OPTIONS = [
    { id: 1, value: "He", name: "He" },
    { id: 2, value: "She", name: "She" },
    { id: 3, value: "They", name: "They" },
  ];

  const PHONE_OPTIONS = [
    { id: 1, value: "Cell", name: "Cell" },
    { id: 2, value: "Home", name: "Home" },
    { id: 3, value: "Work", name: "Work" },
  ];

  const ETHINICITY_OPTIONS = !isReadonly
    ? [
        { id: 1, name: "Asian", label: "Asian" },
        {
          id: 2,
          name: "Black or African American",
          label: "Black or African American",
        },
        { id: 3, name: "Hispanic or Latino", label: "AsiHispanic or Latinoan" },
        {
          id: 4,
          name: "Native American or American Indian",
          label: "Native American or American Indian",
        },
        {
          id: 5,
          name: "Native Hawaiian & Other Pacific Islander",
          label: "Native Hawaiian & Other Pacific Islander",
        },
        { id: 6, name: "White", label: "White" },
        { id: 7, name: "Other", label: "Other" },
        { id: 8, name: "Prefer not to answer", label: "Prefer not to answer" },
      ]
    : [];

  const PROGRAMS_OPTIONS = app_programs.length > 0 ? app_programs : [
    { id: 1, name: "Saturday Academy", label: "Satuday Academy" },
    { id: 2, name: "In school", label: "In school" },
  ]

  const LOCATION_SITE_OPTIONS = location_sites.length > 0 ? location_sites : [
    { name: "Raleigh", value: "Raleigh" },
    { name: "Durham", value: "Durham" },
  ];

  const EMAIL_OPTIONS = [
    { id: 1, value: "Personal", name: "Personal" },
    { id: 2, value: "Work", name: "Work" },
  ];

  let CHILD_LIVES_OPTION = [
    {id: 1, name: "Father", label: "Father"},
    {id: 2, name: "Mother", label: "Mother"},
    {id: 3, name: "Brother", label: "Brother"},
    {id: 4, name: "Sister", label: "Sister"},
    {id: 5, name: "Uncle", label: "Uncle"},
    {id: 6, name: "Aunt", label: "Aunt"},
    {id: 7, name: "Cousin (Male)", label: "Cousin (Male)"},
    {id: 8, name: "Grandfather", label: "Grandfather"},
    {id: 9, name: "Grandmother", label: "Grandmother"},
    {id: 10, name: "Stepbrother", label: "Stepbrother"},
    {id: 11, name: "Stepsister", label: "Stepsister"},
    {id: 12, name: "Stepfather", label: "Stepfather"},
    {id: 13, name: "Stepmother", label: "Stepmother"},
    {id: 14, name: "Stepson", label: "Stepson"},
    {id: 15, name: "Stepdaughter", label: "Stepdaughter"},
    {id: 16, name: "Brother-in-law", label: "Brother-in-law"},
    {id: 17, name: "Sister-in-law", label: "Sister-in-law"},
    {id: 18, name: "Father-in-law", label: "Father-in-law"},
    {id: 19, name: "Mother-in-law", label: "Mother-in-law"},
    {id: 20, name: "Family Friend", label: "Family Friend"},
    {id: 21, name: "Other relatives", label: "Other relatives"},
    {id: 22, name: "Others", label: "Others"}
  ];
  
  let readOnlyChildLivesWith = ""

  if(childProfile.child_lives_with && childProfile.child_lives_with.length > 0 && isReadonly) {
    childProfile.child_lives_with.forEach((item) => {
      readOnlyChildLivesWith += item.name + ", ";
    });

    readOnlyChildLivesWith = readOnlyChildLivesWith.slice(0, -2);
  }

  let readOnlyProgram = "";

  if(childProfile.program && childProfile.program.length > 0 && isReadonly) {
    childProfile.program.forEach((item) => {
      readOnlyProgram += item.name + ", ";
    });

    readOnlyProgram = readOnlyProgram.slice(0, -2);
  }

  let readOnlyEthinicity = "";

  if(childProfile.ethinicity && childProfile.ethinicity.length > 0 && isReadonly) {
    childProfile.ethinicity.forEach((item) => {
      readOnlyEthinicity += item.name + ", ";
    });

    readOnlyEthinicity = readOnlyEthinicity.slice(0, -2);
  }

  const range = (start, end) => {
    let arr = [];

    for (let i = start; i <= end; i++) {
      arr.push(i);
    }

    return arr;
  };

  const [imagePreview, setImagePreview] = useState(ProfileImg);

  const handleFileChange = (event) => {
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
    "December",
  ];

  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const handleOtherPhone = () => {
    if(isReadonly) return;
    setShowPhone(!showPhone);
  };

  const handleOtherEmail = () => {
    if(isReadonly) return;
    setShowEmail(!showEmail);
  };

  const ExampleCustomInput = ({
    value,
    onClick,
    name,
    className,
    placeholder,
  }) => (
    <div className="field">
      <input
        defaultValue={value}
        onClick={onClick}
        name={name}
        className={className}
        placeholder="mm/dd/yyyy"
        readOnly={true}
        ref={register({ required: true })}
      />
      <label className="field-label">
        <span className="required">*</span> Date of Birth
      </label>
    </div>
  );

  return (
    <ChildInfomationFormStyled>
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
                name={"ch_first_name" + (counter - 1)}
                className="field-input"
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
              <label className="field-label">
                <span className="required">*</span> First Name
              </label>
            </div>
            <ErrorMessage
              field={errors["ch_first_name" + (counter - 1)]}
              errorType="required"
              message="Firstname is required."
            />
          </div>
          <div className="form-group">
            <div className="field">
              <input
                readOnly={isReadonly}
                name={"ch_last_name" + (counter - 1)}
                className="field-input"
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
              <label className="field-label">
                <span className="required">*</span> Last Name
              </label>
            </div>
            <ErrorMessage
              field={errors["ch_last_name" + (counter - 1)]}
              errorType="required"
              message="Lastname is required."
            />
          </div>
          <div className="form-group">
            <div className="field">
              <input
                name="ch_nick_name"
                className="field-input"
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
              <label className="field-label">Nick Name</label>
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
                  nextMonthButtonDisabled,
                }) => (
                  <div
                    style={{
                      margin: 0,
                      display: "flex",
                      alignCenter: "center",
                      justifyContent: "center",
                      background: "#f36e22",
                      padding: "5px 3px"
                    }}
                  >
                    <button className="datepicker-btn" onClick={(e) => {e.preventDefault()}}>
                      <FontAwesomeIcon
                        icon={faAngleLeft}
                        onClick={decreaseMonth}
                        disabled={prevMonthButtonDisabled}
                      />
                    </button>
                    <select
                      value={new Date(date).getFullYear()}
                      onChange={({ target: { value } }) => changeYear(value)}
                    >
                      {years.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <select
                      value={months[date.getMonth()]}
                      onChange={({ target: { value } }) =>
                        changeMonth(months.indexOf(value))
                      }
                    >
                      {months.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <button className="datepicker-btn" onClick={(e) => {e.preventDefault()}}>
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
                onChange={(date) => {
                  handleChildFormDetailsChange(
                    counter - 1,
                    "profile",
                    "date_of_birth",
                    date
                  );
                }}
                name={"ch_birthdate" + (counter - 1)}
                customInput={
                  <ExampleCustomInput className="field-input birthdate-field" />
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
            <div className="field">
              <select
                disabled={isReadonly}
                readOnly={isReadonly}
                name={"ch_gender" + (counter - 1)}
                className="field-input"
                onChange={({ target }) => {
                  handleChildFormDetailsChange(
                    counter - 1,
                    "profile",
                    "gender",
                    target.value
                  );
                }}
                ref={register({ required: true })}
                defaultValue={childProfile.gender}
              >
                <option value="">Select</option>
                <optgroup label="Gender">
                  {GENDER_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.value}>
                      {opt.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Custom">
                  {CUSTOM_GENDER_OPTIONS.map((opt) => (
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
          <div className="form-group">
            <div className="field">

              {
                isReadonly ? (
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
                <textarea
                  className="field-input readonly"
                  name={"ethinicity_" + (counter - 1)}
                  readOnly={isReadonly}
                  defaultValue={readOnlyEthinicity}
                  style={{
                    background: "white",
                    borderBottom: "2px solid rgb(204, 204, 204) !important",
                    resize: "none"
                  }}
                >
                </textarea>
                ) : (
                <Multiselect
                  readOnly={isReadonly}
                  disabled={isReadonly}
                  id={"ethinicity_" + (counter - 1)}
                  className="field-input"
                  options={ETHINICITY_OPTIONS}
                  hasSelectAll={hasSelectAll}
                  onSelect={(selectedList) => {
                    handleChildFormDetailsChange(
                      counter - 1,
                      "profile",
                      "ethinicity",
                      selectedList
                    );
                  }}
                  onRemove={(selectedList) => {
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
                )
              }
              <label className="field-label">
                Ethinicity (select all choices that apply)
              </label>
            </div>
          </div>
        </div>

        <div className="grid">
          <div className="form-group">
            <div className="field">
              <select
                disabled={isReadonly}
                name="ch_phone_type"
                className="field-input"
                onChange={({ target }) => {
                  handleChildFormDetailsChange(
                    counter - 1,
                    "profile",
                    "phone_type",
                    target.value
                  );
                }}
                readOnly={isReadonly}
                defaultValue={childProfile.phone_type}
              >
                <option value="">Select Type</option>
                {PHONE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.value}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <label className="field-label">
                {!showPhone ? (
                  <span className="add" onClick={(e) => handleOtherPhone()}>
                    <FontAwesomeIcon size="lg" icon={faPlusCircle} />
                  </span>
                ) : (
                  <span className="remove" onClick={(e) => handleOtherPhone()}>
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
                  name={"ch_phone_number" + (counter - 1)}
                  className="field-input"
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
                      completed: (value) => {
                        if (value) {
                          return value.match(/\d/g).length === 10;
                        } else {
                          return true;
                        }
                      },
                    },
                  })}
                />
              ) : (
                <input
                  name="ch_phone_number"
                  className="field-input"
                  placeholder="Phone"
                  readOnly={isReadonly}
                  defaultValue={childProfile.phone_number}
                />
              )}

              <label className="field-label">Phone Number</label>
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
              <div className="field">
                <select
                  disabled={isReadonly}
                  name="ch_phone_type2"
                  className="field-input"
                  onChange={({ target }) => {
                    handleChildFormDetailsChange(
                      counter - 1,
                      "profile",
                      "phone_type2",
                      target.value
                    );
                  }}
                  readOnly={isReadonly}
                  defaultValue={childProfile.phone_type}
                >
                  <option value="">Select Type</option>
                  {PHONE_OPTIONS.map((opt) => (
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
                    name={"ch_phone_number2" + (counter - 1)}
                    className="field-input"
                    placeholder="Phone"
                    onChange={({ target }) => {
                      handleChildFormDetailsChange(
                        counter - 1,
                        "profile",
                        "phone_number2",
                        target.value
                      );
                    }}
                    defaultValue={childProfile.phone_number}
                    format="(###) ###-####"
                    mask="_"
                    getInputRef={register({
                      validate: {
                        completed: (value) => {
                          if (value) {
                            return value.match(/\d/g).length === 10;
                          } else {
                            return true;
                          }
                        },
                      },
                    })}
                  />
                ) : (
                  <input
                    name="ch_phone_number2"
                    className="field-input"
                    placeholder="Phone"
                    defaultValue={childProfile.phone_number}
                  />
                )}
                <label className="field-label">Phone Number</label>
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
            <div className="field">
              <select
                disabled={isReadonly}
                name="ch_email_type"
                className="field-input"
                onChange={({ target }) => {
                  handleChildFormDetailsChange(
                    counter - 1,
                    "profile",
                    "email_type",
                    target.value
                  );
                }}
                readOnly={isReadonly}
                defaultValue={childProfile.email_type}
              >
                <option value="">Select Type</option>
                {EMAIL_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <label className="field-label">
                {!showEmail ? (
                  <span className="add" onClick={(e) => handleOtherEmail()}>
                    <FontAwesomeIcon size="lg" icon={faPlusCircle} />
                  </span>
                ) : (
                  <span className="remove" onClick={(e) => handleOtherEmail()}>
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
                name={"ch_email_address" + (counter - 1)}
                className="field-input"
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
                    message: "Invalid email address",
                  },
                })}
              />
              <label className="field-label">
                Email Address (Child only, if applicable)
              </label>
            </div>
            <ErrorMessage
              field={errors["ch_email_address" + (counter - 1)]}
              errorType="pattern"
              message="Invalid email address"
            />
          </div>
        </div>

        {showEmail && (
          <div className="grid">
            <div className="form-group">
              <div className="field">
                <select
                  disabled={isReadonly}
                  name="ch_email_type2"
                  className="field-input"
                  onChange={({ target }) => {
                    handleChildFormDetailsChange(
                      counter - 1,
                      "profile",
                      "email_type2",
                      target.value
                    );
                  }}
                  readOnly={isReadonly}
                  defaultValue={childProfile.email_type}
                >
                  <option value="">Select Type</option>
                  {EMAIL_OPTIONS.map((opt) => (
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
                  type="text"
                  name={"ch_email_address2" + (counter - 1)}
                  className="field-input"
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
                      message: "Invalid email address",
                    },
                  })}
                />
                <label className="field-label">
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
                name={"ch_address" + (counter - 1)}
                className="field-input"
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
              <label className="field-label">
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
                name={"ch_city" + (counter - 1)}
                className="field-input"
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
              <label className="field-label">
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
            <div className="field">
              <select
                disabled={isReadonly}
                name={"ch_state" + (counter - 1)}
                className="field-input"
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
                ref={register({ required: true })}
              >
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
                name={"ch_zip_code" + (counter - 1)}
                className="field-input"
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
                defaultValue={childProfile.zip_code}
                placeholder="Zip Code"
                ref={register({ required: true, minLength: 5 })}
                maxLength="5"
              />
              <label className="field-label">
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
              <select
                readOnly={isReadonly}
                disabled={isReadonly}
                name={"ch_location_site" + (counter - 1)}
                className="field-input"
                onChange={({ target }) => {
                  handleChildFormDetailsChange(
                    counter - 1,
                    "profile",
                    "location_site",
                    target.value
                  );
                }}
                ref={register({ required: true, minLength: 5 })}
                defaultValue={childProfile.location_site}
              >
                <option value="">Select</option>
                {LOCATION_SITE_OPTIONS.map((opt, index) => (
                  <option key={index + 1} value={opt.value}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <label className="field-label">
                <span className="required">*</span> Location Site
              </label>
            </div>
            <ErrorMessage
              field={errors["ch_location_site" + (counter - 1)]}
              errorType="required"
              message="Location Site is required"
            />
          </div>
          <div className="form-group">
            <div className="field">
              {
                isReadonly ? (
                // <input 
                //   readOnly={isReadonly}
                //   name={"program_" + (counter - 1)}
                //   className="field-input"
                //   placeholder="First Name"
                //   onChange={({ target }) => {}}
                //   ref={register({ required: true })}
                //   defaultValue={readOnlyProgram}
                // />

                <textarea
                  className="field-input readonly"
                  name={"program_" + (counter - 1)}
                  readOnly={isReadonly}
                  defaultValue={readOnlyProgram}
                  style={{
                    background: "white",
                    borderBottom: "2px solid rgb(204, 204, 204) !important",
                    resize: "none"
                  }}
                >
              </textarea>
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
                  onSelect={(selectedList) => {
                    handleChildFormDetailsChange(
                      counter - 1,
                      "profile",
                      "program",
                      selectedList
                    );
                  }}
                  onRemove={(selectedList) => {
                    handleChildFormDetailsChange(
                      counter - 1,
                      "profile",
                      "program",
                      selectedList
                    );
                  }}
                />
                )
              }
              <label className="field-label">
                Program (select all choices that apply)
              </label>
            </div>
          </div>
        </div>
        <div className="grid">
          <div className="form-group">
            <div className="field">
              {
                isReadonly ? (
                  <textarea
                    className="field-input readonly"
                    name={"ch_lives_with" + (counter - 1)}
                    readOnly={isReadonly}
                    defaultValue={readOnlyChildLivesWith}
                  >
                  </textarea>
                  // <input 
                  //   readOnly={isReadonly}
                  //   name={"ch_lives_with" + (counter - 1)}
                  //   className="field-input"
                  //   placeholder="First Name"
                  //   onChange={({ target }) => {
                  //   }}
                  //   ref={register({ required: true })}
                  //   defaultValue={readOnlyChildLivesWith}
                  // />
                ) : (
                <Multiselect
                  selectedValues={childProfile.child_lives_with}
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
                  onSelect={(selectedList) => {
                    handleChildFormDetailsChange(
                      counter - 1,
                      "profile",
                      "child_lives_with",
                      selectedList
                    );
                  }}
                  onRemove={(selectedList) => {
                    handleChildFormDetailsChange(
                      counter - 1,
                      "profile",
                      "child_lives_with",
                      selectedList
                    );
                  }}
                />
                )
              }

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
      </div>
    </ChildInfomationFormStyled>
  );
}
