import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import unionBy from 'lodash.unionby'

import { CSVLink, CSVDownload } from "react-csv";

import ExportTestGradeDialogStyled from '../ImportTestGradeDialog/style';

export default function index({
  inputType,
  onClose,
  appGroups = [],
  formAppGroups = [],
  onGetGroupGradeTest,
  data = [],
  loading
}) {
  const [appGroupText, setAppGroupText] = useState("");
  const updatedGroups =  unionBy(appGroups, formAppGroups, "app_grp_id");// [...(appGroups || []),...(formAppGroups || [])]
  // useEffect(() => {
  //   if(appGroups.length > 0)
  //     setAppGroupText(appGroups[0].app_grp_id);
  // }, [appGroups])

  return ReactDOM.createPortal(
    <ExportTestGradeDialogStyled
      data-testid='app-big-calendar-create-modal'
      className='modal'
    >
      <div className='modal-content export'>
        <div className='modal-header'>
          <h2>Export Student {inputType == 'test' ? 'Standard Test' : inputType == 'grades' ? 'Grades' : '' } Data</h2>
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>
        
        <div className='modal-body'>
          <div>Filter:</div>
          {/* <div>
            <label>Application Group</label>
          </div> */}
          <div>
            <select
                className="form-control"
                value={appGroupText}
                onChange={e => {
                  console.log(e.target.value);
                  setAppGroupText(e.target.value);
                  if(e.target.value)
                    onGetGroupGradeTest(e.target.value);
                }}>
                <option value="" disabled>Select Application Group</option>
                {updatedGroups.map((opt, i) => (
                  <option key={i} value={opt.app_grp_id}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>
        </div>
        <div className='modal-footer'>
          <button
            className='modalBtn cancelBtn'
            onClick={onClose}
          >
            Cancel
          </button>
          <CSVLink
            id="gradeExportBtn"
            filename={inputType == 'test'? 'Standard Test Export.csv' : 'Grades Export.csv'}
            data={data}
          >
            <button
              className='modalBtn'
              disabled={!appGroupText || loading}
            >
              Export
            </button>
          </CSVLink>

        </div>
      </div>
    </ExportTestGradeDialogStyled>,
    document.getElementById('modal')
  );
}