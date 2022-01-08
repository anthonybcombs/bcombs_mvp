import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { uuid } from 'uuidv4'
import moment from 'moment'
import cloneDeep from 'lodash.clonedeep'
import update from 'immutability-helper'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faPencilAlt, faCheck, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import DatePicker from "react-datepicker";

import { requestAddUpdateStudentStandardizedTest, requestDeleteStudentStandardizedTest, clearGrades } from '../../../../../redux/actions/Grades'


export default ({ rows: propRows, testOptions }) => {
  const dispatch = useDispatch();
  const { gradeInput, loading: { gradeLoading } } = useSelector(({ gradeInput, loading }) => {
    return {
      gradeInput,
      loading
    }
  });

  const [enableEdit, setEnableEdit] = useState(false)
  const [rows, setRows] = useState([])

  const formatValue = (row, key) => {
  
    switch (key) {
      case 'test_name':
        return (testOptions.find(e => e.value === row.test_name) || {}).label || '--'
      case 'month_taken':
        return row.month_taken ? moment(new Date(row.month_taken)).format('MMMM YYYY') : null
      case 'score_percentage':
      case 'school_percentage':
      case 'district_percentage':
      case 'state_percentage':
      case 'nationality_percentage':
        return enableEdit ? (
          <input
            type='number'
            value={row[key] || ''}
            onChange={(e) => handleInputChange(e, row.id, key)}
          />
        ) : (
          row[key] ? `${row[key]}%` : '--'
        )
      default:
        return ''
    }
  }


  const goldenKeys = {
    student_test_id: { type: 'int' },
    child_id: { type: 'string' },
    test_name: { type: 'string' },
    attempt: { type: 'int' },
    grade_taken: { type: 'int' },
    month_taken: { type: 'date' },
    score: { type: 'int' },
    score_percentage: { type: 'float' },
    ach_level: { type: 'int' },
    school_percentage: { type: 'float' },
    nationality_percentage: { type: 'float' },
    district_percentage: { type: 'float' },
    state_percentage: { type: 'float' },
    attachment: { type: 'attachment' }
  }

  const columns = {
    test_name: { type: 'string', label: 'Test name', func: formatValue, editable: false },
    month_taken: { type: 'date', label: 'Taken'  },
    attempt: { type: 'number', label: 'Attempt', editable: false },
    grade_taken: { type: 'number', label: 'Grades', editable: false },
    score: { type: 'number', label: 'Score' },
    ach_level: { type: 'number', label: 'Ach level' },
    score_percentage: { type: 'number', label: '%', func: formatValue },
    school_percentage: { type: 'number', label: '% school', func: formatValue },
    district_percentage: { type: 'number', label: '% district', func: formatValue },
    state_percentage: { type: 'number', label: '% state', func: formatValue },
    nationality_percentage: { type: 'number', label: '% nationally', func: formatValue }
  }

  const handleInputChange = ({ target: { value } }, id, key) => {
    setRows(update(rows, {
      [rows.findIndex(e => e.id === id)]: { $merge: { [key]: value } }
    }))
  }

  useEffect(() => {
    if (propRows && propRows.length) {
      setRows(propRows.map(e => ({ ...e, id: uuid() })))
    }
  }, [propRows]);


  const handleCancel = () => {
    if (propRows && propRows.length) {
      setRows(propRows.map(e => ({ ...e, id: uuid() })))
    }
    setEnableEdit(false);
  }

  const handleSave = () => {
    const newRows = cloneDeep(rows)
      .map(e => {
        let newRow = Object.entries(goldenKeys)
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

        if (!newRow.student_test_id) {
          delete newRow.student_test_id
        }
        if (!newRow.attachment || (newRow.attachment && typeof newRow.attachment === 'string')) {
          delete newRow.attachment
        }
        if (newRow.month_taken) {
          newRow.month_taken = newRow.month_taken && !isNaN(newRow.month_taken) ? moment(new Date(parseInt(newRow.month_taken))).format('yyyy-MM-DD') : moment(new Date(newRow.month_taken)).format('yyyy-MM-DD')
        }
        return newRow
      })
    dispatch(requestAddUpdateStudentStandardizedTest(newRows))
    setEnableEdit(false);
  }

  return (
    <div className='rightContainer'>
      <div className='rightContainerHeader'>
        <span className='header'>Standard Test</span>
        <div style={{ paddingTop: 12 }}>
          {
            !enableEdit ? (
              rows.length > 0 && 
              <button
                onClick={() => setEnableEdit(true)}

              >
                <FontAwesomeIcon className='back-icon' icon={faPencilAlt} />Edit
              </button>
            ) : (
              <>
              <button
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                {`  `}
                <button
                onClick={handleSave}
              >
                <FontAwesomeIcon className='back-icon' icon={faCheck} />Save
              </button>
                </>
            
            )
          }
        </div>

      </div>

      <div className='tableWrapper'>
        <table className='profileTrackingTable standardTestTable'>
          <thead>
            <tr>
              {
                Object.values(columns).map(({ label }, index) => {
                  return (<th key={`st-th-${index}`}>{label}</th>)
                })
              }
            </tr>
          </thead>
          <tbody>
            {
              rows.length > 0 ? (
                rows.map((row, index) => {
                  return (
                    <tr key={`tr-ct-${index}`}>
                      {
                        Object.entries(columns).map(([key, { func = null, type, editable = true }]) => {
                          

                          return (
                            <td key={`td-ct-${key}-${index}`}>
                              {
                                func ? (
                                  func(row, key)
                                ) : (
                                  (enableEdit && editable) ? (

                                    type === 'date' ?
                                      
                                        <DatePicker
                                          selected={row[key] && row[key] !== '' ? isNaN(row[key]) ? new Date(row[key]) : parseInt(row[key]) : ''}
                                          onChange={date => {
                                             handleInputChange({ target: { value: date.toISOString() } },  row.id, key)
                                          }}
                                          dateFormat='MM/yyyy'
                                          showMonthYearPicker
                                          showFullMonthYearPicker
                                        />
                                      
                                     : 
                                    <input
                                      type={type}
                                      value={row[key]}
                                      onChange={(e) => handleInputChange(e, row.id, key)}
                                    />
                                  ) : (
                                    type === 'date' ?  moment( isNaN(row[key]) ? new Date(row[key]) : parseInt(row[key])).format('MMMM YYYY') : row[key] || '--'
                                  )
                                )
                              }
                            </td>
                          )
                        })
                      }
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={Object.keys(columns).length}>
                    No Records
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>

    </div>
  )
}