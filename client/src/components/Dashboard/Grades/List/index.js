import React, { useEffect, useState } from 'react'
import cloneDeep from 'lodash.clonedeep'
import orderBy from 'lodash.orderby'
import uniqBy from 'lodash.uniqby'
import { groupBy, maxBy } from 'lodash'
import { Link } from '@reach/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import { useLocation } from '@reach/router';
import { parse } from 'query-string';

import GradesStyled from './styles'
import Headers from '../Headers'
import { FilterOptionsObj } from '../Headers/options'
import { useSelector, useDispatch } from 'react-redux'

import Loading from '../../../../helpers/Loading.js'
import { getNameFromCustomForm } from '../utils'
import ProfileImg from "../../../../images/defaultprofile.png";
import { requestGetStudentCumulativeGradeByAppGroup, requestGetStudentCumulativeGradeByVendor } from '../../../../redux/actions/Grades'

import { getOptionTestName } from '../../../../constants/options'

export default () => {
  const dispatch = useDispatch()
  const { gradeInput, loading: { gradeLoading } } = useSelector(({ gradeInput, loading }) => ({
    gradeInput, loading
  }))

  const queryLocation = useLocation();
  const { group_id, form_id, group_type, request_type, vendor } = parse(queryLocation.search)
  const isVendor = request_type === 'vendor'
  const commonQueryStrings = `group_id=${group_id}&group_type=${group_type}&request_type=${request_type}`
  const testOptions = getOptionTestName(form_id || group_id);
  const testOptionsObj = cloneDeep(testOptions.reduce((acc, curr) => ({ ...acc, [curr.value]: 0 }), {}))

  const initialColumns = {
    name: { type: 'string', label: 'Name' },
    schoolType: { type: 'string', label: 'School Type' },
    gradeLevel: { type: 'string', label: 'Grade Level' },
    attendanceSummary: { type: 'string', label: 'Attendance Summary' },
    gpa: { type: 'string', label: 'GPA Cum(semester)' },
    ...(testOptions.reduce((acc, curr) => ({ ...acc, [curr.value]: { type: 'number', label: curr.label } }), {}))
  }

  const displayCount = 3

  const [data, setData] = useState([])
  const [baseColumns, setBaseColumns] = useState(cloneDeep(initialColumns))
  const [columns, setColumns] = useState(cloneDeep(initialColumns))
  const [rows, setRows] = useState(data)
  const [gradeCounter, setGradeCounter] = useState(displayCount)
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
  const [stYearValues, setStYearValues] = useState([])
  const [stCounter, setStCounter] = useState(displayCount)

  let activeGradeColumns = gradeColumns[gradeType].slice(gradeCounter - displayCount, gradeCounter)
  if (activeGradeColumns.length < displayCount && gradeColumns[gradeType].length > displayCount) {
    activeGradeColumns = gradeColumns[gradeType].slice(gradeColumns[gradeType].length - displayCount, gradeColumns[gradeType].length)
  }

  const stColumns = testOptions.map(e => e.value)
  let activeStColumns = stColumns.slice(stCounter - displayCount, stCounter)
  if (activeStColumns.length < displayCount && stColumns.length > displayCount) {
    activeStColumns = stColumns.slice(stColumns.length - displayCount, stColumns.length)
  }

  const getActiveColumns = (type, gCols) => ['name', 'schoolType', 'gradeLevel', 'gpa', 'attendanceSummary', ...(gCols || gradeColumns[type]), ...stColumns]
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
        }, [{ value: '', checked: true, isBlank: true }])
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

  const handleSetRowAndColumn = (type, colKeys, cols) => {
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
      const sortColumns = sort.map(e => (row) => row[e.column].toString().toLowerCase())
      const sortOrder = sort.map(e => e.value)
      newRows = orderBy(newRows, sortColumns, sortOrder)
    }

    // Column filter
    const newColumnFilters = Object.entries(getColumnFiltersByActiveColumn())
    const hasUnChecked = !!newColumnFilters.filter(([key, value]) => value.find(e => !e.checked)).length
    if (hasUnChecked) {
      newRows = newRows.filter((row) => {
        const result = newColumnFilters.filter(([key, value]) => {
          const comparer = value.filter(e => e.checked).map(e => e.value)
          const isBlankChecked = value.find(e => e.isBlank).checked || false
          return (isBlankChecked && !row[key]) || !value.length || comparer.includes(row[key])
        })
        return result.length === newColumnFilters.length
      })
    }

    //Grade Date Filter
    if (date) {
      const flattenGradeKeys = [...(gradeColumns.number || []), ...(gradeColumns.string || []), 'attendanceSummary']
      const { year, quarter } = date
      const yearSplit = year.split('-')
      // let newData = cloneDeep(data)

      const formatRowData = (rowData, filter) => {
        let newRowData = rowData
        if (filter && year) {
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

          const newSt = year
            ? stYearValues[`${yearSplit[1]}_${e.child_id}`] || stYearValues[`${yearSplit[0]}_${e.child_id}`] || testOptionsObj
            : e.stFinalValues

          return {
            ...e,
            ...newGrades,
            ...newSt
          }
        })

        return newRowData
      }
      newRows = formatRowData(newRows, true)
      const newData = formatRowData(cloneDeep(data))

      setData(newData)
      setColumnFilters(generateColumnFilters(newData, null, flattenGradeKeys))
    }

    setRows(newRows)

    setFilterFromHeaders(cloneDeep(filters))
  }

  const renderTableData = () => {
    const highlightFilters = filterFromHeaders?.highlight || []
    const { conditions } = FilterOptionsObj.highlight
    const updatedRows = uniqBy(rows, 'child_id');
    return updatedRows.map((row, index) => {
      const {
        name, schoolType, gradeLevel, gpa, attendanceSummary
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

      const formatValue = (val) => val || '--'
      let profile = row.image || ''
      if (profile) {
        profile = profile.includes('file/') ? 'https://bcombs.s3.amazonaws.com/' + profile : profile;
      }

      return (
        <tr key={`grades-list-${index}`}>
          <td className='subHeader'>
            <table className='subTable student'>
              <tr>
                <td style={{ ...highLight(name, 'name'), minWidth: '100px', wordBreak: 'break-word', display: 'flex', alignItems: 'center' }}>
                  <div className="profile-image">
                    <img src={profile || ProfileImg} />
                  </div>
                  <Link to={`/dashboard/grades/individual/${row.child_id}?${commonQueryStrings}`}>
                    {name}
                  </Link>
                </td>
                <td style={{ ...highLight(schoolType, 'schoolType'), minWidth: '100px', wordBreak: 'break-word' }}>{formatValue(schoolType)}</td>
                <td style={{ ...highLight(gradeLevel, 'gradeLevel'), minWidth: '100px', wordBreak: 'break-word' }}>{formatValue(gradeLevel)}</td>
                <td style={{ ...highLight(gpa, 'gpa'), minWidth: '50px', wordBreak: 'break-word' }}>{formatValue(gpa)}</td>
                <td style={{ ...highLight(attendanceSummary, 'attendanceSummary'), minWidth: '100px', wordBreak: 'break-word' }}>{formatValue(attendanceSummary)}</td>
              </tr>
            </table>
          </td>
          <td className='subHeader'>
            <table className='subTable'>
              <tr>
                {
                  activeGradeColumns.map(e => {
                    return <td style={{ ...highLight(row[e], e), width: '25%' }}>{formatValue(row[e])}</td>
                  })
                }
              </tr>
            </table>
          </td>
          <td className='subHeader'>
            <table className='subTable'>
              <tr>
                {
                  activeStColumns.map(e => {
                    return <td style={{ ...highLight(row[e], e), width: '25%' }}>{formatValue(row[e])}</td>
                  })
                }
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

  const handleChangeTableFilterColumn = (key) => {
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
      const currColumnFilter = orderBy(columnFilters[key], ['value'], ['asc'])
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
                      <span className='labelName'>{value || '--'}</span>
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

  const getDataList = (data) => {
    return data
      .reduce((accumulator, { child_id, firstname, lastname, cumulative_grades, standardized_test, image = '', form_contents }) => {
        const { data, labels, quarterValues, schoolYears, stYearValues } = accumulator
        if (form_contents) {
          const name = getNameFromCustomForm(form_contents)
          const { formData = [] } = typeof form_contents === 'string' ? JSON.parse(form_contents) : form_contents
          const { fields = [] } = formData.find(e => e.fields[0].tag === 'profileImage') || {}
          if (fields.length) {
            const { value } = fields[0]
            const { url } = value ? JSON.parse(value) : {}
            image = url.includes('file/') ? 'https://bcombs.s3.amazonaws.com/' + url : url;
          }
          firstname = name.firstname
          lastname = name.lastname
        }
        const {
          grades = [], school_type = '', year_level = '', school_year_start = '',
          school_year_end = '', student_grade_cumulative_id, gpa_final, gpa_sem_2, gpa_sem_1,
        } = cumulative_grades.length ? maxBy(cumulative_grades, 'year_level') : {}


        const parseYear = (y) => typeof y === 'string' ? parseInt(y) : y
        const sy = parseYear(school_year_start) && parseYear(school_year_end) ? `${parseYear(school_year_start)}-${parseYear(school_year_end)}` : ''

        const { final_quarter_attendance = '', final_grade = '', letter_final_grade = '',
          attendance_quarter_1_total, attendance_quarter_2_total,
          attendance_quarter_3_total, attendance_quarter_4_total } = grades?.length ? grades[0] : []
       
        const final_quarter_attendance_total = attendance_quarter_1_total + attendance_quarter_2_total +
          attendance_quarter_3_total + attendance_quarter_4_total

          
        // Grades reduce
        const { values, keys, quarters } = (grades || []).reduce((acc, curr) => {

          const {
            subject = '',
            grade_quarter_1 = '', letter_grade_quarter_1 = '', grade_quarter_2 = '', letter_grade_quarter_2 = '',
            grade_quarter_3 = '', letter_grade_quarter_3 = '', grade_quarter_4 = '', letter_grade_quarter_4 = '',
            attendance_quarter_1_total = '', attendance_quarter_2_total = '', attendance_quarter_3_total = '',
            attendance_quarter_4_total = '', letter_year_final_grade, year_final_grade = ''
          } = curr

          const { values = {}, keys = {}, quarters } = acc
          const subjectKey = subject.toLocaleLowerCase().replace(/ /g, "_")
          const final_quarter_attendance_total = attendance_quarter_1_total + attendance_quarter_2_total +
            attendance_quarter_3_total + attendance_quarter_4_total
          return {
            values: {
              ...values,
              [`${subjectKey}`]: letter_year_final_grade || letter_grade_quarter_4 || letter_grade_quarter_3 || letter_grade_quarter_2 || letter_grade_quarter_1,
              [`${subjectKey}Number`]: year_final_grade || grade_quarter_4 || grade_quarter_3 || grade_quarter_2 || grade_quarter_1,
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
              [`attendanceSummary_${student_grade_cumulative_id}`]: final_quarter_attendance_total,
              [`attendanceSummary_${student_grade_cumulative_id}_1`]: attendance_quarter_1_total,
              [`attendanceSummary_${student_grade_cumulative_id}_2`]: attendance_quarter_2_total,
              [`attendanceSummary_${student_grade_cumulative_id}_3`]: attendance_quarter_3_total,
              [`attendanceSummary_${student_grade_cumulative_id}_4`]: attendance_quarter_4_total,
            }
          }
        }, {})


        //ST reduce
        const stValues = Object.entries(
          groupBy(
            standardized_test,
            'test_name'
          )
        ).reduce((acc, [key, val = []]) => {
          let currScore = 0
          if (val.length > 0) {
            const maxGrade = maxBy(val, 'grade_taken').grade_taken || 1
            const maxScore = maxBy(val.filter(e => e.grade_taken === maxGrade), 'attempt')?.score || 0
            currScore = maxScore
          }
          return { ...acc, [key]: currScore }
        }, testOptionsObj)

        const yearValues = Object.entries(
          groupBy(
            standardized_test.filter(e => e.month_taken).map(e => ({ ...e, month_taken: moment(e.month_taken).format('yyyy') })),
            'month_taken'
          )
        ).reduce((acc, [key, val]) => {
          const stGroupObj = Object.entries(groupBy(val, 'test_name'))
            .reduce((stAcc, [stKey, stVal = []]) => {
              const maxGrade = maxBy(stVal, 'grade_taken').grade_taken || 1
              const maxScore = maxBy(stVal.filter(e => e.grade_taken === maxGrade), 'attempt')?.score || 0
              return {
                ...stAcc,
                [stKey]: maxScore
              }
            }, testOptionsObj)
          return {
            ...acc,
            [`${key}_${child_id}`]: stGroupObj
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
              gpa: gpa_final || gpa_sem_2 || gpa_sem_1,
              attendanceSummary: final_quarter_attendance_total,
              ...values,
              ...stValues,
              stFinalValues: stValues,
              schoolYear: sy,
              studentGradeCumulativeId: student_grade_cumulative_id,
              image
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
          schoolYears: sy && !schoolYears.includes(sy) ? [...schoolYears, sy] : schoolYears,
          stYearValues: {
            ...stYearValues,
            ...yearValues
          }
        }
      }, { data: [], labels: {}, quarterValues: {}, stYearValues: {}, schoolYears: [] })
  }

  useEffect(() => {
    handleSetRowAndColumn(gradeType);
    if (group_id && group_type) {
      if (isVendor) {
        dispatch(requestGetStudentCumulativeGradeByVendor(group_id))
      } else {
        dispatch(requestGetStudentCumulativeGradeByAppGroup({
          app_group_id: group_id,
          app_group_type: group_type
        }))
      }
    }
  }, [])

  useEffect(() => {
    if (gradeInput?.gradeList) {
      let newGradeList = (gradeInput.gradeList || []).filter(e => e.app_group_id)
      if (group_type === 'bcombs') {
        newGradeList = newGradeList.filter(e => !e.form_contents)
      } else {
        newGradeList = newGradeList.filter(e => e.form_contents)
      }
      const { data, labels, quarterValues, schoolYears, stYearValues } = getDataList(newGradeList)
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
      setStYearValues(stYearValues)
      setColumnFilters(generateColumnFilters(data, labels))
      handleSetRowAndColumn(gradeType, getActiveColumns(gradeType, newGradeColumns[gradeType]), newColumns)
    }
  }, [gradeInput])

  const { year = '' } = filterFromHeaders?.date || {}

  return (
    <GradesStyled>
      <h2>Grade List Views {year ? `(${year})` : ''}</h2>
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
              {
                (group_id || group_type) && (
                  <Link to={`/dashboard/studentdata${vendor ? `?vendor=${vendor}` : ''}`} className='back-btn'>
                    <FontAwesomeIcon className='back-icon' icon={faAngleLeft} />
                    Back
                  </Link>
                )
              }
              <div className='gradeListFilter'>
                <Headers
                  enableClearFilter
                  filterOptions={['sort', 'highlight', 'date']}
                  columns={columns}
                  rows={rows}
                  schoolYears={schoolYears}

                  onApplyFilter={handleApplyFilter}
                  centerSearch={true}
                />
                <Link
                  className='applyFilterBtn'
                  to={`/dashboard/grades/input?${commonQueryStrings}&return_page=grades&vendor=${vendor}`}
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
                            {
                              activeGradeColumns.map((e, index) => {
                                const isFirst = index === 0
                                const isLast = index === (displayCount - 1)
                                const showFirst = activeGradeColumns.length > 1 && isFirst && gradeCounter > activeGradeColumns.length && gradeColumns[gradeType].length > displayCount
                                const showLast = activeGradeColumns.length > 1 && isLast && gradeColumns[gradeType].length > gradeCounter
                                return (
                                  <td style={{ width: '25%' }} key={`subjectCol-${index}`}>
                                    {
                                      showFirst && (
                                        <span style={{ cursor: 'pointer', marginRight: '1rem' }} onClick={() => setGradeCounter(gradeCounter - displayCount)} >
                                          <FontAwesomeIcon icon={faAngleLeft} />
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
                                        <span style={{ cursor: 'pointer', marginLeft: '1rem' }} onClick={() => setGradeCounter(gradeCounter + displayCount)} >
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
                            {
                              activeStColumns.map((e, index) => {
                                const isFirst = index === 0
                                const isLast = index === (displayCount - 1)
                                const showFirst = activeStColumns.length > 1 && isFirst && stCounter > activeStColumns.length && stColumns.length > displayCount
                                const showLast = activeStColumns.length > 1 && isLast && stColumns.length > stCounter
                                return (
                                  <td style={{ width: '25%' }} key={`subjectCol-${index}`}>
                                    {
                                      showFirst && (
                                        <span style={{ cursor: 'pointer', marginRight: '1rem' }} onClick={() => setStCounter(stCounter - displayCount)} >
                                          <FontAwesomeIcon icon={faAngleLeft} />
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
                                        <span style={{ cursor: 'pointer', marginLeft: '1rem' }} onClick={() => setStCounter(stCounter + displayCount)} >
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
                    </tr>
                    {
                      (rows.length === 0)
                        ? (<tr><td colSpan={getActiveColumns('number').length}>No records.</td><td></td></tr>)
                        : renderTableData()
                    }
                  </tbody>
                </table>
              </div>
            </>
          )
        }
      </div>
    </GradesStyled>
  )
}
