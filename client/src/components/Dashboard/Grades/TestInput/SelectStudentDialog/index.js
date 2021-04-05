import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { uuid } from 'uuidv4'

import SelectStudentDialogStyled from './style'
import CustomTable from '../../../CustomComponents/CustomTable'
import CustomSelect from '../../../CustomComponents/CustomSelect'
import { getGradeTestAttempt } from '../../utils'

export default function index({
  onClose, onSelectStudent, rows: propRows, existingRows, keys, gradeTakenOptions, testOptions, columns, type = 'test_input'
}) {
  console.log('zzzz', propRows)
  const [selectedGradeTest, setSelectedGradeTest] = useState({})

  const handleChangeSt = (child_id, value, key) => {
    const newObj = { ...selectedGradeTest[child_id], [key]: value }

    setSelectedGradeTest({
      ...selectedGradeTest,
      [child_id]: newObj
    })
    
  }
  const formatValue = (item, key) => {
    const { test_name = 'act', grade_taken = 1, attempt = '', level = '' } = selectedGradeTest[item.child_id] || {}
    const { standardized_test = [], cumulative_grades = [] } = propRows.find(e => e.child_id === item.child_id) || {}
    if (key === 'standardized_test') {
      return (
        <CustomSelect
          value={test_name}
          options={testOptions}
          onChange={(e) => handleChangeSt(item.child_id, e.target.value, 'test_name')}
        />
      )
    }
    if (key === 'grade_taken') {
      return (
        <CustomSelect
          value={grade_taken}
          options={gradeTakenOptions}
          onChange={(e) => handleChangeSt(item.child_id, e.target.value, 'grade_taken')}
        />
      )
    }
    if (key === 'attempt') {
      const options = (standardized_test || [])
        .filter(e => (e.grade_taken == grade_taken && e.test_name === test_name))
        .map(e => ({ value: e.attempt, label: e.attempt }))

      return (
        <CustomSelect
          value={attempt}
          options={[
            { value: '', label: 'New attempt' },
            ...options
          ]}
          onChange={(e) => handleChangeSt(item.child_id, e.target.value, 'attempt')}
        />
      )
    }
    if (key === 'latest_attempt') {
      const latestAttempt = getGradeTestAttempt(standardized_test, grade_taken, test_name, item.child_id)
      return (
        <span>{(latestAttempt - 1) || '--'}</span>
      )
    }
    if (key === 'level') {
      return (
        <CustomSelect
          value={level}
          options={gradeTakenOptions}
          onChange={(e) => handleChangeSt(item.child_id, e.target.value, 'level')}
        />
      )
    }
    if (key === 'taken') {
      const isTaken = cumulative_grades.find(e => e.year_level == level)
      return <span>{isTaken ? 'Taken' : 'Not Taken'}</span>
    }
  }

  const newColumns = Object.entries(columns).reduce((acc, [key, val]) => {
    if (val.isFunc) {
      return {
        ...acc,
        [key]: { ...val, func: formatValue }
      }
    }

    return {
      ...acc,
      [key]: val
    }
    
  }, {})

  const [populateExistingData, setPopulateExistingData] = useState(true)
  const [selected, setSelected] = useState([])
  const [rows, setRows] = useState([])

  const keysObj = keys.reduce((acc, curr) => ({ ...acc, [curr]: '' }), {})

  const handleSave = () => {
    let newData = []
    if (type === 'test_input') {
      newData = selected.map(eachId => {
        const { child_id, name, standardized_test } = rows.find(e => e.child_id === eachId) || {}
        const { test_name = 'act', grade_taken = 1, attempt = 1 } = selectedGradeTest[eachId] || {}
        const existingTestIds = existingRows.filter(e => e.student_test_id).map(e => e.student_test_id)
        const st = populateExistingData
          ? (standardized_test.find(e => (!existingTestIds.includes(e.student_test_id) && e.grade_taken == grade_taken && e.test_name == test_name && e.attempt == attempt)) || keysObj)
          : keysObj
  
        const newAttempt = getGradeTestAttempt([...standardized_test, ...existingRows.filter(e => !e.student_test_id)], grade_taken, test_name, eachId)
  
        return {
          ...st,
          attempt: st.attempt || newAttempt,
          score_percentage: st.score_percentage || '',
          grade_taken,
          test_name,
          child_id,
          name,
          id: uuid()
        }
      })
    }
  
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
            columns={newColumns}
            idKey='child_id'
            headerRightActions={[(
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
            )]}

            selectable
            onSelect={(ids) => setSelected(ids)}
          />
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
            disabled={selected.length === 0}
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
