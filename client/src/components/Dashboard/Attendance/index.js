import React, { useEffect,useState } from "react";
import { Link } from "@reach/router";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { useDispatch,useSelector } from "react-redux";
import { uuid } from "uuidv4";
import { getHours, max } from "date-fns";

import {
  requestGetApplications
} from "../../../redux/actions/Application";
import { requestGetForms } from '../../../redux/actions/FormBuilder'   
import { requestVendor } from "../../../redux/actions/Vendors";

const AttendanceSummaryStyled = styled.div`
  width: auto;
  max-width: 1920px;
  margin: auto;
  padding: 0rem 3em 2rem;

 

  #attendance {
    padding: 1rem;
    background-color: white;
    box-shadow: 0 0 25px #eae9e9;
    min-height: calc(100vh - 220px);
  }

  #groups {
    border: 0;
    width: 100%;
    text-align: center;
    border-collapse: collapse;
    box-shadow: 0px 0px 10px #ccc;
    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
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


  @media (max-width: 840px) {
    padding: 0rem 1rem 2rem;
  }

`;

export default function index(props) {
  const dispatch = useDispatch();
  const { applications ,groups, auth, vendors, loading, form : { formList = [] } } = useSelector(
    ({ applications,groups, auth, vendors, loading, form }) => {
      return { applications,groups, auth, vendors, loading,form };
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

      dispatch(requestGetForms({ vendor: vendors[0].id, categories: [] }))
    }
  },[vendors]);


  const getClassCount = (group) => {

    const size = applications.activeapplications.filter((app) => {
      if(app.class_teacher) {
        return app.class_teacher == group.app_grp_id;
      }
    });

    return size.length;
  }
  
  const renderTableData = () => {
    const currentForm = formList.map(form => (
      form.vendor === vendors[0].id
    ))
    console.log('appGroupszzz',appGroups)
    return appGroups.map((group, index) => {

      let count = group.size;
      let classCount = getClassCount(group);
      let availableCount = count - classCount;
      availableCount = availableCount < 0 ? 0 : availableCount;

      return (
        <tr key={group.id}>
          <td>{currentForm && currentForm.form_contents ? currentForm.form_contents?.formTitle : 'Bcombs Form'}</td>
          <td>
            <Link to={"" + selectedVendor?.id2 + "/" + group.name}>
              {group.name}
            </Link>
          </td>
          <td>{count}</td>
          <td>{availableCount}</td>
          <td>{classCount}</td>
          <td>
            <Link to={"view/" + group.app_grp_id}>
              View
            </Link>
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
      <h2>Attendance</h2>
      <div id="attendance">
        <table id="groups">
          <tbody>
            <tr>
              {/* <th>Form</th> */}
              <th>Form</th>
              <th>Class</th>
              <th>Count</th>
              <th>Available</th>
              <th>Class Count</th>
              <th>Action</th>
            </tr>
            <tr>
              <td></td>
              <td>Total</td>
              <td>{getTotalCount()}</td>
              <td>{getTotalAvailable()}</td>
              <td>{getTotalClassCount()}</td>
              <td></td>
            </tr>
            {renderTableData()}
          </tbody>
        </table>
      </div>
    </AttendanceSummaryStyled>
  )
}