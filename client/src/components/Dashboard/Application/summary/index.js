import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { uuid } from "uuidv4";
import { getHours, max } from "date-fns";

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

export default function index({
  appGroups = [],
  applications = [],
  vendor
}) {
  
  console.log("appGroups...", appGroups);

  const getClassCount = (group) => {

    const size = applications.filter((app) => {
      if(app.class_teacher) {
        return app.class_teacher == group.app_grp_id;
      }
    });

    return size.length;
  }

  const renderTableData = () => {

    return appGroups.map((group, index) => {

      let count = group.size;
      let classCount = getClassCount(group);
      let availableCount = count - classCount;
      availableCount = availableCount < 0 ? 0 : availableCount;

      return (
        <tr key={group.id}>
          <td>
            <a href={"class/" + vendor?.id2 + "/" + group.name} target="_blank">
              {group.name}
            </a>
          </td>
          <td>{count}</td>
          <td>{availableCount}</td>
          <td>{classCount}</td>
        </tr>
      )
    })
  }

  const getTotalCount = () => {
    let totalCount = 0;
    appGroups.map(group => {
      totalCount += group.size;
    });
    return totalCount;
  }

  const getTotalAvailable = () => {
    let totalAvailable = 0;
    for(const group of appGroups) {
      let classCount = getClassCount(group);
      totalAvailable += group.size - classCount;
    }

    totalAvailable = totalAvailable < 0 ? 0 : totalAvailable;
    return totalAvailable;
  }

  const getTotalClassCount = () => {
    let totalClassCount = 0;
    for(const group of appGroups) {
      totalClassCount += getClassCount(group);
    }

    return totalClassCount;
  }

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
                <td>{getTotalCount()}</td>
                <td>{getTotalAvailable()}</td>
                <td>{getTotalClassCount()}</td>
              </tr>
              {renderTableData()}
            </tbody>
          </table>
        </div>
      </div>
    </ApplicationSummaryStyled>
  )
}