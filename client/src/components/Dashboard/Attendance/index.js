import React, { useEffect,useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { useDispatch,useSelector } from "react-redux";
import { uuid } from "uuidv4";
import { getHours, max } from "date-fns";

import {
  requestGetApplications
} from "../../../redux/actions/Application";
import { requestVendor } from "../../../redux/actions/Vendors";

const AttendanceSummaryStyled = styled.div`
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

export default function index(props) {
  const dispatch = useDispatch();
  const { applications ,groups, auth, vendors, loading } = useSelector(
    ({ applications,groups, auth, vendors, loading }) => {
      return { applications,groups, auth, vendors, loading };
    }
  );
  const [appGroups,setAppGroups] = useState([]);
  const [selectedVendor,setSelectedVendor] = useState({});
  // appGroups = appGroups.filter((group) => {
  //   return group.vendor == vendor.id;
  // })
    console.log('APplicationzzz', applications)
  
  useEffect(() => {
    if (auth.user_id) {
      //dispatch(requestUserGroup(auth.email));
      dispatch(requestVendor(auth.user_id));
    }
  }, []);

  useEffect(() => {
    if(vendors && vendors[0]) {
      console.log('Set APp Groupsss', vendors)
      setSelectedVendor(vendors[0]);
      setAppGroups(vendors[0].app_groups);
      dispatch(requestGetApplications(vendors[0].id));
    }
  },[vendors]);

  console.log('appGroupszzzzzzz',appGroups)

  const getClassCount = (group) => {

    const size = applications.activeapplications.filter((app) => {
      if(app.class_teacher) {
        return app.class_teacher == group.app_grp_id;
      }
    });

    return size.length;
  }
  
  const renderTableData = () => {
    console.log('appGroupszzz',appGroups)
    return appGroups.map((group, index) => {

      let count = group.size;
      let classCount = getClassCount(group);
      let availableCount = count - classCount;
      availableCount = availableCount < 0 ? 0 : availableCount;

      return (
        <tr key={group.id}>
          <td>
            <a href={"attendance/" + selectedVendor?.id2 + "/" + group.name} target="_blank">
              {group.name}
            </a>
          </td>
          <td>{count}</td>
          <td>{availableCount}</td>
          <td>{classCount}</td>
          <td>
            <a href={"view/" + group.app_grp_id} target="_blank">
              View
            </a>
          </td>
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
    <AttendanceSummaryStyled>
      <div id="application-status">
        <div id="application-status-header">
          <div>              
            <span>Attendance</span>
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
                <th>Action</th>
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
    </AttendanceSummaryStyled>
  )
}