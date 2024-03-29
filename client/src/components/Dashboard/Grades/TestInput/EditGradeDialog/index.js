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
  onClose, data, onSaveGrade, gradeKeys, isParent = false
}) {
  const formatValue = (item, key) => {
    switch (key) {
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
              value={item[`letter_grade_${key}`] || ''}
              onChange={(e) => handleInputChange(e, `letter_grade_${key}`, item.id)}
            />
            <input
              placeholder='99'
              type='number'
              value={item[`grade_${key}`] || ''}
              onChange={(e) => handleInputChange(e, `grade_${key}`, item.id)}
            />
          </div>
        )
      case 'year_final_grade':
      case 'mid_final_grade':
      case 'final_grade':
        return (
          <div>
            <input
              type='text'
              placeholder='A+'
              value={item[`letter_${key}`] || ''}
              onChange={(e) => handleInputChange(e, `letter_${key}`, item.id)}
            />
            <input
              placeholder='99'
              type='number'
              value={item[key] || ''}
              onChange={(e) => handleInputChange(e, key, item.id)}
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
              value={item[`${key}_absent`] || ''}
              onChange={(e) => handleInputChange(e, `${key}_absent`, item.id)}
            />
            <input
              type='number'
              placeholder='Tardy'
              value={item[`${key}_tardy`] || ''}
              onChange={(e) => handleInputChange(e, `${key}_tardy`, item.id)}
            />
            <input
              type='number'
              placeholder='Total'
              value={item[`${key}_total`] || ''}
              onChange={(e) => handleInputChange(e, `${key}_total`, item.id)}
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
    mid_final_grade: { label: 'Semester 1 Final', type: 'number', func: formatValue },
    mid_quarter_remarks: { label: 'Passed', type: 'string' },
    quarter_3: { label: 'Q3', type: 'number', func: formatValue },
    help_q3: { label: 'Help', type: 'func', func: formatValue },
    attendance_quarter_3: { label: 'Attendance', type: 'func', func: formatValue },
    quarter_4: { label: 'Q4', type: 'number', func: formatValue },
    help_q4: { label: 'Help', type: 'func', func: formatValue },
    attendance_quarter_4: { label: 'Attendance', type: 'func', func: formatValue },
    final_grade: { label: 'Semester 2 Final', type: 'number', func: formatValue },
    final_quarter_remarks: { label: 'Passed', type: 'string' },
    year_final_grade: { label: 'Year Final', type: 'number', func: formatValue }
  }

  const otherFieldKeys = {
    gpa_sem_1: { type: 'float' },
    gpa_sem_2: { type: 'float' },
    gpa_final: { type: 'float' },
    mid_student_rank: { type: 'int' },
    final_student_rank: { type: 'int' }
  }

  const colArr = Object.entries(columns)

  const emptyGrade = Object.keys(gradeKeys).reduce((acc, curr) => ({ ...acc, [curr]: '' }), {})
  const [grades, setGrades] = useState([{ id: uuid(), ...emptyGrade }])
  const [deletedGrades, setDeletedGrades] = useState([])
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
    { id: uuid(), ...emptyGrade, student_grade_cumulative_id: data.student_grade_cumulative_id }
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
    const deletedGradeIds =  grades.filter(e => selected.includes(e.id)).map(e => e.student_grades_id);

    setDeletedGrades([...(deletedGradeIds || [])]);

    setGrades(grades.filter(e => !selected.includes(e.id)))
  }

  const handleSave = () => {
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
      }, {});

   
    const defaultGradeIds = data.grades ? data.grades.map(item => item.student_grades_id).filter(id => id) : [];
    const updatedGrades = grades.map(item => {
      return {
        ...item,
        student_grade_cumulative_id: data.student_grade_cumulative_id
      }
    });
    onSaveGrade(updatedGrades, newOtherFields, defaultGradeIds);

  }

  useEffect(() => {
    if (data?.grades && data?.grades.length) {
      setGrades((data?.grades || []).map(e => ({ ...e, id: uuid() })))
    }
    if (Object.keys(data).length) {
      setOtherFields(Object.keys(otherFieldKeys).reduce((acc, curr) => ({ ...acc, [curr]: data[curr] }), {}))
    }
  }, [data])

  useEffect(() => {
    if (!grades.length) {
      setHasChanged(false)
    }
  }, [grades])

  return ReactDOM.createPortal(
    <EditGradeDialogStyled
      data-testid='app-big-calendar-create-modal'
      className='modal'>
      <div className='modal-content'>
        <div className='modal-header'>
          <h2>Edit Grades</h2>
          <span className="close" onClick={() => onClose(hasChanged)}>
            &times;
          </span>
        </div>

        <div className='modal-container'>
          <div id='gradeListTableWrapper'>
            <table id='gradeInputView-table'>
              <thead>
                <tr>
                  <th colSpan='2'>Input By</th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>Auto Value here</th>
                  <th></th>
                  <th></th>
                  <th>Auto Value here</th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
                <tr>
                  <th colSpan='2'>Approved By</th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>Auto Value here</th>
                  <th></th>
                  <th></th>
                  <th>Auto Value here</th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
                <tr>
                  <th colSpan='2'>GPA</th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>
                    <input
                      id='gpa_sem_1'
                      type='number'
                      value={otherFields.gpa_sem_1}
                      onChange={handleChangeOtherFields}
                    />
                  </th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
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
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>
                    <input
                      id='mid_student_rank'
                      type='number'
                      value={otherFields.mid_student_rank}
                      onChange={handleChangeOtherFields}
                    />
                  </th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>
                    <input
                      disabled={isParent}
                      id='final_student_rank'
                      type='number'
                      value={otherFields.final_student_rank}
                      onChange={handleChangeOtherFields}
                    />
                  </th>
                  <th></th>
                  <th></th>
                </tr>
                <tr className='row-header'>
                  <th>
                    <input
                      type='checkbox'
                      checked={selected.length && selected.length === grades.length}
                      onChange={handleSelectAll}
                    />
                  </th>
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
                                      value={row[key] || ''}
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
          <div className='gradeInputView-table-actions'>
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
