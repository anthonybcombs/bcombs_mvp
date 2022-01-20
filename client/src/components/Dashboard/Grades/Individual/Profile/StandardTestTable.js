import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { uuid } from 'uuidv4'
import moment from 'moment'
import cloneDeep from 'lodash.clonedeep'
import update from 'immutability-helper'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faEdit, faSave, faWindowClose, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons'
import DatePicker from "react-datepicker";

import { requestAddUpdateStudentStandardizedTest, requestDeleteStudentStandardizedTest, clearGrades } from '../../../../../redux/actions/Grades'


export default ({ rows: propRows, testOptions, refreshGrades, childId }) => {
  const dispatch = useDispatch();
  const { gradeInput, loading: { gradeLoading } } = useSelector(({ gradeInput, loading }) => {
    return {
      gradeInput,
      loading
    }
  });

  const [enableEdit, setEnableEdit] = useState(false)
  const [rows, setRows] = useState([])
  const [defaultRows, setDefaultRows] = useState([])
  const [deletedStudentTestIds, setDeletedTestStudentIds] = useState([])

 
  const formatValue = (row, key) => {
  
    switch (key) {
      case 'test_name':
        return enableEdit ?  <select  onChange={(e) => handleInputChange(e, row.id, key)} onChange={(e) => handleInputChange(e, row.id, key)} value={row.test_name}>{testOptions.map(item => <option value={item.value}>{item.label}</option>)}</select>:  (testOptions.find(e => e.value === row.test_name) || {}).label || '--'
      case 'month_taken':
        return row.month_taken ? moment(new Date(row.month_taken)).format('MMMM YYYY') : null
      case 'score_percentage':
      case 'school_percentage':
      case 'district_percentage':
      case 'state_percentage':
      case 'nationality_percentage':
        return enableEdit ? (
          <input
            type='number'
            value={row[key] || ''}
            onChange={(e) => handleInputChange(e, row.id, key)}
          />
        ) : (
          row[key] ? `${row[key]}%` : '--'
        )
        case 'delete':
          return enableEdit && <FontAwesomeIcon className="edit-icon" onClick={() => {
            if(row.is_new) {
              handleDelete( 'id', row.id)
            }
            else{
              handleDelete('student_test_id',row.student_test_id)
            }
          }} icon={faTrash} style={{
            color: '#f26e21',
            fontSize: 24,
            cursor:'pointer'
          }} />
      default:
        return ''
    }
  }


  const goldenKeys = {
    student_test_id: { type: 'int' },
    child_id: { type: 'string' },
    test_name: { type: 'string' },
    attempt: { type: 'int' },
    grade_taken: { type: 'int' },
    month_taken: { type: 'date' },
    score: { type: 'int' },
    score_percentage: { type: 'float' },
    ach_level: { type: 'int' },
    school_percentage: { type: 'float' },
    nationality_percentage: { type: 'float' },
    district_percentage: { type: 'float' },
    state_percentage: { type: 'float' },
    attachment: { type: 'attachment' }
  }

  const columns = {
    test_name: { type: 'string', label: 'Test name', func: formatValue, editable: false },
    month_taken: { type: 'date', label: 'Taken'  },
    attempt: { type: 'number', label: 'Attempt', editable: false },
    grade_taken: { type: 'number', label: 'Grades', editable: false },
    score: { type: 'number', label: 'Score' },
    ach_level: { type: 'number', label: 'Ach level' },
    score_percentage: { type: 'number', label: '%', func: formatValue },
    school_percentage: { type: 'number', label: '% school', func: formatValue },
    district_percentage: { type: 'number', label: '% district', func: formatValue },
    state_percentage: { type: 'number', label: '% state', func: formatValue },
    nationality_percentage: { type: 'number', label: '% nationally', func: formatValue },
    delete: { type: 'string', label: 'Delete', editable: false, func: formatValue}
  }

  const handleInputChange = ({ target: { value } }, id, key) => {
    setRows(update(rows, {
      [rows.findIndex(e => e.id === id)]: { $merge: { [key]: value } }
    }))
  }

  useEffect(() => {

    if (propRows && propRows.length) {
      const currentRows = propRows.map(e => ({ ...e, id: uuid() }));
      setRows(cloneDeep(currentRows));
      setDefaultRows(cloneDeep(currentRows))
    }
  }, [propRows]);


  const handleCancel = () => {
    if (propRows && propRows.length) {
      setRows(defaultRows);
    }
    setEnableEdit(false);
  }

  const handleDelete = (field, value) =>  { 
    let updatedRows = cloneDeep(rows);
      updatedRows = updatedRows.filter((item, index) => {
      return item[field] !== value
     });
   
     setDeletedTestStudentIds([...deletedStudentTestIds,value])
     setRows(updatedRows);
   }

  const handleAdd = () => {
    let currentRows = cloneDeep(rows);
    let newRows =   cloneDeep(currentRows[currentRows.length - 1]);
    
    //      student_test_id: newRows.student_test_id + 1,
    currentRows.push({
        child_id: childId,
        attempt: 0,
        ach_level: 0,
        district_percentage: 0,
        grade_taken: 0,
        month_taken: null,
        nationality_percentage: 0,
        school_percentage: 0,
        score: 0,
        score_percentage: 0,
        state_percentage: 0,
        test_name: "",

        id: uuid(),
        is_new: true
    })
 
    setRows(currentRows);

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
          newRow.month_taken = newRow.month_taken && !isNaN(newRow.month_taken) ? moment(new Date(parseInt(newRow.month_taken))).format('yyyy-MM-DD') : moment(new Date(newRow.month_taken)).format('yyyy-MM-DD')
        }
        if(newRow.is_new) {
          delete newRow.is_new;
        }
        return newRow
      })

  
        dispatch(requestAddUpdateStudentStandardizedTest(newRows))
        setEnableEdit(false);

        if(deletedStudentTestIds.length > 0) {
    
          dispatch(requestDeleteStudentStandardizedTest(deletedStudentTestIds));
        }

        setTimeout(() => {
          refreshGrades();
          setDeletedTestStudentIds([]);
        },1500)
       
  }

  return (
    <div className='rightContainer'>
      <div className='rightContainerHeader'>
        <span className='header'>Standard Test</span>
        <div style={{ paddingTop: 12 }}>
          {
            !enableEdit ? (
              
              <FontAwesomeIcon  className="edit-icon"  onClick={() => setEnableEdit(true)}  icon={faEdit} style={{
                color:'#f26e21',
                fontSize: 24,
                cursor:'pointer'
             }} />
            ) : (
              <>
              <FontAwesomeIcon  className="edit-icon"  onClick={handleCancel}  icon={faWindowClose} style={{
                 color:'#f26e21',
                fontSize: 24,
                cursor:'pointer'
               }} />
                {`  `}
                <FontAwesomeIcon  className="edit-icon"  onClick={handleSave}  icon={faSave} style={{
                 color:'#f26e21',
                 fontSize: 24,
                 cursor:'pointer'
               }} />
                {`  `}
               <FontAwesomeIcon  className="plus-icon"  onClick={handleAdd}  icon={faPlusCircle} style={{
                 color:'#f26e21',
                 fontSize: 24,
                 cursor:'pointer'
               }} />
                </>
            
            )
          }
        </div>

      </div>

      <div className='tableWrapper'>
        <table className='profileTrackingTable standardTestTable'>
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
                          
                          editable = row.is_new;
                          return (
                            <td key={`td-ct-${key}-${index}`}>
                              {
                                func ? (
                                  func(row, key)
                                ) : (
                                  (enableEdit && editable) ? (

                                    type === 'date' ?
                                      
                                        <DatePicker
                                          selected={row[key] && row[key] !== '' ? isNaN(row[key]) ? new Date(row[key]) : parseInt(row[key]) : ''}
                                          onChange={date => {
                                             handleInputChange({ target: { value: date.toISOString() } },  row.id, key)
                                          }}
                                          dateFormat='MM/yyyy'
                                          showMonthYearPicker
                                          showFullMonthYearPicker
                                        />
                                      
                                     : 
                                    <input
                                      type={type}
                                      value={row[key]}
                                      onChange={(e) => handleInputChange(e, row.id, key)}
                                    />
                                  ) : (
                                    type === 'date' ?  moment( isNaN(row[key]) ? new Date(row[key]) : parseInt(row[key])).format('MMMM YYYY') : row[key] || '--'
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

    </div>
  )
}