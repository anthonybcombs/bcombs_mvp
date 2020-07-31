import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { useForm } from "react-hook-form";

import ErrorMessage from "../../../../../helpers/ErrorMessage";

const CreateSecurityQuestionsFormStyled = styled.form`
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
    font-size: ${({ theme }) => theme.input.fontSize} !important;
    display: block;
    border: none;
    border-radius: 1;
    border: none;
    outline: 0;
    border-bottom: 2px solid lightgrey;
    margin-top: 2.5em;
    margin-bottom: 1em;
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

    display: block;
    margin: 10px auto;
    border: none;
  }
  h3 {
    text-align: center;
  }
  [hidden] {
    display: none;
  }
  p.error {
    margin: 0 !important;
    font-size: 14px !important;
  }
  @media (min-width: 600px) {
    button[type="submit"] {
      width: ${({ theme }) => theme.button.width.primary};
    }
  }
  input:required {
    box-shadow: none;
  }
  input:invalid {
    box-shadow: none;
  }
  input:focus {
    border-color: ${({ theme }) => theme.input.focus.border.color};
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

export default function CreateSecurityQuestionsForm({
  data,
  onSubmit,
  handleInputChange
}) {
  const theme = useContext(ThemeContext);

  console.log("Dataaaaa", data);
  const {
    register,
    handleSubmit,
    errors,
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  return (
    <CreateSecurityQuestionsFormStyled
      method="POST"
      theme={theme}
      onSubmit={handleSubmit(onSubmit)}>
      <h3>Create Security Questions</h3>
      <div className="form-group">
        <div className="field">
          <input
            className="field-input"
            name="securityquestion1"
            placeholder="Security Question 1"
            onChange={({ target }) => {
              handleInputChange("securityquestion1", target.value);
            }}
            ref={register({ required: true })}
          />
          <label className="field-label">
            <span className="required">*</span> Security Question 1
          </label>
        </div>
        <ErrorMessage
          field={errors.securityquestion1}
          errorType="required"
          message="Security Question 1 is required."
        />
      </div>
      <div className="form-group">
        <div className="field">
          <input
            className="field-input"
            name="securityquestion1answer"
            placeholder="Security Question 1 Answer"
            onChange={({ target }) => {
              handleInputChange("securityquestion1answer", target.value);
            }}
            ref={register({ required: true })}
          />
          <label className="field-label">
            <span className="required">*</span> Security Question 1 Answer
          </label>
        </div>
        <ErrorMessage
          field={errors.securityquestion1}
          errorType="required"
          message="Security Question 1 Answer is required."
        />
      </div>
      <div className="form-group">
        <div className="field">
          <input
            className="field-input"
            name="securityquestion2"
            placeholder="Security Question 2"
            onChange={({ target }) => {
              handleInputChange("securityquestion2", target.value);
            }}
            ref={register({ required: true })}
          />
          <label className="field-label">
            <span className="required">*</span> Security Question 2
          </label>
        </div>
        <ErrorMessage
          field={errors.securityquestion2}
          errorType="required"
          message="Security Question 2 is required."
        />
      </div>
      <div className="form-group">
        <div className="field">
          <input
            className="field-input"
            name="securityquestion2answer"
            placeholder="Security Question 2 Answer"
            onChange={({ target }) => {
              handleInputChange("securityquestion2answer", target.value);
            }}
            ref={register({ required: true })}
          />
          <label className="field-label">
            <span className="required">*</span> Security Question 2 Answer
          </label>
        </div>
        <ErrorMessage
          field={errors.securityquestion2}
          errorType="required"
          message="Security Question 2 Answer is required."
        />
      </div>
      <div className="form-group">
        <div className="field">
          <input
            className="field-input"
            name="securityquestion3"
            placeholder="Security Question 3"
            onChange={({ target }) => {
              handleInputChange("securityquestion3", target.value);
            }}
            ref={register({ required: true })}
          />
          <label className="field-label">
            <span className="required">*</span> Security Question 3
          </label>
        </div>
        <ErrorMessage
          field={errors.securityquestion3}
          errorType="required"
          message="Security Question 3 is required."
        />
      </div>
      <div className="form-group">
        <div className="field">
          <input
            className="field-input"
            name="securityquestion3answer"
            placeholder="Security Question 3 Answer"
            onChange={({ target }) => {
              handleInputChange("securityquestion3answer", target.value);
            }}
            ref={register({ required: true })}
          />
          <label className="field-label">
            <span className="required">*</span> Security Question 3 Answer
          </label>
        </div>
        <ErrorMessage
          field={errors.securityquestion3}
          errorType="required"
          message="Security Question 3 Answer is required."
        />
      </div>
      <button type="submit">
        Save and Continue
      </button>
    </CreateSecurityQuestionsFormStyled>
  );
}
