import React, { useState }from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUndo
} from "@fortawesome/free-solid-svg-icons";
import DataTable from "react-data-table-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./SearchDate.css";

const ArchivedApplicationStyled = styled.div`

  padding: 1em;

  #dataTableContainer {
    box-shadow: 0px 0px 10px #ccc;
    padding: 1em;
    background-color: #fff;
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

const SearchDateComponent = (startDate) => (
  <>
    <span className="date-label">Date :</span>
    <DatePicker />
    <span className="to-label">To</span>
    <DatePicker />
    <button className="go-btn">Go</button>
  </>
);

export default function index() {

  const status = ['currentPassed', 'inProccess'];

  const name = ['James Ward', 'Terrance Woodyard', 'Cedric Taylor', 'Al Sullivan']

  const group = ['Freshmen', 'Juniors', 'Sophomores', 'Seniors', 'Middle School']

  const data = [];

  for(let x = 1; x <= 50; x++) {

    let randStatus = Math.floor((Math.random() * 2) + 1) - 1;
    let randName = Math.floor((Math.random() * 4) + 1) - 1;
    let randParentName = Math.floor((Math.random() * 4) + 1) - 1;
    let randGroup = Math.floor((Math.random() * 5) + 1) - 1;

    data.push({
      status: status[randStatus],
      studentName: name[randName],
      parentName: name[randParentName],
      class: group[randGroup],
      birthDate: "10.10 (Jun 16, 2009)",
      type: "PT",
      daysRequested: "",
      dateNeeded: "April 25, 2020",
      voucher: false,
      waiver: false,
      applicationDate: "Jun 16, 2018",
      archiveDate: "Jun 16, 2018"
    });
  }

  const columns = [
    {
      name: 'Student Name',
      selector: 'studentName',
      sortable: false,
      cell: row => <a href="#"><span>{row.studentName}</span></a>,
    },
    {
      name: 'Parent name',
      selector: 'parentName',
      sortable: false,
      cell: row => <a href="#"><span>{row.parentName}</span></a>
    },
    {
      name: 'Class',
      selector: 'class',
      sortable: false
    },
    {
      name: 'Age (Bdate)',
      selector: 'birthDate',
      sortable: false
    },
    {
      name: 'Type',
      selector: 'type',
      sortable: false
    },
    {
      name: 'Days Requested',
      selector: 'daysRequested',
      sortable: false
    },
    {
      name: 'Date Requested',
      selector: 'dateNeeded',
      sortable: false
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
      sortable: false
    },
    {
      name: 'Archive Date',
      selector: 'archiveDate',
      sortable: false
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

  const noHeader = true;
  const striped = true;

  const [startDate, setStartDate] = React.useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);

  const subHeaderComponentMemo = React.useMemo(() => {
    return <SearchDateComponent startDate={startDate}/>;
  }, [startDate, resetPaginationToggle]);

  return (
    <ArchivedApplicationStyled>
      <h2>Archived</h2>
      <div id="applicationList">
        <div id="tableSection">
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
        </div>
      </div>
    </ArchivedApplicationStyled>
  )
}