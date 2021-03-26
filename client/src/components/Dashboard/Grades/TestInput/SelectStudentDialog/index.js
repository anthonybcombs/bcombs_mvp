import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { uuid } from 'uuidv4'

import SelectStudentDialogStyled from './style'
import CustomTable from '../../../CustomComponents/CustomTable'
import CustomSelect from '../../../CustomComponents/CustomSelect'
import { concatAST } from 'graphql'

export default function index({
  onClose, onSelectStudent, rows: propRows, keys
}) {

  const [selectedTest, setSelectedTest] = useState({})

  const handleChangeSt = (child_id, value) => {
    setSelectedTest({
      ...selectedTest,
      [child_id]: value
    })
  }
  const formatValue = (item, key) => {
    if (key === 'standardized_test') {
      return (
        <CustomSelect
          value={selectedTest[item.child_id]}
          options={[
            { label: 'New Test', value: '' },
            ...item.standardized_test.map(e => ({
              label: e.test_name,
              value: e.student_test_id
            })),
          ]}
          onChange={(e) => handleChangeSt(item.child_id, e.target.value)}
        />
      )
    }
  }

  const columns = {
    child_id: { label: 'Child Id', type: 'string' },
    name: { label: 'Name', type: 'string' },
    standardized_test: { label: 'Test Name', type: 'string', func: formatValue }
  }

  const [populateExistingData, setPopulateExistingData] = useState(false)
  const [selected, setSelected] = useState([])
  const [rows, setRows] = useState([])

  const keysObj = keys.reduce((acc, curr) => ({ ...acc, [curr]: '' }), {})

  const handleSave = () => {
    const newData = selected.map(eachId => {
      const { child_id, name, standardized_test } = rows.find(e => e.child_id === eachId) || {}
      const selectedTestId = selectedTest[eachId]
      const st = (selectedTestId && populateExistingData) ? (standardized_test.find(e => e.student_test_id == selectedTestId) || keysObj) : keysObj
      return {
        ...st,
        child_id,
        name,
        id: uuid()
      }
    })

    onSelectStudent(newData)
  }

  useEffect(() => {
    setRows(
      propRows.flatMap(row => {
        const { firstname = '', lastname = '', standardized_test = [], child_id } = row
        return {
          name: `${firstname} ${lastname}`,
          child_id,
          standardized_test
        }
        // return standardized_test.length > 0 ? (
        //   standardized_test.map(st => ({
        //     ...st,
        //     name: `${firstname} ${lastname}`,
        //     student_test_id: st.student_test_id || '',
        //     id: uuid()
        //   }))
        // ) : [{
        //   ...keysObj,
        //   child_id,
        //   name: `${firstname} ${lastname}`,
        //   id: uuid()
        // }]
      })
    )
  }, [propRows])

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
          <div className='populate'>
            <label htmlFor='populate' className='checkboxContainer'>
              <input
                type='checkbox'
                id='populate'
                checked={populateExistingData}
                onChange={({ target: { checked } }) => setPopulateExistingData(checked)}
              />
              <span className='checkmark' />
              <span id='populate' className='labelName'>Populate existing record</span>
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
