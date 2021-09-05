import React, { useEffect, useState } from 'react'
import { Link } from '@reach/router'
import cloneDeep from 'lodash.clonedeep'
import orderBy from 'lodash.orderby'
import { uuid } from 'uuidv4'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faAngleLeft, faPlusCircle, faCopy, faTrashAlt, faCheck, faTimes, faPaperclip, faTimesCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'
import update from 'immutability-helper'
import DatePicker from "react-datepicker";
import CustomSelect from '../../CustomComponents/CustomSelect'

import Headers from '../Headers'
import Loading from '../../../../helpers/Loading.js'
import { FilterOptionsObj } from '../Headers/options'
import SelectStudentDialog from './SelectStudentDialog'
import EditGradeDialog from './EditGradeDialog'
import ConfirmDialog from './ConfirmDialog'
import { getGradeTestAttempt } from '../utils'

import { useSelector, useDispatch } from 'react-redux'
import { requestAddUpdateStudentCumulative, requestDeleteStudentStandardizedTest, clearGrades } from '../../../../redux/actions/Grades'

export default ({ applications, importData = [], childId, requestList, groupId, groupType, loading, onHasChanged, appGroupIds, type }) => {
  const dispatch = useDispatch()
  const { gradeInput } = useSelector(({ gradeInput }) => ({
    gradeInput
  }))

  const attempOptions = Array(5).fill().map((e, i) => ({ value: i + 1, label: `${i + 1}` }))
  const testOptions = [{ value: 'act', label: 'ACT' }, { value: 'sat', label: 'SAT' }, { value: 'eog', label: 'EOG' }]
  const gradeTakenOptions = [{ value: 1, label: '1st' }, { value: 2, label: '2nd' }, { value: 3, label: '3rd' }, ...Array(9).fill().map((e, i) => ({ value: i + 4, label: `${i + 4}th` }))]

  const initialColumns = {
    name: { type: 'string', label: 'Name' },
    child_id: { type: 'string', label: 'ID' },
    year_level: { type: 'int', label: 'Level' },
    child_designation: { type: 'string', label: 'Designations' },
    school_name: { type: 'string', label: 'Name' },
    school_type: { type: 'string', label: 'Type' },
    school_designation: { type: 'string', label: 'Designation' },
    school_year_start: { type: 'string', label: 'Start', isDate: true },
    school_year_end: { type: 'string', label: 'End', isDate: true },
    school_year_frame: { type: 'string', label: 'Frame' },
    scale: { type: 'number', label: 'Scale' },
    grades: { type: 'object', label: '', sortable: false, filterable: false },
    help_needed: { type: 'string', label: 'Help Needed', sortable: false, filterable: false },
    attachment: { type: 'obj', label: 'Attachment', sortable: false, filterable: false }
  }

  const goldenKeys = {
    student_grade_cumulative_id: { type: 'int' },
    // app_id: { type: 'string' },
    app_group_id: { type: 'string' },
    application_type: { type: 'string' },
    //app_group_name: { type: 'string' },
    application_type: { type: 'string' },
    child_id: { type: 'string' },
    // form_contents: { type: 'string' },
    year_level: { type: 'int' },
    child_designation: { type: 'string' },
    school_designation: { type: 'string' },
    school_type: { type: 'string' },
    school_name: { type: 'string' },
    school_year_start: { type: 'string' },
    school_year_end: { type: 'string' },
    school_year_frame: { type: 'string' },
    scale: { type: 'float' },
    gpa_sem_1: { type: 'float' },
    gpa_sem_2: { type: 'float' },
    gpa_final: { type: 'float' },
    mid_student_rank: { type: 'int' },
    final_student_rank: { type: 'int' },
    attachment: { type: 'object' },
    grades: { type: 'object' },
    // firstname: { type: 'string' },
    //lastname: { type: 'string' }
  }

  const gradeKeys = {
    student_grade_cumulative_id: { type: 'int' },
    class: { type: 'string' },
    subject: { type: 'string' },
    teacher_name: { type: 'string' },
    designation: { type: 'string' },
    grade_quarter_1: { type: 'float' },
    grade_quarter_2: { type: 'float' },
    grade_quarter_3: { type: 'float' },
    grade_quarter_4: { type: 'float' },
    letter_grade_quarter_1: { type: 'string' },
    letter_grade_quarter_2: { type: 'string' },
    letter_grade_quarter_3: { type: 'string' },
    letter_grade_quarter_4: { type: 'string' },
    attendance_quarter_1_absent: { type: 'int' },
    attendance_quarter_2_absent: { type: 'int' },
    attendance_quarter_3_absent: { type: 'int' },
    attendance_quarter_4_absent: { type: 'int' },
    attendance_quarter_1_tardy: { type: 'int' },
    attendance_quarter_2_tardy: { type: 'int' },
    attendance_quarter_3_tardy: { type: 'int' },
    attendance_quarter_4_tardy: { type: 'int' },
    attendance_quarter_1_total: { type: 'int' },
    attendance_quarter_2_total: { type: 'int' },
    attendance_quarter_3_total: { type: 'int' },
    attendance_quarter_4_total: { type: 'int' },
    mid_quarter_remarks: { type: 'string' },
    final_quarter_remarks: { type: 'string' },
    letter_mid_final_grade: { type: 'string' },
    mid_final_grade: { type: 'float' },
    letter_final_grade: { type: 'string' },
    final_grade: { type: 'float' },
    letter_year_final_grade: { type: 'string' },
    year_final_grade: { type: 'float' },
    letter_final_grade: { type: 'string' },
    help_q1: { type: 'string' },
    help_q2: { type: 'string' },
    help_q3: { type: 'string' },
    help_q4: { type: 'string' },
  }

  const [columns, setColumns] = useState(cloneDeep(initialColumns))
  const [rows, setRows] = useState([])
  const [filteredRows, setFilteredRows] = useState([])
  const [filterFromHeaders, setFilterFromHeaders] = useState({})
  const [activeColumnKey, setActiveColumnKey] = useState('')
  const [selected, setSelected] = useState([])
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [backDialog, setBackDialog] = useState(false)
  const [selectStudentOpen, setSelectStudentOpen] = useState(false)
  const [editGradeOpen, setEditGradeOpen] = useState(false)
  const [activeGrade, setActiveGrade] = useState('')
  const [editGradeConfirmDialog, setEditGradeConfirmDialog] = useState(false)
  const [enableEditDialog, setEnableEditDialog] = useState(false)
  const [selectedRowForEdit, setSelectedRowForEdit] = useState('');
  const [isReview, setIsReview] = useState(false)

  const generateColumnFilters = (passedRows) => {
    let newColumnFilters = {}
    Object.entries(initialColumns).forEach(([key, { isDate = false, isArr, filterable = true }]) => {
      newColumnFilters[key] = (passedRows || rows)
        .map(e => e[key])
        .sort()
        .reduce((acc, curr) => {
          if (filterable) {
            let fcurr = curr || ''
            const pass = isArr && curr.length === 0
            if (isDate && curr) {
              fcurr = parseInt(curr).toString()
            }
            if (!acc.find(e => e.value === fcurr) && !pass) {
              acc.push({ value: fcurr, checked: true })
            }
          }
          return acc
        }, [{ value: '', checked: true, isBlank: true }])
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
      const sortColumns = sort.map(e => (row) => row[e.column].toString().toLowerCase())
      const sortOrder = sort.map(e => e.value)
      newRows = orderBy(newRows, sortColumns, sortOrder)
    }

    // Column filter
    const newColumnFilters = Object.entries(columnFilters)
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
    setFilteredRows(newRows)
    setFilterFromHeaders(cloneDeep(filters))
  }

  const handleInputChange = ({ target: { value } }, index, key) => {
    const mergeObj = { [key]: value }
    onHasChanged(true)
    setRows(update(rows, {
      [index]: { $merge: mergeObj }
    }))
    setFilteredRows(update(filteredRows, {
      [index]: { $merge: mergeObj }
    }))
  }

  const handleEditGrades = (id) => {
    setEditGradeOpen(true)
    setActiveGrade(id)
  }

  const handleEnableEditDialog = (id) => {
    setSelectedRowForEdit(id)
    setEnableEditDialog(true)
  }

  const handleEnableEditConfirm = () => {
    setRows(update(rows, {
      [rows.findIndex(e => e.id === selectedRowForEdit)]: { $merge: { enableEdit: true } }
    }))
    setFilteredRows(update(filteredRows, {
      [filteredRows.findIndex(e => e.id === selectedRowForEdit)]: { $merge: { enableEdit: true } }
    }))
    setEnableEditDialog(false)
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
    reader.onloadend = function () {
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
      const enableEdit = row.enableEdit
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
        <tr
          key={`grades-list-${index}`}
          className={`tr-data${row.student_grade_cumulative_id ? ' has-data' : ''} ${enableEdit ? 'edit-enabled' : ''}`}
          onClick={() => {
            if (!isReview) {
              return !enableEdit ? handleEnableEditDialog(row.id) : {}
            }

          }}
        >
          <td>
            <input
              type='checkbox'
              checked={!!selected.find(e => e.id === row.id)}
              onChange={e => handleSelect(e, row)}
            />
          </td>
          {
            colKeysArr.map(([key, { type }]) => {
              const getFilename = (attachment) => {
                if (!attachment) {
                  return ''
                }
                const file = (typeof attachment === 'object' ? attachment.filename : attachment).split('/')
                return file[file.length - 1]
              }
              const highlightStyle = ['school_year_start', 'school_year_end'].includes(key) ? highLight(row[key] ? moment(row[key]).format('MM/yyyy') : '', key) : highLight(row[key], key)

              return (
                <td key={`td-gl-${key}-${index}`} style={{ ...highlightStyle, position: 'relative', wordBreak: 'break-word' }} className={`${key}`}>
                  {
                    !enableEdit && <div className='editCover' />
                  }
                  {
                    (
                      ['name', 'child_id', 'year_level'].includes(key)
                    ) && (
                      <input
                        readOnly
                        style={highlightStyle}
                        value={row[key] || '--'}
                      />
                    )
                  }
                  {
                    key === 'help_needed' && (
                      <div>{`${row[key]}`}</div>
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
                              if (!isReview) {
                                document.getElementById(`attachement_${row.id}`).click()
                              }

                            }}
                          />
                          <input
                            disabled={isReview}
                            id={`attachement_${row.id}`}
                            style={{ display: 'none' }}
                            type='file'
                            onChange={(e) => handelUpload(e.target.files[0], index, key)}
                          />
                        </>
                      ) : (
                        <>
                          <input
                            disabled={isReview}
                            style={highlightStyle}
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
                    key === 'school_year_start' && (
                      <DatePicker
                        disabled={isReview}
                        selected={row[key] ? new Date(row[key]) : ''}
                        onChange={date => handleInputChange({ target: { value: date.toISOString() } }, index, key)}
                        maxDate={row.school_year_end ? new Date(new Date(row.school_year_end).setMonth(new Date(row.school_year_end).getMonth() - 1)) : ''}
                        dateFormat='MM/yyyy'
                        showMonthYearPicker
                        showFullMonthYearPicker
                        showDisabledMonthNavigation
                      />
                    )
                  }
                  {
                    key === 'grades' && (
                      <FontAwesomeIcon
                        icon={faPlusCircle}
                        onClick={() => handleEditGrades(row.id)}
                      />
                    )
                  }
                  {
                    key === 'school_year_end' && (
                      <DatePicker
                        disabled={isReview}
                        selected={row[key] ? new Date(row[key]) : ''}
                        onChange={date => handleInputChange({ target: { value: date.toISOString() } }, index, key)}
                        minDate={row.school_year_start ? new Date(new Date(row.school_year_start).setMonth(new Date(row.school_year_start).getMonth() + 1)) : ''}
                        dateFormat='MM/yyyy'
                        showMonthYearPicker
                        showFullMonthYearPicker
                        showDisabledMonthNavigation
                      />
                    )
                  }
                  {
                    !['name', 'child_id', 'attachment', 'year_level', 'school_year_start', 'school_year_end', 'grades', 'help_needed'].includes(key) && (
                      <input
                        disabled={isReview}
                        style={highlightStyle}
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
    setSelected(checked ? filteredRows.map(e => e) : [])
  }

  const handleSelect = ({ target: { checked } }, row) => {
    setSelected(checked ? [...selected, row] : selected.filter(e => e.id !== row.id))
  }

  const handleAdd = () => {
    setSelectStudentOpen(true)
  }
  const remapSelectedRowsByAttemp = (data) => {
    let newRows = []
    let currMax = {}
    data.forEach(e => {
      const { standardized_test = [] } = gradeInput.gradeList.find(g => g.child_id === e.child_id) || {}
      const attemptKey = `${e.child_id}_${e.grade_taken}_${e.test_name}`
      const attempt = currMax[attemptKey] || getGradeTestAttempt(standardized_test, e.grade_taken, e.test_name, e.child_id)
      newRows = [
        ...newRows,
        { ...e, attempt: e.student_test_id ? e.attempt : attempt }
      ]
      currMax[attemptKey] = attempt + (e.student_test_id ? 0 : 1)
    })

    return newRows
  }

  const handleCopy = () => {
    const newRows = cloneDeep(rows)
    const selectedIds = selected.map(e => e.id)
    const copiedRows = newRows
      .filter(e => selectedIds.includes(e.id))
      .map(e => ({ ...e, student_test_id: '', attachment: '', id: uuid() }))
    const mergedRows = remapSelectedRowsByAttemp([...newRows, ...copiedRows])

    onHasChanged(true)
    setRows(mergedRows)
    setFilteredRows(mergedRows)
    setColumnFilters(generateColumnFilters(mergedRows))
  }

  const handleDelete = (skipConfirm = false) => {
    const selectedIds = selected.map(e => e.id)
    const newRows = remapSelectedRowsByAttemp(cloneDeep(rows).filter(e => !selectedIds.includes(e.id)))

    onHasChanged(true)
    setRows(newRows)
    setFilteredRows(newRows)
    setColumnFilters(generateColumnFilters(newRows))
    setSelected([])

    // dispatch remove from database
    if (!skipConfirm) {
      dispatch(requestDeleteStudentStandardizedTest(selected.filter(e => e.student_test_id).map(e => e.student_test_id)))
    }

    setDeleteDialog(false)
  }

  const handleSelectStudent = (data) => {
    const newRows = [...rows, ...data]
    setRows(newRows)
    setFilteredRows(newRows)
    setColumnFilters(generateColumnFilters(newRows))
    setSelectStudentOpen(false)
  }

  const handleBack = () => {
    window.location.replace('/dashboard/grades')
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
              acc[key] = e[key] || ''
            }
            return acc
          }, {})

        if (!newRow.student_grade_cumulative_id) {
          delete newRow.student_grade_cumulative_id
        }
        if (!newRow.attachment || (newRow.attachment && typeof newRow.attachment === 'string')) {
          delete newRow.attachment
        }
        if (!newRow.grades) {
          newRow.grades = []
        }

        newRow.grades = (e?.grades || [])
          .map(e => {
            let newGrade = Object.entries(gradeKeys)
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

            return newGrade
          })

        if (groupType === 'bcombs') {
          return {
            ...newRow
          }
        }
        const appGroupIdList = e.app_group_id ? e.app_group_id.split(',') : appGroupIds ;

        if(type === 'all') {

        }
        return {
          ...newRow,
          app_group_id: appGroupIdList && appGroupIdList[0],
          application_type: 'forms'
        }
      })
      console.log('NEW ROWSSSSSSSSSSSS', newRows)
      dispatch(requestAddUpdateStudentCumulative(newRows))
 
  }

  const handleSaveGrade = (grades, otherFields) => {
    const gradesHelp = grades.filter(e => (e.help_q1 || e.help_q2 || e.help_q3 || e.help_q4)).map(e => e.subject)
    const mergeObject = { grades, ...otherFields, help_needed: `${gradesHelp}` }

    setRows(update(rows, {
      [rows.findIndex(e => e.id === activeGrade)]: { $merge: mergeObject }
    }))
    setFilteredRows(update(filteredRows, {
      [filteredRows.findIndex(e => e.id === activeGrade)]: { $merge: mergeObject }
    }))
    setEditGradeOpen(false)
  }

  const handleCloseEditGradeDialog = (hasEdit) => {
    if (hasEdit) {
      setEditGradeConfirmDialog(true)
    } else {
      setEditGradeOpen(false)
      setEditGradeConfirmDialog(false)
    }
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
                // if (!value) {
                //   return null
                // }
                return (
                  <div key={`col-filter-option-${index}`} id={`${index}`} className='filter-option'>
                    <label htmlFor={`${key}_${valueID}_${index}`} className='checkboxContainer'>
                      <input
                        type='checkbox'
                        id={`${key}_${valueID}_${index}`}
                        value={value}
                        checked={checked}
                        onChange={(e) => handlePrepareColumnFilter(e, key)}
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

  useEffect(() => {
    if (gradeInput.gradeUpdated) {
      dispatch(clearGrades())
      requestList()
    }
  }, [gradeInput])

  useEffect(() => {
    if (gradeInput.gradeList) {

      // let newGradeList = (gradeInput.gradeList || []).filter(e => {
      //   if(groupType === 'forms' && type === 'all') {
      //     const ids = e.app_group_id ? e.app_group_id.split(',') : [];
      //     console.log('idssss', ids)
      //     console.log('idssss appGroupIds', appGroupIds)
      //     return ids && ids.some(id => appGroupIds && appGroupIds.includes(id))
      //   }
      //   return e.app_group_id && e.app_group_id.includes(groupId)
      // })
      let newGradeList = (gradeInput.gradeList || []) //.filter(e => e.app_group_id)
      if (groupType === 'bcombs') {
        newGradeList = newGradeList.filter(e => !e.form_contents)
      } else {
        newGradeList = newGradeList.filter(e => e.form_contents)
        console.log('newGradeListzxczxczxc',newGradeList)
        if (newGradeList.length === 0) {
          newGradeList = applications && applications.map(item => {
            return {
              ...item,
              standardized_test: []
            }
          })

        }
      }
      // let updatedGradeList = newGradeList.filter(e => e.standardized_test).flatMap(e => e.standardized_test)
      // console.log('newGradeListzzzzzzzzzzz updatedGradeList', updatedGradeList)
      // if (updatedGradeList.length > 0) {
      //   const newRows = cloneDeep(rows).map(row => {
      //     const { student_test_id } = updatedGradeList.find(e => (
      //       e.child_id === row.child_id && e.grade_taken == row.grade_taken && e.test_name === row.test_name && e.attempt == row.attempt
      //     )) || {}
      //     return { ...row, student_test_id: student_test_id || row.student_test_id }
      //   })

        setRows([])
        setFilteredRows([])
      }
      // else {
      //   setRows(newGradeList)
      //   setFilteredRows(newGradeList)
      // }


  }, [gradeInput.gradeList])

  useEffect(() => {
    if (!rows.length) {
      onHasChanged(false)
    }
  }, [rows])

  useEffect(() => {
    console.log('importData', importData);
    setRows(importData);
    setFilteredRows(importData);
  }, [importData]);

  const colArr = Object.entries(columns)
  const gColumns = {
    name: { label: 'Name', type: 'string', isFunc: true },
    // child_id: { label: 'ID', type: 'string' },
    year_level: { label: 'Level', type: 'number', isFunc: true },
    latest_grade: { label: 'Latest Year Level Inputted', type: 'string', isFunc: true },
  }

  let selectStudentRows = (gradeInput.gradeList || []).filter(e => {

    if (appGroupIds && appGroupIds.length > 0) {
      const ids = e.app_group_id && e.app_group_id.split(',');
      return ids && ids.some(id => appGroupIds.includes(id))
    }
    return e.app_group_id;
  })

  if (groupType === 'bcombs') {
    selectStudentRows = selectStudentRows.filter(e => !e.form_contents)
  } else {
   

    selectStudentRows = selectStudentRows.filter(e => {
      return e.form_contents 
    })  
      selectStudentRows = applications && applications.map((e) => {

        const currentApplication = selectStudentRows.find(item => {

          return e.app_id === item.child_id

        });

        if(currentApplication) {
          return {
            ...currentApplication
          }
        }
        return {
          app_group_id: e.class_teacher,
          child_id: e.app_id,
          standardized_test: [],
          cumulative_grades: [],
          form_contents: e.form_contents,
          firstname: null,
          lastname: null
        }
      })


      console.log('selectStudentRows1231231231123123 applications',applications)
      console.log('selectStudentRows1231231231123123',selectStudentRows)

  }
  console.log('selectStudentRows1231231231123123 2',selectStudentRows)
  return (
    <div
      className='gradesTable'
      onClick={() => {
        handleSetActiveColumnKey()
      }}
    >
      {
        (loading) ? (
          <Loading />
        ) : (
          <>
            <div className='gradeListFilter'>
              <Headers
                enableClearFilter
                filterOptions={['sort', 'highlight']}
                columns={columns}
                rows={rows}
                searchId='gradeInputSearch'

                onApplyFilter={handleApplyFilter}
              />
            </div>
            <div className='gradeListTableWrapper'>
              <table className='gradeInputView-table'>
                <thead>
                  <tr>
                    <th colSpan={5} className='standard'>Grades</th>
                    <th colSpan={3} className='th-grades'>School</th>
                    <th colSpan={3} className='th-grades'>School Year</th>
                    <th className='th-grades'>GPA</th>
                    <th className='th-grades'>Grades</th>
                    <th className='th-grades'></th>
                    <th className='th-grades'></th>
                  </tr>
                  <tr>
                    <th style={{ whiteSpace: 'initial' }}>
                      <input
                        type='checkbox'
                        checked={selected.length && selected.length === rows.length}
                        onChange={handleSelectAll}
                      />
                    </th>
                    {
                      colArr.map(([key, { label, filterable = true }]) => {
                        return (
                          <th key={`th-col-${key}`} style={{ whiteSpace: 'initial' }}>
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
                  {
                    (rows.length === 0 || filteredRows.length === 0)
                      ? (<tr><td colSpan={colArr.length}>No records.</td><td></td></tr>)
                      : renderTableData()
                  }
                </tbody>

              </table>
              {/* {
                (rows.length === 0 || filteredRows.length === 0) && (
                  <div style={{ width: '100%'}}>No records.</div>
                )
              } */}
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
                  onClick={() => {
                    if (selected.find(e => e.student_test_id)) {
                      setDeleteDialog(true)
                    } else {
                      handleDelete(true)
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                  <span>Delete</span>
                </button>
                <button
                  className={`btn-copy ${selected.length === 0 ? 'disabled' : ''}`}
                  disabled={selected.length === 0}
                  onClick={() => handleDelete(true)}
                >
                  <FontAwesomeIcon icon={faMinusCircle} />
                  <span>Remove from table</span>
                </button>
              </div>

              <div className='action right'>
                <button
                  className='btn-save'
                  disabled={rows.length === 0}
                  onClick={handleSave}
                >
                  <FontAwesomeIcon icon={faCheck} />
                  <span>Save</span>
                </button>
                <button
                  className='btn-review'
                  disabled={rows.length === 0}
                  onClick={() => {
                    setIsReview(!isReview)
                  }}
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
        editGradeOpen && (
          <EditGradeDialog
            data={rows.find(e => e.id === activeGrade)}
            gradeKeys={gradeKeys}
            onClose={(hasEdit) => handleCloseEditGradeDialog(hasEdit)}
            onSaveGrade={handleSaveGrade}
          />
        )
      }
      {
        selectStudentOpen && (
          <SelectStudentDialog
            rows={selectStudentRows}
            childId={childId}
            columns={gColumns}
            existingRows={rows}
            gradeTakenOptions={gradeTakenOptions}
            testOptions={testOptions}
            attempOptions={attempOptions}
            keys={Object.keys(goldenKeys)}
            isForm={groupType === 'forms'}
            type='grade_input'

            onClose={() => setSelectStudentOpen(false)}
            onSelectStudent={(data) => handleSelectStudent(data)}
          />
        )
      }
      {
        deleteDialog && (
          <ConfirmDialog
            onClose={() => setDeleteDialog(false)}
            onConfirm={() => handleDelete(false)}
            title='Cofirm delete student test records'
            content='Are you sure you want to remove the selected tests? These will remove them from the system.'
          />
        )
      }
      {
        editGradeConfirmDialog && (
          <ConfirmDialog
            onClose={() => setEditGradeConfirmDialog(false)}
            onConfirm={() => handleCloseEditGradeDialog(false)}
            title='Confirm closing dialog'
            content='You have unsaved changes. Would you like to close this dialog?'
          />
        )
      }
      {
        backDialog && (
          <ConfirmDialog
            onClose={() => setBackDialog(false)}
            onConfirm={handleBack}
            title='Confirm leaving page'
            content='You have unsaved changes. Would you like to leave this page?'
          />
        )
      }
      {
        enableEditDialog && (
          <ConfirmDialog
            onClose={() => setEnableEditDialog(false)}
            onConfirm={handleEnableEditConfirm}
            title='Confirm enable row edit'
            content='Are you sure you want to edit this row?'
          />
        )
      }
    </div>
  )
}
