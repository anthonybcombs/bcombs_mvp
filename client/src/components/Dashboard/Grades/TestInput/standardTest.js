import React, { useEffect, useState } from 'react'
import { Link } from '@reach/router'
import cloneDeep from 'lodash.clonedeep'
import orderBy from 'lodash.orderby'
import { uuid } from 'uuidv4'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faAngleLeft, faPlusCircle, faCopy, faTrashAlt, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import update from 'immutability-helper'

import Headers from '../Headers'
import Loading from '../../../../helpers/Loading.js'
import { FilterOptionsObj } from '../Headers/options'
import SelectStudentDialog from './SelectStudentDialog'

import { useSelector, useDispatch } from 'react-redux'
import { requestGetStudentCumulativeGradeByAppGroup  } from '../../../../redux/actions/Grades'

export default () => {
  const dispatch = useDispatch()
  const { gradeInput, loading: { gradeLoading } } = useSelector(({ gradeInput, loading }) => ({
    gradeInput, loading
  }))

  const data = cloneDeep([
    {
      id: '1',
      name: 'John Doe',
      school_id: '',
      test_name: '',
      attempt: '',
      grade_taken: '',
      month_taken: '',
      score: '',
      percentage: '',
      ach_level: '',
      percentage_school: '',
      percentage_district: '',
      percentage_state: '',
      percentage_nationality: '',
      attachment: ''
    }
  ])

  const initialColumns = {
    name: { type: 'string', label: 'Name' },
    school_id: { type: 'string', label: 'ID' },
    test_name: { type: 'string', label: 'Test name' },
    attempt: { type: 'string', label: 'Attempt' },
    grade_taken: { type: 'string', label: 'Grade Taken' },
    month_taken: { type: 'string', label: 'Month Taken' },
    score: { type: 'string', label: 'Score' },
    percentage: { type: 'string', label: '%' },
    ach_level: { type: 'string', label: 'Ach level' },
    percentage_school: { type: 'string', label: '% school' },
    percentage_district: { type: 'string', label: '% district' },
    percentage_state: { type: 'string', label: '% state' },
    percentage_nationality: { type: 'string', label: '% nationality' },
    attachment: { type: 'string', label: 'Attachment', sortable: false, filterable: false }
  }

  const goldenKeys = {
    student_test_id: { type: 'int' },
    child_id: { type: 'string' },
    test_name: { type: 'string' },
    attempt: { type: 'int' },
    grade_taken: { type: 'int' },
    month_taken: { type: 'string' },
    score: { type: 'int' },
    ach_level: { type: 'int' },
    school_percentage: { type: 'float' },
    nationality_percentage: { type: 'float' },
    district_percentage: { type: 'float' },
    state_percentage: { type: 'float' },
    attachment: { type: 'obj' },
    date_created: { type: 'string' }
  }

  const [columns, setColumns] = useState(cloneDeep(initialColumns))
  const [rows, setRows] = useState([])
  const [filteredRows, setFilteredRows] = useState([])
  const [userLookup, setUserLookup] = useState([])
  const [filterFromHeaders, setFilterFromHeaders] = useState({})
  const [activeColumnKey, setActiveColumnKey] = useState('')
  const [selected, setSelected] = useState([])

  const [selectStudentOpen, setSelectStudentOpen] = useState(false)

  const generateColumnFilters = (passedRows) => {
    let newColumnFilters = {}
    Object.keys(initialColumns).forEach(key => {
      newColumnFilters[key] = (passedRows || rows)
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
  
  const handleApplyFilter = (filters) => {
    const { sort, search = '' } = cloneDeep(filters)

    // Search always executes for the data to reset even if search is empty
    let newRows = cloneDeep(rows).filter(({ id, ...rest }) => {
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
      return rowArr.filter(([key, value]) => columnFilters[key] && !!columnFilters[key].find(e => (e.checked && e.value === value))).length === rowArr.length
    })

    setFilteredRows(newRows)

    setFilterFromHeaders(cloneDeep(filters))
  }

  const handleInputChange = ({ target: { value } }, index, id) => {
    const mergeObj = { [id]: value }
    setRows(update(rows, {
      [index]: { $merge: mergeObj }
    }))
    setFilteredRows(update(filteredRows, {
      [index]: { $merge: mergeObj }
    }))
  }

  const handleInputBlur = () => {
    setColumnFilters(generateColumnFilters())
  }

  const renderTableData = () => {
    const highlightFilters = filterFromHeaders?.highlight || []
    const { conditions } = FilterOptionsObj.highlight
    return filteredRows.map((row, index) => {
      const colKeysArr = Object.keys(columns)

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
        <tr key={`grades-list-${index}`} className='tr-data'>
          <td className='subHeader'>
            <table className='subTable standard'>
              <tr>
                <td>
                  <input
                    type='checkbox'
                    checked={selected.includes(row.id)}
                    onChange={e => handleSelect(e, row.id)}
                  />
                </td>
                {
                  colKeysArr.slice(0, 2).map(key => {
                    return (
                      <td style={{ ...highLight(row[key], key), wordBreak: 'break-word'}}>
                        {
                          key === 'name' ? (
                            <input
                              readOnly
                              value={row.name}
                            />
                          ) : (
                            <input
                              value={row[key]}
                              onChange={(e) => handleInputChange(e, index, key)}
                              onBlur={handleInputBlur}
                            />
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
                  colKeysArr.slice(2, colKeysArr.length).map(key => {
                    return (
                      <td style={{ ...highLight(row[key], key), wordBreak: 'break-word'}}>
                        <input
                          value={row[key]}
                          onChange={(e) => handleInputChange(e, index, key)}
                          onBlur={handleInputBlur}
                        />
                      </td>
                    )
                  })
                }
              </tr>
            </table>
          </td>
        </tr>
      )
    })
  }

  const handlePrepareColumnFilter = ({ target: { checked, value } }, key) => {
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
  }

  const handleSelectAllColumFilter = ({ target: { checked } }, key) => {
    setColumnFilters({
      ...columnFilters,
      [key]: columnFilters[key].map(e => ({ ...e, checked }))
    })
  }

  const handleChangeTableFilterColumn = (key) => {
    setPreviousColumnFilters(cloneDeep(columnFilters)) // saves the previous table filter
    handleSetActiveColumnKey(key)
  }

  const handleSelectAll = ({ target: { checked } }) => {
    setSelected(checked ? filteredRows.map(e => e.id) : [])
  }

  const handleSelect = ({ target: { checked } }, id) => {
    setSelected(checked ? [...selected, id] : selected.filter(e => e !== id))
  }

  const handleAdd = () => {
    setSelectStudentOpen(true)
    // const newRows = cloneDeep(rows)
    // const newRow = Object.keys(columns)
    //   .reduce((acc, curr) => {
    //     acc[curr] = ''
    //     return acc
    //   }, { id: uuid() })
    // setRows([...newRows, newRow])
    // setFilteredRows([...newRows, newRow])
    // setColumnFilters(generateColumnFilters([...newRows, newRow]))
  }

  const handleCopy = () => {
    const newRows = cloneDeep(rows)
    const copiedRows = newRows
      .filter(e => selected.includes(e.id))
      .map(e => ({ ...e, id: uuid() }))

    setRows([...newRows, ...copiedRows])
    setFilteredRows([...newRows, ...copiedRows])
    setColumnFilters(generateColumnFilters([...newRows, ...copiedRows]))
  }

  const handleDelete = () => {
    const newRows = cloneDeep(rows).filter(e => !selected.includes(e.id))
    setRows(newRows)
    setFilteredRows(newRows)
    setColumnFilters(generateColumnFilters(newRows))
    setSelected([])
  }

  const handleSelectStudent = (data) => {
    console.log('@@studentData', data)
  }

  const renderTableFilter = (key) => {
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
                if (!value) {
                  return null
                }
                return (
                  <div id={`${index}`} className='filter-option'>
                    <label htmlFor={`${key}_${valueID}_${index}`} className='checkboxContainer'>
                      <input
                        type='checkbox'
                        id={`${key}_${valueID}_${index}`}
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
    dispatch(requestGetStudentCumulativeGradeByAppGroup({
      app_group_id: '0edbc431-eeef-11ea-8212-dafd2d0ae3ff',
      app_group_type: 'bcombs'
    }))
  }, [])

  useEffect(() => {
    if (gradeInput?.gradeList) {
      setUserLookup(gradeInput.gradeList.map(e => ({
        value: e.child_id,
        label: `${e.firstname} ${e.lastname}`
      })))
    }
  }, [gradeInput])


  const colArr = Object.entries(columns)

  console.log('atay jd oi', { gradeInput, rows, userLookup })

  return (
    <div
      onClick={() => {
        handleSetActiveColumnKey()
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
                filterOptions={['sort', 'highlight']}
                columns={columns}
                rows={rows}

                onApplyFilter={handleApplyFilter}
              />
            </div>
            <div id='gradeListTableWrapper'>
              <table id='gradeInputView-table'>
                <tbody>
                  <tr>
                    <th className='standard'>Standard Test</th>
                    <th className='th-grades'>
                      Standardized Test (SAT, ACT, End of Grade)
                    </th>
                  </tr>

                  <tr>
                    <td className='subHeader'>
                      <table className='subTable standardCheckbox'>
                        <tr>
                          <td style={{ whiteSpace: 'initial' }}>
                            <input
                              type='checkbox'
                              checked={selected.length === rows.length && selected.length}
                              onChange={handleSelectAll}
                            />
                          </td>
                          {
                            colArr.slice(0, 2).map(([key, { label }]) => {
                              return (
                                <td style={{ whiteSpace: 'initial' }}>
                                  {label}
                                  <FontAwesomeIcon
                                    icon={faCaretDown}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleChangeTableFilterColumn(key)
                                    }}
                                  />
                                  {renderTableFilter(key)}
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
                            colArr.slice(2, colArr.length).map(([key, { label }]) => {
                              return (
                                <td style={{ whiteSpace: 'initial' }}>
                                  {label}
                                  <FontAwesomeIcon
                                    icon={faCaretDown}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleChangeTableFilterColumn(key)
                                    }}
                                  />
                                  {renderTableFilter(key)}
                                </td>
                              )
                            })
                          }
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
            <div className='gradeInputView-table-actions'>
              <div className='action left'>
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

              <div className='action right'>
                <button
                  className='btn-save'
                  onClick={() => {}}
                >
                  <FontAwesomeIcon icon={faCheck} />
                  <span>Save</span>
                </button>
                <button
                  className='btn-review'
                  onClick={() => {}}
                >
                  <FontAwesomeIcon icon={faCheck} />
                  <span>Review</span>
                </button>
              </div>
            </div>
          </>
        )
      }
      {
        selectStudentOpen && (
          <SelectStudentDialog
            rows={gradeInput?.gradeList || []}
            onClose={() => setSelectStudentOpen(false)}
            keys={Object.keys(goldenKeys)}
            onSelectStudent={(data) => handleSelectStudent(data)}
          />
        )
      }
    </div>
  )
}
