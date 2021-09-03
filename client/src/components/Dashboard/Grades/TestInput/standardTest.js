import React, { useEffect, useState } from 'react'
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
import ConfirmDialog from './ConfirmDialog'
import { getGradeTestAttempt } from '../utils'

import { useSelector, useDispatch } from 'react-redux'
import { requestAddUpdateStudentStandardizedTest, requestDeleteStudentStandardizedTest, clearGrades } from '../../../../redux/actions/Grades'

export default ({ appGroupIds, applications = [], importData = [], childId, groupId, loading, groupType, requestList, onHasChanged }) => {
  const dispatch = useDispatch()
  const { gradeInput } = useSelector(({ gradeInput }) => ({
    gradeInput
  }));

  console.log('appGroupIdsv', appGroupIds)
  const attempOptions = Array(5).fill().map((e, i) => ({ value: i + 1, label: `${i + 1}` }))
  const testOptions = [{ value: 'act', label: 'ACT' }, { value: 'sat', label: 'SAT' }, { value: 'eog', label: 'EOG' }]
  const gradeTakenOptions = [{ value: 1, label: '1st' }, { value: 2, label: '2nd' }, { value: 3, label: '3rd' }, ...Array(9).fill().map((e, i) => ({ value: i + 4, label: `${i + 4}th` }))]

  const initialColumns = {
    name: { type: 'string', label: 'Name' },
    child_id: { type: 'string', label: 'ID' },
    test_name: { type: 'string', label: 'Test name' },
    attempt: { type: 'number', label: 'Attempt' },
    grade_taken: { type: 'number', label: 'Grade Taken' },
    month_taken: { type: 'string', label: 'Month Taken' },
    score: { type: 'number', label: 'Score' },
    score_percentage: { type: 'number', label: '%' },
    ach_level: { type: 'number', label: 'Ach level' },
    school_percentage: { type: 'number', label: '% school' },
    district_percentage: { type: 'number', label: '% district' },
    state_percentage: { type: 'number', label: '% state' },
    nationality_percentage: { type: 'number', label: '% nationally' },
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
    score_percentage: { type: 'float' },
    ach_level: { type: 'int' },
    school_percentage: { type: 'float' },
    nationality_percentage: { type: 'float' },
    district_percentage: { type: 'float' },
    state_percentage: { type: 'float' },
    attachment: { type: 'attachment' }
  }

  const [columns, setColumns] = useState(cloneDeep(initialColumns))
  const [rows, setRows] = useState([])
  const [filteredRows, setFilteredRows] = useState([])
  const [filterFromHeaders, setFilterFromHeaders] = useState({})
  const [activeColumnKey, setActiveColumnKey] = useState('')
  const [selected, setSelected] = useState([])
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [enableEditDialog, setEnableEditDialog] = useState(false)
  const [selectedRowForEdit, setSelectedRowForEdit] = useState('')

  const [selectStudentOpen, setSelectStudentOpen] = useState(false)

  const [isReview, setIsReview] = useState(false)

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
          return !value.length || comparer.includes(row[key])
        })

        return result.length === newColumnFilters.length
      })
    }

    setFilteredRows(newRows)
    setFilterFromHeaders(cloneDeep(filters))
  }

  const handleInputChange = ({ target: { value } }, index, key) => {
    const mergeObj = { [key]: value }

    if (['grade_taken', 'test_name'].includes(key)) {
      let { child_id, test_name, grade_taken } = rows[index]
      if (key === 'grade_taken') {
        grade_taken = value
      } else {
        test_name = value
      }

      const { standardized_test = [] } = (gradeInput?.gradeList || []).find(e => e.child_id === child_id) || {}
      const attempt = getGradeTestAttempt([...standardized_test, ...rows.filter(e => !e.student_test_id)], grade_taken, test_name, child_id)

      mergeObj.attempt = attempt
    }
    console.log('handleInputChange', mergeObj)
    onHasChanged(true)
    setRows(update(rows, {
      [index]: { $merge: mergeObj }
    }))
    setFilteredRows(update(filteredRows, {
      [index]: { $merge: mergeObj }
    }))
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

    console.log('filteredRows', filteredRows);

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
          className={`tr-data${row.student_test_id ? ' has-data' : ''} ${enableEdit ? 'edit-enabled' : ''}`}
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
              let currentMonthTaken = key === 'month_taken' ? isNaN(row[key]) ? new Date(row[key]) : parseInt(row[key]) : null;
              if (key === 'month_taken') {
                console.log('currentMonthTaken', currentMonthTaken)

              }

              const highlightStyle = key === 'month_taken' ? highLight(row[key] && row[key] !== '' ? moment(currentMonthTaken).format('MM/yyyy') : '', key) : highLight(row[key], key)
              // const inputStyles = highlightStyle.color ? { color: highlightStyle.color } : {}
              return (
                <td key={`td-gl-${key}-${index}`} style={{ ...highlightStyle, position: 'relative', wordBreak: 'break-word' }} className={`${key}`}>
                  {
                    !enableEdit && <div className='editCover' />
                  }
                  {
                    (
                      ['name', 'child_id', 'attempt'].includes(key) ||
                      (row.student_test_id && ['grade_taken', 'test_name'].includes(key))
                    ) && (
                      <input
                        readOnly
                        style={highlightStyle}
                        value={
                          key === 'test_name'
                            ? testOptions.find(e => e.value === row.test_name).label
                            : row[key] || '--'
                        }
                      />
                    )
                  }
                  {
                    (key === 'test_name' && !row.student_test_id) && (
                      <CustomSelect
                        disabled={isReview}
                        selectStyle={highlightStyle}
                        value={row[key]}
                        options={testOptions}
                        onChange={(e) => handleInputChange(e, index, key)}
                      />
                    )
                  }
                  {
                    (key === 'grade_taken' && !row.student_test_id) && (
                      <CustomSelect
                        disabled={isReview}
                        selectStyle={highlightStyle}
                        value={row[key]}
                        options={gradeTakenOptions}
                        onChange={(e) => handleInputChange(e, index, key)}
                      />
                    )
                  }
                  {/* {
                    (key === 'attempt' && !row.student_test_id) && (
                      <CustomSelect
                        value={row[key]}
                        options={attempOptions.filter(e => !existingAttempts.includes(e.value) )}
                        onChange={(e) => handleInputChange(e, index, key)}
                      />
                    )
                  } */}
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
                    key === 'month_taken' && (
                      <DatePicker
                        disabled={isReview}
                        selected={row[key] && row[key] !== '' ? isNaN(row[key]) ? new Date(row[key]) : parseInt(row[key]) : ''}
                        onChange={date => {

                          // const formattedDate =  new Date(isNaN(parseInt(parseInt(row[key]))) ? row[key] : parseInt(row[key]));
                          handleInputChange({ target: { value: date.toISOString() } }, index, key)
                        }}
                        dateFormat='MM/yyyy'
                        showMonthYearPicker
                        showFullMonthYearPicker
                      />
                    )
                  }
                  {
                    !['name', 'child_id', 'attachment', 'month_taken', 'test_name', 'grade_taken', 'attempt'].includes(key) && (
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
        if (newRow.month_taken) {
          newRow.month_taken =  moment(new Date(newRow.month_taken)).format('yyyy-MM-DD')
        }
        return newRow
      })

    dispatch(requestAddUpdateStudentStandardizedTest(newRows))
    onHasChanged(false)
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
                  handleApplyFilter(filterFromHeaders) -
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
    if (gradeInput.stUpdated) {
      dispatch(clearGrades())
      requestList()
    }
  }, [gradeInput])

  useEffect(() => {
    if (gradeInput.gradeList) {
      let newGradeList = (gradeInput.gradeList || []).filter(e => e.app_group_id)
      if (groupType === 'bcombs') {
        newGradeList = newGradeList.filter(e => !e.form_contents)
      } else {
        newGradeList = newGradeList.filter(e => e.form_contents && e.form === groupId)



        if (newGradeList.length === 0) {
          newGradeList = applications && applications.map(item => {
            return {
              ...item,
              standardized_test: []
            }
          })
        }
      }


      // newGradeList = newGradeList.flatMap(e => e.standardized_test)
      // const newRows = cloneDeep(rows).map(row => {
      //   const { student_test_id } = newGradeList.find(e => (
      //     e.child_id === row.child_id && e.grade_taken == row.grade_taken && e.test_name === row.test_name && e.attempt == row.attempt
      //   )) || {}
      //   return { ...row, student_test_id: student_test_id || row.student_test_id }
      // })
      // setRows(newRows)
      // setFilteredRows(newRows)
      let updatedGradeList = newGradeList.filter(e => e.standardized_test).flatMap(e => e.standardized_test)
      if (updatedGradeList.length > 0) {
        const newRows = cloneDeep(rows).map(row => {
          const { student_test_id } = updatedGradeList.find(e => (
            e.child_id === row.child_id && e.grade_taken == row.grade_taken && e.test_name === row.test_name && e.attempt == row.attempt
          )) || {}
          return { ...row, student_test_id: student_test_id || row.student_test_id }
        })
        setRows([])
        setFilteredRows([])
      }
      else {
        setRows([])
        setFilteredRows([])
      }
    }
    else {

    }
  }, [gradeInput.gradeList])

  useEffect(() => {
    if (!rows.length) {
      onHasChanged(false)
    }
  }, [rows])


  useEffect(() => {
    setRows(importData);
    setFilteredRows(importData);
  }, [importData]);

  const colArr = Object.entries(columns)
  const stColumns = {
    name: { label: 'Name', type: 'string', isFunc: true },
    grade_taken: { label: 'Grade Taken', type: 'number', isFunc: true },
    standardized_test: { label: 'Test Name', type: 'string', isFunc: true },
    attempt: { label: 'Attempts', type: 'number', isFunc: true },
    latest_attempt: { label: 'Latest Attempt', type: 'number', isFunc: true },
  }

  let selectStudentRows = (gradeInput.gradeList || []).filter(e => e.app_group_id)
  console.log('selectStudentRows student test 1111', selectStudentRows)
  console.log('selectStudentRows student test applications', applications)
  if (groupType === 'bcombs') {
    selectStudentRows = selectStudentRows.filter(e => !e.form_contents)
  } else {
    selectStudentRows = selectStudentRows.filter(e => {
      //e.form_contents && e.form === groupId
      const groupIds = e.app_group_id.split(',');

      return e.form_contents && e.form_contents && e.form === groupId /*&& groupIds.some(id => appGroupIds.includes(id)) **/
    })
      selectStudentRows = applications && applications.map(e => {
  
        const currentApplication = selectStudentRows.find(item => {
          const currentAppGroup = item.app_group_id ? item.app_group_id.split(',') : [];

          return currentAppGroup.find(id => appGroupIds.includes(id));
     
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

  }

  console.log('selectStudentRows student test 222', selectStudentRows)
  return (
    <div
      className='standardTestTable'
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
                searchId='testInputSearch'

                onApplyFilter={handleApplyFilter}
              />
            </div>
            <div className='gradeListTableWrapper'>
              <table className='gradeInputView-table'>
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
        selectStudentOpen && (
          <SelectStudentDialog
            rows={selectStudentRows}
            columns={stColumns}
            existingRows={rows}
            childId={childId}
            gradeTakenOptions={gradeTakenOptions}
            testOptions={testOptions}
            attempOptions={attempOptions}
            isForm={groupType === 'forms'}
            keys={Object.keys(goldenKeys)}

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
