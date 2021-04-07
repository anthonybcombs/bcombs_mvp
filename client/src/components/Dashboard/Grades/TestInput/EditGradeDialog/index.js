import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { uuid } from 'uuidv4'
import { maxBy } from 'lodash'

import EditGradeDialogStyled from './style'
import CustomTable from '../../../CustomComponents/CustomTable'
import CustomSelect from '../../../CustomComponents/CustomSelect'
import { cps } from '@redux-saga/core/effects'

export default function index({
  onClose, data
}) {

  const formatValue = (item, key) => {
    return 'test'
  }

  const columns = {
    class: { label: 'Class Type', type: 'string' },
    subject: { label: 'Name', type: 'string' },
    designation: { label: 'Designation (H, AP)', type: 'string' },
    teacher_name: { label: 'Teacher Name', type: 'string' },
    grade_quarter_1: { label: 'Q1', type: 'number' },
    grade_quarter_1_help: { label: 'Help', type: 'func', func: formatValue },
    attendance_quarter_1: { label: 'Attendance', type: 'func', func: formatValue },
    grade_quarter_2: { label: 'Q2', type: 'number' },
    grade_quarter_2_help: { label: 'Help', type: 'func', func: formatValue },
    attendance_quarter_2: { label: 'Attendance', type: 'func', func: formatValue },
    semestral_1_average: { label: 'Final', type: 'number' },
    semestral_1_passed: { label: 'Passed', type: 'func', func: formatValue },
    grade_quarter_3: { label: 'Q3', type: 'number' },
    grade_quarter_3_help: { label: 'Help', type: 'func', func: formatValue },
    attendance_quarter_3: { label: 'Attendance', type: 'func', func: formatValue },
    grade_quarter_4: { label: 'Q4', type: 'number' },
    grade_quarter_4_help: { label: 'Help', type: 'func', func: formatValue },
    attendance_quarter_4: { label: 'Attendance', type: 'func', func: formatValue },
    semestral_2_average: { label: 'Final', type: 'number' },
    semestral_2_passed: { label: 'Passed', type: 'func', func: formatValue },
    semestral_final: { label: 'Year Final', type: 'number' }
  }

  const colArr = Object.entries(columns)

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
      "attendance": null
  }
  ])
  const [selected, setSelected] = useState([])

  const handleSelect = ({ target: { checked } }, id) => {
    setSelected(checked ? [...selected, id] : selected.filter(e => e !== id))
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
                  <th>Value here</th>
                  <th colSpan='7'></th>
                  <th>Value here</th>
                  <th colSpan='1'></th>
                  <th>Value here</th>
                </tr>
                <tr>
                  <th colSpan='2'>Rank</th>
                  <th colSpan='9'></th>
                  <th>Value here</th>
                  <th colSpan='7'></th>
                  <th>Value here</th>
                  <th colSpan='2'></th>
                </tr>
                <tr>
                  <input
                    type='checkbox'
                    checked={selected.length && selected.length === grades.length}
                    onChange={() => {}}
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
                                      // onChange={(e) => handleInputChange(e, index, key)}
                                      // onBlur={handleInputBlur}
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
