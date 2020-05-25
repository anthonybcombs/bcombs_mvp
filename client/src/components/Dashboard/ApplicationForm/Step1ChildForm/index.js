import React, { useState } from "react";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

import ChildInformationFormStyled from "../ChildInformationForm";
import GeneralInformationFormStyled from "../GeneralInformationForm";
import MedicalCareInfoStyled from '../MedicalCareIformationForm'

const ChildFormStyled = styled.div`

`;

export default function index({
  counter,
  childInformation,
  handleChildFormDetailsChange,
  handleScoresChange,
  actCount,
  satCount,
  psatCount,
  register,
  errors,
  handleAddNumChild,
  handleRemoveNumChild,
  maxChild,
  current,
  ProfileImg
}) {

  return (
    <ChildFormStyled>
      <ChildInformationFormStyled 
        handleChildFormDetailsChange={handleChildFormDetailsChange}
        childProfile={childInformation.profile}
        counter={counter}
        register={register}
        errors={errors}
        ProfileImg={ProfileImg} />
      <GeneralInformationFormStyled 
        handleChildFormDetailsChange={handleChildFormDetailsChange}
        childGeneralInformation={childInformation.general_information}
        counter={counter}
        handleScoresChange={handleScoresChange}
        actCount={actCount}
        satCount={satCount}
        psatCount={psatCount}
        register={register}
        errors={errors} />
      <MedicalCareInfoStyled 
        childEmergencyCare={childInformation.emergency_care_information}
        handleChildFormDetailsChange={handleChildFormDetailsChange}
        counter={counter}
        register={register}
        errors={errors}
      />
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