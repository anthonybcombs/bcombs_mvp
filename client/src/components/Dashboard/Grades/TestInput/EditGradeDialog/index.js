import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import update from 'immutability-helper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faCopy, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { empty, uuid } from 'uuidv4'
import cloneDeep from 'lodash.clonedeep'

import EditGradeDialogStyled from './style'
import CustomTable from '../../../CustomComponents/CustomTable'
import CustomSelect from '../../../CustomComponents/CustomSelect'

export default function index({
  onClose, data, onSaveGrade
}) {
  const formatValue = (item, key) => {
    switch(key) {
      case 'help_q1':
      case 'help_q2':
      case 'help_q3':
      case 'help_q4':
        return (
          <input
            type='checkbox'
            checked={!!item[key]}
            onChange={(e) => handleInputChange(e, key, item.id, true)}
          />
        )
      case 'quarter_1':
      case 'quarter_2':
      case 'quarter_3':
      case 'quarter_4':
        return (
          <div>
            <input
              type='text'
              placeholder='A+'
              value={item[`letter_grade_${key}`]}
              onChange={(e) => handleInputChange(e, `letter_grade_${key}`, item.id)}
            />
            <input
              placeholder='99'
              type='number'
              value={item[`grade_${key}`]}
              onChange={(e) => handleInputChange(e, `grade_${key}`, item.id)}
            />
          </div>
        )
      case 'final_grade':
        return (
          <div>
            <input
              id={`letter_final_grade`}
              type='text'
              placeholder='A+'
              value={item[`letter_final_grade`]}
              onChange={(e) => handleInputChange(e, 'letter_final_grade', item.id)}
            />
            <input
              id={`final_grade`}
              placeholder='99'
              type='number'
              value={item[`final_grade`]}
              onChange={(e) => handleInputChange(e, 'final_grade', item.id)}
            />
          </div>
        )
      case 'attendance_quarter_1':
      case 'attendance_quarter_2':
      case 'attendance_quarter_3':
      case 'attendance_quarter_4':
        return (
          <div>
            <input
              type='number'
              placeholder='Absent'
              value={item[`${key}_absent`]}
              onChange={(e) => handleInputChange(e, `${key}_absent`, item.id)}
            />
            <input
              type='number'
              placeholder='Tardy'
              value={item[`${key}_tardy`]}
              onChange={(e) => handleInputChange(e, `${key}_tardy`, item.id)}
            />
            <input
              type='number'
              placeholder='Present'
              value={item[`${key}_present`]}
              onChange={(e) => handleInputChange(e, `${key}_present`, item.id)}
            />
          </div>
        )
      default:
        return null
    }
  }

  const columns = {
    class: { label: 'Class Type', type: 'string' },
    subject: { label: 'Name', type: 'string' },
    designation: { label: 'Designation (H, AP)', type: 'string' },
    teacher_name: { label: 'Teacher Name', type: 'string' },
    quarter_1: { label: 'Q1', type: 'func', func: formatValue },
    help_q1: { label: 'Help', type: 'func', func: formatValue },
    attendance_quarter_1: { label: 'Attendance', type: 'func', func: formatValue },
    quarter_2: { label: 'Q2', type: 'number', func: formatValue },
    help_q2: { label: 'Help', type: 'func', func: formatValue },
    attendance_quarter_2: { label: 'Attendance', type: 'func', func: formatValue },
    semestral_1_average: { label: 'Final', type: 'number' },
    mid_quarter_remarks: { label: 'Passed', type: 'string' },
    quarter_3: { label: 'Q3', type: 'number', func: formatValue },
    help_q3: { label: 'Help', type: 'func', func: formatValue },
    attendance_quarter_3: { label: 'Attendance', type: 'func', func: formatValue },
    quarter_4: { label: 'Q4', type: 'number', func: formatValue },
    help_q4: { label: 'Help', type: 'func', func: formatValue },
    attendance_quarter_4: { label: 'Attendance', type: 'func', func: formatValue },
    semestral_2_average: { label: 'Final', type: 'number' },
    final_quarter_remarks: { label: 'Passed', type: 'string' },
    final_grade: { label: 'Year Final', type: 'number', func: formatValue }
  }

  const colArr = Object.entries(columns)
  const gradeKeys = {
    student_grade_cumulative_id: { type: 'int' },
    class: { type: 'string' },
    subject: { type: 'string' },
    teacher_name: { type: 'string' },
    designation: { type: 'string' },
    grade_quarter_1: { type: 'float' },
    grade_quarter_2: { type: 'float' },
    grade_quarter_3: { type: 'float' },
    grade_quarter_4: { type: 'float' },
    letter_grade_quarter_1: { type: 'string' },
    letter_grade_quarter_2: { type: 'string' },
    letter_grade_quarter_3: { type: 'string' },
    letter_grade_quarter_4: { type: 'string' },
    // attendance_quarter_1_total: { type: 'int' },
    // attendance_quarter_2_total: { type: 'int' },
    // attendance_quarter_3_total: { type: 'int' },
    // attendance_quarter_4_total: { type: 'int' },
    attendance_quarter_1_absent: { type: 'int' },
    attendance_quarter_2_absent: { type: 'int' },
    attendance_quarter_3_absent: { type: 'int' },
    attendance_quarter_4_absent: { type: 'int' },
    attendance_quarter_1_tardy: { type: 'int' },
    attendance_quarter_2_tardy: { type: 'int' },
    attendance_quarter_3_tardy: { type: 'int' },
    attendance_quarter_4_tardy: { type: 'int' },
    attendance_quarter_1_present: { type: 'int' },
    attendance_quarter_2_present: { type: 'int' },
    attendance_quarter_3_present: { type: 'int' },
    attendance_quarter_4_present: { type: 'int' },
    mid_quarter_remarks: { type: 'string' },
    final_quarter_remarks: { type: 'string' },
    semestral_1_average: { type: 'float' },
    semestral_2_average: { type: 'float' },
    final_grade: { type: 'float' },
    letter_final_grade: { type: 'string' },
    help_q1: { type: 'string' },
    help_q2: { type: 'string' },
    help_q3: { type: 'string' },
    help_q4: { type: 'string' },
  }
  const otherFieldKeys = {
    gpa_sem_1: { type: 'float' },
    gpa_sem_2: { type: 'float' },
    gpa_final: { type: 'float' },
    mid_student_rank: { type: 'int' },
    final_student_rank: { type: 'int' }
  }
  const emptyGrade = Object.keys(gradeKeys).reduce((acc, curr) => ({ ...acc, [curr]: '' }), {})
  const [grades, setGrades] = useState([{ id: uuid(), ...emptyGrade }])
  const [otherFields, setOtherFields] = useState(Object.keys(otherFieldKeys).reduce((acc, curr) => ({ ...acc, [curr]: '' }), {}))
  const [selected, setSelected] = useState([])
  const [hasChanged, setHasChanged] = useState(false)

  const handleInputChange = ({ target: { value, checked } }, key, gradeId, isCheckbox = false) => {
    setGrades(update(grades, {
      [grades.findIndex(e => e.id === gradeId)]: { $merge: { [key]: isCheckbox ? (checked ? 'help' : '') : value } }
    }))
    setHasChanged(true)
  }

  const handleChangeOtherFields = ({ target: { id, value } }) => {
    setOtherFields({
      ...otherFields,
      [id]: value
    })
    setHasChanged(true)
  }

  const handleSelect = ({ target: { checked } }, id) => {
    setSelected(checked ? [...selected, id] : selected.filter(e => e !== id))
  }

  const handleSelectAll = ({ target: { checked } }) => {
    setSelected(checked ? grades.map(e => e.id) : [])
  }

  const handleAdd = () => {
    setGrades([
      ...grades,
      { id: uuid(), ...emptyGrade }
    ])
    setHasChanged(true)
  }

  const handleCopy = () => {
    setGrades([
      ...grades,
      ...selected.map(e => {
        const selectedGrade = grades.find(g => g.id === e)
        return {
          ...selectedGrade,
          id: uuid(),
          student_grade_cumulative_id: '',
        }
      })
    ])
    setHasChanged(true)
  }

  const handleDelete = () => {
    setGrades(grades.filter(e => !selected.includes(e.id)))
  }

  const handleSave = () => {
    const newGrades = cloneDeep(grades)
      .map(e => {
        let newGrade = Object.entries(gradeKeys)
          .reduce((acc, [key, { type }]) => {
            if (type === 'int') {
              acc[key] = e[key] ? parseInt(e[key]) : 0
            } else if (type === 'float') {
              acc[key] = e[key] ? parseFloat(e[key]) : 0
            } else {
              acc[key] = e[key]
            }
            return acc
          }, {})

        return newGrade
      })
    const newOtherFields = Object.entries(otherFieldKeys)
      .reduce((acc, [key, { type }]) => {
        if (type === 'int') {
          acc[key] = otherFields[key] ? parseInt(otherFields[key]) : 0
        } else if (type === 'float') {
          acc[key] = otherFields[key] ? parseFloat(otherFields[key]) : 0
        } else {
          acc[key] = otherFields[key]
        }
        return acc
      }, {})
    onSaveGrade(newGrades, newOtherFields)
  }

  useEffect(() => {
    if (data?.grades && data?.grades.length) {
      setGrades((data?.grades || []).map(e => ({ ...e, id: uuid() })))
    }
  }, [data])

  useEffect(() => {
    if(!grades.length) {
      setHasChanged(false)
    }
  }, [grades])

  return ReactDOM.createPortal(
    <EditGradeDialogStyled
      data-testid='app-big-calendar-create-modal'
      className='modal'>
      <div className='modal-content'>
        <div className='modal-header'>
          Edit Grades
        </div>

        <div className='modal-container'>
          <div id='gradeListTableWrapper'>
            <table id='gradeInputView-table'>
              <thead>
                <tr>
                  <th colSpan='2'>Input By</th>
                  <th colSpan='3'></th>
                  <th>Auto Value here</th>
                  <th colSpan='2'></th>
                  <th>Auto Value here</th>
                  <th colSpan='13'></th>
                </tr>
                <tr>
                  <th colSpan='2'>Approved By</th>
                  <th colSpan='3'></th>
                  <th>Auto Value here</th>
                  <th colSpan='2'></th>
                  <th>Auto Value here</th>
                  <th colSpan='13'></th>
                </tr>
                <tr>
                  <th colSpan='2'>GPA</th>
                  <th colSpan='9'></th>
                  <th>
                    <input
                      id='gpa_sem_1'
                      type='number'
                      value={otherFields.gpa_sem_1}
                      onChange={handleChangeOtherFields}
                    />
                  </th>
                  <th colSpan='7'></th>
                  <th>
                    <input
                      id='gpa_sem_2'
                      type='number'
                      value={otherFields.gpa_sem_2}
                      onChange={handleChangeOtherFields}
                    />
                  </th>
                  <th colSpan='1'></th>
                  <th>
                    <input
                      id='gpa_final'
                      type='number'
                      value={otherFields.gpa_final}
                      onChange={handleChangeOtherFields}
                    />
                  </th>
                </tr>
                <tr>
                  <th colSpan='2'>Rank</th>
                  <th colSpan='9'></th>
                  <th>
                    <input
                      id='mid_student_rank'
                      type='number'
                      value={otherFields.mid_student_rank}
                      onChange={handleChangeOtherFields}
                    />
                  </th>
                  <th colSpan='7'></th>
                  <th>
                    <input
                      id='final_student_rank'
                      type='number'
                      value={otherFields.final_student_rank}
                      onChange={handleChangeOtherFields}
                    />
                  </th>
                  <th colSpan='2'></th>
                </tr>
                <tr>
                  <input
                    type='checkbox'
                    checked={selected.length && selected.length === grades.length}
                    onChange={handleSelectAll}
                  />
                  {
                    colArr.map(([key, col], ci) => {
                      return (
                        <th key={`col-label-${ci}`}>{col.label}</th>
                      )
                    })
                  }
                </tr>
              </thead>
              <tbody>
                {
                  grades.map((row, index) => {
                    return (
                      <tr key={`tr-ct-${index}`}>
                        <td>
                          <input
                            type='checkbox'
                            checked={selected.includes(row.id)}
                            onChange={e => handleSelect(e, row.id)}
                          />
                        </td>
                        {
                          colArr.map(([key, { func = null, type }]) => {
                            return (
                              <td key={`td-ct-${key}-${index}`}>
                                {
                                  func ? (
                                    func(row, key)
                                  ) : (
                                    <input
                                      type={type === 'number' ? 'number' : 'text'}
                                      value={row[key]}
                                      onChange={(e) => handleInputChange(e, key, row.id)}
                                    />
                                  )
                                }
                              </td>
                            )
                          })
                        }
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
          <div className='actions'>
            <button
              className='btn-add'
              onClick={handleAdd}
            >
              <FontAwesomeIcon icon={faPlusCircle} />
              <span>Add</span>
            </button>
            <button
              className={`btn-copy ${selected.length === 0 ? 'disabled' : ''}`}
              disabled={selected.length === 0}
              onClick={handleCopy}
            >
              <FontAwesomeIcon icon={faCopy} />
              <span>Copy</span>
            </button>
            <button
              className={`btn-delete ${selected.length === 0 ? 'disabled' : ''}`}
              disabled={selected.length === 0}
              onClick={handleDelete}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
              <span>Delete</span>
            </button>
          </div>
        </div>

        <div className='modal-footer'>
          <button
            className='modalBtn cancelBtn'
            onClick={() => onClose(hasChanged)}
          >
            Cancel
          </button>
          <button
            className='modalBtn'
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </EditGradeDialogStyled>,
    document.getElementById('modal')
  );
}
