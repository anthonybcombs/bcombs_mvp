import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";


const EmergencyContactFormStyled = styled.div`
  position: relative;

  #contacts {
    width: 100%;
    border-collapse: collapse;
    border: 0;
    margin-bottom: 20px;
  }

  #contacts th {
    background-color: #f26e21;
    color: white;
    font-weight: normal;
    font-size: 18px;
  }

  #contacts td, #contacts th {
    border: 0;
    padding: 10px;
    text-align: center;
  }

  #contacts td {
    border-top: 1px solid #eaedf1;
    padding: 10px;
  }

  #contacts .input-field {
    width: 150px;
    text-align: start;
    font-size: 18px;
    border: 0;
    border-bottom: 1px solid #ccc;
    font-family: inherit;
    -webkit-appearance: none;
    -moz-appearance: none;
    border-radius: 0;
    cursor: text;
    padding: 5px 0;
    display: block;
    text-indent: 5px;
    margin: auto;
  }

  #contacts select.input-field {
    width: 100%;
  }
`;

export default function index() {

  const data = {};

  const GENDER_OPTIONS = [
    { id: 1, value: "Male", name: "Male"},
    { id: 2, value: "Female", name: "Female"}
  ];

  const RELATION_TO_CHILD_OPTIONS = [
    { id: 1, value: "Mother / Father", name: "Mother / Father"},
    { id: 2, value: "Grandparent", name: "Grandparent"},
    { id: 3, value: "Aunt / Uncle", name: "Aunt / Uncle"},
    { id: 4, value: "Sibling", name: "Sibling"},
    { id: 5, value: "Other", name: "Other"}
  ];

  const renderTableData = () => {

    let rows = [];

    for(let i = 0; i < 4; i++) {
      let row =
        <tr key={i}>
          <td>
            <input
              className="input-field"
            />
          </td>
          <td>
            <input
              className="input-field"
            />
          </td>
          <td>
            <select
              className="input-field">
              <option value="">Select Type</option>
              {GENDER_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </td>
          <td>
            <input
              className="input-field"
            />
          </td>
          <td>
            <input
              className="input-field"
            />
          </td>
          <td>
            <select
              className="input-field">
              <option value="">Select Type</option>
              {RELATION_TO_CHILD_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </td>
        </tr>

        rows.push(row);
    }

    return rows;
  }

  return (
    <EmergencyContactFormStyled>
      <h3 className="heading">Emergency Contact</h3>
      <div className="emergency-contact-wrapper">
        <div>
        <table id="contacts">
            <tbody>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Gender</th>
                <th>Mobile Phone #</th>
                <th>Work Phone #</th>
                <th>Relationship To Child</th>
              </tr>
              {renderTableData()}
            </tbody>
          </table>
        </div>
      </div>
    </EmergencyContactFormStyled>
  )
}