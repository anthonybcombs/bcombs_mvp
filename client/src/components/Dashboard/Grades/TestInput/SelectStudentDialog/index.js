import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { uuid } from 'uuidv4'
import { maxBy, merge, values, keyBy } from 'lodash'

import SelectStudentDialogStyled from './style'
import CustomTable from '../../../CustomComponents/CustomTable'
import CustomSelect from '../../../CustomComponents/CustomSelect'
import { getGradeTestAttempt, getNameFromCustomForm } from '../../utils'

export default function index({
  onClose, onSelectStudent, rows: propRows, existingRows, keys, gradeTakenOptions, testOptions, columns, type = 'test_input', childId, isForm
}) {
  
  console.log('rows modal',rows)
  console.log('rows modal  propRows',propRows)
  const isTestInput = type === 'test_input'
  const [selectedGradeTest, setSelectedGradeTest] = useState({})

  const handleChangeSt = (child_id, value, key) => {
    const newObj = { ...selectedGradeTest[child_id], [key]: value }

    setSelectedGradeTest({
      ...selectedGradeTest,
      [child_id]: newObj
    })

  }
  const formatValue = (item, key) => {
    const { test_name = 'act', grade_taken = 1, attempt, year_level = '' } = selectedGradeTest[item.child_id] || {}
    const { standardized_test = [], cumulative_grades = [] } = propRows.find(e => e.child_id === item.child_id) || {}

    if (key === 'name') {
      return item.name || '--'
    }
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
      const latestAttempt = getGradeTestAttempt(standardized_test, grade_taken, test_name, item.child_id)
      return (
        <CustomSelect
          value={attempt === undefined ? (latestAttempt - 1) : attempt}
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
    if (key === 'year_level') {
      const { year_level: latest_grade } = maxBy(cumulative_grades, 'year_level') || {}
      return (
        <CustomSelect
          value={year_level || latest_grade}
          options={gradeTakenOptions}
          onChange={(e) => handleChangeSt(item.child_id, e.target.value, 'year_level')}
        />
      )
    }
    if (key === 'latest_grade') {
      const { year_level: latest_grade } = maxBy(cumulative_grades, 'year_level') || {}
      return <span>{latest_grade || '--'}</span>
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

  console.log('keysObj', keysObj)
  console.log('keysObj keys', keys)
  console.log('keysObj standardized_test', rows)
  console.log('keysObj propRows', propRows)
  const handleSave = () => {
    let newData = []
    if (isTestInput) {
      newData = selected.map(eachId => {
        const { child_id, name, standardized_test  = [] } = rows.find(e => e.child_id === eachId) || {}
        const { test_name = 'act', grade_taken = 1, attempt } = selectedGradeTest[eachId] || {}
        const newAttempt = getGradeTestAttempt([...standardized_test, ...existingRows.filter(e => !e.student_test_id)], grade_taken, test_name, eachId)
        const latestAttemp = attempt === undefined ? (newAttempt - 1) : attempt
        const existingTestIds = existingRows.filter(e => e.student_test_id).map(e => e.student_test_id)
        const st = populateExistingData
          ? (standardized_test.find(e => (!existingTestIds.includes(e.student_test_id) && e.grade_taken == grade_taken && e.test_name == test_name && e.attempt == latestAttemp)) || keysObj)
          : keysObj
        console.log(st.month_taken)
        return {
          ...st,
          attempt: st.attempt || newAttempt,
          score_percentage: st.score_percentage || '',
          grade_taken,
          test_name,
          child_id,
          name,
          enableEdit: st.student_test_id ? false : true,
          id: uuid()
        }
      })
    } else {
      console.log('123123rows ',rows)
      console.log('123123rows selected',selected)
      newData = selected.map(eachId => {
        const { child_id, name, cumulative_grades = [], firstname, lastname, app_id, app_group_id, application_type, type, } = rows.find(e => e.child_id === eachId) || {}

        const test =  rows.find(e => e.child_id === eachId);
        console.log('1111test',test)
        const { year_level: latest_grade } = maxBy(cumulative_grades, 'year_level') || {}
        const { year_level } = selectedGradeTest[eachId] || {}
        const yl = year_level || latest_grade
        const gradesObj = cumulative_grades.find(e => e.year_level == yl) || keysObj
        const help_needed = (gradesObj.grades || []).filter(e => (e.help_q1 || e.help_q2 || e.help_q3 || e.help_q4)).map(e => e.subject)

        return {
          ...gradesObj,
          help_needed,
          firstname,
          lastname,
          year_level: yl || 1,
          child_id,
          app_id,
          app_group_id,
          application_type,
          type,
          name,
          enableEdit: gradesObj.student_grade_cumulative_id ? false : true,
          id: uuid()
        }
      })
        .filter(gr => !(existingRows.find(e => (e.child_id === gr.child_id && e.year_level == gr.year_level))))

    }
    console.log('newDataaaa,', newData)
    onSelectStudent(newData)
  }

  useEffect(() => {

    let newRows = propRows.flatMap(row => {
      let { firstname = '', lastname = '', standardized_test = [], child_id, cumulative_grades, app_id, app_group_id, application_type, type, form_contents } = row
      if (isForm && form_contents) {
        const name = getNameFromCustomForm(form_contents)
        firstname = name.firstname
        lastname = name.lastname
      }
      return {
        name: (firstname || lastname) ? `${firstname} ${lastname}` : '',
        firstname,
        lastname,
        child_id: child_id || app_id,
        app_id,
        app_group_id,
        application_type,
        type,
        standardized_test,
        cumulative_grades
      }
    })

    newRows = merge(keyBy(newRows, 'child_id'), keyBy(newRows, 'child_id'));
    newRows = values(newRows);


    setRows(newRows)
  }, [propRows]);

  return ReactDOM.createPortal(
    <SelectStudentDialogStyled
      data-testid='app-big-calendar-create-modal'
      className='modal'>
      <div className='modal-content'>
        <div className='modal-header'>
          <h2>Select student</h2>
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>

        <div className='modal-body'>
          <CustomTable
            hasSearch
            rows={rows}
            columns={newColumns}
            idKey='child_id'
            headerRightActions={
              isTestInput
                ? [(
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
                )]
                : null
            }

            selectable
            defaultSelectedIds={childId ? [childId] : []}
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
