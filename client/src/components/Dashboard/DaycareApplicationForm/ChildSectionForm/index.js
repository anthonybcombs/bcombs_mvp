import React, { useState } from "react";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

import ChildInformationFormStyled from "../ChildInformationForm";
import GeneralInformationFormStyled from "../GeneralInformationForm";
import MedicalCareInfoStyled from '../../ApplicationForm/MedicalCareIformationForm';

const ChildFormStyled = styled.div`
  @media (max-width: 480px) {
    .application-btn-container a.remove {
      width: 58px;
      white-space: pre;
      overflow: hidden;
      padding: 12px 37px 12px 18px;
    }
    .application-btn-container a.remove span {
      position: relative;
    }
    .application-btn-container a.remove span:after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 40px;
      height: 100%;
      background: red;
    }
    .application-btn-container a.left {
      margin-right: 5px;
    }
  }
`;

export default function index({
  counter,
  childInformation,
  handleChildFormDetailsChange,
  register,
  errors,
  handleAddNumChild,
  handleRemoveNumChild,
  maxChild,
  current,
  ProfileImg
}) {

  console.log("hello anditoi na ko");

  return (
    <ChildFormStyled>
      <ChildInformationFormStyled 
        handleChildFormDetailsChange={handleChildFormDetailsChange}
        childProfile={childInformation.profile}
        counter={counter}
        register={register}
        errors={errors}
        ProfileImg={ProfileImg}/>
      <br/>
      <br/>
      <GeneralInformationFormStyled 
        handleChildFormDetailsChange={handleChildFormDetailsChange}
        childGeneralInformation={childInformation.general_information}
        counter={counter}
        register={register}
        errors={errors} />
      <br/>
      <br/>
      <MedicalCareInfoStyled 
        childEmergencyCare={childInformation.emergency_care_information}
        handleChildFormDetailsChange={handleChildFormDetailsChange}
        counter={counter}
        register={register}
        errors={errors} />
      <div className="application-btn-container">
        {
          current < maxChild && counter == current &&
          <a href="#" className="left" onClick={(e) => {
            e.preventDefault();
            handleAddNumChild();
          }}>
            <FontAwesomeIcon size="sm" icon={faPlusCircle} />
            <span>Add Child</span>
          </a>
        }
        {
          current <= maxChild && current > 1 && counter != 1 &&
          <a href="#" className="left remove" onClick={(e) => {
            e.preventDefault();
            handleRemoveNumChild(counter - 1);
          }}>
            <FontAwesomeIcon size="sm" icon={faMinusCircle} />
            <span>Remove Child</span>
          </a>
        }
      </div>
    </ChildFormStyled>
  )
}