import React, { useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
const SetRemindersModalStyled = styled.div`
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
    width: 45%;
    position: relative;
  }

  .links-container {
    margin-top: 20px;
  }

  .links-container a {
    display: block;
    margin: 10px 0;
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
export default function index({
  applications,
  closeReminderModal
}) {

  console.log('reminder applications', applications);
  return ReactDOM.createPortal(
    <SetRemindersModalStyled
      data-testid="app-big-calendar-create-modal"
      className="modal">
      <div className="modal-content">
        <h2>
          Reminder: Please update your application

          <span
            className="close"
            onClick={() => closeReminderModal()}>
            &times;
          </span>
        </h2>

        <div className="details">
          Hi, The following application needs to be updated.

          <div className="links-container">
          {
            applications.map((a) => (
              <a href={`/dashboard/myapplication?appId=39601804-eeac-11eb-8726-8e38912fb756&action=update`}>
                <span>{a.vendorName} Application Form</span>
              </a>
            ))
          }
          </div>

        </div>
      </div>
    </SetRemindersModalStyled>,
    document.getElementById("modal")
  );
}
