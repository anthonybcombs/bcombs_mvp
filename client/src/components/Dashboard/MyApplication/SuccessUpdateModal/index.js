import React, { useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
const SuccessUpdateModalStyled = styled.div`
  h2 {
    color: #F26E21;
  }

  .details {
    text-align: justify;
  }

  .close {
    position: absolute;
    top: 0.3rem;
    right: 1rem;
  }

  .modal-content {
    margin: 1em auto;
    padding: 0 2em 1em 2em;
    width: 20%;
    position: relative;
  }
  @media screen and (max-width: 1920px) {
    .modal-content {
      margin: 1.5em auto;
      width: 35%;
    }
    #content {
      justify-content: center;
      display: grid;
      grid-gap: 1%;
      margin: 0 50px;
    }
    button[type="submit"] {
      width: 30%;
    }
  }
  @media screen and (max-width: 1024px) {
    .modal-content {
      margin: 1.5em auto;
      width: 50%;
    }
  }
  @media screen and (max-width: 768px) {
    .modal-content {
      margin: 1.5em auto;
      width: 62%;
    }
  }
`;
export default function index({ onRedirect }) {
  return ReactDOM.createPortal(
    <SuccessUpdateModalStyled
      data-testid="app-big-calendar-create-modal"
      className="modal">
      <div className="modal-content">
        <h2>
          Application succesfully updated
          <span
            className="close"
            onClick={() => onRedirect()}>
            &times;
          </span>
        </h2>

        <div className="details">
          Thank you for updating your application.
          You will be redirected to login.

          {/* <p>
            1. You will receive a verification email asking you to authenticate your email account.
          </p>
          <p>
            2. Login to your account and set your password and security questions.
          </p>
          <p>
            3. Once confirmed, you will have to access to your personalized BCombs account and have access to view and edit your application.
          </p> */}
        </div>
      </div>
    </SuccessUpdateModalStyled>,
    document.getElementById("modal")
  );
}
