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
    margin-top: 15em;
  }
  > div {
    display: grid;
  }
  > #contact-header > div:first-child > div > img {
    border-radius: 50%;
    height: 100px;
    width: 100px;
    display: block;
    margin-left: auto;
    margin-right: auto;
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
  > #contact-header p,
  > #contact-header h3 {
    padding: 0;
    margin: 0.3em;
  }
  > #contact-header p:nth-of-type(3) {
    color: lightgrey;
  }
  #contact-body {
    padding: 1em;
  }
  @media (min-width: 600px) {
    button[type="submit"] {
      width: ${({ theme }) => theme.button.width.primary};
    }
    input,
    p.error {
      width: 80%;
      margin: 2.5em auto 2.5em auto;
    }
    > #contact-header {
      grid-template-columns: repeat(2, 1fr);
    }
    > #contact-body {
      grid-template-columns: 65% 35%;
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
`;
export default function ContactForm({
  contactDetails,
  groups,
  onSubmit,
  handleContactDetailsChange
}) {
  const { register, handleSubmit, errors } = useForm();
  const theme = useContext(ThemeContext);
  return (
    <ContactFormStyled
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
      theme={theme}
    >
      <div id="contact-header">
        <div>
          <div>
            <img src="https://i.picsum.photos/id/1043/200/300.jpg" />
            <button>Edit profile picture</button>
          </div>
        </div>
        <div>
          <h3>
            {contactDetails.firstName} {contactDetails.lastName}
          </h3>
          <p>{contactDetails.email}</p>
          <p>{contactDetails.phoneNumber}</p>
          <p>{contactDetails.relation}</p>
        </div>
      </div>
      <div id="contact-body">
        <div>
          <input
            placeholder="First name"
            name="firstName"
            value={contactDetails.firstName}
            onChange={({ target }) => {
              handleContactDetailsChange("firstName", target.value);
            }}
            ref={register({ required: true })}
          />
          <ErrorMessage
            field={errors.firstName}
            errorType="required"
            message="First  name is required."
          />
          <input
            placeholder="Last name"
            name="lastName"
            value={contactDetails.lastName}
            onChange={({ target }) => {
              handleContactDetailsChange("lastName", target.value);
            }}
            ref={register({ required: true })}
          />
          <ErrorMessage
            field={errors.lastName}
            errorType="required"
            message="Last  name is required."
          />
          <input
            placeholder="Phone number"
            name="phoneNumber"
            value={contactDetails.phoneNumber}
            onChange={({ target }) => {
              handleContactDetailsChange("phoneNumber", target.value);
            }}
            ref={register({ required: true })}
          />
          <ErrorMessage
            field={errors.phoneNumber}
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
        </div>
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
      </div>
      <button type="submit">Save</button>
    </ContactFormStyled>
  );
}
