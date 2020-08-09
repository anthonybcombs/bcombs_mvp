import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import styled, { ThemeContext } from "styled-components";
import ErrorMessage from "../../../helpers/ErrorMessage";
import Recaptcha from "react-recaptcha";
import { useDispatch, useSelector } from "react-redux";
import { requestSecurityQuestions } from "../../../redux/actions/Users";

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
export default function Form({ onSubmit, handleInputChange, hasStatus }) {
  const dispatch = useDispatch();
  const resetTypeEmail = "Email";
  const resetTypeSecQuestions = "Security Questions";
  const [resetType, setResetType] = useState(resetTypeSecQuestions);
  const [randomQuestions, setRandomQuestions] = useState([]);
  const [securityQuestionError, setSecurityQuestionError] = useState("");
  const [hasStatusMsg, setHasStatusMsg] = useState(hasStatus);
  const { register, handleSubmit, errors, reset, watch, setValue } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });
  const resetTypes = [
    // { name: resetTypeEmail.toLowerCase(), text: resetTypeEmail },
    { name: resetTypeSecQuestions.toLowerCase(), text: resetTypeEmail }
  ];
  const email = watch("email");

  const { user } = useSelector(({ user }) => {
    return {
      user
    };
  });

  useEffect(() => {
    register({ name: "not_robot" }, { required: true });
  }, []);

  const handleChangeResetType = type => {
    setResetType(type);
  };

  const onVerifyCaptcha = response => {
    if (response) {
      setValue("not_robot", response);
    }
  };

  const generateSecurityQuestions = () => {
    setHasStatusMsg(false);
    console.log("Emailll", email);
    dispatch(requestSecurityQuestions(email));
  };

  useEffect(() => {
    if (
      Object.keys(user.profile).length &&
      !user.profile.hasOwnProperty("error") &&
      !hasStatusMsg
    ) {
      let questions = [
        { name: "security_question1", text: user.profile.security_question1 },
        { name: "security_question2", text: user.profile.security_question2 },
        { name: "security_question3", text: user.profile.security_question3 }
      ];
      setRandomQuestions(questions);
    }
    if (
      email &&
      Object.keys(user.profile).length &&
      user.profile.hasOwnProperty("error")
    ) {
      setSecurityQuestionError(user.profile.error);
    } else {
      setSecurityQuestionError("");
    }
  }, [user]);

  return (
    <ForgotPasswordFormStyled
      data-testid="app-forgot-password-form"
      method="POST"
      onSubmit={handleSubmit(() => {
        reset();
        return onSubmit();
      })}>
      {/* <div id="resetTypes" className="grid">
        {resetTypes.map(type => (
          <button
            key={type.name}
            className={resetType === type.text ? "selected" : ""}
            type="button"
            onClick={() => {
              handleChangeResetType(type.text);
              handleInputChange("reset_type", type.name);
            }}>
            Reset via email
          </button>
        ))}
      </div> */}
      <div>
        <br />
        <div className="form-group">
          <div className="field">
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
            {securityQuestionError && (
              <>
                <p className="error error-size">{securityQuestionError}</p>
              </>
            )}
          </div>
        </div>
        <br />
        {resetType === resetTypeSecQuestions && randomQuestions.length > 0 && (
          <>
            {randomQuestions.map((question, index) => (
              <div className="form-group" key={index}>
                <div className="field">
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
              </div>
            ))}
            {/* <div className="form-group">
            <div className="field">
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
            </div>
          </div> */}
            {/* <div className="form-group">
            <div className="field">
              <input
                disabled={errors.password}
                type="password"
                name="confirm_password"
                placeholder="Confirm New Password"
                onChange={({ target }) => {
                  handleInputChange("confirm_password", target.value);
                }}
                ref={register({
                  required: true,
                  validate: {
                    sameConfirmPassword: value => {
                      return value === watch("password");
                    }
                  }
                })}
              />
              <ErrorMessage
                className="error-size"
                field={errors.confirm_password}
                errorType="required"
                message="Confirm New Password is required."
              />

              <ErrorMessage
                className="error-size"
                field={errors.confirm_password}
                errorType="sameConfirmPassword"
                message="The passwords do not match."
              />
            </div>
          </div> */}
          </>
        )}
      </div>
      {(resetType === resetTypeEmail || randomQuestions.length > 0) && (
        <>
          <Recaptcha
            sitekey="6LcDvbQZAAAAAI5egI5fYzQYk3wCOZULXy_wHFM9"
            render="explicit"
            verifyCallback={onVerifyCaptcha}
          />
          <ErrorMessage
            className="error-size"
            field={errors.not_robot}
            errorType="required"
            message="Please verify that you are not a robot."
          />
          <button data-testid="app-forgot-password-send-button" type="submit">
            Reset Password
          </button>
        </>
      )}
      {resetType === resetTypeSecQuestions && randomQuestions.length === 0 && (
        <button
          data-testid="app-forgot-password-send-button"
          type="submit"
          onClick={generateSecurityQuestions}>
          Get Security Questions
        </button>
      )}
    </ForgotPasswordFormStyled>
  );
}
