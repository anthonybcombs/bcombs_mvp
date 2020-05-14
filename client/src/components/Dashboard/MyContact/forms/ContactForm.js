import React, { useEffect, useState, useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { useForm } from "react-hook-form";
import { Multiselect } from "multiselect-react-dropdown";

import ErrorMessage from "../../../../helpers/ErrorMessage";
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
    margin-top: 15em;
  }
  @media (min-width: 600px) {
    button[type="submit"] {
      width: ${({ theme }) => theme.button.width.primary};
    }
  }
`;
export default function ContactForm({
  contactDetails,
  groups,
  onSubmit,
  handleContactDetailsChange
}) {
  const [groupOptions, setGroupOptions] = useState([]);
  const { register, handleSubmit, errors } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  useEffect(() => {
    if (groups) {
      let formattedGroups = groups.map(item => {
        return {
          name: `${item.name} `,
          id: item.id
        };
      });
      setGroupOptions(formattedGroups);
    }
  }, [groups]);

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
              name="last_name"
              className="field-input"
              placeholder="Last Name"
              onChange={({ target }) => {
                handleContactDetailsChange("last_name", target.value);
              }}
              ref={register({ required: true, maxLength: 20 })}
              value={contactDetails.last_name}
            />
            <label className="field-label">Lastname</label>
          </div>
          <ErrorMessage
            field={errors.last_name}
            errorType="required"
            message="Lastname is required."
          />
          <ErrorMessage
            field={errors.last_name}
            errorType="maxLength"
            message="Length should not be greater than 20."
          />
        </div>

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
              value={contactDetails.first_name}
            />
            <label className="field-label">Firstname</label>
          </div>
          <ErrorMessage
            field={errors.first_name}
            errorType="required"
            message="Firstname is required."
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
              name="phone_number"
              className="field-input"
              placeholder="Phone Number"
              onChange={({ target }) => {
                handleContactDetailsChange("phone_number", target.value);
              }}
              ref={register({
                required: true,
                pattern: /^[\s()+-]*([0-9][\s()+-]*){6,20}$/
              })}
              value={contactDetails.phone_number}
            />
            <label className="field-label">Phone Number</label>
          </div>
          <ErrorMessage
            field={errors.phone_number}
            errorType="required"
            message="Phone Number is required."
          />

          <ErrorMessage
            field={errors.phone_number}
            errorType="pattern"
            message="Only accepts numeric and should be a minimum of 6 digits"
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
            <label className="field-label">Email</label>
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
            <label className="field-label">Relation</label>
          </div>
          <ErrorMessage
            field={errors.email}
            errorType="required"
            message="Relation is required."
          />
        </div>
      </div>
      {/* <input
        placeholder="First name"
        name="first_name"
        value={contactDetails.first_name}
        onChange={({ target }) => {
          handleContactDetailsChange("first_name", target.value);
        }}
        ref={register({ required: true })}
      />
      <ErrorMessage
        field={errors.first_name}
        errorType="required"
        message="First  name is required."
      />
      <input
        placeholder="Last name"
        name="last_name"
        value={contactDetails.last_name}
        onChange={({ target }) => {
          handleContactDetailsChange("last_name", target.value);
        }}
        ref={register({ required: true })}
      />
      <ErrorMessage
        field={errors.last_name}
        errorType="required"
        message="Last  name is required."
      />
      <input
        placeholder="Phone number"
        name="phone_number"
        value={contactDetails.phone_number}
        onChange={({ target }) => {
          handleContactDetailsChange("phone_number", target.value);
        }}
        ref={register({ required: true })}
      />
      <ErrorMessage
        field={errors.phone_number}
        errorType="required"
        message="Phone number is required."
      />
      <input
        type="email"
        placeholder="Email"
        name="email"
        value={contactDetails.email}
        onChange={({ target }) => {
          handleContactDetailsChange("email", target.value);
        }}
        ref={register({ required: true })}
      />
      <ErrorMessage
        field={errors.email}
        errorType="required"
        message="Email is required."
      />
      <input
        placeholder="Relation"
        name="relation"
        value={contactDetails.relation}
        onChange={({ target }) => {
          handleContactDetailsChange("relation", target.value);
        }}
        ref={register({ required: true })}
      />
      <ErrorMessage
        field={errors.relation}
        errorType="required"
        message="Relation is required."
      /> */}
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

        <Multiselect
          className="field-input"
          options={groupOptions}
          hasSelectAll={false}
          onSelect={handleSelectChange}
          placeholder="Add from my contacts"
          displayValue="name"
          closeIcon="cancel"
        />
      </div>
      <button type="submit">Save</button>
    </ContactFormStyled>
  );
}
