import React, { useEffect, useState, useContext } from "react";
import ReactDOM from "react-dom";
import styled, { ThemeContext } from "styled-components";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { format } from "date-fns";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ErrorMessage from "../../../../helpers/ErrorMessage";

import { isValidDate } from "../../../../helpers/Date";

const EditProfileModal = styled.form`
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
  }
  .modal-content {
    width: 25%;
  }
  @media (min-width: 600px) {
    button[type="submit"] {
      width: ${({ theme }) => theme.button.width.primary};
    }
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

  .field-label-simple {
    font-size: 18px;
    color: #4b525a;
    font-weight: 600;
    text-align: left;
    margin-bottom: 20px;
  }

  .field-input {
    font-size: 18px;
    border: 0;
    border-bottom: 2px solid #ccc;
    font-family: inherit;
    -webkit-appearance: none;
    -moz-appearance: none;
    border-radius: 0;
    padding: 5px;
    cursor: text;
    line-height: 1.8;

    padding: 5px 0;
    width: 100%;
    display: block;
    text-indent: 5px;
  }

  .field-label {
    font-size: 14px;
    color: #4b525a;
  }

  .field-input:placeholder-shown + .field-label {
    overflow: hidden;
    transform-origin: left bottom;
    transform: translate(0, 2.125rem) scale(1.4);
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
`;

const GENDER_OPTIONS = [
  { id: "male", value: "Male", name: "Male" },
  { id: "female", value: "Female", name: "Female" },
  { id: "custom", value: "Custom", name: "Custom" },
];

const CUSTOM_GENDER_OPTIONS = [
  { id: "she", value: "She", name: "She" },
  { id: "he", value: "He", name: "He" },
  { id: "they", value: "They", name: "They" },
];

const ETHINICITY_OPTIONS = [
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
];

export default function index({
  isVisible = true,
  toggleProfileVisible,
  data,
  onSubmit,
  handleInputChange
}) {
  const theme = useContext(ThemeContext);
  const [defaultEthnicity, setDefaultEthnicity] = useState("");
  const { register, handleSubmit, errors, watch } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });
  const dispatch = useDispatch();
  const gender = watch('gender');

  // let month = "" + (formattedDateOfBirth.getMonth() + 1),
  //   day = "" + formattedDateOfBirth.getDate(),
  //   year = formattedDateOfBirth.getFullYear();
  useEffect(() => {
    if (data) {
      const userEthnicity = ETHINICITY_OPTIONS.find(
        item => item.name === data.ethnicity
      );
      setDefaultEthnicity((userEthnicity && userEthnicity.name) || "");
    }
  }, [data]);

  if (!isVisible) {
    return <></>;
  }

  return ReactDOM.createPortal(
    <EditProfileModal
      data-testid="app-dashboard-my-events-new-event"
      className="modal"
      theme={theme}
      method="POST"
      onSubmit={handleSubmit(onSubmit)}>
      <div className="modal-content">
        <span
          className="close"
          onClick={() => {
            toggleProfileVisible(false);
          }}>
          &times;
        </span>

        <div className="grid">
          <div className="form-group">
            <div className="field">
              <input
                name="firstname"
                className="field-input"
                placeholder="First Name"
                onChange={({ target }) => {
                  handleInputChange("firstname", target.value);
                }}
                ref={register({ required: true, maxLength: 20 })}
                value={data.firstname}
              />
              <label className="field-label">First Name</label>
            </div>
            <ErrorMessage
              field={errors.firstname}
              errorType="required"
              message="Firstname is required."
            />
            <ErrorMessage
              field={errors.firstname}
              errorType="maxLength"
              message="Length should not be greater than 20."
            />
          </div>

          <div className="form-group">
            <div className="field">
              <input
                name="lastname"
                className="field-input"
                placeholder="Last Name"
                onChange={({ target }) => {
                  handleInputChange("lastname", target.value);
                }}
                ref={register({ required: true, maxLength: 30 })}
                value={data.lastname}
              />
              <label className="field-label">Last Name</label>
            </div>
            <ErrorMessage
              field={errors.lastname}
              errorType="required"
              message="Lastname is required."
            />
            <ErrorMessage
              field={errors.lastname}
              errorType="maxLength"
              message="Length should not be greater than 30."
            />
          </div>

          <div className="form-group">
            <div className="field">
              <select
                name="gender"
                className="field-input"
                onChange={({ target }) => {
                  handleInputChange("gender", target.value);
                }}
                ref={register({ required: true })}
                >
                <option value="">Select</option>
                {GENDER_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id} selected={opt.id === data.gender}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <label className="field-label">Gender</label>
            </div>
            <ErrorMessage
              field={errors.gender}
              errorType="required"
              message="Gender is required."
            />
          </div>

          {gender === 'custom' && <>
              <div className="form-group">
                <div className="field">
                  <select
                    name="customgender"
                    className="field-input"
                    onChange={({ target }) => {
                      handleInputChange("customgender", target.value);
                    }}
                    ref={register({ required: true })}
                  >
                    <option value="">Select</option>
                    {CUSTOM_GENDER_OPTIONS.map(opt => (
                      <option key={opt.id} value={opt.id} selected={opt.id === data.customgender}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                  <label className="field-label">Custom Gender</label>
                </div>
                <ErrorMessage
                  field={errors.customgender}
                  errorType="required"
                  message="Custom Gender is required."
                />
              </div>
            </>
          }

          <div className="form-group">
            <div className="field">
              <DatePicker
                className="field-input"
                placeholderText="mm/dd/yyyy"
                selected={isValidDate(data.dateofbirth) && new Date(data.dateofbirth)}
                onChange={date => {
                  handleInputChange(
                    "dateofbirth",
                    format(new Date(date), "yyyy-MM-dd")
                  );
                }}
                // onChange={date => {
                //   setChildBirthDate(date)
                // }}
              />
              <label className="field-label">Date of Birth</label>
            </div>
          </div>

          <div className="form-group">
            <div className="field">
              <select
                name="ethnicity"
                className="field-input"
                onChange={({ target }) => {
                  const currentEthnicity = ETHINICITY_OPTIONS.find(
                    item => item.name === target.value
                  );

                  handleInputChange(
                    "ethnicity",
                    currentEthnicity ? currentEthnicity.name : ""
                  );
                  // setDefaultEthnicity(
                  //   currentEthnicity ? currentEthnicity.name : ""
                  // );
                }}
                ref={register}
                value={defaultEthnicity}>
                <option value="">Select</option>
                {ETHINICITY_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.name}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <label className="field-label">Ethnicity</label>
            </div>
          </div>

          <div className="form-group">
            <div className="field">
              <input
                name="address"
                className="field-input"
                placeholder="Address"
                onChange={({ target }) => {
                  handleInputChange("address", target.value);
                }}
                ref={register({ required: true, maxLength: 100 })}
                value={data.address}
              />
              <label className="field-label">Address</label>
            </div>
            <ErrorMessage
              field={errors.address}
              errorType="required"
              message="Address is required."
            />
            <ErrorMessage
              field={errors.address}
              errorType="maxLength"
              message="Length should not be greater than 100."
            />
          </div>

          <div className="form-group">
            <div className="field">
              <input
                name="zipcode"
                className="field-input"
                placeholder="Zipcode"
                onChange={({ target }) => {
                  handleInputChange("zipcode", target.value);
                }}
                ref={register({ required: true })}
                value={data.zipcode}
              />
              <label className="field-label">Zipcode</label>
            </div>
            <ErrorMessage
              field={errors.zipcode}
              errorType="required"
              message="Zipcode is required."
            />
          </div>

          <div className="form-group">
            <div className="field">
              <input
                name="school"
                className="field-input"
                placeholder="School"
                onChange={({ target }) => {
                  handleInputChange("school", target.value);
                }}
                ref={register}
                value={data.school}
                ref={register({ maxLength: 50 })}
              />
              <label className="field-label">School</label>
            </div>

            <ErrorMessage
              field={errors.school}
              errorType="maxLength"
              message="Length should not be greater than 50."
            />
          </div>

          <div className="form-group">
            <div className="field">
              <input
                type="number"
                name="grade"
                className="field-input"
                placeholder="Grade"
                onChange={({ target }) => {
                  handleInputChange("grade", target.value);
                }}
                ref={register}
                value={data.grade}
              />
              <label className="field-label">Grade</label>
            </div>
          </div>
        </div>
        {/* <input
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
          //data-testid="app-profile-input-date-of-birth"
          name="dateofbirth"
          type="date"
          placeholder="Date of Birth"
          onChange={({ target }) => {
            handleInputChange("dateofbirth", target.value);
          }}
          ref={register}
          value={format(new Date(data.dateofbirth), "yyyy-MM-dd")}
        />
        <ErrorMessage
          field={errors.dateofbirth}
          errorType="required"
          message="Date of Birth is required."
        />

        <input
          data-testid="app-profile-input-ethnicity"
          name="ethnicity"
          type="text"
          placeholder="Ethnicity"
          onChange={({ target }) => {
            handleInputChange("ethnicity", target.value);
          }}
          ref={register}
          value={data.ethnicity}
        />
        <ErrorMessage
          field={errors.dateofbirth}
          errorType="required"
          message="Ethnicity is required."
        />

        <input
          data-testid="app-profile-input-address"
          name="address"
          placeholder="Address"
          onChange={({ target }) => {
            handleInputChange("address", target.value);
          }}
          ref={register}
          value={data.address}
        />
        <ErrorMessage
          field={errors.address}
          errorType="required"
          message="Address is required."
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
          data-testid="app-profile-input-school"
          name="school"
          type="text"
          placeholder="School"
          onChange={({ target }) => {
            handleInputChange("school", target.value);
          }}
          ref={register}
          value={data.school}
        />
        <ErrorMessage
          field={errors.school}
          errorType="required"
          message="School is required."
        />

        <input
          data-testid="app-profile-input-grade"
          name="grade"
          type="number"
          placeholder="Grade"
          onChange={({ target }) => {
            handleInputChange("grade", target.value);
          }}
          ref={register}
          value={data.grade}
        />
        <ErrorMessage
          field={errors.grade}
          errorType="required"
          message="Grade is required."
        /> */}

        <button data-testid="app-profile-submit-button" type="submit">
          Save
        </button>
      </div>
    </EditProfileModal>,
    document.getElementById("modal")
  );
}
