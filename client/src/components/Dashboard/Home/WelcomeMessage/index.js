import React, { useState } from "react";
import styled from "styled-components";
const WelcomeMessageStyled = styled.div`
  position: relative;
  background-color: white !important;
  padding: 1em 1em 1em 1em;
  box-shadow: 0px 3px 6px #908e8e;
  margin: 1em 0 0 0;
  text-align: center;
  p:first-child {
    color: grey;
    font-size: 1.4em;
    margin-top: 2em;
  }
  p:nth-child(2) {
    font-size: 1.5em;
  }
  button {
    padding: 0.6em;
    font-size: 0.7em !important;
    margin-top: 1em;
  }
  .close {
    position: absolute;
    top: 0;
    right: 0;
    margin-right: 0.3em;
  }
  .close:hover {
    color: grey;
  }
  @media (min-width: 600px) {
    .grid {
      grid-template-columns: 50% 50%;
    }
  }
`;
export default function index({ calendarName = "test" }) {
  const [visible, setVisible] = useState(true);
  return (
    <>
      {visible && (
        <WelcomeMessageStyled>
          <h2>Congratulations and time to get organized!</h2>
          <span
            className="close"
            onClick={() => {
              setVisible(false);
            }}
          >
            &times;
          </span>
          <div className="grid">
            <p>{calendarName} has been created!</p>
            <p>
              Now you can personalize the whole family profile.Follow family
              member's school,sports,activities calendars.
              <button>Jump to My Family and Get Started!</button>
            </p>
          </div>
        </WelcomeMessageStyled>
      )}
    </>
  );
}
