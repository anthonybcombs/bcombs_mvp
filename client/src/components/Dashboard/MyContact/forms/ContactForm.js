import React, { useEffect, useState, useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { useForm } from "react-hook-form";
import { Multiselect } from "multiselect-react-dropdown";
import CustomMultiSelect from "../../../../helpers/CustomMultiSelect";
import ErrorMessage from "../../../../helpers/ErrorMessage";
import NumberFormat from "react-number-format";
const ContactFormStyled = styled.form`
  label {
    display: block;
    word-wrap: break-word;
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
  }
  @media (min-width: 600px) {
    button[type="submit"] {
      width: ${({ theme }) => theme.button.width.primary};
    }
  }



  .disabled {
    background-color: gray !important;
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
    margin-top: 8px;
    margin-bottom: -5px;
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
  .required {
    color: red;
  }
`;
export default function ContactForm({
  contactDetails,
  groups,
  isVisible,
  onSubmit,
  handleContactDetailsChange,
  isLoading = false,
  userNotExist = false
}) {
  const [groupOptions, setGroupOptions] = useState([]);
  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange"
  });

  useEffect(() => {
    if (groups) {
      let defaultGroups = groups
        .filter(item => contactDetails.selectedGroups.includes(item.id))
        .map(item => {
          return { name: item.name, id: item.id };
        });
      let formattedGroups = groups.map(item => {
        return {
          name: `${item.name}`,
          id: item.id
        };
      });
      setGroupOptions(formattedGroups);
    }
  }, [groups, isVisible]);

  const handleSelectChange = value => {
    handleContactDetailsChange("selectedGroups", value);
  };

  const theme = useContext(ThemeContext);

  return (
    <ContactFormStyled
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
      theme={theme}>
      <div className="grid">
        <div className="form-group">
          <div className="field">
            <input
              name="first_name"
              className="field-input"
              placeholder="First Name"
              onChange={({ target }) => {
                handleContactDetailsChange("first_name", target.value);
              }}
              ref={register({ required: true, maxLength: 20 })}
              defaultValue={contactDetails.first_name}
            />
            <label className="field-label">
              <span className="required">*</span> First Name
            </label>
          </div>
          <ErrorMessage
            field={errors.first_name}
            errorType="required"
            message="First Name is required."
          />
          <ErrorMessage
            field={errors.first_name}
            errorType="maxLength"
            message="Length should not be greater than 20."
          />
        </div>
        <div className="form-group">
          <div className="field">
            <input
              name="last_name"
              className="field-input"
              placeholder="Last Name"
              onChange={({ target }) => {
                handleContactDetailsChange("last_name", target.value);
              }}
              ref={register({ required: true, maxLength: 20 })}
              value={contactDetails.last_name}
            />
            <label className="field-label">
              <span className="required">*</span> Last Name
            </label>
          </div>
          {/* <ErrorMessage
            field={errors.last_name}
            errorType="required"
            message="Last Name is required."
          />
          <ErrorMessage
            field={errors.last_name}
            errorType="maxLength"
            message="Length should not be greater than 20."
          /> */}

          <ErrorMessage
            field={errors.last_name}
            errorType="required"
            message={
              <>
                <p className="error error-size">
                  Last Name is required.
                  <br />
                </p>
              </>
            }
          />
        </div>

        <div className="form-group">
          <div className="field">
            <NumberFormat
              name="phone_number"
              className="field-input"
              placeholder="Phone Number"
              onChange={({ target }) => {
                handleContactDetailsChange("phone_number", target.value);
              }}
              defaultValue={contactDetails.phone_number}
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
            <label className="field-label">
              <span className="required">*</span> Phone Number
            </label>
          </div>
          <ErrorMessage
            field={errors["phone_number"]}
            errorType="completed"
            message="Phone Number must be consist of 10 digits."
          />
        </div>

        <div className="form-group">
          <div className="field">
            <input
              type="email"
              name="email"
              className="field-input"
              placeholder="Email"
              onChange={({ target }) => {
                handleContactDetailsChange("email", target.value);
              }}
              ref={register({
                required: true,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Valid email should contain '@' and '.'"
                }
              })}
              value={contactDetails.email}
            />
            <label className="field-label">
              <span className="required">*</span> Email
            </label>
          </div>
          {userNotExist && <div style={{ color: "red" }}>User not exist!</div>}
          <ErrorMessage
            className="error-size"
            field={errors.email}
            errorType="required"
            message={
              <>
                <p className="error error-size">
                  Email is required.
                  <br />
                  Valid email address should contain '@' and '.' <br />
                </p>
              </>
            }
          />
        </div>

        <label>
          <span style={{ color: "red" }}>*</span> Relation
        </label>
        <select
          name="relation"
          className="field-input"
          placeholder="Relation"
          onChange={e => {
            handleContactDetailsChange("relation", e.target.value);
          }}
          ref={register({ required: true })}
          value={contactDetails.relation}>
          <option key="0" value="Default" selected>
            Default
          </option>
          <option key="1" value="Father">
            Father
          </option>
          <option key="2" value="Mother">
            Mother
          </option>
          <option key="3" value="Sibling">
            Sibling
          </option>
        </select>
      </div>
      <ErrorMessage
        field={errors.email}
        errorType="required"
        message="Relation is required."
      />

      <div>
        <p>Assign to existing group</p>
        {/* {groups.map(group => (
          <label htmlFor="group" key={group.id}>
            <input
              type="checkbox"
              name="group"
              checked={contactDetails.selectedGroups.includes(group.id)}
              value={group.id}
              onChange={({ target }) => {
                handleContactDetailsChange("selectedGroups", target.value);
              }}
            />
            {group.name}
          </label>
        ))} */}
        {/* 
        <Multiselect
          className="field-input"
          options={groupOptions}
          hasSelectAll={false}
          onSelect={handleSelectChange}
          placeholder="Add from my contacts"
          displayValue="name"
          closeIcon="cancel"
        /> */}
        {/* <CustomMultiSelectOptions
          className="field-input"
          options={groupOptions}
          value={groupOptions.filter((opt) =>
            contactDetails.selectedGroups.includes(opt.value)
          )}
          onChange={(value) => {
            console.log("valueeee", value);
            handleContactDetailsChange("selectedGroups", value);
          }}
          labelledBy={"Select"}
        /> */}
        <div className="form-group">
          <div className="field">
            <CustomMultiSelect
              className="field-input"
              options={groupOptions}
              selectedValues={contactDetails?.selectedGroups || []}
              hasSelectAll={false}
              onSelect={handleSelectChange}
              placeholder="Add from my contacts"
              displayValue="name"
              closeIcon="cancel"
            />
          </div>
        </div>
        <div style={{ display: 'block' }}>
          <input
            type="checkbox"
            name="forms_select_all"
            onChange={e => {
              console.log('groupOptions',groupOptions)
              if (e.target.checked) {
                handleContactDetailsChange("selectedGroups", groupOptions);
              }
              else {
                handleContactDetailsChange("selectedGroups", []);
              }
            }}

          /> Select All
        </div>


      </div>
      <button
        className={isLoading ? "disabled" : ""}
        type="submit">
        {isLoading ? "Saving..." : "Save"}
      </button>
    </ContactFormStyled>
  );
}
