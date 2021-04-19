import React, { useEffect, useState } from 'react'
import moment from 'moment'
import update from 'immutability-helper'
import CustomSelect from '../../../CustomComponents/CustomSelect'

export default ({ rows: propRows, testOptions }) => {
  const gradeTakenOptions = [
    { value: 1, label: '1st' }, { value: 2, label: '2nd' }, { value: 3, label: '3rd' },
    ...Array(9).fill().map((e, i) => ({ value: i+4, label: `${i + 4}th` }))
  ]

  const highSchoolOptions = [
    { value: 9, label: 'Freshman' }, { value: 10, label: 'Sophomore' }, { value: 11, label: 'Junior' }, { value: 12, label: 'Senior' }
  ]

  const [rows, setRows] = useState([])
  const [enableEdit, setEnableEdit] = useState(false)
  const [cumGradeOptions, setCumGradeOptions] = useState([])

  const formatValue = (row, key) => {
    switch(key) {
      case 'year_level':
        if (row.year_level > 8) {
          return (highSchoolOptions.find(e => e.value == row.year_level) || {}).label || '--'
        }
        return (gradeTakenOptions.find(g => g.value === row.year_level) || {}).label || '--'
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

  const columns = {
    year_level: { type: 'string', label: 'Grade', func: formatValue, editable: false },
    year: { type: 'string', label: 'Year', func: formatValue, editable: false },
    beg_cum: { type: 'number', label: 'Beg Cum', editable: false },
    gpa_sem_1: { type: 'number', label: 'Sem 1', editable: false },
    mid_student_rank: { type: 'number', label: 'Rank' },
    gpa_sem_2: { type: 'number', label: 'Sem 2' },
    final_student_rank: { type: 'number', label: 'Rank' },
    attendance: { type: 'number', label: 'Attendance', func: formatValue },
    school_type: { type: 'number', label: 'School Type' },
    school_name: { type: 'number', label: 'School' },
  }

  const handleInputChange = ({ target: { value } }, id, key) => {
    setRows(update(rows, {
      [rows.findIndex(e => e.id === id)]: { $merge: { [key]: value } }
    }))
  }

  const handleSelectCumGrade = ({ target: { value } }) => {
    const row = propRows.find(e => e.student_grade_cumulative_id == value)
    setRows(row ? [row] : [])
  }

  useEffect(() => {
    if (propRows && propRows.length) {
      setRows([propRows[0]])
      setCumGradeOptions(propRows.map(e => {
        const gradeNumth = (gradeTakenOptions.find(g => g.value === e.year_level) || {}).label || ''
        return {
          value: e.student_grade_cumulative_id, label: `${gradeNumth} Grade Cumulative`
        }
      }))
    }
  }, [propRows])

  return (
    <div className='standardTestTable'>
      <div>
        <CustomSelect
          value={rows[0]?.student_grade_cumulative_id || ''}
          options={cumGradeOptions}
          placeholder='Select Grade Level'
          onChange={handleSelectCumGrade}
        />
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