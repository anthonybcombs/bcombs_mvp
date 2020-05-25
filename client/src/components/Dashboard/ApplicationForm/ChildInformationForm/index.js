import React, { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle, faPlusCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import ErrorMessage from "../../../../helpers/ErrorMessage";
import DatePicker from 'react-datepicker';
import { Multiselect } from 'multiselect-react-dropdown';
import "react-datepicker/dist/react-datepicker.css";
import "../../ArchivedApplication/SearchDate.css";
import STATES from "../states.json";
import NumberFormat from 'react-number-format';

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

export default function index({
  counter,
  childProfile,
  handleChildFormDetailsChange,
  register,
  errors,
  isReadonly = false,
  ProfileImg
}) {
  
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

  const ETHINICITY_OPTIONS = !isReadonly ? [
    { id: 1, name:"Asian", label:"Asian" },
    { id: 2, name:"Black or African American", label:"Black or African American" },
    { id: 3, name:"Hispanic or Latino", label:"AsiHispanic or Latinoan" },
    { id: 4, name:"Native American or American Indian", label:"Native American or American Indian" },
    { id: 5, name:"Native Hawaiian & Other Pacific Islander", label:"Native Hawaiian & Other Pacific Islander" },
    { id: 6, name:"White", label:"White" },
    { id: 7, name:"Other", label:"Other" },
    { id: 8, name:"Prefer not to answer", label:"Prefer not to answer" }
  ] : []; 

  const PROGRAMS_OPTIONS = !isReadonly ? [
    { id: 1, name:"Saturday Academy", label: "Satuday Academy" },
    { id: 2, name:"In school", label: "In school" },
  ] : [];

  const LOCATION_SITE_OPTIONS = [
    { name: "Raleigh", value: "Raleigh" },
    { name: "Durham", value: "Durham" }
  ];

  const EMAIL_OPTIONS = [
    { id: 1, value: "Personal", name: "Personal"},
    { id: 2, value: "Work", name: "Work"}
  ];

  const [ethinicitySelected, setEthinicitySelected] = useState([]);
  const [schoolProgramSelected, setSchoolProgramSelected] = useState([]);

  const range = (start, end) => {
    let arr = [];

    for(let i = start; i <= end; i++) {
      arr.push(i);
    }

    return arr;
  }

  const years = range(1990, new Date().getFullYear());
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
    setShowPhone(!showPhone);  
  }

  const handleOtherEmail = () => {
    setShowEmail(!showEmail);
  }

  return (
    <ChildInfomationFormStyled>
      <h3 className="heading">Child Information {counter > 1 ? `(${counter})` : ``}</h3>
      <div className="child-info-wrapper">
        <div className="img-profile-wrapper">
            <img src={ProfileImg} width="80" height="80" />
            {!isReadonly && <input name={"ch_img" + (counter - 1)} type="file"/> }
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
                  handleChildFormDetailsChange(counter - 1, "profile", "first_name", target.value);
                }}
                ref={register({ required: true })}
                defaultValue={childProfile.first_name}
              />
              <label className="field-label"><span className="required">*</span> First Name</label>
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
                  handleChildFormDetailsChange(counter - 1, "profile", "last_name", target.value);
                }}
                ref={register({ required: true })}
                defaultValue={childProfile.last_name}
              />
              <label className="field-label"><span className="required">*</span> Last Name</label>
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
                  handleChildFormDetailsChange(counter - 1, "profile", "nick_name", target.value);
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
                  nextMonthButtonDisabled
                }) => (
                  <div
                    style={{
                      margin: 10,
                      display: "flex",
                      justifyContent: "center"
                    }}
                  >
                    <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                      {"<"}
                    </button>
                    <select
                      value={new Date(date).getFullYear()}
                      onChange={({ target: { value } }) => changeYear(value)}
                    >
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
                      }
                    >
                      {months.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
          
                    <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                      {">"}
                    </button>
                  </div>
                )}
                name={"ch_birthdate" + (counter - 1)}
                className="field-input birthdate-field" 
                placeholderText="mm/dd/yyyy"
                selected={childProfile.date_of_birth}
                disabled={isReadonly}
                onChange={(date) => {
                  handleChildFormDetailsChange(counter - 1, "profile", "date_of_birth", date);
                }}
                ref={register({ required: true })}
              />
              <label className="field-label"><span className="required">*</span> Date of Birth</label>
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
                  handleChildFormDetailsChange(counter - 1, "profile", "gender", target.value);
                }}
                ref={register({ required: true })}
                defaultValue={childProfile.gender}  
              >
                  <option value="">Select</option>
                {GENDER_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.value}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <label className="field-label"><span className="required">*</span> Gender</label>
            </div>
            <ErrorMessage
              field={errors["ch_gender" + (counter - 1)]}
              errorType="required"
              message="Gender is required"
            />
          </div>
          <div className="form-group">
            <div className="field">
              <Multiselect
                readOnly={isReadonly}
                disabled={isReadonly}
                id={"ethinicity_" + (counter - 1)}
                className="field-input"
                options={ETHINICITY_OPTIONS}
                hasSelectAll={hasSelectAll}
                onSelect={setEthinicitySelected}
                placeholder="Select all that apply"
                displayValue="name"
                closeIcon="cancel"
                name={"ethinicity_" + (counter - 1)}
              />
              <label className="field-label">Ethinicity (select all choices that apply)</label>
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
                  handleChildFormDetailsChange(counter - 1, "profile", "phone_type", target.value);
                }}
                readOnly={isReadonly}
                defaultValue={childProfile.phone_type}
              >
                  <option value="" >Select Type</option>
                {PHONE_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.value}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <label className="field-label">
                {
                  !showPhone ?
                  <span 
                    className="add"
                    onClick={(e) => handleOtherPhone()}
                  >
                    <FontAwesomeIcon size="lg" icon={faPlusCircle} />
                  </span>
                  :
                  <span 
                    className="remove"
                    onClick={(e) => handleOtherPhone()}
                  >
                    <FontAwesomeIcon size="lg" icon={faTimesCircle} />
                  </span>
                }
                &nbsp; Type
                </label>
            </div>
          </div>
          <div className="form-group">
            <div className="field">
              {
                !isReadonly ?
                <NumberFormat 
                  name="ch_phone_number"
                  className="field-input"
                  placeholder="Phone"
                  onChange={({ target }) => {
                    handleChildFormDetailsChange(counter - 1, "profile", "phone_number", target.value);
                  }}
                  defaultValue={childProfile.phone_number}
                  format="(###) ###-####" mask="_"
                />
                :
                <input 
                  name="ch_phone_number"
                  className="field-input"
                  placeholder="Phone"
                  readOnly={isReadonly}
                  defaultValue={childProfile.phone_number}
                />
              }
 
              <label className="field-label">Phone</label>
            </div>
          </div>
        </div>
        {
          showPhone && 
          <div className="grid">
            <div className="form-group">
              <div className="field">
                <select
                  disabled={isReadonly}
                  name="ch_phone_type2"
                  className="field-input"
                  onChange={({ target }) => {
                    handleChildFormDetailsChange(counter - 1, "profile", "phone_type2", target.value);
                  }}
                  readOnly={isReadonly}
                  defaultValue={childProfile.phone_type}
                >
                    <option value="" >Select Type</option>
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
                {
                  !isReadonly ?
                  <NumberFormat 
                    name="ch_phone_number2"
                    className="field-input"
                    placeholder="Phone"
                    onChange={({ target }) => {
                      handleChildFormDetailsChange(counter - 1, "profile", "phone_number2", target.value);
                    }}
                    defaultValue={childProfile.phone_number}
                    format="(###) ###-####" mask="_"
                  />
                  :
                  <input 
                    name="ch_phone_number2"
                    className="field-input"
                    placeholder="Phone"
                    defaultValue={childProfile.phone_number}
                  />
                }
                <label className="field-label">Phone</label>
              </div>
            </div>
          </div>
        }
        <div className="grid">
          <div className="form-group">
            <div className="field">
              <select
                disabled={isReadonly}
                name="ch_email_type"
                className="field-input"
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "profile", "email_type", target.value);
                }}
                readOnly={isReadonly}
                defaultValue={childProfile.email_type}
              >
                  <option value="" >Select Type</option>
                {EMAIL_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <label className="field-label">
                {
                  !showEmail ?
                  <span 
                    className="add"
                    onClick={(e) => handleOtherEmail()}
                  >
                    <FontAwesomeIcon size="lg" icon={faPlusCircle} />
                  </span>
                  :
                  <span 
                    className="remove"
                    onClick={(e) => handleOtherEmail()}
                  >
                    <FontAwesomeIcon size="lg" icon={faTimesCircle} />
                  </span>
                }
                &nbsp;  
                Type
              </label>
            </div>
          </div>

          <div className="form-group">
            <div className="field">
              <input
                name="ch_email_address"
                className="field-input"
                placeholder="Email Address"
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "profile", "email_address", target.value);
                }}
                readOnly={isReadonly}
                defaultValue={childProfile.email_address}
              />
              <label className="field-label">Email Address (Child only, if applicable)</label>
            </div>
          </div>
        </div>

        {
          showEmail && 
          <div className="grid">
            <div className="form-group">
              <div className="field">
                <select
                  disabled={isReadonly}
                  name="ch_email_type2"
                  className="field-input"
                  onChange={({ target }) => {
                    handleChildFormDetailsChange(counter - 1, "profile", "email_type2", target.value);
                  }}
                  readOnly={isReadonly}
                  defaultValue={childProfile.email_type}
                >
                    <option value="" >Select Type</option>
                  {EMAIL_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>
                <label className="field-label">
                  Type
                </label>
              </div>
            </div>

            <div className="form-group">
              <div className="field">
                <input
                  name="ch_email_address2"
                  className="field-input"
                  placeholder="Email Address"
                  onChange={({ target }) => {
                    handleChildFormDetailsChange(counter - 1, "profile", "email_address2", target.value);
                  }}
                  readOnly={isReadonly}
                  defaultValue={childProfile.email_address}
                />
                <label className="field-label">Email Address (Child only, if applicable)</label>
              </div>
            </div>
          </div>
        }

        <div className="grid">
          <div className="form-group">
            <div className="field">
              <input
                name={"ch_address" + (counter - 1)}
                className="field-input"
                placeholder="Address"
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "profile", "address", target.value);
                }}
                readOnly={isReadonly}
                ref={register({ required: true })}
                defaultValue={childProfile.address}
              />
              <label className="field-label"><span className="required">*</span> Address</label>
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
                  handleChildFormDetailsChange(counter - 1, "profile", "city", target.value);
                }}
                readOnly={isReadonly}
                defaultValue={childProfile.city}
                ref={register({ required: true })}
              />
              <label className="field-label"><span className="required">*</span> City</label>
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
                  handleChildFormDetailsChange(counter - 1, "profile", "state", target.value);
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
              <label className="field-label"><span className="required">*</span> State</label>
            </div>
            <ErrorMessage
              field={errors["ch_state" + (counter - 1)]}
              errorType="required"
              message="State is required"
            />
          </div>
          <div className="form-group">
            <div className="field">
              <NumberFormat
                readOnly={isReadonly}
                name={"ch_zip_code" + (counter - 1)}
                className="field-input"
                onChange={({ target }) => {
                  handleChildFormDetailsChange(counter - 1, "profile", "zip_code", target.value);
                }}
                defaultValue={childProfile.zip_code}
                placeholder="Zip Code"
                ref={register({ required: true, minLength: 5 })}
                format="#####"
              />
              <label className="field-label"><span className="required">*</span> Zip Code</label>
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
                  handleChildFormDetailsChange(counter - 1, "profile", "location_site", target.value);
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
              <label className="field-label"><span className="required">*</span> Location Site</label>
            </div>
            <ErrorMessage
              field={errors["ch_location_site" + (counter - 1)]}
              errorType="required"
              message="Location Site is required"
            />
          </div>
          <div className="form-group">
            <div className="field">
              <Multiselect
                readOnly={isReadonly}
                disabled={isReadonly}
                className="field-input"
                options={PROGRAMS_OPTIONS}
                hasSelectAll={hasSelectAll}
                onSelect={setSchoolProgramSelected}
                placeholder="Choose Multiple"
                displayValue="name"
                closeIcon="cancel"
                id={"program_" + (counter - 1)}
                name={"program_" + (counter - 1)}
              />
              <label className="field-label">Program (select all choices that apply)</label>
            </div>
          </div>
        </div>
      </div>
    </ChildInfomationFormStyled>
  )
}