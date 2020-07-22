import React, { useContext, useState, useEffect } from "react";
import { Link } from "@reach/router";
import { useForm } from "react-hook-form";
import styled, { ThemeContext } from "styled-components";
import Popover, { ArrowContainer } from "react-tiny-popover";
import Recaptcha from "react-recaptcha";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

import ErrorMessage from "../../../helpers/ErrorMessage";

const CreateUserFormStyled = styled.form`
  input:required {
    box-shadow: none;
  }
  input:invalid {
    box-shadow: none;
  }

  input:focus {
    border-color: ${({ theme }) => theme.input.focus.border.color};
  }
  #password {
    width: 100% !important;
    display: inline-block !important;
  }

  button {
    color: ${({ theme }) => theme.button.textColor.primary};
    font-size: ${({ theme }) => theme.button.fontSize} !important;
    background-color: lightgrey;
    border: none;
    box-shadow: 0px 3px 6px #908e8e;
    border-radius: ${({ theme }) => theme.button.borderRadius};
  }
  button[type="submit"] {
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    padding: 10px;
    display: block;
    margin: 10px auto;
    border: none;
    width: 100px !important;
    margin-top: 0.5em;
  }
  select {
    display: block;
    width: 100%;
    font-size: ${({ theme }) => theme.select.fontSize};
    border: none;
  }
  select option {
    font-weight: normal;
  }
  #userTypes button {
    padding: 10px;
    border-radius: 0 !important;
    margin: 5px;
  }
  #userTypes button.selected {
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    box-shadow: 0px 3px 6px
      ${({ theme }) => theme.button.backgroundColor.primary};
  }
  p {
    font-weight: bold;
    text-align: center;
    padding: 0;
    margin-top: 1em;
    font-size: ${({ theme }) => theme.p.fontSize} !important;
    text-align: left;
  }
  p a {
    color: ${({ theme }) => theme.anchor.textColor.primary};
    font-size: ${({ theme }) => theme.anchor.fontSize} !important;
    text-decoration: none;
  }
  ul {
    list-style: none !important;
    margin: 0;
    padding: 0;
  }
  @media (min-width: 600px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 1%;
    }
  }

  .info-icon {
    margin-left: 0px !important;
  }
  p.error {
    text-align: left !important;
    font-size: 1.3em;
    color: red;
  }
  p.error-size {
    font-size: 14px !important;
  }
  input.error-input {
    border-color: red;
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
  .required {
    color: red;
  }
`;

const PopoverStyled = styled.div`
  background: white;
  padding: 5px;
  border: 1px solid lightgrey;
  a {
    display: block;
    color: grey;
    text-decoration: none;
    cursor: pointer;
    margin: 1em;
  }
  svg {
    margin-right: 1em;
  }
`;
export default function Form({
  onSubmit,
  handleInputChange,
  handleChangeUserType,
  status,
  userDetails,
  userTypes
}) {
  const theme = useContext(ThemeContext);
  const [isPopoverOpen, setPopOverOpen] = useState(false);
  const { register, handleSubmit, errors, watch, setValue } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange"
  });
  const { type } = userDetails;

  const onVerifyCaptcha = (response) => {
    if (response) {
      setValue('not_robot', response);
    }
  };

  useEffect(() => {
    register({ name: 'not_robot'}, { required: true });
  });

  return (
    <CreateUserFormStyled
      data-testid="app-create-form"
      theme={theme}
      onSubmit={handleSubmit(onSubmit)}>
      <div id="userTypes" className="grid">
        {userTypes.map(userType => (
          <button
            key={userType.id}
            data-testid="app-create-button-user"
            className={type.name === userType.name ? "selected" : ""}
            type="button"
            onClick={() => {
              handleChangeUserType(userType);
            }}>
            {userType.name.toUpperCase()}
          </button>
        ))}
      </div>
      {status && status.message && <p className="error">{status.message}</p>}
      <br />
      <br />

      <div className="form-group">
        <div className="field">
          <input
            className="field-input"
            type="text"
            id="username"
            name="username"
            data-testid="app-create-input-username"
            placeholder="Public Display Name"
            onChange={({ target }) => {
              handleInputChange("username", target.value);
            }}
            ref={register({
              minLength: 2,
              maxLength: 15
              //pattern: /^(([0-9][A-z]+)|([A-z]+))$/
              // validate: {
              //   alphanumeric: value => {
              //     const alphaExp = /^[a-zA-z0-9]+$|^[a-zA-Z]*$/;
              //     return alphaExp.test(value);
              //   }
              // }
            })}
          />
          <label className="field-label">Public Display Name</label>
        </div>
        <ErrorMessage
          field={errors.username}
          errorType="alphanumeric"
          message={
            <>
              <p className="error error-size">
                Username must be 2 to 15 characters long
              </p>
            </>
          }
        />
      </div>

      <div className="form-group">
        <div className="field">
          <input
            className={`${errors.email ? `error-input` : ""} field-input`}
            type="email"
            id="email"
            name="email"
            data-testid="app-create-input-email"
            placeholder="Email"
            onChange={({ target }) => {
              handleInputChange("email", target.value);
            }}
            ref={register({
              required: true,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Valid email should contain '@' and '.'"
              }
            })}
          />
          <label className="field-label">
            <span className="required">*</span> Email
          </label>
        </div>

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

      <div className="form-group">
        <div className="field">
          <input
            disabled={errors.email}
            className={`${errors.password ? `error-input` : ""} field-input`}
            type="password"
            id="password"
            name="password"
            data-testid="app-create-input-password"
            placeholder="Password"
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
                // passwordRequirement: value => {
                //   const passworRequirementRegex = /^(?=.{10,}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?\W).*$/;
                //   return passworRequirementRegex.test(value);
                // }
              }
            })}
          />

          <label className="field-label">
            <span className="required">*</span> Password{" "}
            <Popover
              isOpen={isPopoverOpen}
              position={"right"}
              padding={10}
              onClickOutside={() => setPopOverOpen(false)}
              content={({ position, targetRect, popoverRect }) => (
                <ArrowContainer
                  position={position}
                  targetRect={targetRect}
                  popoverRect={popoverRect}
                  arrowColor="lightgrey"
                  arrowSize={7}
                  arrowStyle={{ opacity: 1 }}
                  arrow="center">
                  <PopoverStyled>
                    * Password minimum length must be at least 8 characters.
                    <br />
                    * Must contain atleast one upper case.
                    <br />
                    * Must contain atleast one lower case.
                    <br />
                    * Must contain atleast one number.
                    <br />* Must contain atleast one special character.
                  </PopoverStyled>
                </ArrowContainer>
              )}>
              <FontAwesomeIcon
                className="info-icon"
                onClick={() => {
                  setPopOverOpen(true);
                }}
                icon={faInfoCircle}
              />
            </Popover>
          </label>
        </div>
        <ErrorMessage
          className="error-size"
          field={errors.password}
          errorType="required"
          message={
            <>
              <p className="error error-size">
                Password is required.
                <br />
                Password minimum length must be at least 8 characters. <br />
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
      </div>

      <div className="form-group">
        <div className="field">
          <input
            disabled={errors.password || errors.email}
            className={`${
              errors.confirm_password ? `error-input` : ""
            } field-input`}
            type="password"
            id="confirm_password"
            name="confirm_password"
            data-testid="app-create-input-confirm-password"
            placeholder="* Confirm Password"
            onChange={({ target }) => {
              handleInputChange("confirm_password", target.value);
            }}
            ref={register({
              required: true,
              //minLength: 8,
              validate: {
                sameConfirmPassword: value => {
                  return value === watch("password");
                }
              }
            })}
          />
          <label className="field-label">
            <span className="required">*</span> Confirm Password
          </label>
        </div>
        <ErrorMessage
          className="error-size"
          field={errors.confirm_password}
          errorType="required"
          message="Confirm password is required."
        />

        <ErrorMessage
          className="error-size"
          field={errors.confirm_password}
          errorType="sameConfirmPassword"
          message="The passwords do not match."
        />
      </div>

      <div className="form-group">
        <div className="field">
          <Recaptcha
            sitekey='6LcDvbQZAAAAAI5egI5fYzQYk3wCOZULXy_wHFM9'
            render='explicit'
            verifyCallback={onVerifyCaptcha}
          />
        </div>

        <ErrorMessage
          className="error-size"
          field={errors.not_robot}
          errorType="required"
          message="Please verify that you are not a robot."
        />
      </div>

      <button
        disabled={errors.password || errors.email}
        type="submit"
        data-testid="app-create-button-signup">
        SIGN UP
      </button>
      <p>
        Already have an account? <Link to="/">Sign In</Link>
      </p>
    </CreateUserFormStyled>
  );
}
