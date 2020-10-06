import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import ErrorMessage from "../../../../helpers/ErrorMessage";

const RelationshipToChildStyled = styled.div`
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
  handleParentChildRelationship = {},
  register,
  errors,
  parents,
  childs,
  isReadonly = false
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

  return (
    <RelationshipToChildStyled>
      <h3 className="heading">Relationship to Child</h3>
      <div className="relationship-wrapper">
        <div className="content">
          <div className="question-box">
            <p>What is the relation of <strong>Test Parent 1</strong> to</p>
            <ul>
              <li>
                <span>
                  Test Child 1
                  <small style={{fontSize: "50%"}}>(Child)</small>
                </span>
                
                <div className='select-field-wrapper'>
                  <select
                    name={"ch_parent"}
                    className="input-field"
                    onChange={({target}) => {
                      handleParentChildRelationship()
                    }}
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
              </li>
              <li>
                <span>
                  Test child 2
                  <small style={{fontSize: "50%"}}>(Child)</small>
                </span>
                
                <div className='select-field-wrapper'>
                  <select
                    name={"ch_parent"}
                    className="input-field"
                    onChange={({target}) => {
                      handleParentChildRelationship()
                    }}
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
              </li>
            </ul>
          </div>

          <div className="question-box">
            <p>What is the relation of <strong>Test Parent 2</strong> to</p>
            <ul>
              <li>
                <span>
                  Test Child 1
                  <small style={{fontSize: "50%"}}>(Child)</small>
                </span>
                
                <div className='select-field-wrapper'>
                  <select
                    name={"ch_parent"}
                    className="input-field"
                    onChange={({target}) => {
                      handleParentChildRelationship()
                    }}
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
              </li>
              <li>
                <span>
                  Test child 2
                  <small style={{fontSize: "50%"}}>(Child)</small>
                </span>
                
                <div className='select-field-wrapper'>
                  <select
                    name={"ch_parent"}
                    className="input-field"
                    onChange={({target}) => {
                      handleParentChildRelationship()
                    }}
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
              </li>
            </ul>
          </div>

        </div>
      </div>
    </RelationshipToChildStyled>
  )
}