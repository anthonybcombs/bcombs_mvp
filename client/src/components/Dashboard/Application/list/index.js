import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArchive,
  faCheck,
  faTimes } from "@fortawesome/free-solid-svg-icons";
import DataTable from 'react-data-table-component';
import { uuid } from "uuidv4";

const ApplicationListStyled = styled.div`
  
  margin-bottom: 20px;

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
  }

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
`;

const TextField = styled.input`
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

const FilterComponent = () => (
  <>
    <TextField id="search" type="text" placeholder="Search" />
    <ClearButton type="button">X</ClearButton>
  </>
);

export default function index() {

  const status = ['currentFailed', 'currentPassed', 'inProccess'];

  const name = ['James Ward', 'Terrance Woodyard', 'Cedric Taylor', 'Al Sullivan']

  const group = ['Freshmen', 'Juniors', 'Sophomores', 'Seniors', 'Middle School']

  const data = [];

  for(let x = 1; x <= 10; x++) {

    let randStatus = Math.floor((Math.random() * 3) + 1) - 1;
    let randName = Math.floor((Math.random() * 4) + 1) - 1;
    let randGroup = Math.floor((Math.random() * 5) + 1) - 1;

    data.push({
      id: uuid(),
      status: status[randStatus],
      studentName: name[randName],
      parentName: "Parent A" + x,
      class: group[randGroup],
      birthDate: "10.10 (Jun 16, 2009)",
      applicationDate: "Jun 16, 2018",
      attachment1: "",
      attachment2: ""
    });
  }


  console.log(data);

  const getApplicationStatusVal = (status) => {

    if(status == 'currentPassed') {
      return <a href="#"><span>Current Student</span>&nbsp;<FontAwesomeIcon icon={faCheck} /></a>
    } else if (status == 'currentFailed') {
      return <a href="#"><span>Current Student</span>&nbsp;<FontAwesomeIcon icon={faTimes} /></a>
    } else {
      return <a href="#"><span>In process</span></a>
    }
  }

  const columns = [
    {
      name: 'Status',
      selector: 'status',
      sortable: true,
      cell: row => getApplicationStatusVal(row.status),
      
    },
    {
      name: 'Student Name',
      selector: 'studentName',
      sortable: true,
      cell: row => <a href="#"><span>{row.studentName}</span></a>,
    },
    {
      name: 'Parent name',
      selector: 'parentName',
      sortable: true,
      cell: row => <a href="#"><span>{row.parentName}</span></a>
    },
    {
      name: 'Class',
      selector: 'class',
      sortable: true
    },
    {
      name: 'Age (Bdate)',
      selector: 'birthDate',
      sortable: true
    },
    {
      name: 'Application Date',
      selector: 'applicationDate',
      sortable: true
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

  const [filterText, setFilterText] = React.useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);

  const subHeaderComponentMemo = React.useMemo(() => {
    return <FilterComponent />;
  }, [filterText, resetPaginationToggle]);

  const noHeader = true;
  const striped = true;

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
            />
          </div>
        </div>
      </div>
    </ApplicationListStyled>
  )
}