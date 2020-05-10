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
  .contact-body {
    padding: 1em;
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
      grid-template-columns: repeat(2, 1fr);
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
`;

/*
    > .contact-body {
      grid-template-columns: 65% 35%;
    }
    */
export default function ContactForm({
  contactDetails,
  groups,
  onSubmit,
  handleContactDetailsChange
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
      <div id="contact-header">
        <div>
          <div>
            <img src="https://i.picsum.photos/id/1043/200/300.jpg" />
            <button>Edit profile picture</button>
          </div>
        </div>
        <div>
          <h3>
            {contactDetails.first_name} {contactDetails.last_name}
          </h3>
          <p>{contactDetails.email}</p>
          <p>{contactDetails.phone_number}</p>
          <p>{contactDetails.relation}</p>
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
              ref={register({ required: true })}
              value={contactDetails.last_name}
            />
            <label className="field-label">Lastname</label>
          </div>
          <ErrorMessage
            field={errors.last_name}
            errorType="required"
            message="Lastname is required."
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
              ref={register({ required: true })}
            />
            <label className="field-label">Firstname</label>
          </div>
          <ErrorMessage
            field={errors.first_name}
            errorType="required"
            message="Firstname is required."
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
              ref={register({ required: true })}
              value={contactDetails.phone_number}
            />
            <label className="field-label">Phone Number</label>
          </div>
          <ErrorMessage
            field={errors.phone_number}
            errorType="required"
            message="Phone Number is required."
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

        <div>
          <p>Assign to existing group</p>
          {groups.map(group => (
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
          ))}
        </div>
      </div>
      <button type="submit">Save</button>
    </ContactFormStyled>
  );
}
