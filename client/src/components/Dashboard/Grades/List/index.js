import React, { useEffect, useState } from 'react'
import cloneDeep from 'lodash.clonedeep'
import orderBy from 'lodash.orderby'
import isEqual from 'lodash.isequal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'

import GradesStyled from './styles'
import Headers from '../Headers'
import { FilterOptionsObj } from '../Headers/options'
import CustomSelect from '../../CustomComponents/CustomSelect'

import Loading from '../../../../helpers/Loading.js'

import { useSelector, useDispatch } from 'react-redux'

import { requestVendor } from '../../../../redux/actions/Vendors'

export default ({ form_id, type, history }) => {
  const data = cloneDeep([
    {
      name: 'John Doe',
      schoolType: 'Middle School',
      gradeLevel: '6th',
      gpa: '3.2(2.6)',
      attendanceSummary: '85% (34/40)',
      math: 'A',
      science: 'B',
      english: 'C',
      history: 'B',
      act1: 0,
      act2: 2,
      sat: 12
    },
    {
      name: 'John Smith',
      schoolType: 'Middle School',
      gradeLevel: '5th',
      gpa: '3.3(3.6)',
      attendanceSummary: '95% (35/40)',
      math: 'B',
      science: 'B',
      english: 'A',
      history: 'A',
      act1: 0,
      act2: 3,
      sat: 10
    },
    {
      name: 'Smith Legend',
      schoolType: 'High School',
      gradeLevel: '8th',
      gpa: '1.2(1.6)',
      attendanceSummary: '95% (30/40)',
      math: 'A',
      science: 'A',
      english: 'A',
      history: 'A',
      act1: 0,
      act2: 4,
      sat: 20
    },
    {
      name: 'John Legend',
      schoolType: 'Middle School',
      gradeLevel: '4th',
      gpa: '3.1(2.1)',
      attendanceSummary: '75% (31/40)',
      math: 'C',
      science: 'C',
      english: 'B',
      history: 'C',
      act1: 0,
      act2: 1,
      sat: 15
    },
    {
      name: 'Legend Doe',
      schoolType: 'High School',
      gradeLevel: '9th',
      gpa: '2.5(1.6)',
      attendanceSummary: '89% (20/40)',
      math: 'A',
      science: 'B',
      english: 'A',
      history: 'B',
      act1: 0,
      act2: 1,
      sat: 9
    },
    {
      name: 'John Doe',
      schoolType: 'High School',
      gradeLevel: '10th',
      gpa: '1.1(1.1)',
      attendanceSummary: '98% (31/40)',
      math: 'A',
      science: 'A',
      english: 'A',
      history: 'A',
      act1: 0,
      act2: 1,
      sat: 1
    },
  ])

  const columns = {
    name: { type: 'string', label: 'Name' },
    schoolType: { type: 'string', label: 'School Type' },
    gradeLevel: { type: 'string', label: 'Grade Level' },
    gpa: { type: 'string', label: 'GPA Cum(semester)' },
    attendanceSummary: { type: 'string', label: 'Attendance Summary' },
    math: { type: 'string', label: 'Math' },
    science: { type: 'string', label: 'Science' },
    english: { type: 'string', label: 'English' },
    history: { type: 'string', label: 'History' },
    act1: { type: 'number', label: 'Act 1' },
    act2: { type: 'number', label: 'Act 2' },
    sat: { type: 'number', label: 'SAT' },
  }
  const subjectColumns = ['math', 'science', 'english', 'history']
  const subjectDisplayCount = 3

  const [rows, setRows] = useState(data)
  const [subjectCounter, setSubjectCounter] = useState(subjectDisplayCount)
  const [filterFromHeaders, setFilterFromHeaders] = useState({})
  const [activeColumnKey, setActiveColumnKey] = useState('')

  const generateColumnFilters = (newRows = null, filters = null) => {
    let newColumnFilters = {}
    Object.keys(columns).forEach(key => {
      newColumnFilters[key] = (newRows || rows)

      if (filters) {
        newColumnFilters[key] = newColumnFilters[key].filter(e => filters.includes(e[activeColumnKey]))
      }
      newColumnFilters[key] = newColumnFilters[key]
        .map(e => e[key])
        .sort()
        .reduce((acc, curr) => {
          if (!acc.find(e => e.value === curr)) {
            acc.push({ value: curr, checked: true })
          }
          return acc
        }, [])
    })
    return newColumnFilters
  }

  const [columnFilters, setColumnFilters] = useState(generateColumnFilters())
  const [previousColumnFilters, setPreviousColumnFilters] = useState(null)
  const [firstColumnFilter, setFirstColumnFilter] = useState('')
  const [columnFilterHistory, setColumnFilterHistory] = useState([generateColumnFilters()])
  
  let activeSubjectColumns = subjectColumns.slice(subjectCounter - subjectDisplayCount, subjectCounter)
  if (activeSubjectColumns.length < subjectDisplayCount) {
    activeSubjectColumns = subjectColumns.slice(subjectColumns.length - subjectDisplayCount, subjectColumns.length)
  }
  const activeColumns = ['name', 'address', 'grade', ...activeSubjectColumns, 'date']
  
  const handleApplyFilter = (filters, columnFilters = null) => {
    const { sort, search = '' } = cloneDeep(filters)

    // Search always executes for the data to reset even if search is empty
    let newRows = cloneDeep(data).filter(({ id, ...rest }) => {
      const itemEntries = Object.entries(rest)
      return itemEntries.find(([key, val]) => {
        const isDate = columns[key].type === 'date'
        if (isDate) {
          return moment(val).format('ll').toString().toLowerCase().includes(search.toLowerCase())
        }
        return ['string', 'number'].includes(typeof val) && val.toString().toLowerCase().includes(search.toLowerCase())
      })
    })

    // Sort executes here
    if (sort && sort.length > 0) {
      const sortColumns = sort.map(e => e.column)
      const sortOrder = sort.map(e => e.value)
      newRows = orderBy(newRows, sortColumns, sortOrder)
    }

    // Sort per table column
    if (columnFilters) {
      // Set column filter history
      const columnIndex = columnFilterHistory.findIndex(e => isEqual(e[activeColumnKey], columnFilters[activeColumnKey]))
      let newColumnFilters = {}
      if (columnIndex !== -1) {
        newColumnFilters = cloneDeep(columnFilterHistory[columnIndex])
      } else {
        newColumnFilters = generateColumnFilters(newRows, columnFilters[activeColumnKey].filter(e => e.checked).map(e => e.value))
      }

      console.log('achay baya', { columnIndex, columnFilterHistory, newColumnFilters, newRows })
      newRows = newRows.filter(e => {
        const rowArr = Object.entries(e)
        return rowArr.filter(([key, value]) => !!newColumnFilters[key].find(e => (e.checked && e.value === value))).length === rowArr.length
      })

      // {
      //   name: 'John Doe',
      //   schoolType: 'High School',
      //   gradeLevel: '10th',
      //   gpa: '1.1(1.1)',
      //   attendanceSummary: '98% (31/40)',
      //   math: 'A',
      //   science: 'A',
      //   english: 'A',
      //   history: 'A',
      //   act1: 0,
      //   act2: 1,
      //   sat: 1
      // }

      if (columnIndex === -1) {
        let newAdjustedColumnFilters = generateColumnFilters(newRows)
        newAdjustedColumnFilters[activeColumnKey] = columnFilters[activeColumnKey]
        setColumnFilters(cloneDeep(newAdjustedColumnFilters))
        setColumnFilterHistory([cloneDeep(newAdjustedColumnFilters), ...columnFilterHistory])
      } else {
        setColumnFilters(cloneDeep(columnFilterHistory[columnIndex]))
      }
    }

    setRows(newRows)

    setFilterFromHeaders(cloneDeep(filters))
  }

  const renderTableData = () => {
    const highlightFilters = filterFromHeaders?.highlight || []
    const { conditions } = FilterOptionsObj.highlight
    return rows.map((row, index) => {
      const { 
        name, schoolType, gradeLevel, gpa, attendanceSummary, act1, act2, sat
      } = row
      const highLight = (rowVal, columnName) => {
        const newFormat = highlightFilters.reduce((acc, { column, condition, value, format }) => {
          const isTrue = column.includes(columnName) && condition && conditions[condition](rowVal, value)
          if (isTrue) {
            return {
              ...acc,
              ...JSON.parse(format)
            }
          }
          return acc
        }, {})
        return newFormat
      }

      return (
        <tr key={`grades-list-${index}`}>
          <td className="subHeader">
            <table className="subTable student">
              <tr>
                <td style={{ ...highLight(name, 'name'), minWidth: '100px', wordBreak: 'break-word'}}>{name}</td>
                <td style={{ ...highLight(schoolType, 'schoolType'), minWidth: '100px', wordBreak: 'break-word'}}>{schoolType}</td>
                <td style={{ ...highLight(gradeLevel, 'gradeLevel'), minWidth: '100px', wordBreak: 'break-word'}}>{gradeLevel}</td>
                <td style={{ ...highLight(gpa, 'gpa'), minWidth: '50px', wordBreak: 'break-word'}}>{gpa}</td>
                <td style={{ ...highLight(attendanceSummary, 'attendanceSummary'), minWidth: '100px', wordBreak: 'break-word'}}>{attendanceSummary}</td>
              </tr>
            </table>
          </td>
          <td className="subHeader">
            <table className="subTable">
              <tr>
                {
                  activeSubjectColumns.map(e => (
                    <td style={{ ...highLight(row[e], e), width: '25%' }}>{row[e]}</td>
                  ))
                }
              </tr>
            </table>
          </td>
          <td className="subHeader">
            <table className="subTable">
              <tr>
                <td style={highLight(act1, 'act1')}>{act1}</td>
                <td style={highLight(act2, 'act2')}>{act2}</td>
                <td style={highLight(sat, 'sat')}>{sat}</td>
              </tr>
            </table>
          </td>
        </tr>
      )
    })
  }

  const getColumnValues = (key) => {
    return (key === firstColumnFilter ? data : rows)
      .reduce((acc, curr) => {
        if (!acc.includes(curr[key])) {
          acc.push(curr[key])
        }
        return acc
      }, [])
      .sort()
  }

  const handlePrepareColumnFilter = ({ target: { checked, value } }, key) => {
    const newFilters = (columnFilters[key] || [])
      .map(e => ({ ...e, checked: e.value === value ? checked : e.checked }))

    setColumnFilters({
      ...columnFilters,
      [key]: newFilters
    })
  }

  const handleChangeTableFilterColumn = (key) =>{
    setPreviousColumnFilters(cloneDeep(columnFilters)) // saves the previous table filter
    // setColumnFilters({
    //   ...columnFilters,
    //   [key]: rows.map(e => e[key])
    // })
    setActiveColumnKey(key)
    
    //Set first table filter if table filter is empty
    // if (!Object.keys(columnFilters).length) {
    //   setFirstColumnFilter(key)
    // }
  }

  const renderTableFilter = (key) => {
    if (activeColumnKey && activeColumnKey === key) {
      return (
        <div
          style={{ position: 'absolute', backgroundColor: '#fff' }}
          onClick={e => e.stopPropagation()}
        >
          {
            columnFilters[key].map(({ value, checked }, index) => {
              return (
                <div id={`${key}_${value}_${index}`}>
                  <label htmlFor={`${key}_${value}_${index}`} className='checkboxContainer'>
                    <input
                      type='checkbox'
                      id={`${key}_${value}_${index}`}
                      value={value}
                      checked={checked}
                      onChange={(e) => handlePrepareColumnFilter(e, key)}
                    />
                    <span className='checkmark' />
                    <span className='labelName'>{value}</span>
                  </label>
                </div>
              )
            })
          }
          <button
            onClick={() => {
              setColumnFilters(previousColumnFilters)
              setActiveColumnKey('')
            }}
          >
            Cancel
          </button>
          <button
            disabled={columnFilters[key].filter(e => e.checked).length === 0}
            onClick={() => {
              if (columnFilters[key].filter(e => e.checked).length > 0) {
                handleApplyFilter(filterFromHeaders, columnFilters)
                setActiveColumnKey('')
              }
            }}
          >
            Apply
          </button>
        </div>
      )
    }
    return null
  }
  console.log('sharooow', { columnFilters, columnFilterHistory })
  return (
    <GradesStyled>
      <h2>Grade List Views</h2>
      <div
        id='gradeListView'
        onClick={() => {
          setActiveColumnKey('')
        }}
      >
        <div className='gradeListFilter'>
          <Headers
            enableClearFilter
            filterOptions={['sort', 'highlight', 'date']}
            columns={columns}
            rows={rows}

            onApplyFilter={handleApplyFilter}
          />
          <button
            className='applyFilterBtn'
            onClick={() => {}}
          >
            {`Grades & Test Input`}
          </button>
        </div>
        <div id='gradeListTableWrapper'>
          <table id='gradeListView-table'>
            <tbody>
              <tr>
                <th>Student</th>
                <th>Grades</th>
                <th>Standard Test</th>
              </tr>

              <tr>
                <td className="subHeader">
                  <table className="subTable student">
                    <tr>
                      <td style={{ minWidth: '100px', whiteSpace: 'initial' }}>
                        <span>Name</span>
                        <FontAwesomeIcon
                          icon={faCaretDown}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleChangeTableFilterColumn('name')
                          }}
                        />
                        {renderTableFilter('name')}
                      </td>
                      <td style={{ minWidth: '100px', whiteSpace: 'initial' }}>
                        School Type
                        <FontAwesomeIcon
                          icon={faCaretDown}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleChangeTableFilterColumn('schoolType')
                          }}
                        />
                        {renderTableFilter('schoolType')}
                      </td>
                      <td style={{ minWidth: '100px', whiteSpace: 'initial' }}>
                        Grade Level
                        <FontAwesomeIcon
                          icon={faCaretDown}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleChangeTableFilterColumn('gradeLevel')
                          }}
                        />
                        {renderTableFilter('gradeLevel')}
                      </td>
                      <td style={{ minWidth: '50px', whiteSpace: 'initial' }}>
                        GPA Cum (Semester)
                        <FontAwesomeIcon
                          icon={faCaretDown}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleChangeTableFilterColumn('gpa')
                          }}
                        />
                        {renderTableFilter('gpa')}
                      </td>
                      <td style={{ minWidth: '100px', whiteSpace: 'initial' }}>
                        Attendance Summary
                        <FontAwesomeIcon
                          icon={faCaretDown}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleChangeTableFilterColumn('attendanceSummary')
                          }}
                        />
                        {renderTableFilter('attendanceSummary')}
                      </td>
                    </tr>
                  </table>
                </td>

                <td className="subHeader">
                  <table className="subTable">
                    <tr>
                      {/* <td style={{ width: '25%' }}>Grade</td> */}
                      {
                        activeSubjectColumns.map((e, index) => {
                          const isFirst = index === 0
                          const isLast = index === (subjectDisplayCount - 1)
                          const showFirst = isFirst && subjectCounter > activeSubjectColumns.length
                          const showLast = isLast && subjectColumns.length > subjectCounter
                          return (
                            <td style={{ width: '25%' }} key={`subjectCol-${index}`}>
                              {
                                showFirst && (
                                  <span style={{ cursor: 'pointer', marginRight: '1rem' }} onClick={() => setSubjectCounter(subjectCounter - subjectDisplayCount)} >
                                    <FontAwesomeIcon icon={faAngleLeft}/>
                                  </span>
                                )
                              }
                              {columns[e]?.label || e}
                              {
                                showLast && (
                                  <span style={{ cursor: 'pointer', marginLeft: '1rem' }} onClick={() => setSubjectCounter(subjectCounter + subjectDisplayCount)} >
                                    <FontAwesomeIcon icon={faAngleRight} />
                                  </span>
                                )
                              }
                            </td>
                          )
                        })
                      }
                    </tr>
                  </table>
                </td>

                <td className="subHeader">
                  <table className="subTable">
                    <tr>
                      <td>
                        Act 1
                        <FontAwesomeIcon icon={faCaretDown}/>
                      </td>
                      <td>
                        Act 2
                        <FontAwesomeIcon icon={faCaretDown}/>
                      </td>
                      <td>
                        SAT
                        <FontAwesomeIcon icon={faCaretDown}/>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              {renderTableData()}
            </tbody>
          </table>
    
        </div>
      </div>
    </GradesStyled>
  )
}
