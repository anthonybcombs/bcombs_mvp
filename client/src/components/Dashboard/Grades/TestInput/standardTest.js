import React, { useEffect, useState } from 'react'
import { Link } from '@reach/router'
import cloneDeep from 'lodash.clonedeep'
import orderBy from 'lodash.orderby'
import { uuid } from 'uuidv4'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faAngleLeft, faPlusCircle, faCopy, faTrashAlt, faCheck, faTimes, faPaperclip, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import update from 'immutability-helper'
import DatePicker from "react-datepicker";

import Headers from '../Headers'
import Loading from '../../../../helpers/Loading.js'
import { FilterOptionsObj } from '../Headers/options'
import SelectStudentDialog from './SelectStudentDialog'

import { useSelector, useDispatch } from 'react-redux'
import { requestGetStudentCumulativeGradeByAppGroup, requestAddUpdateStudentStandardizedTest  } from '../../../../redux/actions/Grades'

export default () => {
  const dispatch = useDispatch()
  const { gradeInput, loading: { gradeLoading, standardGradeLoading } } = useSelector(({ gradeInput, loading }) => ({
    gradeInput, loading
  }))

  const initialColumns = {
    name: { type: 'string', label: 'Name' },
    child_id: { type: 'string', label: 'ID' },
    test_name: { type: 'string', label: 'Test name' },
    attempt: { type: 'number', label: 'Attempt' },
    grade_taken: { type: 'number', label: 'Grade Taken' },
    month_taken: { type: 'string', label: 'Month Taken' },
    score: { type: 'number', label: 'Score' },
    percentage: { type: 'string', label: '%' },
    ach_level: { type: 'number', label: 'Ach level' },
    school_percentage: { type: 'number', label: '% school' },
    district_percentage: { type: 'number', label: '% district' },
    state_percentage: { type: 'number', label: '% state' },
    nationality_percentage: { type: 'number', label: '% nationality' },
    attachment: { type: 'obj', label: 'Attachment', sortable: false, filterable: false }
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
    attachment: { type: 'attachment' },
    // date_created: { type: 'string' }
  }

  const [columns, setColumns] = useState(cloneDeep(initialColumns))
  const [rows, setRows] = useState([])
  const [filteredRows, setFilteredRows] = useState([])
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

  const handleInputChange = ({ target: { value } }, index, key) => {
    const mergeObj = { [key]: value }
    setRows(update(rows, {
      [index]: { $merge: mergeObj }
    }))
    setFilteredRows(update(filteredRows, {
      [index]: { $merge: mergeObj }
    }))
  }

  const handelUpload = (file, index, key) => {
    if (!file) {
      return
    }
    // if (file.size / 1048576 > 5) {
    //   onCheckError(fieldId, ['Maximum size for file upload is 5MB.'])
    //   return
    // }
    const [, ext] = file.name.split('.')

    // const allowedExt = allowTypes.filter(e => e.selected).reduce((acc, curr) => [...acc, ...curr.ext], [])
    // if (!allowedExt.includes(`.${ext.toLowerCase()}`)) {
    //   onCheckError(fieldId, [errorMessage])
    //   return
    // }

    var reader = new FileReader()
    reader.onloadend = function() {
      handleInputChange(
        {
          target: {
            value: { url: '', data: reader.result, filename: file.name, contentType: file.type, extension: `.${ext}` }
          }
        },
        index,
        key
      )
    }
    reader.readAsDataURL(file)
  }

  const handleInputBlur = () => {
    setColumnFilters(generateColumnFilters())
  }

  const renderTableData = () => {
    const highlightFilters = filterFromHeaders?.highlight || []
    const { conditions } = FilterOptionsObj.highlight
    return filteredRows.map((row, index) => {
      const colKeysArr = Object.entries(columns)

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
          <td>
            <input
              type='checkbox'
              checked={selected.includes(row.id)}
              onChange={e => handleSelect(e, row.id)}
            />
          </td>
          {
            colKeysArr.map(([key, { type }]) => {
              const getFilename = (attachment) => {
                console.log('pisting yawa', attachment)
                if (!attachment) {
                  return ''
                }
                const file = (typeof attachment === 'object' ? attachment.filename : attachment).split('/')
                return file[file.length - 1]
              }
              return (
                <td style={{ ...highLight(row[key], key), wordBreak: 'break-word'}} className={`${key}`}>
                  {
                    ['name', 'child_id'].includes(key) && (
                      <input
                        readOnly
                        value={row[key]}
                      />
                    )
                  }
                  {
                    key === 'attachment' && (
                      !row[key] ? (
                        <>
                          <FontAwesomeIcon
                            className='attachment'
                            icon={faPaperclip}
                            onClick={() => {
                              document.getElementById(`attachement_${row.id}`).click()
                            }}
                          />
                          <input
                            id={`attachement_${row.id}`}
                            style={{ display: 'none' }}
                            type='file'
                            onChange={(e) => handelUpload(e.target.files[0], index, key)}
                          />
                        </>
                      ) : (
                        <>
                          <input
                            readOnly
                            value={getFilename(row[key])}
                          />
                          <FontAwesomeIcon
                            className='close-icon'
                            icon={faTimesCircle}
                            onClick={() => handleInputChange({ target: { value: null } }, index, key)}
                          />
                        </>
                      )
                    )
                  }
                  {
                    key === 'month_taken' && (
                      <DatePicker
                        selected={row[key] ? new Date(row[key]) : ''}
                        onChange={date => handleInputChange({ target: { value: date.toISOString() } }, index, key)}
                        dateFormat='MM/yyyy'
                        showMonthYearPicker
                        showFullMonthYearPicker
                      />
                    )
                  }
                  {
                    !['name', 'child_id', 'attachment', 'month_taken'].includes(key) && (
                      <input
                        type={type === 'number' ? 'number' : 'text'}
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
    handleMagicScroll(!!key)
    setActiveColumnKey(key)
    setColumnFilterSearch('')
  }

  const handleSelectAllColumFilter = ({ target: { checked } }, key) => {
    setColumnFilters({
      ...columnFilters,
      [key]: columnFilters[key].map(e => ({ ...e, checked }))
    })
  }

  const handleMagicScroll = (hide = false) => {
    if (hide) {
      document.getElementById('gradeListTableWrapper').style = 'overflow-x: auto'
      document.getElementById('gradeInputView').style = 'overflow: hidden'
    } else {
      document.getElementById('gradeListTableWrapper').style = 'overflow-x: auto'
      document.getElementById('gradeInputView').style = 'overflow: unset'
    }
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
  }

  const handleCopy = () => {
    const newRows = cloneDeep(rows)
    const copiedRows = newRows
      .filter(e => selected.includes(e.id))
      .map(e => ({ ...e, student_test_id: '', attachment: '', id: uuid() }))

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
    setRows([ ...rows, ...data ])
    setFilteredRows([...rows, ...data])
    setColumnFilters(generateColumnFilters([...rows, ...data]))
    setSelectStudentOpen(false)
  }

  const handleSave = () => {
    const newRows = cloneDeep(rows)
      .map(e => {
        let newRow = Object.entries(goldenKeys)
          .reduce((acc, [key, { type }]) => {
            if (type === 'int') {
              acc[key] = e[key] ? parseInt(e[key]) : ''
            } else if (type === 'float') {
              acc[key] = e[key] ? parseFloat(e[key]) : ''
            // } else if (type === 'attachment') {
            //   acc[key] = e[key] || { contentType: '', data: '', extension: '', filename: '', url: '' }
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
        return newRow
      })

    dispatch(requestAddUpdateStudentStandardizedTest(newRows))
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
      app_group_id: '97754eb9-fc18-11ea-8212-dafd2d0ae3ff',
      app_group_type: 'bcombs'
    }))
  }, [])

  // useEffect(() => {
  //   if (gradeInput?.gradeList) {
  //     setUserLookup(gradeInput.gradeList.map(e => ({
  //       value: e.child_id,
  //       label: `${e.firstname} ${e.lastname}`
  //     })))
  //   }
  // }, [gradeInput])


  const colArr = Object.entries(columns)
  return (
    <div
      onClick={() => {
        handleSetActiveColumnKey()
      }}
    >
      {
        (gradeLoading || standardGradeLoading) ? (
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
                <thead>
                  <tr>
                    <th colSpan={3} className='standard'>Standard Test</th>
                    <th colSpan={12} className='th-grades'>
                      Standardized Test (SAT, ACT, End of Grade)
                    </th>
                  </tr>
                  <tr>
                    <th style={{ whiteSpace: 'initial' }}>
                      <input
                        type='checkbox'
                        checked={selected.length === rows.length && selected.length}
                        onChange={handleSelectAll}
                      />
                    </th>
                    {
                      colArr.map(([key, { label, filterable = true }]) => {
                        return (
                          <th style={{ whiteSpace: 'initial' }}>
                            {label}
                            {
                              filterable && (
                                <>
                                  <FontAwesomeIcon
                                    icon={faCaretDown}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleChangeTableFilterColumn(key)
                                    }}
                                  />
                                  {renderTableFilter(key)}
                                </>
                              )
                            }
                          </th>
                        )
                      })
                    }
                  </tr>
                </thead>
                <tbody>
                  {renderTableData()}
                </tbody>
                
              </table>
              {
                rows.length === 0 && (
                  <div style={{ width: '100%'}}>No records.</div>
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
                  onClick={handleSave}
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
