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
  vendor={},
  form={},
  isForm = false
}) {

  console.log("selected form", form);

  const getClassCount = (group) => {

    if(applications.length > 0) {
      const size = applications.filter((app) => {
        if(app.class_teacher) {
          return app.class_teacher == group.app_grp_id;
        }
      });
  
      return size.length;
    }

    return 0;

  }

  const renderTableData = () => {

    if(appGroups.length > 0) {
      return appGroups.map((group, index) => {

        let count = group.size;
        let classCount = getClassCount(group);
        let availableCount = count - classCount;
        availableCount = availableCount < 0 ? 0 : availableCount;

        let classLink = ""
        if(group.vendor) {
          classLink = `class/bcombs/${vendor.id2}?appgroup=${group.app_grp_id}`;
        }
        else if(group.form) {
          classLink = `class/custom/${group.form}?appgroup=${group.app_grp_id}`;
        }
        return (
          <tr key={group.id}>
            <td>
              <a href={classLink}>
                {group.name}
              </a>
            </td>
            <td>{count}</td>
            <td>{availableCount}</td>
            <td>{classCount}</td>
          </tr>
        )
      })
    } else {
      return (<tr></tr>)
    }

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

  let allLink;

  if(!isForm)
    allLink = `class/bcombs/${vendor.id2}`;
  else
    allLink = `class/custom/${form}`;

  return (
    <ApplicationSummaryStyled>
      <div id="application-status">
        <div id="application-status-header">
          <div>              
            <span>Overall Summary</span>
          </div>
        </div>
        {
          appGroups.length > 0 && (
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
                  <td>
                  <a href={allLink}>
                    All
                  </a>
                  </td>
                  <td>{getTotalCount()}</td>
                  <td>{getTotalAvailable()}</td>
                  <td>{getTotalClassCount()}</td>
                </tr>
                {renderTableData()}
              </tbody>
            </table>
          </div>
          )
        }
      </div>
    </ApplicationSummaryStyled>
  )
}