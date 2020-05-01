import React, { useState } from "react";
import styled from "styled-components";

import ChildFormStyled from "./Step1ChildForm";
import ParentFormStyled from "./Step2ParentForm";
import TermsWaiverFormStyled from "./Step3TermsWaiverForm";

const ApplicationFormStyled = styled.div`
  padding: 20px;
  position: relative;
  display: block;

  .wizard-wrapper {
    margin: 30px auto;
  }

  .wizard-wrapper .wizard-inner {
    position: relative;
    width: 90%;
    margin: 0 auto;
  }

  .wizard-wrapper .connecting-line {
    height: 3px;
    background: #e0e0e0;
    position: absolute;
    width: 78%;
    margin: 0 auto;
    left: 0;
    right: 0%;
    top: 28%;
    z-index: 1;
  }

  .wizard-wrapper .nav-tabs {
    position: relative;
    margin: 0 auto;
    margin-bottom: 0;
    border-bottom: none;
    list-style: none;
    padding-left: 0;
  }

  .wizard-wrapper .nav-tabs:after {
    content: " ";
    display: table;
    clear: both;
  }
  
  .nav-tabs > li {
    margin-bottom: 0;
    display: block;
    position: relative;
    width: 25%;
    float: left;
    text-align: center;
  }

  .wizard-wrapper .nav-tabs > li a {
    padding: 0;
    border: none;
    text-decoration: none;
  }

  .wizard-wrapper .nav-tabs > li.active > a,
  .wizard-wrapper .nav-tabs > li.active > a:hover,
  .wizard-wrapper .nav-tabs > li.active > a:focus {
    color: #555555;
    cursor: default;
    border: 0;
    border-bottom-color: transparent;
  }

  .wizard-wrapper .round-tab {
    width: 50px;
    height: 50px;
    line-height: 48px;
    margin: 0 auto;
    margin-bottom: 10px;
    display: table;
    border-radius: 100px;
    z-index: 2;
    position: relative;
    left: 0;
    font-size: 20px;
    transition: all 0.5s ease;
    border: 2px solid #f26e21;
    background: white;
    color: #f26e21;
  }

  .wizard-wrapper .round-tab:hover {
    background-color: #f47b2c;
    color: white;
    transition: all 0.5s ease;
  }

  .wizard-wrapper li.active .round-tab {
    border: 2px solid
  }

  .wizard-wrapper .nav-tabs > li.active .round-tab {
    border-color: #f26e21;
    background: #f47b2c;
    color: white
  }

  .wizard-inner .round-tab-title {
    color: #f26e21;
    font-weight: 600;
    font-size: 20px;
  }

  .wizard-inner .nav-tabs > li.active .round-tab-title {
    color: #f26e21
  }

  .container {
    margin-right: auto;
    margin-left: auto;
    padding-left: 15px;
    padding-right: 15px;
    width: 100%;
    padding-top: 25px;
  }

  @media (min-width: 768px) {
    .container {
      max-width: 850px;
    }
  }

  @media (min-width: 992px) {
    .container {
      max-width: 1070px;
    }
  }

  @media (min-width: 1200px) {
    .container {
      max-width: 1240px;
    }
  }

  .heading {
    color: #f26e21;
    border-bottom: 4px solid #f26e21;
    width: fit-content;
    padding-bottom: 6px;
    padding-left: 15px;
    font-size: 27px;
  }

  .child-info-wrapper,
  .general-info-wrapper,
  .medical-info-wrapper,
  .parent-info-wrapper,
  .emergency-contact-wrapper,
  .waiver-wrapper  {
    box-shadow: 0px 0px 30px #ccc;
    padding: 30px;
    margin-top: 30px;
    overflow: hidden;
    background-color: #fff;
    padding-bottom: 70px;
  }

  .emergency-contact-wrapper {
    padding-bottom: 30px;
  }

  .child-info-wrapper > div,
  .general-info-wrapper > div,
  .medical-info-wrapper > div,
  .parent-info-wrapper > div,
  .emergency-contact-wrapper > div,
  .waiver-wrapper > div {
    padding-left: 15px;
    padding-right: 15px;
  }

  .cus-select-container {
    position: relative;
    padding-left: 30px;
    margin-bottom: 12px !important;
    margin-right: 20px;
    cursor: pointer;
    font-size: 18px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .cus-select-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  .cus-select-container .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 17px;
    width: 17px;
    background-color: white;
    border: 3px solid #4b525a;
    border-radius: 50%;
  }

  .cus-select-container .checkmark:after {
    content: "";
    position: absolute;
    display: none;
    top: 4px;
    left: 4px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #4b525a
  }

  .cus-select-container input:checked ~ .checkmark:after {
    display: block;
  }

  .cus-checkbox-container {
    position: relative !important;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    margin: 30px auto 0 auto;
    margin-bottom: 0px;
    padding-left: 20px;
    font-size: 22px;
    cursor: pointer;
  }

  .cus-checkbox-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .cus-checkbox-container .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: white;
    border-color: black;
    border-radius: 0px;
    cursor: pointer;
    border: 1px solid #ccc;
  }
  
  .cus-checkbox-container .checkmark:after {
    left: 8px;
    top: 5px;
    width: 7px;
    height: 10px;
    border: solid black;
    border-width: 0 3px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);

    content: "";
    position: absolute;
    display: none;
  }

  .cus-checkbox-container input:checked ~ .checkmark:after {
    display: block;
  }

  .hide {
    display: none;
  }

  .agree-text {
    font-size: 18px;
    padding-left: 15px;
    color: #4b525a;
    font-weight: bold;
    margin-bottom: 20px;
  }
  
  .style-eight {
    overflow: visible;
    padding: 0;
    border: none;
    border-top: medium double #f26e21;
    color: #f26e21;
    text-align: center;
    margin-top: 20px;
    margin-bottom: 20px;
    height: 0;
  }

  .style-eight::after {
    content: "§";
    display: inline-block;
    position: relative;
    top: -0.7em;
    font-size: 1.5em;
    padding: 0 0.25em;
    background: none;
  }

  .application-btn-container {
    margin-top: 40px;
    text-align: center;
  }

  .application-btn-container a {
    color: #555555;
    cursor: default;
    border: 0;
    border-bottom-color: transparent;
    text-decoration: none;
    cursor: pointer;
    background: #f26e21;
    color: white;
    border-radius: 25px;
    padding: 12px 25px;
    display: inline-block
  }

  .application-btn-container a.right {
    float: right;
  }

  .application-btn-container a.left {
    float: left;
  }

  .application-btn-container:after {
    content: " ";
    display: table;
    clear: both;
  }
`;

export default function index() {

  const [selectedStep, setSelectedStep] = useState(1);

  const handleWizardSelection = (index) => {
    setSelectedStep(index);
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  return (
    <ApplicationFormStyled
      id="applicationForm">
      <div className="wizard-wrapper">
        <div className="wizard-inner">
          <div className="connecting-line"></div>
          <ul className="nav-tabs">
            <li className={selectedStep == 1 ? "active": ""}>
              <a href="#" value="1" onClick={(e) => {
                 e.preventDefault();
                handleWizardSelection(1)
              }}>
                <span className="round-tab">1</span>
                <span className="round-tab-title">Child</span>
              </a>
            </li>
            <li className={selectedStep == 2 ? "active": ""}>
              <a href="#" onClick={(e) => {
                e.preventDefault();
                handleWizardSelection(2)
              }}>
                <span className="round-tab">2</span>
                <span className="round-tab-title">Parent</span>
              </a>
            </li>
            <li className={selectedStep == 3 ? "active": ""}>
              <a href="#" onClick={(e) => {
                e.preventDefault();
                handleWizardSelection(3)
              }}>
                <span className="round-tab">3</span>
                <span className="round-tab-title">Terms & Waiver</span>
              </a>
            </li>
            <li className={selectedStep == 4 ? "active": ""}>
              <a href="#" onClick={(e) => {
                e.preventDefault();
                handleWizardSelection(4)
              }}>
                <span className="round-tab">4</span>
                <span className="round-tab-title">Review</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="container">
          <div className={(selectedStep == 1 || selectedStep == 4) ? "" : "hide"}>
            <ChildFormStyled/> 
          </div>
          {selectedStep == 4 && <hr className="style-eight"></hr>}
          <div className={(selectedStep == 2 || selectedStep == 4) ? "" : "hide"}>
            <ParentFormStyled />
          </div>
          {selectedStep == 4 && <hr className="style-eight"></hr>}
          <div className={(selectedStep == 3 || selectedStep == 4 ) ? "" : "hide"}>
            <TermsWaiverFormStyled />
          </div>

          <div className="application-btn-container">
            {
              selectedStep < 4 &&
              <a href="#" className="right" onClick={(e) => {
                e.preventDefault();
  
                if(selectedStep == 1) handleWizardSelection(2);
                else if(selectedStep == 2) handleWizardSelection(3)
                else if (selectedStep == 3) handleWizardSelection(4)
  
                scrollToTop();
              }}>
                Next
              </a>
            }
            {
              (selectedStep > 1 && selectedStep != 4) &&
              <a href="#" className="left" onClick={(e) => {
                e.preventDefault();
  
                if(selectedStep == 3) handleWizardSelection(2);
                else if(selectedStep == 2) handleWizardSelection(1)
  
                scrollToTop();
              }}>
                Previous
              </a>
            }
            {
              (selectedStep == 4 ) &&
              <a href="#" onClick={(e) => {
                e.preventDefault();
              }}>
                Submit
              </a>
            }  

          </div>
        </div>

      </div>
    </ApplicationFormStyled>
  )
}