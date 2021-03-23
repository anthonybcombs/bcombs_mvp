import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import SelectStudentDialogStyled from './style'
import CustomTable from '../../../CustomComponents/CustomTable'

export default function index({
  onClose, onselectStudent, rows
}) {
  const columns = {
    child_id: { label: 'Child Id', type: 'string' },
    firstname: { label: 'First name', type: 'string' },
    lastname: { label: 'Last name', type: 'string' }
  }

  const [populateExistingData, setPopulateExistingData] = useState(false)

  const handleSelect = (selected) => {
    console.log('witwew', selected)
  }

  return ReactDOM.createPortal(
    <SelectStudentDialogStyled
      data-testid='app-big-calendar-create-modal'
      className='modal'>
      <div className='modal-content'>
        <div className='modal-header'>
          Select student
        </div>

        <div className='modal-container'>
          <CustomTable
            hasSearch
            rows={rows}
            columns={columns}
            idKey='child_id'

            selectable
            onSelect={handleSelect}
          />
          <div id='populate'>
            <label htmlFor='populate' className='checkboxContainer'>
              <input
                type='checkbox'
                id='populate'
                checked={populateExistingData}
                onChange={({ target: { checked } }) => setPopulateExistingData(checked)}
              />
              <span className='checkmark' />
              <span className='labelName'>Populate existing data</span>
            </label>
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
            onClick={onselectStudent}
          >
            Select
          </button>
        </div>
      </div>
    </SelectStudentDialogStyled>,
    document.getElementById('modal')
  );
}
