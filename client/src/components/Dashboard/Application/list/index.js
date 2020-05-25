import React, { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArchive,
  faCheck,
  faTimes } from "@fortawesome/free-solid-svg-icons";
import DataTable from 'react-data-table-component';
import { uuid } from "uuidv4";
import { format } from "date-fns";

import "../../ApplicationForm/ApplicationForm.css";

const ApplicationListStyled = styled.div`
  
  margin-bottom: 20px;

  #dataTableContainer .gVljTM {
    position: absolute;
    top: 22px;
    left: 120px;
    font-size: 16px
  }

  #dataTableContainer .ncoBp {
    position: absolute;
    top: 22px;
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
    display: grid;
    margin: 30px 0;
  }

  #archivedBtnContainer {
    display: flex;
    align-items: center;
  }

  #archivedButton {
    margin-left: 30px;
    font-size: 1em;
    color: #fff;
    background-color: #f26e21;
    border-radius: 4px;
    padding: 6px 10px;
  }

  #legendContainer {
    display: flex;
    align-items: center;
  }

  #legendContainer ul {
    margin: auto;
  }

  #legendContainer ul li {
    list-style-type: none;
    display: inline;
    margin-right: 20px;
  }

  #legendContainer span {
    padding: 0px 8px;
    margin-right: 5px;
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
  }

  #actionButtonContainer > div {
    display: flex;
    justify-content: flex-end;
    margin-right: 30px;
  }

  #actionButtonContainer a{
    background-color: #f26e21;
    padding: 10px;
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

  @media (min-width: 600px) {
    #tableHeader {
      grid-template-columns: 10% 60% 30%;
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
  m
  &:hover {
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

  display: grid;
  grid-template-columns: 20% 20% 20% 20%;
  grid-gap: 5%;
  min-width: 85%;

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

  select.form-control {
    height: 32px;
    width: auto;
  }
`;

const CLASS_OPTIONS = ["Seniors", "Juniors", "Sophomores", "Freshmen", "Middle School"];

const STATUS_OPTIONS = ["In process", "Current Student", "Waiting List", "Accepted", "Rejected", "No longer a Student"];

const COLOR_OPTIONS = ["Blue", "Red", "Green"];

const FilterComponent = ({ filterText, onFilter, onClassChange, onClear, classText }) => (
  <>
    <SelectWrapper>
    <TextField id="search" type="text" placeholder="Search Name" value={filterText} onChange={onFilter} />
      <select 
        name="class"
        className="form-control"
        value={classText}
        onChange={onClassChange}>
        <option value="">Select Status</option>
        {
          STATUS_OPTIONS.map((opt, i) => (
            <option key={i} val={opt}>{opt}</option>
          ))
        }
      </select>
      <select 
        name="class"
        className="form-control"
        value={classText}
        onChange={onClassChange}>
        <option value="">Select Class</option>
        {
          CLASS_OPTIONS.map((opt, i) => (
            <option key={i} val={opt}>{opt}</option>
          ))
        }
      </select>
      <select 
        name="class"
        className="form-control"
        value={classText}
        onChange={onClassChange}>
        <option value="">Select Color</option>
        {
          COLOR_OPTIONS.map((opt, i) => (
            <option key={i} val={opt}>{opt}</option>
          ))
        }
      </select>
      {/* <ClearButton type="button" onClick={onClear}>X</ClearButton> */}
    </SelectWrapper>

  </>
);

export default function index({
  applications,
  handleSelectedApplication
}) {

  const getApplicationStatusVal = (student_status, verification, row) => {

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

    if(verification == "verified") {
      verificationVal = faCheck;
    } else if (verification == "rejected") {
      verificationVal = faTimes;
    } else {
      verificationVal = "";
    }

    return <a href="" 
      onClick={(e) => {
        e.preventDefault();

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

        handleSelectedApplication(row, "application")
      }}><span>{studentStatusVal}</span>&nbsp;
      { verificationVal && <FontAwesomeIcon icon={verificationVal} />}
    </a>
    
  }

  const getPrimaryParentName = (parents) => {

    if(parents.length > 0) {
      return <a href="" onClick={(e) => {e.preventDefault();}}><span>{parents[0]?.firstname + " " + parents[0]?.lastname}</span></a>
    } else {
      return "";
    }
  }

  const DATE_FORMAT = "LLL dd, yyyy";

  const getAgeBdate = (child) => {
    if(!child.age && child <= -1) return "";

    let birthdate = format(new Date(child.birthdate), DATE_FORMAT);
    return <div>
      {child.age}&nbsp; ({birthdate})
    </div>
  }

  const columns = [
    {
      name: 'Status',
      selector: 'status',
      sortable: true,
      cell: row => getApplicationStatusVal(row.student_status, row.verification, row),
      
    },
    {
      name: 'Student Name',
      selector: 'studentName',
      sortable: true,
      cell: row => <a onClick={(e) => {e.preventDefault();}} href="#"><span>{row.child?.firstname + " " + row.child?.lastname}</span></a>,
    },
    {
      name: 'Parent name',
      selector: 'parentName',
      sortable: true,
      cell: row => getPrimaryParentName(row.parents)
    },
    {
      name: 'Class',
      selector: 'class',
      sortable: true,
      cell: row => row?.child?.grade_desc
    },
    {
      name: 'Age (Bdate)',
      selector: 'birthDate',
      sortable: true,
      cell: row => getAgeBdate(row.child)
    },
    {
      name: 'Application Date',
      selector: 'applicationDate',
      sortable: true,
      cell: row => format(new Date(row.application_date), DATE_FORMAT)
    },
    {
      name: 'Attachment 1',
      selector: 'attachment1',
      sortable: false,
      cell: row => <a href="#"><span>-</span></a>,
    },
    {
      name: 'Attachment 2',
      selector: 'attachment2',
      sortable: false,
      cell: row => <a href="#"><span>-</span></a>,
    }
  ];

  const customStyles = {
    header: {
      style: {
        minHeight: '70px'
      }
    },
    subHeader: {
      style: {
        marginBottom: '12px',
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
        fontSize: '16px',
        padding: '10px'
      }
    },
    rows: {
      style: {
        '&:not(:last-of-type)': {
          borderColor: "#eaedf1"
        },
        minHeight: "35px"
      }
    }
  }

  const conditionalRowStyles = [
    {
      when: row => row.status === "currentPassed",
      style: {
        backgroundColor: 'SteelBlue !important',
        color: '#fff !important',
        borderBottom: '1px solid #fff !important',
        a: {
          color: 'inherit !important'
        }
      }
    },
    {
      when: row => row.status === "currentFailed",
      style: {
        backgroundColor: 'red !important',
        color: '#fff !important',
        borderBottom: '1px solid #fff !important',
        a: {
          color: 'inherit !important'
        }
      }
    }
  ]

  const [filterText, setFilterText] = useState('');
  const [classText, setClassText] = useState('');
  
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  let data = applications.length > 0 ? applications : [];

  let getApplications = applications.length > 0 ? applications : [];

  data = getApplications.filter((item) => {

      let name_accepted = true;
      let class_accepted = true;

      if(filterText) {
        name_accepted = item.child.firstname && item.child.firstname.toLowerCase().includes(filterText.toLowerCase()) ||
          item.child.lastname && item.child.lastname.toLowerCase().includes(filterText.toLowerCase()) ||
          item.parents[0].firstname && item.parents[0].firstname.toLowerCase().includes(filterText.toLowerCase()) ||
          item.parents[0].lastname && item.parents[0].lastname.toLowerCase().includes(filterText.toLowerCase())
      }

      if(classText) {
        class_accepted = item.child.grade_desc == classText
      }

      return name_accepted && class_accepted;
    });

  console.log("data", data);

  const subHeaderComponentMemo = React.useMemo(() => {

    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };
    
    return <FilterComponent onClassChange={e => setClassText(e.target.value)} classText={classText} onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />;
  }, [filterText, resetPaginationToggle, classText]);

  const noHeader = true;
  const striped = true;

  const paginationRowsPerPageOptions = [10, 25, 50, 100]
  const paginationComponentOptions = {
    rowsPerPageText: 'Rows per page:', 
    rangeSeparatorText: 'of', 
    noRowsPerPage: false,
    selectAllRowsItem: true, 
    selectAllRowsItemText: 'All'
  }

  return (
    <ApplicationListStyled>
      <div id="applicationList">
        <div id="listHeader">

        </div>
        <div id="tableSection">
          <div id="tableHeader">
            <div id="archivedBtnContainer">
              <button id="archivedButton">
                <FontAwesomeIcon icon={faArchive} />
              </button>
            </div>
            <div id="legendContainer">
              <ul>
                <li>
                  <span className='red'></span> Leaving the room
                </li>
                <li>
                  <span className='steelBlue'></span> Coming into the room
                </li>
                <li>
                  <span className='green'></span> Potentials for leaving room
                </li>
              </ul>
            </div>
            <div id="actionButtonContainer">
              <div>
                <a href="/dashboard/archived" target="_blank">Archived Applications</a>
                <a href="#">All Applications</a>
              </div>
            </div>
          </div>
          <div id="dataTableContainer">
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
            />
          </div>
        </div>
      </div>
    </ApplicationListStyled>
  )
}