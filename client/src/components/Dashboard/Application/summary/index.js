import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { uuid } from "uuidv4";

const ApplicationSummaryStyled = styled.div`
  #application-status {
    padding: 1em;
  }

  #application-status-header {
    font-size: 1.2em;
  }

  #application-status-header > div {
    padding: 1em 0;
  }

  #application-status-header > div > span {
    font-weight: normal;
  }

  #application-status-header > div > svg {
    color: #D33125;
  }

  #application-status-list {
    box-shadow: 0px 0px 10px #ccc;
  }

  #groups {
    text-align: center;
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;
    border: 0;
  }
  
  #groups td, #groups th {
    border: 0;
    padding: 15px;
  }
  
  #groups tr:nth-child(odd){background-color: #f9f9f9;}
  
  // #groups tr:hover {background-color: #ddd;}
  
  #groups th {
    text-align: center;
    background-color: #f26e21;
    color: white;
  }

  #groups a {
    color: #3e89fe;
    text-decoration: none;
  }
`;

export default function index({grades}) {
  
  let maxClass = 20;

  let tCount = 0;
  let tAvailable = 0;
  let tClassCount = 0;

  // const setTotals = () => {
    
  //   grades.map((grades) => {
  //     let count = maxClass;
  //     let available = maxClass - group.contacts.length;
  //     let classCount = group.contacts.length;

  //     tCount = tCount + count;
  //     tAvailable = tAvailable + available;
  //     tClassCount = tClassCount + classCount;
  //   });
  // }

  const renderTableData = () => {

    return grades.map((grade, index) => {

      let count = maxClass;
      let available = 0;
      let classCount = 0;
      
      return (
        <tr key={grade.id}>
          <td>
            <a href="#">
              {grade.name}
            </a>
          </td>
          <td>{count}</td>
          <td>{available}</td>
          <td>{classCount}</td>
        </tr>
      )
    })
  }

  // setTotals();

  return (
    <ApplicationSummaryStyled>
      <div id="application-status">
        <div id="application-status-header">
          <div>              
            <span>Overall Summary</span>
          </div>
        </div>
        <div id="application-status-list">
          <table id="groups">
            <tbody>
              <tr>
                <th>Class</th>
                <th>Count</th>
                <th>Available</th>
                <th>Class Count</th>
              </tr>
              <tr>
                <td>Total</td>
                <td>{tCount}</td>
                <td>{tAvailable}</td>
                <td>{tClassCount}</td>
              </tr>
              {renderTableData()}
            </tbody>
          </table>
        </div>
      </div>
    </ApplicationSummaryStyled>
  )
}