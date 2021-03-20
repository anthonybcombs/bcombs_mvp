import React, { useEffect, useState } from 'react'
import cloneDeep from 'lodash.clonedeep'
import orderBy from 'lodash.orderby'
import isEqual from 'lodash.isequal'
import { Link } from '@reach/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'

import GradesStyled from './styles'
import Headers from '../Headers'
import { FilterOptionsObj } from '../Headers/options'
import { useSelector, useDispatch } from 'react-redux'

import Loading from '../../../../helpers/Loading.js'

import { requestGetStudentCumulativeGradeByUser, requestGetStudentCumulativeGradeByAppGroup  } from '../../../../redux/actions/Grades'

export default ({ child_id }) => {
  const dispatch = useDispatch()
  const { gradeInput, loading: { gradeLoading } } = useSelector(({ gradeInput, loading }) => ({
    gradeInput, loading
  }))

  const initialColumns = {
    name: { type: 'string', label: 'Name', sortable: false, filterable: false },
    schoolType: { type: 'string', label: 'School Type' },
    gradeLevel: { type: 'string', label: 'Grade Level' },
    attendanceSummary: { type: 'string', label: 'Attendance Summary' },
    gpa: { type: 'string', label: 'GPA Cum(semester)' },
    act1: { type: 'number', label: 'Act 1' },
    act2: { type: 'number', label: 'Act 2' },
    sat: { type: 'number', label: 'SAT' },
  }

  const gradeDisplayCount = 3

  const [data, setData] = useState([])
  const [baseColumns, setBaseColumns] = useState(cloneDeep(initialColumns))
  const [columns, setColumns] = useState(cloneDeep(initialColumns))
  const [rows, setRows] = useState(data)
  const [gradeCounter, setGradeCounter] = useState(gradeDisplayCount)
  const [filterFromHeaders, setFilterFromHeaders] = useState({})
  const [activeColumnKey, setActiveColumnKey] = useState('')
  const [showGradeOptions, setShowGradeOptions] = useState(false)
  const [gradeType, setGradeType] = useState('number')
  const [gradeColumns, setGradeColumns] = useState({ string: [], number: [] })
  const [columnFilters, setColumnFilters] = useState({})
  const [previousColumnFilters, setPreviousColumnFilters] = useState(null)
  const [columnFilterSearch, setColumnFilterSearch] = useState(null)
  const [quarterValues, setQuarterValues] = useState({})
  const [schoolYears, setSchoolYears] = useState([])
  
  let activeGradeColumns = gradeColumns[gradeType].slice(gradeCounter - gradeDisplayCount, gradeCounter)
  if (activeGradeColumns.length < gradeDisplayCount) {
    activeGradeColumns = gradeColumns[gradeType].slice(gradeColumns[gradeType].length - gradeDisplayCount, gradeColumns[gradeType].length)
  }
  
  const getActiveColumns = (type, gCols) => ['name', 'schoolType', 'gradeLevel', 'gpa', 'attendanceSummary', ...(gCols || gradeColumns[type]), 'act1', 'act2', 'sat']
  
  const generateColumnFilters = (rowData, cols, resetKeys = null) => {
    let newColumnFilters = { ...columnFilters }
    const keys = resetKeys || Object.keys(({ ...columns, ...(cols || {}) }))

    keys.forEach(key => {
      newColumnFilters[key] = (rowData || data)
        .map(e => e[key])
        .sort()
        .reduce((acc, curr) => {
          if (curr && !acc.find(e => e.value === curr)) {
            acc.push({ value: curr, checked: true })
          }
          return acc
        }, [])
    })
    return newColumnFilters
  }

  const getColumnFiltersByActiveColumn = () => {
    const activeColumn = getActiveColumns(gradeType)
    return Object.entries(columnFilters)
      .reduce((acc, [key, value]) => {
        if (activeColumn.includes(key)) {
          acc[key] = value
        }
        return acc
      }, {})
  }

  const handleSetRowAndColumn = (type, newData, colKeys, colKeysObj, cols) => {
    // const newRows = cloneDeep((newData || data))
    //   .reduce((acc, curr) => {
    //     const newType = type === 'number' ? 'string' : 'number'
    //     colKeysObj[newType].forEach(e => {
    //       delete curr[e]
    //     })
    //     acc.push(curr)
    //     return acc
    //   }, [])
    
    // setRows(newRows)

    const newColumns = (colKeys || getActiveColumns(type))
      .reduce((acc, curr) => {
        acc[curr] = (cols || baseColumns)[curr]
        return acc
      }, {})
    setColumns(newColumns)
  }
  
  const handleApplyFilter = (filters) => {
    const { sort, search = '', date } = cloneDeep(filters)

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
    const newColumnFilters = Object.entries(getColumnFiltersByActiveColumn())
    newRows = newRows.filter((row) => {
      const result = newColumnFilters.filter(([key, value]) => {
        const comparer = value.filter(e => e.checked).map(e => e.value)
        return !value.length || comparer.includes(row[key])
      })

      return result.length === newColumnFilters.length
    })

    //Grade Date Filter
    if (date && date.year && !isEqual(date, filterFromHeaders.date)) {
      const flattenGradeKeys = [...(gradeColumns.number || []), ...(gradeColumns.string || []), 'attendanceSummary']
      const { year, quarter } = date
      let newData = cloneDeep(data)
      const formatRowData = (rowData, noFilter) => {
        let newRowData = rowData
        if (!noFilter) {
          newRowData = newRowData.filter(e => e.schoolYear === year)
        }

        newRowData = newRowData.map(e => {
          const newGrades = flattenGradeKeys.reduce((acc, curr) => {
            const gradeKey = `${curr}_${e.studentGradeCumulativeId}${quarter ? '_' : ''}${quarter}`
            return {
              ...acc,
              [curr]: quarterValues[gradeKey]
            }
          }, {})
          return {
            ...e,
            ...newGrades
          }
        })

        return newRowData
      }
      newRows = formatRowData(newRows)
      newData = formatRowData(newData, true)

      setData(newData)
      setColumnFilters(generateColumnFilters(newData, null, flattenGradeKeys))
      console.log('@@@@filtered===', { flattenGradeKeys, newRows, quarterValues })
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
          <td className='subHeader'>
            <table className='subTable student'>
              <tr>
                <td style={{ minWidth: '100px', wordBreak: 'break-word'}}>{index === 0 ? name : ''}</td>
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
                    return <td style={{ ...highLight(row[e], e), width: '25%' }}>{row[e]}</td>
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

  const getGradeList = (data) => {
    return (data?.cumulative_grades || [])
    .reduce((accumulator, {
      child_id, firstname, lastname, grades = [], school_type = '', year_level = '', school_year_start = '',
      school_year_end = '', student_grade_cumulative_id
    }) => {
      const { data, labels, quarterValues, schoolYears } = accumulator
      const sy = school_year_start && school_year_end ? `${school_year_start}-${school_year_end}` : ''
      const { year_final_grade = '', final_quarter_attendance = '', final_grade = '', letter_final_grade = '' } = grades.length ? grades[0] : []

      const { values, keys, quarters } = grades.reduce((acc, curr) => {
        const {
          subject = '',
          grade_quarter_1 = '', letter_grade_quarter_1 = '', grade_quarter_2 = '', letter_grade_quarter_2 = '',
          grade_quarter_3 = '', letter_grade_quarter_3 = '', grade_quarter_4 = '', letter_grade_quarter_4 = '',
          attendance_quarter_1_total = '', attendance_quarter_2_total = '', attendance_quarter_3_total = '',
          attendance_quarter_4_total = ''
        } = curr

        const { values = {}, keys = {}, quarters } = acc
        const subjectKey = subject.toLocaleLowerCase().replace(/ /g,"_")
        return {
          values: {
            ...values,
            [`${subjectKey}`]: letter_final_grade,
            [`${subjectKey}Number`]: final_grade,
          },
          keys: {
            ...keys,
            [`${subjectKey}`]: { type: 'string', label: subject },
            [`${subjectKey}Number`]: { type: 'number', label: subject },
          },
          quarters: {
            ...quarters,
            [`${subjectKey}_${student_grade_cumulative_id}`]: letter_final_grade,
            [`${subjectKey}Number_${student_grade_cumulative_id}`]: final_grade,
            [`${subjectKey}_${student_grade_cumulative_id}_1`]: letter_grade_quarter_1,
            [`${subjectKey}Number_${student_grade_cumulative_id}_1`]: grade_quarter_1,
            [`${subjectKey}_${student_grade_cumulative_id}_2`]: letter_grade_quarter_2,
            [`${subjectKey}Number_${student_grade_cumulative_id}_2`]: grade_quarter_2,
            [`${subjectKey}_${student_grade_cumulative_id}_3`]: letter_grade_quarter_3,
            [`${subjectKey}Number_${student_grade_cumulative_id}_3`]: grade_quarter_3,
            [`${subjectKey}_${student_grade_cumulative_id}_4`]: letter_grade_quarter_4,
            [`${subjectKey}Number_${student_grade_cumulative_id}_4`]: grade_quarter_4,
            [`attendanceSummary_${student_grade_cumulative_id}`]: final_quarter_attendance,
            [`attendanceSummary_${student_grade_cumulative_id}_1`]: attendance_quarter_1_total,
            [`attendanceSummary_${student_grade_cumulative_id}_2`]: attendance_quarter_2_total,
            [`attendanceSummary_${student_grade_cumulative_id}_3`]: attendance_quarter_3_total,
            [`attendanceSummary_${student_grade_cumulative_id}_4`]: attendance_quarter_4_total,
          }
        }
      }, {})

      return {
        ...accumulator,
        data: [
          ...data,
          {
            child_id,
            name: `${firstname} ${lastname}`,
            schoolType: school_type, //string
            gradeLevel: year_level, //number
            gpa: year_final_grade,
            attendanceSummary: final_quarter_attendance,
            ...values,
            act1: '',
            act2: '',
            schoolYear: sy,
            studentGradeCumulativeId: student_grade_cumulative_id
          }
        ],
        labels: {
          ...labels,
          ...keys
        },
        quarterValues: {
          ...quarterValues,
          ...quarters
        },
        schoolYears: sy && !schoolYears.includes(sy) ? [...schoolYears, sy] : schoolYears
      }
    }, { data: [], labels: {}, quarterValues: {}, schoolYears: [] })
  }

  useEffect(() => {
    handleSetRowAndColumn(gradeType)
    dispatch(requestGetStudentCumulativeGradeByUser(child_id))
  }, [])

  useEffect(() => {
    if (gradeInput?.individualList) {
      const { data, labels, quarterValues, schoolYears } = getGradeList((gradeInput.individualList || {}))
      const newGradeColumns = {
        string: Object.keys(labels).filter(e => !e.includes('Number')),
        number: Object.keys(labels).filter(e => e.includes('Number'))
      }
      const newColumns = {
        ...columns,
        ...labels,
      }
      setData(data)
      setRows(data)
      setBaseColumns(newColumns)
      setColumns(newColumns)
      setGradeColumns(newGradeColumns)
      setQuarterValues(quarterValues)
      setSchoolYears(schoolYears)
      setColumnFilters(generateColumnFilters(data, labels))
      handleSetRowAndColumn(gradeType, data, getActiveColumns(gradeType, newGradeColumns[gradeType]), newGradeColumns, newColumns)
      console.log('toweweng', { data, labels, quarterValues, schoolYears })
    }
  }, [gradeInput])

  console.log('@@@final data', { rows, data, columns, columnFilters, gradeColumns })

  return (
    <GradesStyled>
      <h2>Grade Individual View</h2>
      <div
        id='gradeListView'
        onClick={() => {
          handleSetActiveColumnKey()
          setShowGradeOptions(false)
        }}
      >
        {
          gradeLoading ? (
            <Loading />
          ) : (
            <>
              <Link to={'/dashboard/grades'} className='back-btn'>
                <FontAwesomeIcon className='back-icon' icon={faAngleLeft} />
                Back
              </Link>
              <div className='gradeListFilter'>
                <Headers
                  enableClearFilter
                  filterOptions={['sort', 'highlight', 'date']}
                  columns={columns}
                  rows={rows}
                  schoolYears={schoolYears}

                  onApplyFilter={handleApplyFilter}
                />
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
                            {
                              activeGradeColumns.map((e, index) => {
                                const isFirst = index === 0
                                const isLast = index === (gradeDisplayCount - 1)
                                const showFirst = activeGradeColumns.length > 1 && isFirst && gradeCounter > activeGradeColumns.length
                                const showLast = activeGradeColumns.length > 1 && isLast && gradeColumns[gradeType].length > gradeCounter
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
            </>
          )
        }
      </div>
    </GradesStyled>
  )
}
