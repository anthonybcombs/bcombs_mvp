import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArchive,
  faCheck,
  faTimes,
  faDownload
} from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import { format } from "date-fns";
import { CSVLink, CSVDownload } from "react-csv";
import Loading from "../../../../helpers/Loading.js";

import ConfirmedModal from "../../../../helpers/ConfirmedModal";
import ExportFilter from "../../../../helpers/ExportFilter";

import { requestArchivedAppplication } from "../../../../redux/actions/Application";

import "../../ApplicationForm/ApplicationForm.css";

const ApplicationListStyled = styled.div`
  margin-bottom: 20px;

  #dataTableContainer > div header {
    padding: 0;
    display: block;
    min-height: auto;
  }

  #dataTableContainer .gVljTM {
    position: absolute;
    top: 42px;
    left: 120px;
    font-size: 16px;
  }

  #dataTableContainer .ncoBp {
    position: absolute;
    top: 42px;
    left: 0;
    font-size: 16px;
  }

  #dataTableContainer .gVljTM svg {
    right: -5px;
  }

  #dataTableContainer .ggvSbr {
    min-height: 70px;
    margin-bottom: 20px;
  }

  #tableHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin: 30px 0;
    padding: 0 1.5rem;
  }

  #archivedBtnContainer {
    display: flex;
    align-items: center;
  }

  #archivedButton,
  #exportButton {
    // margin-left: 30px;
    font-size: 1em;
    color: #fff;
    background-color: #f26e21;
    border-radius: 4px;
    padding: 10px 15px;
    border: 0;
  }

  #exportButton {
    display: flex;
    margin-left: 20px;
  }

  #exportButton span {
    margin-left: 5px;
  }

  #legendContainer {
    display: flex;
    align-items: center;
  }

  #legendContainer ul {
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  #legendContainer ul li {
    list-style-type: none;
    display: flex;
    margin-right: 20px;
    padding: 1.5px;
  }
  #legendContainer span:not(.label) {
    height: 0;
    padding: 10px;
    margin-right: 8px;
  }

  #legendContainer .red {
    background: red;
  }

  #legendContainer .steelBlue {
    background: SteelBlue;
  }

  #legendContainer .green {
    background: green;
  }

  #actionButtonContainer {
    position: relative;

    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  #actionButtonContainer a {
    background-color: #f26e21;
    padding: 10px 32px;
    width: 100%;
    display: block;
    color: white;
    border-radius: 40px;
    max-width: 200px;
    margin: 0 10px;
    text-decoration: none;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: pre;
  }

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

  .loading-container .hCOWuT {
    height: auto;
  }

  .loading-container .hCOWuT div:first-child {
    margin: 1vh auto;
  }

  @media (max-width: 1024px) {
    #tableHeader {
      flex-direction: column;
    }
    #legendContainer,
    #archivedBtnContainer,
    #actionButtonContainer {
      padding: 0.5rem 0;
    }
  }
  @media (max-width: 768px) {
    #legendContainer ul {
      justify-content: center;
    }
  }
  @media (max-width: 480px) {
    #actionButtonContainer {
      flex-wrap: wrap;
      justify-content: center;
    }
    #actionButtonContainer a {
      margin: 4px 0;
    }
  }
`;

const TextField = styled.input`
  box-sizing: border-box;
  height: 32px;
  width: 200px;
  border-radius: 3px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border: 1px solid #e5e5e5;
  padding: 0 32px 0 16px;
  font-size: 16px;
  m &:hover {
    cursor: pointer;
  }
`;

const ClearButton = styled.button`
  background-color: #f26e21;
  color: white;
  font-size: 16px;
  border-width: initial;
  border-style: none;
  border-color: initial;
  border-image: initial;
  padding: 8px 32px;
  text-decoration: none;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 34px;
  width: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SelectWrapper = styled.div`
  display: flex;
  flex: 1 1 100%;
  justify-content: flex-start;

  input {
    margin-right: auto;
    width: 100%;
    max-width: 280px;
    min-width: 200px;
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
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    -webkit-transition: border-color ease-in-out 0.15s,
      -webkit-box-shadow ease-in-out 0.15s;
    -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
    transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box; /* Firefox, other Gecko */
    box-sizing: border-box;
  }

  select.form-control {
    height: 32px;
    width: auto;
    margin-left: 1rem;
  }
`;

const CLASS_OPTIONS = [
  "Seniors",
  "Juniors",
  "Sophomores",
  "Freshmen",
  "Middle School"
];

const STUDENT_CLASS_OPTIONS = [
  { name: "In process", value: "new_applicant_in_process" },
  { name: "Accepted", value: "new_applicant_accepted" },
  { name: "Rejected", value: "new_applicant_rejected" },
  { name: "Current Student", value: "current_student" },
  { name: "Waiting List", value: "waiting_list" },
  { name: "No longer a Student", value: "no_longer_student" },
  { name: "Missed opportunity", value: "missed_opportunity" },
  { name: "Pending Resubmission", value: "pending_resubmission"}
];

const COLOR_OPTIONS = ["Blue", "Red", "Green"];

const FilterComponent = ({
  onFilter,
  onClassChange,
  onGroupChange,
  onColorChange,
  onStatusChange,
  onClear,
  filterText,
  gradeText,
  colorText,
  statusText,
  groupText,
  appGroups = []
}) => (
  <>
    <SelectWrapper>
      <TextField
        id="search"
        type="text"
        placeholder="Search Name"
        value={filterText}
        onChange={onFilter}
      />
      <select
        name="class"
        className="form-control"
        value={statusText}
        onChange={onStatusChange}>
        <option value="">Select Status</option>
        {STUDENT_CLASS_OPTIONS.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.name}
          </option>
        ))}
      </select>
      <select
        name="class"
        className="form-control"
        value={groupText}
        onChange={onGroupChange}>
        <option value="">Select Group</option>
        {appGroups.map((opt, i) => (
          <option key={i} value={opt.app_grp_id}>
            {opt.name}
          </option>
        ))}
      </select>
      <select
        name="class"
        className="form-control"
        value={gradeText}
        onChange={onClassChange}>
        <option value="">Select Grade</option>
        {CLASS_OPTIONS.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <select
        name="class"
        className="form-control"
        value={colorText}
        onChange={onColorChange}>
        <option value="">Select Color</option>
        {COLOR_OPTIONS.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {/* <ClearButton type="button" onClick={onClear}>X</ClearButton> */}
    </SelectWrapper>
  </>
);

export default function index({
  applications,
  handleSelectedApplication,
  listApplicationLoading = false,
  vendor = {},
  appGroups = [],
  isCustomForm = false,
  filename = ""
}) {

  console.log("appGroups select", appGroups);
  const getApplicationStatusVal = (student_status, verification, row) => {
    let studentStatusVal = "";
    let verificationVal = "";

    if (student_status == "new_applicant_in_process") {
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
    } else if (student_status == "pending_resubmission") {
      studentStatusVal = "Pending Resubmission";
    } else {
      studentStatusVal = "In process";
    }

    if (verification == "verified") {
      verificationVal = faCheck;
    } else if (verification == "rejected") {
      verificationVal = faTimes;
    } else {
      verificationVal = "";
    }

    return (
      <a
        href=""
        onClick={e => {
          e.preventDefault();

          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });

          handleSelectedApplication(row, "application");
        }}>
        <span>{studentStatusVal}</span>&nbsp;
        {verificationVal && <FontAwesomeIcon icon={verificationVal} />}
      </a>
    );
  };

  const getPrimaryParentName = (parents, id) => {
    if (parents && parents.length > 0) {
      return (
        <a href={"parentprofile/" + id}>
          <span>{parents[0]?.firstname + " " + parents[0]?.lastname}</span>
        </a>
      );
    } else {
      return "";
    }
  };

  const DATE_FORMAT = "LLL dd, yyyy";

  const getAgeBdate = child => {
    if (!child || (!child.age && child <= -1)) return "";

    let birthdate = format(new Date(child.birthdate), DATE_FORMAT);
    return (
      <div>
        {child.age}&nbsp; ({birthdate})
      </div>
    );
  };

  const getStudentName = row => {
    if(row?.child?.firstname && row?.child?.lastname) {
      return (
        <a href={"menteeprofile/" + row.id}>
          <span>{row?.child.firstname + " " + row?.child.lastname}</span>
        </a>
      )
    } else {
      return "";
    }
  }

  const columns = [
    {
      name: "Status",
      selector: "status",
      sortable: true,
      cell: row =>
        getApplicationStatusVal(row.student_status, row.verification, row)
    },
    {
      name: "Student Name",
      selector: "studentName",
      sortable: true,
      cell: row => getStudentName(row)
    },
    {
      name: "Parent name",
      selector: "parentName",
      sortable: true,
      cell: row => getPrimaryParentName(row.parents, row.id)
    },
    {
      name: "Group(s)",
      selector: "classGroup",
      sortable: true,
      cell: row => {
        if (row.class_teacher && appGroups && appGroups.length) {

          let displayGroups = '';
          appGroups.map((e) => {
            if(row.class_teacher.includes(e.app_grp_id))
            displayGroups += e.name + ','
          })
          // return (
          //   (appGroups.find(e => row.class_teacher.includes(e.app_grp_id)) || {})
          //     .name || "-"
          // );
          displayGroups = displayGroups.slice(0, -1);
          const arrGroups = displayGroups.split(',');
          console.log('arrGroups', arrGroups);

          if(arrGroups.length > 1) {
            return displayGroups = arrGroups[0] + ',...'
          } else {
            return displayGroups = arrGroups[0];
          }
        }
        return "-";
      }
    },
    {
      name: "Grade",
      selector: "class",
      sortable: true,
      cell: row => row.is_daycare ? "-" : row?.child?.grade_desc
    },
    {
      name: "Age (Bdate)",
      selector: "birthDate",
      sortable: true,
      cell: row => getAgeBdate(row.child)
    },
    {
      name: "Application Date",
      selector: "applicationDate",
      sortable: true,
      cell: row => format(new Date(row.application_date), DATE_FORMAT)
    }
    // {
    //   name: "Attachment 1",
    //   selector: "attachment1",
    //   sortable: false,
    //   cell: row => (
    //     <a href="#">
    //       <span>-</span>
    //     </a>
    //   )
    // },
    // {
    //   name: "Attachment 2",
    //   selector: "attachment2",
    //   sortable: false,
    //   cell: row => (
    //     <a href="#">
    //       <span>-</span>
    //     </a>
    //   )
    // }
  ];

  const customStyles = {
    header: {
      style: {
        minHeight: "70px"
      }
    },
    subHeader: {
      style: {
        marginBottom: "12px"
      }
    },
    headRow: {
      style: {
        background: "#f26e21",
        minHeight: "39px",
        borderColor: "#fff"
      }
    },
    headCells: {
      style: {
        fontSize: "16px",
        color: "#fff"
      }
    },
    cells: {
      style: {
        fontSize: "16px",
        padding: "10px"
      }
    },
    rows: {
      style: {
        "&:not(:last-of-type)": {
          borderColor: "#eaedf1"
        },
        minHeight: "35px"
      }
    }
  };

  const conditionalRowStyles = [
    {
      when: row => row.color_designation === "blue",
      style: {
        backgroundColor: "SteelBlue !important",
        color: "#fff !important",
        borderBottom: "1px solid #fff !important",
        a: {
          color: "inherit !important"
        }
      }
    },
    {
      when: row => row.color_designation === "red",
      style: {
        backgroundColor: "red !important",
        color: "#fff !important",
        borderBottom: "1px solid #fff !important",
        a: {
          color: "inherit !important"
        }
      }
    },
    {
      when: row => row.color_designation === "green",
      style: {
        backgroundColor: "green !important",
        color: "#fff !important",
        borderBottom: "1px solid #fff !important",
        a: {
          color: "inherit !important"
        }
      }
    }
  ];

  const [filterText, setFilterText] = useState("");
  const [gradeText, setGradeText] = useState("");
  const [statusText, setStatusText] = useState("");
  const [colorText, setColorText] = useState("");
  const [groupText, setGroupText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const dispatch = useDispatch();

  let data = applications.length > 0 ? applications : [];

  let getApplications = applications.length > 0 ? applications : [];

  const exportData = applications.length > 0 ? applications : [];

  data = getApplications.filter(item => {
    let name_match = true;
    let class_match = true;
    let color_match = true;
    let status_match = true;
    let group_match = true;

    if (filterText) {

      const childFirstname = !!item.child?.firstname ? item.child.firstname.trim() : "";
      const childLastname = !!item.child?.lastname ? item.child.lastname.trim() : "";
      const childFullname = childFirstname + " " + childLastname;

      const parentFirstname = !!item.parents[0]?.firstname ? item.parents[0]?.firstname.trim() : ""; 
      const parentLastname = !!item.parents[0]?.lastname ? item.parents[0]?.lastname.trim() : "";
      const parentFullname = parentFirstname + " " + parentLastname;

      // name_match =
      //   (item.child?.firstname &&
      //     item.child?.firstname
      //       .toLowerCase()
      //       .includes(filterText.toLowerCase())) ||
      //   (item.child?.lastname &&
      //     item.child?.lastname
      //       .toLowerCase()
      //       .includes(filterText.toLowerCase())) ||
      //   (item.parents && item.parents[0]?.firstname &&
      //     item?.parents[0]?.firstname
      //       .toLowerCase()
      //       .includes(filterText.toLowerCase())) ||
      //   (item.parents && item.parents[0]?.lastname &&
      //     item?.parents[0]?.lastname
      //       .toLowerCase()
      //       .includes(filterText.toLowerCase()));

      console.log('childFullname', childFullname);
      console.log('parentFullname', parentFullname);

      name_match = (childFullname.toLowerCase().includes(filterText.toLowerCase())) ||
        (parentFullname.toLowerCase().includes(filterText.toLowerCase()))
    }

    if (gradeText) {
      class_match = item?.child?.grade_desc == gradeText;
    }

    if (colorText) {
      if (item.color_designation)
        color_match =
          item.color_designation.toLowerCase() == colorText.toLowerCase();
      else color_match = false;
    }

    if (statusText) {
      status_match =
        item.student_status.toLowerCase() == statusText.toLowerCase();
    }

    if (groupText) {
      group_match = 
        item.class_teacher == groupText;
    }

    return name_match && class_match && color_match && status_match && group_match;
  });

  console.log("data", data);

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setFilterText("");
      }
    };

    return (
      <FilterComponent
        onClassChange={e => setGradeText(e.target.value)}
        onFilter={e => setFilterText(e.target.value)}
        onColorChange={e => setColorText(e.target.value)}
        onGroupChange={e => setGroupText(e.target.value)}
        onStatusChange={e => {
          setStatusText(e.target.value);
        }}
        onClear={handleClear}
        filterText={filterText}
        gradeText={gradeText}
        colorText={colorText}
        statusText={statusText}
        groupText={groupText}
        appGroups={appGroups}
      />
    );
  }, [filterText, resetPaginationToggle, gradeText, colorText, statusText, groupText, appGroups]);

  const noHeader = true;
  const striped = true;

  const paginationRowsPerPageOptions = [10, 25, 50, 100];
  const paginationComponentOptions = {
    rowsPerPageText: "Rows per page:",
    rangeSeparatorText: "of",
    noRowsPerPage: false,
    selectAllRowsItem: true,
    selectAllRowsItemText: "All"
  };

  const [selectedRows, setSelectedRows] = useState([]);
  const [showConfirmed, setShowConfiremd] = useState(false);
  const [showExportFilter, setShowExportFilter] = useState(false);

  const handleSelectedRowsChange = state => {
    setSelectedRows(state.selectedRows);
  };

  const doArchivedApplication = () => {
    const app_ids = selectedRows.map(a => a.app_id);
    console.log("APP IDS", app_ids);

    dispatch(requestArchivedAppplication(app_ids));
  };

  const handleOkClick = () => {
    doArchivedApplication();
    setShowConfiremd(false);
  };

  const handleCancelClick = () => {
    setShowConfiremd(false);
  };

  const handleArchivedApplication = () => {
    setShowConfiremd(true);
  };

  const handleExportCSV = e => {
    setShowExportFilter(true);
  };

  const handleExit = () => {
    setShowExportFilter(false);
  };

  return (
    <ApplicationListStyled>
      <div id="applicationList">
        <div id="listHeader"></div>
        <div id="tableSection">
          <div id="tableHeader">
            <div id="archivedBtnContainer">
              <button id="archivedButton" onClick={handleArchivedApplication}>
                <FontAwesomeIcon icon={faArchive} />
              </button>
              <button id="exportButton" onClick={handleExportCSV}>
                <FontAwesomeIcon icon={faDownload} />
                <span>Export</span>
              </button>
              {/* <CSVLink 
                id="exportButton" 
                data={exportData}
                filename={getVendorFilename()}>
                <FontAwesomeIcon icon={faDownload} />
                <span>Export</span>
              </CSVLink> */}
            </div>
            <div id="legendContainer">
              <ul>
                <li>
                  <span className="red"></span>
                  <span className="label">Leaving the room</span>
                </li>
                <li>
                  <span className="steelBlue"></span>
                  <span className="label">Coming into the room</span>
                </li>
                <li>
                  <span className="green"></span>
                  <span className="label">Potentials for leaving room</span>
                </li>
              </ul>
            </div>
            <div id="actionButtonContainer">
              <a href="/dashboard/archived">
                Archived Applications
              </a>
              <a
                href=""
                onClick={e => {
                  e.preventDefault();
                  window.location.reload(false);
                }}>
                All Applications
              </a>
            </div>
          </div>
          <div id="dataTableContainer">
            {listApplicationLoading ? (
              <div className="loading-container">
                <Loading />
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={data}
                pagination
                selectableRows
                noHeader={noHeader}
                striped={striped}
                customStyles={customStyles}
                conditionalRowStyles={conditionalRowStyles}
                subHeader
                subHeaderComponent={subHeaderComponentMemo}
                paginationRowsPerPageOptions={paginationRowsPerPageOptions}
                paginationComponentOptions={paginationComponentOptions}
                onSelectedRowsChange={handleSelectedRowsChange}
              />
            )}
          </div>
        </div>
      </div>
      {showConfirmed && (
        <ConfirmedModal
          handleOkClick={handleOkClick}
          handleCancelClick={handleCancelClick}
          message={"Archived the applications?"}
        />
      )}
      {showExportFilter && (
        <ExportFilter
          applications={exportData}
          handleExit={handleExit}
          vendor={vendor}
          appGroups={appGroups}
          app_programs={
            vendor && vendor.app_programs && vendor.app_programs.length > 0
              ? vendor.app_programs
              : []
          }
          location_sites={
            vendor && vendor.location_sites && vendor.location_sites.length > 0
              ? vendor.location_sites
              : []
          }
          isCustomForm={isCustomForm}
          filename={filename}
        />
      )}
    </ApplicationListStyled>
  );
}
