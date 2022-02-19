import React, { useEffect, useState, useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { useForm } from "react-hook-form";

//import CustomMultiSelectOptions from "../../../../helpers/CustomMultiSelectOptions";
import CustomMultiSelect from "../../../../helpers/CustomMultiSelect";

import ErrorMessage from "../../../../helpers/ErrorMessage";

import NumberFormat from "react-number-format";

const ContactFormStyled = styled.form`
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
  }
  input:focus {
    border-color: ${({ theme }) => theme.input.focus.border.color};
    transition: 3s;
  }
  input:first-child {
    margin-top: 1em;
  }
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
  > div {
    display: grid;
  }
  > #contact-header .contact-image img {
    height: 100px;
    width: 100px;
    border-radius: 100px;
    object-fit: cover;
    box-shadow: 0 3px 6px #ddd;
    border: 1px solid #ec6e33;
  }
  > #contact-header > div:first-child > div > button {
    background: none;
    box-shadow: none;
    color: #f26e21;
    font-weight: bold;
  }
  > #contact-header {
    text-align: center;
  }
  > #contact-header h3 {
    color: #ec6e33;
  }
  > #contact-header p,
  > #contact-header h3 {
    padding: 0;
    margin: 0.3em;
  }
  > #contact-header p:nth-of-type(3) {
    color: lightgrey;
  }
  @media (min-width: 600px) {
    button[type="submit"] {
      width: ${({ theme }) => theme.button.width.primary};
    }
    input,
    p.error {
      width: 80%;
    }
    > #contact-header {
      margin: 1rem 0;
      grid-gap: 1rem;
      grid-template-columns: 100px 1fr;
    }
    > .contact-body {
    }
    > #contact-header > div:nth-child(2) {
      text-align: left;
    }
    > #contact-header > div:first-child {
      position: relative;
    }
    > #contact-header > div:first-child > div {
      position: absolute;
      right: 0;
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

/*
    > .contact-body {
      grid-template-columns: 65% 35%;
    }
    */
export default function ContactForm({
  contact,
  contactDetails,
  groups,
  onSubmit,
  handleContactDetailsChange,
  counter = 1
}) {
  const { register, handleSubmit, errors } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange"
  });
  const [groupOptions, setGroupOptions] = useState([]);
  const [defaultGroups, setDefaultGroups] = useState([]);
  const theme = useContext(ThemeContext);

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
      setDefaultGroups(defaultGroups);
    }
  }, [groups]);
  const handleSelectChange = value => {
    handleContactDetailsChange("selectedGroups", value);
  };

  const handleRemoveChange = value => {
    const currentGroupIds = value.map(item => item.id);

    const removedGroups = groupOptions.filter(
      item => !currentGroupIds.includes(item.id)
    );

    handleContactDetailsChange("removedGroups", removedGroups);
  };

  return (
    <ContactFormStyled
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
      theme={theme}>
      <div id="contact-header">
        <div className="contact-image">
          <img src={contact.profile_img} />
        </div>
        <div className="contact-details">
          <h3>
            {contact.first_name} {contact.last_name}
          </h3>
          <p>{contact.email}</p>
          <p>{contact.phone_number}</p>
          <p>{contact.relation}</p>
        </div>
      </div>
      <div id="applicationForm" className="contact-body">
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

          <ErrorMessage
            field={errors.last_name}
            errorType="required"
            message={
              <>
                <p className="error error-size">
                  Last Name is required.
                  <br />
                  Length should not be greater than 20.
                </p>
              </>
            }
          />
        </div>

        <div className="form-group">
          <div className="field">
            <input
              name="first_name"
              className="field-input"
              placeholder="First Name"
              value={contactDetails.first_name}
              onChange={({ target }) => {
                handleContactDetailsChange("first_name", target.value);
              }}
              ref={register({ required: true, maxLength: 20 })}
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
              ref={register({ required: true })}
              value={contactDetails.email}
            />
            <label className="field-label">
              <span className="required">*</span> Email
            </label>
          </div>
          <ErrorMessage
            field={errors.email}
            errorType="required"
            message="Email is required."
          />
        </div>

        <div className="form-group">
          <div className="field">
            <input
              type="text"
              name="relation"
              className="field-input"
              placeholder="Relation"
              onChange={({ target }) => {
                handleContactDetailsChange("relation", target.value);
              }}
              ref={register({ required: true })}
              value={contactDetails.relation}
            />
            <label className="field-label">
              <span className="required">*</span> Relation
            </label>
          </div>
          <ErrorMessage
            field={errors.email}
            errorType="required"
            message="Relation is required."
          />
        </div>

        <div>
          <p>Assign to existing group</p>
          {/* {groups.map(group => (
            <label htmlFor="group" key={group.id} style={{ marginLeft: 12 }}>
              <input
                type="checkbox"
                name="group"
                //checked={contactDetails.selectedGroups.includes(group.id)}
                checked={true}
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
            selectedValues={defaultGroups}
            //selectedValues={contactDetails.selectedGroups || []}

            onSelect={handleSelectChange}
            onRemove={handleRemoveChange}
            placeholder="Add from my contacts"
            displayValue="name"
            closeIcon="cancel"
          /> */}
          <div className="form-group">
            <div className="field">
              <CustomMultiSelect
                className="field-input"
                options={groupOptions}
                selectedValues={defaultGroups}
                onSelect={handleSelectChange}
                onRemove={handleRemoveChange}
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
                console.log('groupOptions', groupOptions)
                if (e.target.checked) {
                  handleContactDetailsChange("selectedGroups", groupOptions);
                }
                else {
                  handleContactDetailsChange("selectedGroups", []);
                }
              }}

            /> Select All
          </div>

          {/* 
          <CustomMultiSelectOptions
            className="field-input"
            options={groupOptions}
            value={groupOptions.filter(opt =>
              contactDetails.selectedGroups.includes(opt.value)
            )}
            onChange={value => {
              handleContactDetailsChange("selectedGroups", value);
            }}
            labelledBy={"Select"}
          /> */}
        </div>
      </div>
      <button type="submit">
        Save
      </button>
    </ContactFormStyled>
  );
}
