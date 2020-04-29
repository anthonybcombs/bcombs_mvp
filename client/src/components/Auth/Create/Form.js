import React, { useContext } from "react";
import { Link } from "@reach/router";
import { useForm } from "react-hook-form";
import styled, { ThemeContext } from "styled-components";
import ErrorMessage from "../../../helpers/ErrorMessage";
const CreateUserFormStyled = styled.form`
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
    outline: 0;
    margin-top: 2.5em;
    margin-bottom: 2.5em;
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
`;
export default function Form({
  onSubmit,
  handleInputChange,
  handleChangeUserType,
  hasVendorCode,
  userDetails,
  userTypes
}) {
  const theme = useContext(ThemeContext);
  const { register, handleSubmit, errors } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });
  const { type } = userDetails;
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
      <input
        type="text"
        id="username"
        name="username"
        data-testid="app-create-input-username"
        placeholder="Username"
        onChange={({ target }) => {
          handleInputChange("username", target.value);
        }}
        ref={register({
          required: true,
          minLength: 5,
          validate: {
            alphanumeric: value => {
              const alphaExp = /^[a-zA-Z0-9_]{5,}[a-zA-Z]+[0-9]*$/;
              return alphaExp.test(value);
            }
          }
        })}
      />
      <ErrorMessage
        field={errors.username}
        errorType="required"
        message="Username is required."
      />
      <ErrorMessage
        field={errors.username}
        errorType="minLength"
        message="Username minimum length must be at least 5 characters."
      />
      <ErrorMessage
        field={errors.username}
        errorType="alphanumeric"
        message="Username must be alphanumeric."
      />
      <input
        type="email"
        id="email"
        name="email"
        data-testid="app-create-input-email"
        placeholder="Email"
        onChange={({ target }) => {
          handleInputChange("email", target.value);
        }}
        ref={register({ required: true })}
      />
      <ErrorMessage
        field={errors.email}
        errorType="required"
        message="Email is required."
      />
      <input
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
              const oneSpecialCharacterRegex = /(?=.*[@#$%^&+=])/;
              return oneSpecialCharacterRegex.test(value);
            }
            // passwordRequirement: value => {
            //   const passworRequirementRegex = /^(?=.{10,}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?\W).*$/;
            //   return passworRequirementRegex.test(value);
            // }
          }
        })}
      />
      <ErrorMessage
        field={errors.password}
        errorType="required"
        message="Password is required."
      />
      <ErrorMessage
        field={errors.password}
        errorType="minLength"
        message="Password minimum length must be at least 8 characters."
      />
      <ErrorMessage
        field={errors.password}
        errorType="containsOneUpperCase"
        message={"Must contain atleast one upper case."}
      />
      <ErrorMessage
        field={errors.password}
        errorType="containsOneLowerCase"
        message={"Must contain atleast one lower case."}
      />
      <ErrorMessage
        field={errors.password}
        errorType="containsOneNumber"
        message={"Must contain atleast one number."}
      />
      <ErrorMessage
        field={errors.password}
        errorType="containsOneSpecialCharacter"
        message={"Must contain atleast one special character."}
      />
      <input
        type="password"
        id="confirm_password"
        name="confirm_password"
        data-testid="app-create-input-confirm-password"
        placeholder="Confirm Password"
        onChange={({ target }) => {
          handleInputChange("confirm_password", target.value);
        }}
        ref={register({
          required: true,
          minLength: 8,
          validate: {
            sameConfirmPassword: value => value === password.value
          }
        })}
      />
      <ErrorMessage
        field={errors.confirm_password}
        errorType="required"
        message="Confirm password is required."
      />
      <ErrorMessage
        field={errors.confirm_password}
        errorType="minLength"
        message="Confirm password minimum length must be at least 8 characters."
      />
      <ErrorMessage
        field={errors.confirm_password}
        errorType="sameConfirmPassword"
        message="The passwords do not match."
      />
      <button type="submit" data-testid="app-create-button-signup">
        SIGN UP
      </button>
      <p>
        Already Member! <Link to="/">Sign In</Link>
      </p>
    </CreateUserFormStyled>
  );
}
