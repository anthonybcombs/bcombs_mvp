import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../../../helpers/ErrorMessage";
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
    margin-bottom: 2.5em;
  }
  input:focus {
    border-color: ${({ theme }) => theme.input.focus.border.color};
    transition: 3s;
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
    margin-top: 15em;
  }
  @media (min-width: 600px) {
    button[type="submit"] {
      width: ${({ theme }) => theme.button.width.primary};
    }
    input,
    p.error {
      width: 50%;
      margin: 2.5em auto 2.5em auto;
    }
    div {
      width: 50%;
      margin: 2.5em auto 2.5em auto;
    }
  }
`;
export default function ContactForm({
  contactDetails,
  groups,
  onSubmit,
  handleContactDetailsChange
}) {
  console.log("groups", groups);
  const { register, handleSubmit, errors } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });
  const theme = useContext(ThemeContext);
  return (
    <ContactFormStyled
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
      theme={theme}>
      <input
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
      />
      <div>
        <p>Assign to existing group</p>
        {groups.map(group => (
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
        ))}
      </div>
      <button type="submit">Save</button>
    </ContactFormStyled>
  );
}
