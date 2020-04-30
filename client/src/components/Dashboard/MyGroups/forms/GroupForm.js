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
  select {
    font-size: ${({ theme }) => theme.input.fontSize};
    display: block;
    width: 50% !important;
    border: none;
    margin: 2.5em auto 2.5em auto;
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

const VISIBILITY_OPTIONS = [
  { value: "public", name: "Public" },
  { value: "private", name: "Private" }
];
export default function GroupForm({
  groupDetails,
  contacts,
  onSubmit,
  handleGroupDetailsChange
}) {
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
        placeholder="Group name"
        name="name"
        value={groupDetails.name}
        onChange={({ target }) => {
          handleGroupDetailsChange("name", target.value);
        }}
        ref={register({ required: true })}
      />
      <ErrorMessage
        field={errors.name}
        errorType="required"
        message="Group name  is required."
      />

      <select
        data-testid="app-profile-select-gender"
        name="visibility"
        onChange={({ target }) => {
          handleGroupDetailsChange("visibility", target.value);
        }}
        ref={register}>
        {VISIBILITY_OPTIONS.map(opt => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
      <div>
        <p>Assign to existing contact</p>
        {contacts.map(contact => (
          <label htmlFor="contact" key={contact.id}>
            <input
              type="checkbox"
              name="contact"
              checked={groupDetails.contacts.includes(contact.id)}
              value={contact.id}
              onChange={({ target }) => {
                handleGroupDetailsChange("contacts", target.value);
              }}
            />
            {contact.first_name} {contact.last_name}
          </label>
        ))}
      </div>
      <button type="submit">Save</button>
    </ContactFormStyled>
  );
}
