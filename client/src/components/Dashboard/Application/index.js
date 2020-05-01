import React, { useState }from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThList,
  faFileSignature,
  faCogs
} from "@fortawesome/free-solid-svg-icons";

import ApplicationSummaryStyled from "./summary";
import ApplicationSettingsStyled from "./settings";
import ApplicationListStyled from "./list"

const ApplicationStyled = styled.div`
  padding: 1em;
  
  #application {
    display: grid;
  }

  #labels {
    padding: 1em;
  }

  #labels > div,
  #labels > a {
    padding: 1em;
    font-size: 1.2em;
    cursor: pointer;
    display: block;
    color: initial;
    text-decoration: none;
  }

  #labels > div > span,
  #labels > a > span {
    margin-left: 1em;
  }

  #application > div {
    background-color: white;
    box-shadow: 0 0 25px #eae9e9;
  }

  #application > div:nth-of-type(2) {
    margin-right: 0.5em;
  }

  .selected {
    background: #f26e21;
    color: white !important;
  }

  @media (min-width: 600px) {
    #application {
      grid-template-columns: 25% 75%;
      grid-gap: 1%;
    }
  }

  @media (min-width: 1500px) {
    #application > div:nth-of-type(2) {
      margin-right: 1em;
    }
  }
`;

export default function index() {

  const [selectedLabel, setSelectedLabel] = useState("Application Status");

  const handleSelectedLabel = value => {
    setSelectedLabel(value);
  };

  return (
    <ApplicationStyled>
      <h2>Application</h2>
      <div id="application">
        <div>
          <div id="labels">
            <a href="/application/2" target="_blank">
              <FontAwesomeIcon icon={faFileSignature} />
              <span>Application</span>
            </a>

            <div
              className={`${selectedLabel === "Application Status" ? "selected" : ""}`}  
              onClick={() => {
                handleSelectedLabel("Application Status");
              }}
            >
              <FontAwesomeIcon icon={faThList} />
              <span>Application Status</span>
            </div>

            <div
              className={`${selectedLabel === "Form Settings" ? "selected" : ""}`}  
              onClick={() => {
                handleSelectedLabel("Form Settings");
              }}
            >
              <FontAwesomeIcon icon={faCogs} />
              <span>Form Settings</span>
            </div>
          </div>
        </div>
        <div>
          {
            selectedLabel === "Application Status" &&
            <ApplicationSummaryStyled/>
          }
          {
            selectedLabel === "Form Settings" && 
            <ApplicationSettingsStyled />
          }
        </div>
      </div>
      {
        selectedLabel === "Application Status" &&
        <ApplicationListStyled />
      }
    </ApplicationStyled>
  )
}