import React, { useEffect, useState } from 'react'
import moment from 'moment'
import update from 'immutability-helper'

const TABLE = (data) => {
  const { rows, columns, year_level, school_year_start, school_year_end, gradeTakenOptions, enableEdit, handleInputChange, attendanceColumns } = data
  return (
    <table>
      <thead>
        <tr>
          <th colSpan={Object.keys(columns).length}>
            {(gradeTakenOptions.find(e => e.value === year_level) || {}).label}
            Grade
            ({moment(school_year_start).format('YY')}/{moment(school_year_end).format('YY')})
          </th>
        </tr>
        <tr>
          {
            Object.values(columns).map(({ label }, index) => {
              return (<th key={`st-th-${index}`}>{label}</th>)
            })
          }
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Attendance</td>
          <td></td>
          {
            attendanceColumns.map(e => (
              <td>--</td>
            ))
          }
        </tr>
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
  )
}

export default ({ rows: propRows, testOptions }) => {
  const gradeTakenOptions = [
    { value: 1, label: '1st' }, { value: 2, label: '2nd' }, { value: 3, label: '3rd' },
    ...Array(9).fill().map((e, i) => ({ value: i+4, label: `${i + 4}th` }))
  ]

  const [rows, setRows] = useState([])
  const [enableEdit, setEnableEdit] = useState(false)

  const formatValue = (row, key) => {
    switch(key) {
      case 'year':
        return `${moment(row.school_year_start).format('YY')}/${moment(row.school_year_end).format('YY')}`
      case 'beg_cum':
        const prevYL = row.year_level - 1
        return (rows.find(e => e.year_level === prevYL) || {}).gpa_final || '--'
      case 'attendance':
        return (row?.grades || [])[0]?.final_quarter_attendance || '--'
      default:
        return ''
    }
  }

  const semColumns = {
    class: { type: 'string', label: 'Class', editable: false },
    subject: { type: 'string', label: 'Subject', editable: false },
    letter_grade_quarter_1: { type: 'number', label: 'Q1', editable: false },
    letter_grade_quarter_2: { type: 'number', label: 'Q2', editable: false },
    letter_mid_final_grade: { type: 'number', label: 'Final' },
    letter_grade_quarter_3: { type: 'number', label: 'Q1', editable: false },
    letter_grade_quarter_4: { type: 'number', label: 'Q2', editable: false },
    letter_final_grade: { type: 'number', label: 'Final' },
    letter_year_final_grade: { type: 'number', label: 'Year Final' },
  }

  const quarterColumns = {
    class: { type: 'string', label: 'Class', editable: false },
    subject: { type: 'string', label: 'Subject', editable: false },
    letter_grade_quarter_1: { type: 'number', label: 'Q1', editable: false },
    letter_grade_quarter_2: { type: 'number', label: 'Q2', editable: false },
    letter_grade_quarter_3: { type: 'number', label: 'Q1', editable: false },
    letter_year_final_grade: { type: 'number', label: 'Year Final' },
  }

  const handleInputChange = ({ target: { value } }, id, key) => {
    setRows(update(rows, {
      [rows.findIndex(e => e.id === id)]: { $merge: { [key]: value } }
    }))
  }

  useEffect(() => {
    if (propRows && propRows.length) {
      setRows(propRows)
    }
  }, [propRows])

  return (
    <div className='standardTestTable'>
      {
        rows.map(({ grades, ...rest }, gi) => {
          return (
            <>
              <div key={`individual-grades-${gi}`}>
                <div>Individual Grades (Semester)</div>
                <TABLE
                  {...rest}
                  rows={grades}
                  columns={semColumns}
                  gradeTakenOptions={gradeTakenOptions}
                  enableEdit={enableEdit}
                  handleInputChange={handleInputChange}
                  attendanceColumns={['attendance_quarter_1_total', 'attendance_quarter_2_total', 'mid_final_attendance', 'attendance_quarter_3_total', 'attendance_quarter_4_total', 'final_attendance', 'final_quarter_attendance']}
                />
              </div>

              <div>
                <div>Individual Grades (Quarter)</div>
                <TABLE
                  {...rest}
                  rows={grades}
                  columns={quarterColumns}
                  gradeTakenOptions={gradeTakenOptions}
                  enableEdit={enableEdit}
                  handleInputChange={handleInputChange}
                  attendanceColumns={['attendance_quarter_1_total', 'attendance_quarter_2_total', 'attendance_quarter_3_total', 'final_quarter_attendance']}
                />
              </div>
            </>
          )
        })
      }
    </div>
  )
}