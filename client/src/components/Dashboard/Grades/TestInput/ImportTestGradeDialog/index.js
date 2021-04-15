import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import { CSVLink, CSVDownload } from "react-csv";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'

import ImportTestGradeDialogStyled from './style';

export default function index({
  inputType,
  data,
  onClose,
  onImport
}) {

  console.log('exporTestData', data);

  const [importData, setImportData] = useState([]);

  const handelUpload = (file) => {
    if(!file) {
      return;
    }

    var reader = new FileReader()
    reader.onloadend = function(e) {

      const rows = e.target.result.split("\n");
      setImportData(rows);

      console.log('e.target.result', rows);
    }
    reader.readAsText(file);
  }
  return ReactDOM.createPortal(
    <ImportTestGradeDialogStyled
      data-testid='app-big-calendar-create-modal'
      className='modal'
    >
      <div className='modal-content'>
        <div className='modal-header'>
          Import Student {inputType == 'test' ? 'Standard Test' : inputType == 'grades' ? 'Grades' : '' } Data
        </div>
        
        <div className='modal-container'>
          <div>
            Please upload the template file
          </div>
          <div style={{'paddingLeft': '30px'}}>
            {
              inputType == 'test' && (
                <CSVLink
                  id="gradeExportBtn"
                  filename='Standart Test.csv'
                  data={data}
                >
                  Download the template here.
                </CSVLink>
              )
            }
          </div>
          <div>
            <span style={{'color': 'red', 'fontWeight': 'bold'}}>Important!</span>
            <ul>
              <li>You must first download the template file here</li>
              <li>You must not change the name and the ID from the downloaded template</li>
              <li>This import is only to edit existing student's data and not create new students</li>
            </ul>
          </div>
          <div>
            <input
              type='file'
              accept='.csv'
              onChange={(e) => handelUpload(e.target.files[0])}
            />
          </div>
        </div>
        <div className='modal-footer'>
          <button
            className='modalBtn cancelBtn'
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className='modalBtn'
            disabled={importData.length === 0}
            onClick={() => onImport(importData)}
          >
            Import
          </button>
        </div>
      </div>
    </ImportTestGradeDialogStyled>,
    document.getElementById('modal')
  );
}