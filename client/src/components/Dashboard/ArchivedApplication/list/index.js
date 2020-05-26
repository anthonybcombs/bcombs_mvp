
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
import "react-datepicker/dist/react-datepicker.css";

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

  #dataTableContainer a {
    color: #3e89fe;
    text-decoration: none;
  }

  @media (min-width: 600px) {
    #tableHeader {
      grid-template-columns: 10% 60% 30%;
    }
  }

  .currentDay {
    background-color: #f26e21;
  }
`;

const SearchDateComponent = ({handleOnChange, startDate, endDate}) => (
  <>
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
  </>
);

export default function index({
  archivedapplications
}) {
  const getPrimaryParentName = (parents) => {
    if(parents.length > 0) {
      return <a href="" onClick={(e) => {e.preventDefault();}}><span>{parents[0]?.firstname + " " + parents[0]?.lastname}</span></a>
    } else {
      return "";
    }
  }

  let currDate = new Date().toISOString();

  const [startDate, setStartDate] = useState(currDate);
  const [endDate, setEndDate] = useState(currDate);

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
      cell: row => <a href="#"><FontAwesomeIcon icon={faUndo} /></a>
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

  console.log(archivedapplications);

  const subHeaderComponentMemo = useMemo(() => {
    return <SearchDateComponent 
        handleOnChange={handleOnChange}
        startDate={startDate} 
        endDate={endDate} 
      />;
  }, [startDate, endDate, resetPaginationToggle]);

  return (
    <ArchivedApplicationListStyled>
      <div id="dataTableContainer">
        <DataTable 
          columns={columns}
          data={archivedapplications}
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