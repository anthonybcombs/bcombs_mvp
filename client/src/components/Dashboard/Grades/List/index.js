import React, { useEffect, useState } from 'react'
import cloneDeep from 'lodash.clonedeep'
import orderBy from 'lodash.orderby'
import { Link } from '@reach/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'

import GradesStyled from './styles'
import Headers from '../Headers'
import { FilterOptionsObj } from '../Headers/options'
import { useSelector, useDispatch } from 'react-redux'

import Loading from '../../../../helpers/Loading.js'
import { getGpaCum } from '../utils'

import { requestVendor } from '../../../../redux/actions/Vendors'
import { requestGetStudentCumulativeGradeByAppGroup  } from '../../../../redux/actions/Grades'

export default () => {
  const dispatch = useDispatch()
  const { gradeInput } = useSelector(({ gradeInput }) => ({
    gradeInput
  }))
  console.log('galdkfjasdf', gradeInput)
  const gradeList = (gradeInput?.gradeList || [])
    .map(grade => {
      const { firstName, lastName, cumulative_grades } = grade
      const hasCumGrades = !!cumulative_grades.length
      return {
        ...grade,
        name: `${firstName} ${lastName}`,
        school_type: hasCumGrades ? cumulative_grades[0].school_type : '', //string
        grade_level: hasCumGrades ? cumulative_grades[0].year_level : '', //number
        
      }
    })

  const data = cloneDeep([
    {
      id: '1',
      name: 'John Doe',
      schoolType: 'Middle School',
      gradeLevel: '6th',
      gpa: '3.2 (2.6)',
      attendanceSummary: '85% (34/40)',
      math: 'A',
      mathNumber: 99,
      science: 'B',
      scienceNumber: 90,
      english: 'C',
      englishNumber: 80,
      history: 'B',
      historyNumber: 90,
      act1: 0,
      act2: 2,
      sat: 12
    },
    {
      id: '2',
      name: 'John Smith',
      schoolType: 'Middle School',
      gradeLevel: '5th',
      gpa: '3.3 (3.6)',
      attendanceSummary: '95% (35/40)',
      math: 'B',
      mathNumber: 90,
      science: 'B',
      scienceNumber: 90,
      english: 'A',
      englishNumber: 99,
      history: 'A',
      historyNumber: 99,
      act1: 0,
      act2: 3,
      sat: 10
    },
    {
      id: '3',
      name: 'Smith Legend',
      schoolType: 'High School',
      gradeLevel: '8th',
      gpa: '1.2 (1.6)',
      attendanceSummary: '95% (30/40)',
      math: 'A',
      mathNumber: 99,
      science: 'A',
      scienceNumber: 99,
      english: 'A',
      englishNumber: 99,
      history: 'A',
      historyNumber: 99,
      act1: 0,
      act2: 4,
      sat: 20
    },
    {
      id: '4',
      name: 'John Legend',
      schoolType: 'Middle School',
      gradeLevel: '4th',
      gpa: '3.1 (2.1)',
      attendanceSummary: '75% (31/40)',
      math: 'C',
      mathNumber: 80,
      science: 'C',
      scienceNumber: 80,
      english: 'B',
      englishNumber: 90,
      history: 'C',
      historyNumber: 80,
      act1: 0,
      act2: 1,
      sat: 15
    },
    {
      id: '5',
      name: 'Legend Doe',
      schoolType: 'High School',
      gradeLevel: '9th',
      gpa: '2.5 (1.6)',
      attendanceSummary: '89% (20/40)',
      math: 'A',
      mathNumber: 99,
      science: 'B',
      scienceNumber: 90,
      english: 'A',
      englishNumber: 99,
      history: 'B',
      historyNumber: 90,
      act1: 0,
      act2: 1,
      sat: 9
    },
    {
      id: '6',
      name: 'John Doe',
      schoolType: 'High School',
      gradeLevel: '10th',
      gpa: '1.1 (1.1)',
      attendanceSummary: '98% (31/40)',
      math: 'A',
      mathNumber: 99,
      science: 'A',
      scienceNumber: 99,
      english: 'A',
      englishNumber: 99,
      history: 'A',
      historyNumber: 99,
      act1: 0,
      act2: 1,
      sat: 1
    },
  ])

  const initialColumns = {
    name: { type: 'string', label: 'Name' },
    schoolType: { type: 'string', label: 'School Type' },
    gradeLevel: { type: 'string', label: 'Grade Level' },
    gpa: { type: 'string', label: 'GPA Cum(semester)' },
    attendanceSummary: { type: 'string', label: 'Attendance Summary' },
    math: { type: 'string', label: 'Math' },
    mathNumber: { type: 'number', label: 'Math (%)' },
    science: { type: 'string', label: 'Science' },
    scienceNumber: { type: 'number', label: 'Science (%)' },
    english: { type: 'string', label: 'English' },
    englishNumber: { type: 'number', label: 'English (%)' },
    history: { type: 'string', label: 'History' },
    historyNumber: { type: 'number', label: 'History (%)' },
    act1: { type: 'number', label: 'Act 1' },
    act2: { type: 'number', label: 'Act 2' },
    sat: { type: 'number', label: 'SAT' },
  }

  const gradeDisplayCount = 3

  const [columns, setColumns] = useState(cloneDeep(initialColumns))
  const [rows, setRows] = useState(data)
  const [gradeCounter, setGradeCounter] = useState(gradeDisplayCount)
  const [filterFromHeaders, setFilterFromHeaders] = useState({})
  const [activeColumnKey, setActiveColumnKey] = useState('')
  const [showGradeOptions, setShowGradeOptions] = useState(false)
  const [gradeType, setGradeType] = useState('string')

  const gradeColumns = {
    string: ['math', 'science', 'english', 'history'],
    number: ['mathNumber', 'scienceNumber', 'englishNumber', 'historyNumber']
  }

  const generateColumnFilters = () => {
    let newColumnFilters = {}
    Object.keys(initialColumns).forEach(key => {
      newColumnFilters[key] = data
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
  const [columnFilterSearch, setColumnFilterSearch] = useState(null)
  
  let activeGradeColumns = gradeColumns[gradeType].slice(gradeCounter - gradeDisplayCount, gradeCounter)
  if (activeGradeColumns.length < gradeDisplayCount) {
    activeGradeColumns = gradeColumns[gradeType].slice(gradeColumns[gradeType].length - gradeDisplayCount, gradeColumns[gradeType].length)
  }

  const activeColumns = (type) => ['name', 'schoolType', 'gradeLevel', 'gpa', 'attendanceSummary', ...gradeColumns[type], 'act1', 'act2', 'sat']
  
  const handleSetRowAndColumn = (type) => {
    const newRows = cloneDeep(data)
      .reduce((acc, curr) => {
        const newType = type === 'number' ? 'string' : 'number'
        gradeColumns[newType].forEach(e => {
          delete curr[e]
        })
        acc.push(curr)
        return acc
      }, [])
    const newColumns = activeColumns(type)
      .reduce((acc, curr) => {
        acc[curr] = initialColumns[curr]
        return acc
      }, {})
    setRows(newRows)

    setColumns(newColumns)
  }
  
  const handleApplyFilter = (filters) => {
    const { sort, search = '' } = cloneDeep(filters)

    // Search always executes for the data to reset even if search is empty
    let newRows = cloneDeep(data).filter(({ id, ...rest }) => {
      const itemEntries = Object.entries(rest)
      return itemEntries.find(([key, val]) => {
        const isDate = columns[key]?.type === 'date'
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

    // Column filter
    newRows = newRows.filter(({ id, ...rest}) => {
      const rowArr = Object.entries(rest)
      return rowArr.filter(([key, value]) => !!columnFilters[key].find(e => (e.checked && e.value === value))).length === rowArr.length
    })

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
          <td className='subHeader'>
            <table className='subTable student'>
              <tr>
                <td style={{ ...highLight(name, 'name'), minWidth: '100px', wordBreak: 'break-word'}}>
                  <Link to={`/dashboard/grades/${row.id}`}>
                    {name}
                  </Link>
                </td>
                <td style={{ ...highLight(schoolType, 'schoolType'), minWidth: '100px', wordBreak: 'break-word'}}>{schoolType}</td>
                <td style={{ ...highLight(gradeLevel, 'gradeLevel'), minWidth: '100px', wordBreak: 'break-word'}}>{gradeLevel}</td>
                <td style={{ ...highLight(gpa, 'gpa'), minWidth: '50px', wordBreak: 'break-word'}}>{gpa}</td>
                <td style={{ ...highLight(attendanceSummary, 'attendanceSummary'), minWidth: '100px', wordBreak: 'break-word'}}>{attendanceSummary}</td>
              </tr>
            </table>
          </td>
          <td className='subHeader'>
            <table className='subTable'>
              <tr>
                {
                  activeGradeColumns.map(e => {
                    // const gradeValue = 
                    return <td style={{ ...highLight(row[e], e), width: '25%' }}>{gradeType === 'number' ? `${row[e]}%` : row[e]}</td>
                  })
                }
              </tr>
            </table>
          </td>
          <td className='subHeader'>
            <table className='subTable'>
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

  const handlePrepareColumnFilter = ({ target: { checked, value } }, key, isGrade) => {
    const newFilters = (columnFilters[key] || [])
      .map(e => {
        return { ...e, checked: e.value == value ? checked : e.checked }
      })

    setColumnFilters({
      ...columnFilters,
      [key]: newFilters
    })
  }

  const handleSetActiveColumnKey = (key = '') => {
    setActiveColumnKey(key)
    setColumnFilterSearch('')
    setShowGradeOptions(false)
  }

  const handleChangeTableFilterColumn = (key) =>{
    setPreviousColumnFilters(cloneDeep(columnFilters)) // saves the previous table filter
    handleSetActiveColumnKey(key)
  }

  const handleSelectAllColumFilter = ({ target: { checked } }, key) => {
    setColumnFilters({
      ...columnFilters,
      [key]: columnFilters[key].map(e => ({ ...e, checked }))
    })
  }

  const handleSetGradeType = (type) => {
    setGradeType(type)
    handleSetRowAndColumn(type)
  }

  const renderTableFilter = (key, isGrade = false) => {
    if (activeColumnKey && activeColumnKey === key) {
      const currColumnFilter = columnFilters[key]
      return (
        <div
          style={{ position: 'absolute', backgroundColor: '#fff', zIndex: 2 }}
          className='filterDropdwon'
          onClick={e => e.stopPropagation()}
        >
          <div className='filter-search'>
            <input
              placeholder='Search'
              className='field-input'
              value={columnFilterSearch}
              onChange={(e) => setColumnFilterSearch(e.target.value)}
            />
          </div>
          <div className='filter-option'>
            <label htmlFor={`${key}_selectAll`} className='checkboxContainer'>
              <input
                type='checkbox'
                id={`${key}_selectAll`}
                checked={currColumnFilter.length === currColumnFilter.filter(e => e.checked).length}
                onChange={(e) => handleSelectAllColumFilter(e, key)}
              />
              <span className='checkmark' />
              <span className='labelName'>Select All</span>
            </label>
          </div>
          {
            (columnFilterSearch ? currColumnFilter.filter(e => e.value.toLowerCase().includes(columnFilterSearch.toLowerCase())) : currColumnFilter)
              .map(({ value, checked }, index) => {
                const valueID = (value.toString()).replace(/\s/g, '')
                return (
                  <div id={`${index}`} className='filter-option'>
                    <label htmlFor={`${key}_${valueID}_${index}`} className='checkboxContainer'>
                      <input
                        type='checkbox'
                        id={`${key}_${valueID}_${index}`}
                        value={value}
                        checked={checked}
                        onChange={(e) => handlePrepareColumnFilter(e, key, isGrade)}
                      />
                      <span className='checkmark' />
                      <span className='labelName'>{value}</span>
                    </label>
                  </div>
                )
              })
          }
          <div className='actions'>
            <button
              className='cancel'
              onClick={() => {
                setColumnFilters(previousColumnFilters)
                handleSetActiveColumnKey()
              }}
            >
              Cancel
            </button>
            <button
              className='apply'
              disabled={columnFilters[key].filter(e => e.checked).length === 0}
              onClick={() => {
                if (columnFilters[key].filter(e => e.checked).length > 0) {
                  handleApplyFilter(filterFromHeaders)
                  handleSetActiveColumnKey()
                }
              }}
            >
              Apply
            </button>
          </div>
        </div>
      )
    }
    return null
  }

  useEffect(() => {
    handleSetRowAndColumn(gradeType)
    dispatch(requestGetStudentCumulativeGradeByAppGroup({
      app_group_id: '0edbc431-eeef-11ea-8212-dafd2d0ae3ff',
      app_group_type: 'bcombs'
    }))
  }, [])

  return (
    <GradesStyled>
      <h2>Grade List Views</h2>
      <div
        id='gradeListView'
        onClick={() => {
          handleSetActiveColumnKey()
          setShowGradeOptions(false)
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
          <Link
            className='applyFilterBtn'
            to={`/dashboard/grades/input`}
          >
            {`Grades & Test Input`}
          </Link>
          {/* <button
            className='applyFilterBtn'
            onClick={() => window.history.push()}
          >
            {`Grades & Test Input`}
          </button> */}
        </div>
        <div id='gradeListTableWrapper'>
          <table id='gradeListView-table'>
            <tbody>
              <tr>
                <th>Student</th>
                <th className='th-grades'>
                  Grades
                  <FontAwesomeIcon
                    icon={faCaretDown}
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowGradeOptions(!showGradeOptions)
                      setActiveColumnKey('')
                    }}
                  />
                  {
                    showGradeOptions && (
                      <div className='gradesFilter'>
                        <div className='header'>Select grade type</div>
                        <label htmlFor='letters' className='radioButtonContainer'>
                          <input
                            type='radio'
                            id='letters'
                            checked={gradeType === 'string'}
                            onChange={() => handleSetGradeType('string')}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className='labelName'>Letters</span>
                        </label>
                        
                        <label htmlFor='numbers' className='radioButtonContainer'>
                          <input
                            type='radio'
                            id='numbers'
                            checked={gradeType === 'number'}
                            onChange={() => handleSetGradeType('number')}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className='labelName'>Numbers</span>
                        </label>
                      </div>
                    )
                  }
                </th>
                <th>Standard Test</th>
              </tr>

              <tr>
                <td className='subHeader'>
                  <table className='subTable student'>
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

                <td className='subHeader'>
                  <table className='subTable'>
                    <tr>
                      {/* <td style={{ width: '25%' }}>Grade</td> */}
                      {
                        activeGradeColumns.map((e, index) => {
                          const isFirst = index === 0
                          const isLast = index === (gradeDisplayCount - 1)
                          const showFirst = isFirst && gradeCounter > activeGradeColumns.length
                          const showLast = isLast && gradeColumns[gradeType].length > gradeCounter
                          return (
                            <td style={{ width: '25%' }} key={`subjectCol-${index}`}>
                              {
                                showFirst && (
                                  <span style={{ cursor: 'pointer', marginRight: '1rem' }} onClick={() => setGradeCounter(gradeCounter - gradeDisplayCount)} >
                                    <FontAwesomeIcon icon={faAngleLeft}/>
                                  </span>
                                )
                              }
                              {columns[e]?.label || e}
                              <FontAwesomeIcon
                                icon={faCaretDown}
                                onClick={(event) => {
                                  event.stopPropagation()
                                  handleChangeTableFilterColumn(e)
                                }}
                              />
                              {renderTableFilter(e, true)}
                              {
                                showLast && (
                                  <span style={{ cursor: 'pointer', marginLeft: '1rem' }} onClick={() => setGradeCounter(gradeCounter + gradeDisplayCount)} >
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

                <td className='subHeader'>
                  <table className='subTable'>
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
          {
            rows.length === 0 && (
              <div>No records.</div>
            )
          }
        </div>
      </div>
    </GradesStyled>
  )
}
