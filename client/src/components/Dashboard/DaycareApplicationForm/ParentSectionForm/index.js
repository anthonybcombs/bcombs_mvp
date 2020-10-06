import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

import ParentInformationStyled from "../ParentInformationForm";
import EmergencyContactFormStyled from "../../ApplicationForm/EmergencyContacForm";
import RelationshipToChildStyled from "../RelationshipToChildForm";

const ParentFormStyled = styled.div`

`;

export default function index({
  handleParentFormDetailsChange,
  handleParentChildRelationship = {},
  parentsInformation,
  emergencyContacts,
  handleAddParent,
  handleRemoveParent,
  current,
  maxParent,
  register,
  errors,
  ProfileImg,
  parents = [],
  childs = []
}) {
  const renderParentForm = () => {

    const items = []
    for(let i = 1; i <= current; i++) {
      if(i == 1) {
        items.push(
          <div key={i}>
            <ParentInformationStyled 
              key={i}
              handleParentFormDetailsChange={handleParentFormDetailsChange}
              parentProfile={parentsInformation[i - 1].profile}
              counter={i}
              register={register}
              errors={errors}
              ProfileImg={ProfileImg}
            />
            <div className="application-btn-container">
              {
                current < maxParent && i == current &&
                <a href="#" className="left" onClick={(e) => {
                  e.preventDefault();
                  handleAddParent();
                }}>
                  <FontAwesomeIcon size="sm" icon={faPlusCircle} />
                  <span>Add Parent</span>
                </a>
              }
              {
                current < maxParent && current > 1 && i != 1 &&
                <a href="#" className="left remove" onClick={(e) => {
                  e.preventDefault();
                  handleRemoveParent(i - 1);
                }}>
                  <FontAwesomeIcon size="sm"  icon={faMinusCircle} />
                  <span>Remove Parent</span>
                </a>
              }
            </div>
          </div>
  
        )
      } else {
        items.push(
          <div key={i}>
            <hr className="style-eight"></hr>
            <ParentInformationStyled 
              key={i}
              handleParentFormDetailsChange={handleParentFormDetailsChange}
              parentProfile={parentsInformation[i - 1].profile}
              counter={i}
              register={register}
              errors={errors}
              ProfileImg={ProfileImg}
            />
            <div className="application-btn-container">
              {
                current < maxParent && i == current &&
                <a href="#" className="left" onClick={(e) => {
                  e.preventDefault();
                  handleAddParent();
                }}>
                  <FontAwesomeIcon size="sm" icon={faPlusCircle} />
                  <span>Add Parent</span>
                </a>
              }
              {
                current <= maxParent && current > 1 && i != 1 &&
                <a href="#" className="left remove" onClick={(e) => {
                  e.preventDefault();
                  handleRemoveParent(i - 1);
                }}>
                  <FontAwesomeIcon size="sm"  icon={faMinusCircle} />
                  <span>Remove Parent</span>
                </a>
              }
            </div>
          </div>
        )
      }
    }
    return items;
  }
  return (
    <ParentFormStyled>
      {renderParentForm()}
      <br/>
      <br/>
      <RelationshipToChildStyled
        handleParentChildRelationship={handleParentChildRelationship}
        register={register}
        errors={errors}
        childs={childs}
        parents={parents}
      />
      <br/>
      <br/>
      <EmergencyContactFormStyled
        handleParentFormDetailsChange={handleParentFormDetailsChange}
        parentEmergencyContacts={emergencyContacts}
        register={register}
        errors={errors}
      />
    </ParentFormStyled>
  )
}