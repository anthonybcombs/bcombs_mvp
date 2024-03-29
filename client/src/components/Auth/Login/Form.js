import React, { useContext, useEffect } from "react";
import styled, { ThemeContext } from "styled-components";
import { useForm } from "react-hook-form";
import { Link } from "@reach/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGooglePlus, faFacebook } from "@fortawesome/free-brands-svg-icons";
import ErrorMessage from "../../../helpers/ErrorMessage";
import Recaptcha from "react-recaptcha";

const LoginFormStyled = styled.form`
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
    margin-top: 3em;
    margin-bottom: 1em;
  }
  input:focus {
    border-color: ${({ theme }) => theme.input.focus.border.color};
    transition: 3s;
  }
  button {
    color: ${({ theme }) => theme.button.textColor.primary};
    font-size: ${({ theme }) => theme.button.fontSize} !important;
    border: none;
    box-shadow: 0px 3px 6px #908e8e;
    padding-top: 1em;
    padding-bottom: 1em;
    border-radius: ${({ theme }) => theme.button.borderRadius} !important;
  }
  button[type="submit"] {
    padding: 10px;
    display: block;
    margin: 2em auto;
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    border: none;
    width: 100px !important;
  }
  svg {
    vertical-align: middle;
  }
  #socials {
    margin-top: 2em !important;
  }
  #socials button {
    padding: 1em;
    border-radius: 0 !important;
    margin: 5px;
  }
  #facebook {
    background-color: ${({ theme }) => theme.button.backgroundColor.secondary};
  }
  #google {
    background-color: ${({ theme }) => theme.button.backgroundColor.error};
  }
  #authOptions p {
    font-weight: bold;
    text-align: center;
    padding: 0;
    margin-top: 1em;
    font-size: ${({ theme }) => theme.p.fontSize} !important;
  }
  #authOptions p a {
    color: ${({ theme }) => theme.anchor.textColor.primary};
    font-size: ${({ theme }) => theme.anchor.fontSize} !important;
    text-decoration: none;
  }
  #socials > * {
    width: initial;
  }
  p.error {
    text-align: left !important;
  }
  p.error-size {
    font-size: 14px !important;
  }
  @media (min-width: 600px) {
    .grid {
      grid-template-columns: 50% 50%;
      grid-gap: 1%;
    }
    #authOptions p:first-child {
      text-align: left;
    }
    #authOptions p:last-child {
      text-align: right;
    }
    button[type="submit"] {
      width: 300px;
    }
  }
  #g-recaptcha {
    margin-top: 3em;
  }
`;
export default function Form({
  onSubmit,
  handleInputChange,
  // handleGoogleSignIn,
  // handleFacebookSignIn,
  hideForgotPassword = false
}) {
  const theme = useContext(ThemeContext);
  const { register, handleSubmit, errors, setValue } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const onVerifyCaptcha = response => {
    if (response) {
      setValue("not_robot", response);
    }
  };

  useEffect(() => {
    register({ name: "not_robot" }, { required: true });
  }, []);


  return (
    <LoginFormStyled
      theme={theme}
      data-testid="app-login-form"
      method="POST"
      onSubmit={handleSubmit(onSubmit)}>
      <input
        type="email"
        id="email"
        name="email"
        data-testid="app-login-input-email"
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
      <input
        type="password"
        id="password"
        name="password"
        data-testid="app-login-input-password"
        placeholder="Password"
        onChange={({ target }) => {
          handleInputChange("password", target.value);
        }}
        ref={register({ required: true })}
      />
      <ErrorMessage
        className="error-size"
        field={errors.password}
        errorType="required"
        message="Password is required."
      />
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
      <button type="submit" data-testid="app-login-button-signin">
        SIGN IN
      </button>
      {/* START Temporary comment as of august 28 */}
      {/* <div id="socials" className="grid">
        <button
          id="facebook"
          type="button"
          onClick={() => {
            handleFacebookSignIn();
          }}
        >
          <FontAwesomeIcon icon={faFacebook} fixedWidth size="2x" />
          <span> Sign In with Facebook</span>
        </button>
        <button
          id="google"
          type="button"
          onClick={() => {
            handleGoogleSignIn();
          }}
        >
          <FontAwesomeIcon icon={faGooglePlus} fixedWidth size="2x" />
          <span> Sign In with Google</span>
        </button>
      </div> */}
      {/* END Temporary comment as of august 28 */}
      {/*className="grid" */}
      <div id="authOptions">
        {/* <p>
          New Member! <Link to="/auth/create">Sign Up</Link>
        </p> */}
        {
          hideForgotPassword ? "" : (
            <p>
              <Link to="/auth/forgot-password">Forgot Password</Link>
            </p>
          )
        }

      </div>
    </LoginFormStyled>
  );
}
