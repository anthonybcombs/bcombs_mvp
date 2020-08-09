import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "@reach/router";
import { format } from "date-fns";

import DataTable from "react-data-table-component";

import { requestVendor } from "../../../../redux/actions/Vendors";
import { requestGetApplications } from "../../../../redux/actions/Application";
import { requestUserGroup } from "../../../../redux/actions/Groups";

import ProfileImg from "../../../../images/defaultprofile.png";

const ClassListViewStyled = styled.div`
  padding: 1em;

  #dataTableContainer {
    box-shadow: 0px 0px 10px #ccc;
    padding: 1em;
    background-color: #fff;
    position: relative;
  }

  #dataTableContainer a {
    color: #3e89fe;
    text-decoration: none;
  }

  #dataTableContainer .img-container {
    margin-right: 10px;
  }

  #dataTableContainer img {
    width: 55px;
    height: 55px;
  }
`;

export default function index() {

  const { name, vendor_id } = useParams();

  const { auth, vendors, groups, applications, loading } = useSelector(
    ({ auth, vendors, applications, groups, loading }) => {
      return { auth, vendors, applications, groups, loading };
    }
  );

  const dispatch = useDispatch();

  let filterApplications = [];

  useEffect(() => {
    if(auth.user_id) {
      dispatch(requestVendor(auth.user_id));
      dispatch(requestUserGroup(auth.email));
    }
  }, []);

  useEffect(() => {
    console.log("vendor", vendors);
    if (vendors && vendors.length > 0) {
      let vendorId;
      for(const vendor of vendors) {
        if(vendor.id2 == vendor_id) {
          vendorId = vendor.id
          break;
        }
      }
      dispatch(requestGetApplications(vendorId));
    }
  }, [vendors]);

  if(applications && applications.activeapplications.length > 0) {

    let appGroupId = "";

    if(groups && groups.application_groups && groups.application_groups.length > 0) {
      const applicationGroups = groups.application_groups;

      for(const group of applicationGroups) {
        if(group.name === name) {
          appGroupId = group.app_grp_id;
          break;
        }
      }
    }

    console.log("appGroupId", appGroupId);

    filterApplications = applications.activeapplications.filter((application) => {
      return application && application.class_teacher == appGroupId;
    });

    filterApplications = filterApplications.map((item) => {
      item.class_teacher = name;
      console.log("application", item);

      return item;
    });

    console.log("filterApplications", filterApplications);
  }


  console.log("groups", groups);

  const getPrimaryParentName = (parents, id) => {

    if(parents.length > 0) {
      return (<><span className="img-container"><img src={ProfileImg}/></span><a target="_blank" href={"/dashboard/parentprofile/" + id}><span>{parents[0]?.firstname + " " + parents[0]?.lastname}</span></a></>)
    } else {
      return "";
    }
  }

  const columns = [
    {
      name: 'Child',
      selector: 'studentName',
      sortable: false,
      cell: row => (<><span className="img-container"><img src={ProfileImg}/></span><a target="_blank" href={"/dashboard/menteeprofile/" + row.id}><span>{row.child?.firstname + " " + row.child?.lastname}</span></a></>)
    },
    {
      name: 'Sibling(s)',
      selector: 'parentName',
      sortable: false,
      cell: ""
    },
    {
      name: 'Parent(s)',
      selector: 'class',
      sortable: false,
      cell: row => getPrimaryParentName(row.parents, row.id)
    },
    {
      name: 'Class',
      selector: 'birthDate',
      sortable: false,
      cell: row => row?.child?.grade_desc
    },
    {
      name: 'Group(s)',
      selector: 'type',
      sortable: false,
      cell: row => row.class_teacher
    },
    {
      name: 'Days Requested',
      selector: 'daysRequested',
      sortable: false
    },
    {
      name: 'Emergency',
      selector: 'dateNeeded',
      sortable: false,
      cell: ''
    }
  ];
  const noHeader = true;
  const striped = true;

  const customStyles = {
    subHeader: {
      style: {
        justifyContent: 'flex-start',
        paddingLeft: '0',
        marginBottom: '20px'
      }
    },
    headRow: {
      style: {
        background: '#f26e21',
        minHeight: '39px',
        borderColor: '#fff'
      }
    },
    headCells: {
      style: {
        fontSize: '16px',
        color: '#fff'
      }
    },
    cells: {
      style: {
        fontSize: '16px'
      }
    },
    rows: {
      style: {
        '&:not(:last-of-type)': {
          borderColor: "#eaedf1"
        },
        minHeight: "35px",
        padding: "10px 0"
      }
    }
  }

  return (
    <ClassListViewStyled>
      <div id="dataTableContainer">
        <DataTable 
          columns={columns}
          data={filterApplications}
          pagination
          noHeader={noHeader}
          striped={striped}
          customStyles={customStyles}
          selectableRows
        />
      </div>
    </ClassListViewStyled>
  )
}