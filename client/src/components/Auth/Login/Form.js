import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGooglePlus, faFacebook } from "@fortawesome/free-brands-svg-icons";
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
    margin-top: 30px;
    margin-bottom: 30px;
    outline: 0;
  }
  input:focus {
    border-color: green;
    transition: 3s;
  }
  button {
    color: ${({ theme }) => theme.button.textColor.primary};
    font-size: ${({ theme }) => theme.button.fontSize} !important;
    border: none;
    box-shadow: 0px 3px 6px #908e8e;
    cursor: pointer;
  }
  button[type="submit"] {
    padding: 10px;
    display: block;
    margin: 10px auto;
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    border: none;
    width: 100px !important;
  }
  svg {
    vertical-align: middle;
  }
  #socials,
  #authOptions {
    display: grid;
    grid-gap: 1%;
  }
  #socials button {
    padding: 1em;
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
    margin: 5px;
    font-size: ${({ theme }) => theme.p.fontSize} !important;
  }
  #authOptions p a {
    color: ${({ theme }) => theme.anchor.textColor.primary};
    font-size: ${({ theme }) => theme.anchor.fontSize} !important;
    text-decoration: none;
  }
  @media (min-width: 600px) {
    #socials,
    #authOptions {
      grid-template-columns: 50% 50%;
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
`;
export default function Form({ onSubmit, handleInputChange, userDetails }) {
  const theme = useContext(ThemeContext);
  return (
    <LoginFormStyled
      theme={theme}
      data-testid="app-login-form"
      method="POST"
      onSubmit={e => onSubmit(e)}
    >
      <input
        type="email"
        id="email"
        name="email"
        data-testid="app-login-input-email"
        placeholder="Email"
        value={userDetails.email}
        onChange={({ target }) => {
          handleInputChange("email", target.value);
        }}
      />
      <input
        type="password"
        id="password"
        name="password"
        data-testid="app-login-input-password"
        placeholder="Password"
        value={userDetails.password}
        onChange={({ target }) => {
          handleInputChange("password", target.value);
        }}
      />
      <div id="socials">
        <button id="facebook">
          <FontAwesomeIcon icon={faFacebook} fixedWidth size="2x" />
          <span> Sign In with Facebook</span>
        </button>
        <button id="google">
          <FontAwesomeIcon icon={faGooglePlus} fixedWidth size="2x" />
          <span> Sign In with Google</span>
        </button>
      </div>
      <div id="authOptions">
        <p>
          New Member! <a href="/auth/create">Sign Up</a>
        </p>
        <p>
          <a href="#">Forgot Password</a>
        </p>
      </div>
      <button type="submit" data-testid="app-login-button-signin">
        SIGN IN
      </button>
    </LoginFormStyled>
  );
}
