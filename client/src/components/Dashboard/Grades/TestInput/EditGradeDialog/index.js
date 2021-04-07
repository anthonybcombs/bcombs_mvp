import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import update from 'immutability-helper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faCopy, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { uuid } from 'uuidv4'

import EditGradeDialogStyled from './style'
import CustomTable from '../../../CustomComponents/CustomTable'
import CustomSelect from '../../../CustomComponents/CustomSelect'

export default function index({
  onClose, data
}) {
  const formatValue = (item, key) => {
    switch(key) {
      case 'quarter_1_help':
      case 'quarter_2_help':
      case 'quarter_3_help':
      case 'quarter_4_help':
        return (
          <input
            id={key}
            type='checkbox'
            checked={!!item[key]}
            onChange={(e) => handleInputChange(e, item.id, true)}
          />
        )
      case 'quarter_1':
      case 'quarter_2':
      case 'quarter_3':
      case 'quarter_4':
        return (
          <div>
            <input
              id={`letter_grade_${key}`}
              type='text'
              placeholder='A+'
              value={item[`letter_grade_${key}`]}
              onChange={(e) => handleInputChange(e, item.id)}
            />
            <input
              id={`grade_${key}`}
              placeholder='99'
              type='number'
              value={item[`grade_${key}`]}
              onChange={(e) => handleInputChange(e, item.id)}
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
              id={`${key}_absent`}
              type='number'
              placeholder='Absent'
              value={item[`${key}_absent`]}
              onChange={(e) => handleInputChange(e, item.id)}
            />
            <input
              id={`${key}_tardy`}
              type='number'
              placeholder='Tardy'
              value={item[`${key}_tardy`]}
              onChange={(e) => handleInputChange(e, item.id)}
            />
            <input
              id={`${key}_present`}
              type='number'
              placeholder='Present'
              value={item[`${key}_present`]}
              onChange={(e) => handleInputChange(e, item.id)}
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
    quarter_1_help: { label: 'Help', type: 'func', func: formatValue },
    attendance_quarter_1: { label: 'Attendance', type: 'func', func: formatValue },
    quarter_2: { label: 'Q2', type: 'number', func: formatValue },
    quarter_2_help: { label: 'Help', type: 'func', func: formatValue },
    attendance_quarter_2: { label: 'Attendance', type: 'func', func: formatValue },
    semestral_1_average: { label: 'Final', type: 'number' },
    mid_quarter_remarks: { label: 'Passed', type: 'string' },
    quarter_3: { label: 'Q3', type: 'number', func: formatValue },
    quarter_3_help: { label: 'Help', type: 'func', func: formatValue },
    attendance_quarter_3: { label: 'Attendance', type: 'func', func: formatValue },
    quarter_4: { label: 'Q4', type: 'number', func: formatValue },
    quarter_4_help: { label: 'Help', type: 'func', func: formatValue },
    attendance_quarter_4: { label: 'Attendance', type: 'func', func: formatValue },
    semestral_2_average: { label: 'Final', type: 'number' },
    final_quarter_remarks: { label: 'Passed', type: 'string' },
    final_grade: { label: 'Year Final', type: 'number' }
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
  }

  const [grades, setGrades] = useState([
    {
      "id": '1',
      "student_grade_cumulative_id": 2,
      "class": "Basic Programming",
      "subject": "Basic Programming",
      "teacher_name": "Test",
      "designation": "Test",
      "grade_quarter_1": 99,
      "grade_quarter_2": 99,
      "grade_quarter_3": 99,
      "grade_quarter_4": 88,
      "letter_grade_quarter_1": "A",
      "letter_grade_quarter_2": "B",
      "letter_grade_quarter_3": "C",
      "letter_grade_quarter_4": "B",
      "attendance_quarter_1_total": 40,
      "attendance_quarter_2_total": 40,
      "attendance_quarter_3_total": 37,
      "attendance_quarter_4_total": 38,
      "attendance_quarter_1_absent": 2,
      "attendance_quarter_2_absent": 3,
      "attendance_quarter_3_absent": 4,
      "attendance_quarter_4_absent": 1,
      "attendance_quarter_1_tardy": 1,
      "attendance_quarter_2_tardy": 2,
      "attendance_quarter_3_tardy": 3,
      "attendance_quarter_4_tardy": 2,
      "attendance_quarter_1_present": 37,
      "attendance_quarter_2_present": 35,
      "attendance_quarter_3_present": 30,
      "attendance_quarter_4_present": 35,
      "final_grade": 90,
      "year_final_grade": 87,
      "quarter_average": 96.25,
      "semestral_1_average": null,
      "semestral_2_average": null,
      "semestral_final": null,
      "final_semestral_1_attendance": null,
      "final_semestral_2_attendance": null,
      "final_quarter_attendance": 155,
      "mid_quarter_remarks": null,
      "final_quarter_remarks": null,
      "attendance": null
  }
  ])
  const [otherFields, setOtherFields] = useState({ gpa_sem_1: '', gpa_sem_2: '', gpa_final: '', rank_sem_1: '', rank_sem_2: '' })
  const [selected, setSelected] = useState([])

  const handleInputChange = ({ target: { id, value, checked } }, gradeId, isCheckbox = false) => {
    setGrades(update(grades, {
      [grades.findIndex(e => e.id === gradeId)]: { $merge: { [id]: isCheckbox ? checked : value } }
    }))
  }

  const handleChangeOtherFields = ({ target: { id, value } }) => {
    setOtherFields({
      ...otherFields,
      [id]: value
    })
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
      {
        id: uuid(),
        ...Object.keys(gradeKeys).reduce((acc, curr) => ({ ...acc, [curr]: '' }), {})
      }
    ])
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
  }

  const handleDelete = () => {
    setGrades(grades.filter(e => !selected.includes(e.id)))
  }

  // useEffect(() => {
  //   if (data) {
  //     setGrades(data?.grades || [])
  //   }
  // }, [data])
  console.log('zzzz', grades)
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
                      id='rank_sem_1'
                      type='number'
                      value={otherFields.rank_sem_1}
                      onChange={handleChangeOtherFields}
                    />
                  </th>
                  <th colSpan='7'></th>
                  <th>
                    <input
                      id='rank_sem_2'
                      type='number'
                      value={otherFields.rank_sem_2}
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
                                      id={key}
                                      type={type === 'number' ? 'number' : 'text'}
                                      value={row[key]}
                                      onChange={(e) => handleInputChange(e, row.id)}
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
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className='modalBtn'
            onClick={() => {}}
          >
            Save
          </button>
        </div>
      </div>
    </EditGradeDialogStyled>,
    document.getElementById('modal')
  );
}
