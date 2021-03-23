import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { uuid } from 'uuidv4'

import SelectStudentDialogStyled from './style'
import CustomTable from '../../../CustomComponents/CustomTable'

export default function index({
  onClose, onSelectStudent, rows: propRows, keys
}) {
  const columns = {
    child_id: { label: 'Child Id', type: 'string' },
    firstname: { label: 'First name', type: 'string' },
    lastname: { label: 'Last name', type: 'string' }
  }

  const [populateExistingData, setPopulateExistingData] = useState(false)
  const [selected, setSelected] = useState([])
  const [rows, setRows] = useState(propRows)

  const keysObj = keys.reduce((acc, curr) => ({ ...acc, [curr]: '' }), {})

  const handleSave = () => {
    const newData = selected.flatMap(eachId => {
      const { firstname = '', lastname = '', standardized_test = [] } = rows.find(e => e.child_id === eachId) || {}
      return standardized_test.length > 0 ? (
        standardized_test.map(st => ({
          ...(populateExistingData ? st : keysObj),
          child_id: eachId,
          name: `${firstname} ${lastname}`,
          id: uuid()
        }))
      ) : [{
        ...keysObj,
        child_id: eachId,
        name: `${firstname} ${lastname}`,
        id: uuid()
      }]
    })

    onSelectStudent(newData)
  }

  // useEffect(() => {
  //   setRows(
  //     propRows.flatMap(row => {
  //       const { firstname, lastname, standardized_test } = row
  //     })
  //   )
  // }, [propRows])

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
            onSelect={(ids) => setSelected(ids)}
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
            onClick={handleSave}
          >
            Select
          </button>
        </div>
      </div>
    </SelectStudentDialogStyled>,
    document.getElementById('modal')
  );
}
