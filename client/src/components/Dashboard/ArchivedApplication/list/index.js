
import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUndo
} from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";
import "../../ApplicationForm/ApplicationForm.css"

const ArchivedApplicationListStyled = styled.div`
  #dataTableContainer {
    box-shadow: 0px 0px 10px #ccc;
    padding: 1em;
    background-color: #fff;
    position: relative;
  }

  #dataTableContainer .gVljTM {
    position: absolute;
    top: 15px;
    right: 50px;
  }

  #dataTableContainer .react-datepicker__input-container input {
    font-size: 16px;
    padding: 0 5px;
  }

  #dataTableContainer .ncoBp {
    position: absolute;
    top: 20px;
    right: 100px;
  }

  #dataTableContainer .unarchived {
    color: #3e89fe;
    border: 0;
    background-color: transparent;
  }

  @media (min-width: 600px) {
    #tableHeader {
      grid-template-columns: 10% 60% 30%;
    }
  }

  .currentDay {
    background-color: #f26e21;
  }

  .filter-container {
    width: 100%;
    margin-top: 20px;
    display: grid;
    grid-template-columns: 35% 20% 20%;
    grid-gap: 2%;
    min-width: 85%;
  }

  .filter-container .go-btn {
    display: inline-block;
  }

  .filter-container > div {
    width: 100%;
    display: flex;
    align-items: center;
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

  select.form-control {
    height: 32px;
  }

  .date-range {
    display: block !important;
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

const CLASS_OPTIONS = ["Seniors", "Juniors", "Sophomores", "Freshmen", "Middle School"];
const COLOR_OPTIONS = ["Blue", "Red", "Green"];

const SearchDateComponent = ({
  handleOnChange, 
  startDate, 
  endDate, 
  classText,
  colorText,
  onColorChange,
  onClassChange
}) => (
  <>
    <div className="filter-container">
      <div className="date-range">
        <span className="date-label">Date :</span>
        <DatePicker
          placeholderText="mm/dd/yyyy"
          selected={new Date(startDate)}
          onChange={(date) => {
            handleOnChange("start_date", date);
          }}
        />
        <span className="to-label">To</span>
        <DatePicker
          placeholderText="mm/dd/yyyy"
          selected={new Date(endDate)}
          onChange={(date) => {
            handleOnChange("end_date", date);
          }}
        />
        <button className="go-btn">Go</button>
      </div>
      <div>
        <select 
          name="class"
          className="form-control"
          defaultValue={classText}
          onChange={onClassChange}>
          <option value="">Select Class</option>
          {
            CLASS_OPTIONS.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))
          }
        </select>
      </div>
      <div>
        <select 
          name="class"
          className="form-control"
          defaultValue={colorText}
          onChange={onColorChange}>
          <option value="">Select Color</option>
          {
            COLOR_OPTIONS.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))
          }
        </select>
      </div>
    </div>

  </>
);

export default function index({
  archivedapplications,
  handleUnarchived
}) {
  const getPrimaryParentName = (parents) => {
    if(parents.length > 0) {
      return <a href="" onClick={(e) => {e.preventDefault();}}><span>{parents[0]?.firstname + " " + parents[0]?.lastname}</span></a>
    } else {
      return "";
    }
  }

  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment().add(1, 'd'));

  const handleOnChange = (date_type, date) => {
    if(date_type == "start_date")
      setStartDate(date)
    else
      setEndDate(date)
  }

  const DATE_FORMAT = "LLL dd, yyyy";

  const getAgeBdate = (child) => {
    if(!child.age && child <= -1) return "";

    let birthdate = format(new Date(child.birthdate), DATE_FORMAT);
    return <div>
      {child.age}&nbsp; ({birthdate})
    </div>
  }

  const getCurrentDate = () => {
    const currentDate = format(new Date(), DATE_FORMAT);
    return <div>{currentDate}</div>
  }

  
  const columns = [
    {
      name: 'Student Name',
      selector: 'studentName',
      sortable: false,
      cell: row => <a onClick={(e) => {e.preventDefault();}} href="#"><span>{row.child?.firstname + " " + row.child?.lastname}</span></a>,
    },
    {
      name: 'Parent name',
      selector: 'parentName',
      sortable: false,
      cell: row => getPrimaryParentName(row.parents)
    },
    {
      name: 'Class',
      selector: 'class',
      sortable: false,
      cell: row => row.class_teacher ? row.class_teacher : row?.child?.grade_desc
    },
    {
      name: 'Age (Bdate)',
      selector: 'birthDate',
      sortable: false,
      cell: row => getAgeBdate(row.child)
    },
    {
      name: 'Type',
      selector: 'type',
      sortable: false,
      cell: row => <div>PT</div>
    },
    {
      name: 'Days Requested',
      selector: 'daysRequested',
      sortable: false
    },
    {
      name: 'Date Needed',
      selector: 'dateNeeded',
      sortable: false,
      cell: row => getCurrentDate()
    },
    {
      name: 'Voucher',
      selector: 'voucher',
      sortable: false,
      cell: row => row.voucher ? 'Yes': 'No'
    },
    {
      name: 'Waiver',
      selector: 'waiver',
      sortable: false,
      cell: row => row.waiver ? 'Yes': 'No'
    },
    {
      name: 'Application Date',
      selector: 'applicationDate',
      sortable: false,
      cell: row => format(new Date(row.application_date), DATE_FORMAT)
    },
    {
      name: 'Archive Date',
      selector: 'archiveDate',
      sortable: false,
      cell: row => format(new Date(row.archived_date), DATE_FORMAT)
    },
    {
      name: 'Unarchive',
      selected: 'unarchived',
      sortable: false,
      cell: row => <button className="unarchived" onClick={() => {handleUnarchived(row.app_id)}}><FontAwesomeIcon icon={faUndo} /></button>
    }
  ];

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
        minHeight: "35px"
      }
    }
  }

  const conditionalRowStyles = [
    {
      when: row => row.color_designation === "blue",
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
      when: row => row.color_designation === "red",
      style: {
        backgroundColor: 'red !important',
        color: '#fff !important',
        borderBottom: '1px solid #fff !important',
        a: {
          color: 'inherit !important'
        }
      }
    },
    {
      when: row => row.color_designation === "green",
      style: {
        backgroundColor: 'green !important',
        color: '#fff !important',
        borderBottom: '1px solid #fff !important',
        a: {
          color: 'inherit !important'
        }
      }
    }
  ]

  const noHeader = true;
  const striped = true;

  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const [classText, setClassText] = useState('');
  const [colorText, setColorText] = useState('');

  const subHeaderComponentMemo = useMemo(() => {
    return <SearchDateComponent 
        handleOnChange={handleOnChange}
        startDate={startDate} 
        endDate={endDate} 
        onClassChange={e => setClassText(e.target.value)} 
        onColorChange={e => setColorText(e.target.value)}
        colorText={colorText}
        classText={classText} 
      />;
  }, [startDate, endDate, resetPaginationToggle, colorText, classText]);

  let data = archivedapplications.length > 0 ? archivedapplications : [];

  let getApplications = archivedapplications.length > 0 ? archivedapplications : [];

  data = getApplications.filter((item) => {

    let class_match = true;
    let color_match = true;

    if(classText) {
      class_match = item.child.grade_desc == classText;
    }

    if(colorText) {
      if(item.color_designation)
        color_match = item.color_designation.toLowerCase() == colorText.toLowerCase();
      else
        color_match = false;
    }

    return class_match && color_match
  });

  return (
    <ArchivedApplicationListStyled>
      <div id="dataTableContainer">
        <DataTable 
          columns={columns}
          data={data}
          pagination
          noHeader={noHeader}
          striped={striped}
          customStyles={customStyles}
          conditionalRowStyles={conditionalRowStyles}
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
        />
      </div>
    </ArchivedApplicationListStyled>
  );
}