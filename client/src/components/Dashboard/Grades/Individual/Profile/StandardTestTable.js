import React, { useEffect, useState } from 'react'
import { uuid } from 'uuidv4'
import moment from 'moment'
import update from 'immutability-helper'

export default ({ rows: propRows, testOptions }) => {
  const [enableEdit, setEnableEdit] = useState(false)
  const [rows, setRows] = useState([])

  const formatValue = (row, key) => {
    switch(key) {
      case 'test_name':
        return (testOptions.find(e => e.value === row.test_name) || {}).label || '--'
      case 'month_taken':
        return row.month_taken ? moment(new Date(row.month_taken)).format('MMMM YYYY') : '--'
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

  const columns = {
    test_name: { type: 'string', label: 'Test name', func: formatValue, editable: false },
    month_taken: { type: 'string', label: 'Taken', func: formatValue, editable: false },
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
  }, [propRows])

  return (
    <div className='standardTestTable'>
      <div>
        Standard Test
        {/* {
          !enableEdit ? (
            <button
              onClick={() => setEnableEdit(true)}
            >
              <FontAwesomeIcon className='back-icon' icon={faPencilAlt} />Edit
            </button>
          ) : (
            <button
              onClick={() => setEnableEdit(false)}
            >
              <FontAwesomeIcon className='back-icon' icon={faCheck} />Save
            </button>
          )
        } */}
      </div>
      <table>
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
                                  <input
                                    type={type === 'number' ? 'number' : 'text'}
                                    value={row[key]}
                                    onChange={(e) => handleInputChange(e, row.id, key)}
                                  />
                                ) : (
                                  row[key] || '--'
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
  )
}