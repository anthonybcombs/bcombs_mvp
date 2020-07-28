import React, { useContext, useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import styled, { ThemeContext } from "styled-components";
import ErrorMessage from "../../../helpers/ErrorMessage";
const ForgotPasswordFormStyled = styled.form`
  input:required {
    box-shadow: none;
  }
  input:invalid {
    box-shadow: none;
  }
  input {
    background: none;
    width: 100%;
    color: black;
    font-size: ${({ theme }) => theme.input.fontSize};
    display: block;
    border: none;
    border-radius: 1;
    border: none;
    outline: 0;
    border-bottom: 2px solid lightgrey;
    margin-top: 30px;
    margin-bottom: 10px;
    outline: 0;
  }
  input:focus {
    border-color: ${({ theme }) => theme.input.focus.border.color};
    transition: 3s;
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
    border: none;
  }
  @media (min-width: 600px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 1%;
    }
  }
  #resetTypes button {
    padding: 10px;
    border-radius: 0 !important;
    margin: 5px;
  }
  #resetTypes button.selected {
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    box-shadow: 0px 3px 6px
      ${({ theme }) => theme.button.backgroundColor.primary};
  }
  p.error {
    text-align: left !important;
  }
  p.error-size {
    font-size: 14px !important;
  }
`;
export default function Form({ onSubmit, handleInputChange }) {
  const resetTypeEmail = 'Email';
  const resetTypeSecQuestions = 'Security Questions'
  const [resetType, setResetType] = useState(resetTypeEmail);
  const [randomQuestions, setRandomQuestions] = useState([]);
  const { register, handleSubmit, errors, reset } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });
  const resetTypes = [
    { name: resetTypeEmail.toLowerCase(), text: resetTypeEmail },
    { name: resetTypeSecQuestions.toLowerCase(), text: resetTypeSecQuestions }
  ];

  const questions = [
    { name: 'zip_code', text: 'Zip Code' },
    { name: 'birth_date', text: 'Birth Date (YYYY-MM-DD)' },
    { name: 'address', text: 'Address' }
  ];

  useEffect(() => {
    setRandomQuestions(questions.sort( () => Math.random() - 0.5));
  }, []);

  const handleChangeResetType = (type) => {
    setResetType(type);
  }

  return (
    <ForgotPasswordFormStyled
      data-testid="app-forgot-password-form"
      method="POST"
      onSubmit={handleSubmit(() => {
        reset();
        return onSubmit();
      })}
    >
      <div id="resetTypes" className="grid">
        {resetTypes.map(type => (
          <button
            key={type.name}
            className={resetType === type.text ? "selected" : ""}
            type="button"
            onClick={() => {
              handleChangeResetType(type.text);
              handleInputChange("reset_type", type.name);
            }}>
            Reset via {type.text}
          </button>
        ))}
      </div>
      <div>
        <input
          data-testid="app-forgot-password-input-email"
          type="email"
          name="email"
          placeholder="Email"
          onChange={({ target }) => {
            handleInputChange("email", target.value);
          }}
          ref={register({ required: true })}
        />
        <ErrorMessage
          className="error-size"
          field={errors.email}
          errorType="required"
          message="Email is required."
        />
        {resetType === resetTypeSecQuestions && <>
          {randomQuestions.map((question, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder={question.text}
                name={question.name}
                onChange={({ target }) => {
                  handleInputChange(question.name, target.value);
                }}
                ref={register({ required: true })}
              />
              <ErrorMessage
                className="error-size"
                field={errors[question.name]}
                errorType="required"
                message={`${question.text} is required.`}
              />
            </div>
          ))}
          <input
            type="password"
            name="password"
            placeholder="New Password"
            onChange={({ target }) => {
              handleInputChange("password", target.value);
            }}
            ref={register({
              required: true,
              minLength: 8,
              validate: {
                containsOneUpperCase: value => {
                  const oneUpperCaseRegex = /(?=.*[A-Z])/;
                  return oneUpperCaseRegex.test(value);
                },
                containsOneLowerCase: value => {
                  const oneLowerCaseRegex = /(?=.*[a-z])/;
                  return oneLowerCaseRegex.test(value);
                },
                containsOneNumber: value => {
                  const oneNumberRegex = /(?=.*\d)/;
                  return oneNumberRegex.test(value);
                },
                containsOneSpecialCharacter: value => {
                  const oneSpecialCharacterRegex = /(?=.*[!@#$%^&+=])/;
                  return oneSpecialCharacterRegex.test(value);
                }
              }
            })}
          />
          <ErrorMessage
            className="error-size"
            field={errors.password}
            errorType="required"
            message={
              <>
                <p className="error error-size">
                  New Password is required.
                  <br />
                  New Password minimum length must be at least 8 characters. <br />
                  Must contain atleast one upper case.
                  <br />
                  Must contain atleast one lower case.
                  <br />
                  Must contain atleast one number.
                  <br />
                  Must contain atleast one special character.
                  <br />
                </p>
              </>
            }
          />
          </>
        }
      </div>
      <button data-testid="app-forgot-password-send-button" type="submit">
        Reset Password
      </button>
    </ForgotPasswordFormStyled>
  );
}
