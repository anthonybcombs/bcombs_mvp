import React, { useState } from "react";
import styled from "styled-components";

import { CSVLink, CSVDownload } from "react-csv";
import { format } from "date-fns";

const ExportFilterModal = styled.div`

  .modal {
    padding: 0;
  }

  .modal-content {
    position: relative;
    top: 100px;
    width: auto;
    max-width: 500px;
    padding: 0;
  }

  .modal-header {
    padding: 1em;
    background-color: #f26e21;
    color: #fff;
  }

  .modal-container {
    background-color: #fff;
    padding: 20px 25px;
  }

  .modal-container p {
    margin-top: 0;
  }

  .close {
    position: absolute;
    top: 5px;
    right: 10px;
    color: #fff;
  }

  #filterExportButton {
    font-size: 1em;
    color: #fff;
    background-color: #f26e21;
    border-radius: 4px;
    padding: 10px 15px;
    border: 0;
    display: inline-block;
    margin: 0;
  }

  .form-control {
    display: block;
    width: 100%;
    height: auto;
    padding: 6px 12px;
    font-size: 16px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);
    box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);
    -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box;  
  }

  select {
    margin-bottom: 25px;
  }
`;

const ExportFilter = ({
  applications = [],
  handleExit,
  vendor
}) => {

  const CLASS_OPTIONS = ["Seniors", "Juniors", "Sophomores", "Freshmen", "Middle School"];

  const STUDENT_CLASS_OPTIONS = [
    { name: "In process", value: "new_applicant_in_process"},
    { name: "Accepted", value: "new_applicant_accepted" },
    { name: "Rejected", value: "new_applicant_rejected"},
    { name: "Current Student", value: "current_student" },
    { name: "Waiting List", value: "waiting_list"},
    { name: "No longer a Student", value: "no_longer_student"},
    { name: "Missed opportunity", value: "missed_opportunity"},
  ];

  const COLOR_OPTIONS = ["Blue", "Red", "Green"];

  const getVendorFilename = () => {

    console.log("VENDOR EXPORT", vendor);

    if(vendor && vendor.name) {
      return vendor.name + " Application List.csv";
    }

    return "";
  }

  const [statusText, setStatusText] = useState("");
  const [classText, setClassText] = useState("");
  const [colorText, setColorText] = useState("");

  const filterApplications = applications.filter((item) => {

    let class_match = true;
    let color_match = true;
    let status_match = true;

    console.log("CLass text", classText);

    if(classText) {
      if(item.class_teacher) {
        class_match = item.class_teacher == classText;
      } else {
        class_match = item.child.grade_desc == classText;
      }
    }

    if(colorText) {
      if(item.color_designation)
        color_match = item.color_designation.toLowerCase() == colorText.toLowerCase();
      else
        color_match = false;
    }
    
    if(statusText) {
      status_match = item.student_status.toLowerCase() == statusText.toLowerCase();
    }

    return class_match && color_match && status_match;
  });


  const getApplicationStatus = (student_status, verification) => {

    let studentStatusVal = "";
    let verificationVal = ""

    if(student_status == "new_applicant_in_process") {
      studentStatusVal = "In process";
    } else if (student_status == "new_applicant_accepted") {
      studentStatusVal = "Accepted";
    } else if (student_status == "new_applicant_rejected") {
      studentStatusVal = "Rejected";
    } else if (student_status == "current_student") {
      studentStatusVal = "Current Student";
    } else if (student_status == "waiting_list") {
      studentStatusVal = "Waiting List";
    } else if (student_status == "no_longer_student") {
      studentStatusVal = "No longer a Student";
    } else if (student_status == "missed_oppurtunity") {
      studentStatusVal = "Missed oppurtunity";
    }

    return studentStatusVal;
  }

  const getPrimaryParentName = (parents) => {
    if(parents.length > 0) {
      return parents[0]?.firstname + " " + parents[0]?.lastname;
    }

    return ""
  }

  const DATE_FORMAT = "LLL dd, yyyy";

  const getAgeBdate = (child) => {
    if(!child.age && child <= -1) return "";

    let birthdate = format(new Date(child.birthdate), DATE_FORMAT);

    return child.age + " (" + birthdate + ")";
  }
  
  let exportApplications = [];

  for(const application of filterApplications) {
    const tempApplication = {
      "Status": getApplicationStatus(application.student_status),
      "Student Name": application.child?.firstname + " " + application.child?.lastname,
      "Parent Name": getPrimaryParentName(application.parents),
      "Class": application?.child?.grade_desc,
      "Age": getAgeBdate(application.child),
      "Application Date": format(new Date(application.application_date), DATE_FORMAT)
    }

    exportApplications.push(tempApplication);
  }

  console.log("filterApplications", filterApplications);
  console.log("exportApplications", exportApplications);

  return (
    <ExportFilterModal>
      <div className="modal">
        <div className="modal-content">
          <span onClick={handleExit} className="close">×</span>
          <div className="modal-header">
            Export Applications
          </div>
          <div className="modal-container">
            <p>Filter:</p>
            <div>
              <select 
                className="form-control"
                value={classText}
                onChange={e => {
                  console.log(e.target.value);
                  setClassText(e.target.value);
                }}>
                <option value="">All Class</option>
                {
                  CLASS_OPTIONS.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))
                }
              </select>
              <select 
                className="form-control"
                value={statusText}
                onChange={e => {
                  setStatusText(e.target.value);
                }}>
                <option value="">All Status</option>
                {
                  STUDENT_CLASS_OPTIONS.map((opt, i) => (
                    <option key={i} value={opt.value}>{opt.name}</option>
                  ))
                }
              </select>
              <select 
                className="form-control"
                value={colorText}
                onChange={e => { 
                  setColorText(e.target.value);
                }}>
                <option value="">All Color</option>
                {
                  COLOR_OPTIONS.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))
                }
              </select>
            </div>
            <CSVLink 
              id="filterExportButton" 
              data={exportApplications}
              filename={getVendorFilename()}>
              <span>Export</span>
            </CSVLink>
          </div>
        </div>
      </div>
    </ExportFilterModal>
  );
}

export default ExportFilter;