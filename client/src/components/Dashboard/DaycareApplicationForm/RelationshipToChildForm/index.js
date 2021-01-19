import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import ErrorMessage from "../../../../helpers/ErrorMessage";

const RelationshipToChildStyled = styled.div`

  margin-bottom: 40px;
  padding-left: 15px;
  padding-right: 15px;

  .relationship-wrapper {
    padding: 20px;
    background-color: #ffffff;
    box-shadow: 0 0 30px #ccc;
  }
  .relationship-wrapper .header {
    background: #f47b2c;
    padding: 10px 0px;
    color: white;
    text-transform: uppercase;
    font-size: 18px;
    font-weight: 600;
    border-radius: 15px;
    text-align: center;
  }

  .relationship-wrapper .content {
    border: 1px solid #ccc;
    border-radius: 5px;
    min-height: 275px;
    overflow-x: scroll;
    overflow-y: hidden;
    white-space: nowrap;
    margin-bottom: 20px;
    padding: 0px 10px;

    display: flex;
    flex-wrap: wrap;
    padding: 2rem 0;
    justify-content: center
  }

  .question-box {
    background: white;
    display: inline-block;
    padding: 10px;
    border-radius: 12px;
    margin: .5rem;
    border: 1px solid #ccc;
    width: 100%;
    max-width: 400px;
  }

  .question-box p  {
    font-size: 19px;
    font-weight: 600;
    color: #4C5157;
    overflow: hidden;
    white-space: normal;
    text-overflow: ellipsis;
  }

  .question-box strong {
    color: #f47b2c;
  }

  .question-box ul li:before {
    content: "• ";
    position: absolute;
    left: -25px;
  }

  .question-box ul li {
    color: #4C5157;
    font-size: 18px;
    margin-top: 18px;
    display: grid;
    grid-template-columns: 50% 50%;
    position: relative;
  }

  .question-box span {
    font-weight: 600;
    color: #4C5157;
    white-space: normal;
  }

  .question-box small {
    margin-left: 5px;
  }

  .question-box select {
    width: 100%;
    padding: 3px;
    font-size: 15px;
    border-color: inherit;
    height: 30px;
  }

  .question-box .select-field-wrapper:after {
    right: 8px !important;
    bottom: 8px !important;
  }
`;

export default function index({
  handleParentChildRelationship,
  handleChildChildRelationship,
  register,
  errors,
  parents,
  childs,
  isReadonly = false,
  relationships = [],
  chRelationships = [],
  isReadView = false
}) {

  const RELATION_TO_CHILD_OPTIONS = [
    { id: 1, value: "Mother", name: "Mother"},
    { id: 2, value: "Father", name: "Father"},
    { id: 3, value: "Grandparent", name: "Grandparent"},
    { id: 4, value: "Aunt / Uncle", name: "Aunt / Uncle"},
    { id: 5, value: "Sibling", name: "Sibling"},
    { id: 6, value: "Other Relative", name: "Other Relative"},
    { id: 7, value: "Family Friend", name: "Family Friend"},
    { id: 8, value: "Other", name: "Other"}
  ];

  const getRelationshipVal = (parent, child) => {
    if(relationships.length > 0) {

      const rel = relationships.filter((item) => {
        return item.parent == parent && item.child == child;
      });

      console.log("rel", rel);

      if(rel.length > 0) return rel[0].relationship;
    }
  }

  const getChRelationshipVal = (child, child2) => {
    if(chRelationships.length > 0) {

      const rel = chRelationships.filter((item) => {
        return item.child == child && item.child2 == child2;
      });

      console.log("rel", rel);

      if(rel.length > 0) return rel[0].relationship;
    }
  }

  console.log("childs", childs);
  console.log("parents", parents);
  console.log("relationships", relationships);

  let tempChilds = []

  if(isReadView) {
    tempChilds.push({
      id: childs[0].id,
      first_name: childs[0].profile.first_name
    })

    for(const item of chRelationships) {
      tempChilds.push({
        id: item.child2,
        first_name: item.details?.firstname
      })
    } 
  }

  console.log("chRelationships", chRelationships);
  console.log("isReadView", isReadView);
  console.log("tempChilds", tempChilds);

  return (
    <RelationshipToChildStyled>
      <h3 className="heading">Relationship to Child</h3>
      <div className="relationship-wrapper">
        <div className="content">
        {
          parents.map((parent, i) => (
            <div key={i} className="question-box">
              <p>What is the relation of <strong>{parent.profile.first_name}</strong> to</p>
              {
                <ul>
                {
                  childs.map((child, j) => (
                    <li key={j}>
                      <span>
                        {child.profile.first_name}
                        <small style={{fontSize: "50%"}}>(Child)</small>  
                      </span>
                      <div className='select-field-wrapper'>
                        <select
                          name={"ch_parent" + i + "" + j}
                          className="input-field"
                          onChange={({target}) => {
                            handleParentChildRelationship(parent.id, child.id, target.value);
                          }}
                          value={getRelationshipVal(parent.id, child.id)}
                          ref={register({required: true})}
                          readOnly={isReadonly}
                          disabled={isReadonly}
                        >
                          <option value="">Select</option>
                          {
                            RELATION_TO_CHILD_OPTIONS.map(opt => (
                              <option key={opt.id} value={opt.name}>
                                {opt.name}
                              </option>
                            ))
                          }
                        </select>
                      </div>
                      <div></div>
                      {
                        errors["ch_parent" + i +"" + j] && (
                          <p style={{color:"red", fontSize:"16px"}}>
                            Relationship is required
                          </p>
                        )
                      }
                    </li>
                  ))
                }
                </ul>
              }
            </div>
          ))
        }
        </div>
        {
          childs.length > 1 && (
            childs.map((child, i) => (
              <div className="content">
                <div key={i} className="question-box">
                  <p>What is the relation of <strong>{child.profile.first_name}</strong> to</p>
                  {
                    <ul>
                      {
                        childs.map((child2, j) => (
                          child.id != child2.id && (
                            <li key={j}>
                              <span>
                                {child2.profile.first_name}
                                <small style={{fontSize: "50%"}}>(Child)</small>  
                              </span>
                              <div className="select-field-wrapper">
                                <select
                                  name={"ch_ch" + i + "" + j}
                                  className="input-field"
                                  onChange={({target}) => {
                                    handleChildChildRelationship(child.id, child2.id, target.value);
                                  }}
                                  value={getChRelationshipVal(child.id, child2.id)}
                                  ref={register({required: true})}
                                  readOnly={isReadonly}
                                  disabled={isReadonly}
                                >
                                  <option value="">Select</option>
                                  {
                                    RELATION_TO_CHILD_OPTIONS.map(opt => (
                                      <option key={opt.id} value={opt.name}>
                                        {opt.name}
                                      </option>
                                    ))
                                  }
                                </select>
                              </div>
                              <div></div>
                              {
                                errors["ch_ch" + i +"" + j] && (
                                  <p style={{color:"red", fontSize:"16px"}}>
                                    Relationship is required
                                  </p>
                                )
                              }
                            </li>
                          )
                        ))
                      }
                    </ul>
                  }
                </div>
              </div>
            ))
          )
        }
        {
          tempChilds && tempChilds.length > 1 && isReadView ? (
            <div className="content">
              <div className="question-box">
                <p>What is the relation of <strong>{tempChilds[0].first_name}</strong> to</p>
                {
                  <ul>
                    {
                      tempChilds.map((child2, j) => (
                        tempChilds[0].id != child2.id && (
                          <li key={j}>
                            <span>
                              {child2.first_name}
                              <small style={{fontSize: "50%"}}>(Child)</small>  
                            </span>
                            <div className="select-field-wrapper">
                              <select
                                name={"ch_ch0" + j}
                                className="input-field"
                                onChange={({target}) => {
                                  handleChildChildRelationship(tempChilds[0].id, child2.id, target.value);
                                }}
                                value={getChRelationshipVal(tempChilds[0].id, child2.id)}
                                ref={register({required: true})}
                                readOnly={isReadonly}
                                disabled={isReadonly}
                              >
                                <option value="">Select</option>
                                {
                                  RELATION_TO_CHILD_OPTIONS.map(opt => (
                                    <option key={opt.id} value={opt.name}>
                                      {opt.name}
                                    </option>
                                  ))
                                }
                              </select>
                            </div>
                            <div></div>
                            {
                              errors["ch_ch0" + j] && (
                                <p style={{color:"red", fontSize:"16px"}}>
                                  Relationship is required
                                </p>
                              )
                            }
                          </li>
                        )
                      ))
                    }
                  </ul>
                }
            </div>
          </div>
          ) : ""
        }
      </div>
    </RelationshipToChildStyled>
  )
}