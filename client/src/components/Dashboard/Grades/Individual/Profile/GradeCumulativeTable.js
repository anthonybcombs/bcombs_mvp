import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import moment from 'moment'
import { uuid } from 'uuidv4'
import update from 'immutability-helper'
import cloneDeep from 'lodash.clonedeep'
import CustomSelect from '../../../CustomComponents/CustomSelect'
import DatePicker from "react-datepicker";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave, faWindowClose } from '@fortawesome/free-solid-svg-icons'

import { requestAddUpdateStudentCumulative } from '../../../../../redux/actions/Grades'


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
  // attachment: { type: 'object' },
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


export default ({ appGroupId, rows: propRows, testOptions, childId, refreshGrades, groupType }) => {
  const dispatch = useDispatch();
  const gradeTakenOptions = [
    { value: 1, label: '1st' }, { value: 2, label: '2nd' }, { value: 3, label: '3rd' },
    ...Array(9).fill().map((e, i) => ({ value: i + 4, label: `${i + 4}th` }))
  ]

  const highSchoolOptions = [
    { value: 9, label: 'Freshman' }, { value: 10, label: 'Sophomore' }, { value: 11, label: 'Junior' }, { value: 12, label: 'Senior' }
  ]

  const [rows, setRows] = useState([])
  const [enableEdit, setEnableEdit] = useState(false)
  const [cumGradeOptions, setCumGradeOptions] = useState([])
  const [currentCumulativeGrade, setCurrentCumulativeGrade] = useState(null)
  const [currentCumGradeOpt, setCurrentCumGradeOpt] = useState(null);
  const [yearLevelList, setYearLevelList] = useState(null);

  const formatValue = (row, key) => {
    switch (key) {
      case 'year_level':
        if (row.year_level > 8) {
          return (highSchoolOptions.find(e => e.value == row.year_level) || {}).label || '--'
        }
        return (gradeTakenOptions.find(g => g.value === row.year_level) || {}).label || '--'
      case 'year':
        return enableEdit ? <div>

          <DatePicker
            selected={row.school_year_start && row.school_year_start !== '' ? isNaN(row.school_year_start) ? new Date(row.school_year_start) : parseInt(row.school_year_start) : ''}
            onChange={date => {
              handleInputChange({ target: { value: date.toISOString() } }, row.id, 'school_year_start')
            }}
            dateFormat='MM/yyyy'
            showMonthYearPicker
            showFullMonthYearPicker
          />

          <DatePicker
            selected={row.school_year_end && row.school_year_end !== '' ? isNaN(row.school_year_end) ? new Date(row.school_year_end) : parseInt(row.school_year_end) : ''}
            onChange={date => {
              handleInputChange({ target: { value: date.toISOString() } }, row.id, 'school_year_end')
            }}
            dateFormat='MM/yyyy'
            showMonthYearPicker
            showFullMonthYearPicker
          />
        </div> : `${moment(row.school_year_start).format('YY')}/${moment(row.school_year_end).format('YY')}`
      case 'beg_cum':
        const prevYL = row.year_level - 1
        return (propRows.find(e => e.year_level === prevYL) || {}).gpa_final || '--'
      case 'attendance':
        return (row?.grades || [])[0]?.final_quarter_attendance || '--'
      default:
        return ''
    }
  }

  const columns = {
    year_level: { type: 'string', label: 'Grade', editable: false },
    year: { type: 'date', label: 'Year', func: formatValue, editable: false },
    beg_cum: { type: 'number', label: 'Beg Cum', func: formatValue, editable: false },
    school_year_frame: { type: 'text', label: 'School Year Frame' },
    gpa_sem_1: { type: 'number', label: 'Sem 1' },
    mid_student_rank: { type: 'number', label: 'Rank' },
    gpa_sem_2: { type: 'number', label: 'Sem 2' },
    final_student_rank: { type: 'number', label: 'Rank' },
    attendance: { type: 'number', label: 'Attendance', func: formatValue },
    school_type: { type: 'text', label: 'School Type' },
    school_name: { type: 'text', label: 'School' },
    designation:  { type: 'text', label: 'Designation' }
  }

  const handleInputChange = ({ target: { value } }, id, key) => {
    setRows(update(rows, {
      [rows.findIndex(e => e.id === id)]: { $merge: { [key]: value } }
    }))
  }



  const handleSelectCumGrade = ({ target: { value } }) => {

    if (value !== 'new') {
      const row = propRows.find(e => e.student_grade_cumulative_id == value);
      setCurrentCumulativeGrade(row);
      setRows(row ? [row] : [])
      setCurrentCumGradeOpt(row?.student_grade_cumulative_id || '');

    }
    else if (value === 'new') {
      const newCumulative = {
        app_group_id: appGroupId,
        app_group_name: null,
        application_type: groupType,
        attachment: null,
        child_designation: "",
        child_id: childId,
        class_name: null,
        class_teacher: null,
        class_type: null,
        final_student_rank: 0,
        firstname: "",
        form_contents: null,
        gpa_final: 0,
        gpa_sem_1: 0,
        gpa_sem_2: 0,
        grades: [],
        lastname: "",
        mid_student_rank: 0,
        scale: 0,
        school_designation: null,
        school_name: null,
        school_type: null,
        school_year_end: 0,
        school_year_frame: 'quarter',
        school_year_start: 0,
        is_new: true,
        id: uuid()
        // student_grade_cumulative_id: 95,
      };

      setCurrentCumulativeGrade(newCumulative);
      setRows([newCumulative]);
      setCurrentCumGradeOpt('new');

    }


  }

  const handleCancel = () => {
    setRows([propRows[0]]);
    setEnableEdit(false);
  }

  useEffect(() => {
    if (propRows && propRows.length) {
      const yearLevels = propRows.map(item => item.year_level);
      setYearLevelList(yearLevels);
      setRows([propRows[0]])
      setCumGradeOptions(propRows.map(e => {
        const gradeNumth = (gradeTakenOptions.find(g => g.value === e.year_level) || {}).label || ''
        return {
          value: e.student_grade_cumulative_id, label: `${gradeNumth} Grade Cumulative`
        }
      }))
    }
  }, [propRows])

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

        delete e.class_teacher;
        delete e.class_name;
        delete e.class_type;
        delete e.app_group_name;
        delete e.lastname;
        delete e.firstname;
        delete e.attachment;
        delete e.form_contents;

        if (!e.student_grade_cumulative_id) {
          delete e.student_grade_cumulative_id
        }
        if (!e.attachment || (e.attachment && typeof e.attachment === 'string')) {
          delete e.attachment
        }
        if (!e.grades) {
          e.grades = []
        }

        newRow.grades = (newRow?.grades || [])
          .map(e => {
            delete e.attendance;
            delete e.final_semestral_1_attendance;
            delete e.final_semestral_2_attendance;
            delete e.help_needed;
            delete e.quarter_average;

            delete e.semestral_1_average;
            delete e.semestral_2_average;
            delete e.semestral_final;

            delete e.final_quarter_attendance;
            // delete e.final_quarter_remarks;

            delete e.attendance_quarter_1_present;
            delete e.attendance_quarter_2_present;
            delete e.attendance_quarter_3_present;
            delete e.attendance_quarter_4_present;
            delete e.grades;
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


        return {
          ...newRow,
          app_group_id: appGroupId,
          application_type: 'bcombs'
        }
      })


    dispatch(requestAddUpdateStudentCumulative(newRows));
    setEnableEdit(false);
    setTimeout(() => {
      refreshGrades();
    },1500);

  }
  // const gradeTakenOptions = [{ value: 1, label: '1st' }, { value: 2, label: '2nd' }, { value: 3, label: '3rd' }, ...Array(9).fill().map((e, i) => ({ value: i + 4, label: `${i + 4}th` }))]
 
  return (
    <div className='rightContainer'>
      <div className='rightContainerHeader'>
        <CustomSelect
          value={rows[0]?.student_grade_cumulative_id || ''}
          options={[...(cumGradeOptions || []), { value: "new", label: "New Grade Level" }]}
          placeholder='Select Grade Level'
          onChange={handleSelectCumGrade}
        />
        <div style={{ paddingTop: 12 }}>
          {
            !enableEdit ? (
              rows.length > 0 &&

              <FontAwesomeIcon className="edit-icon" onClick={() => setEnableEdit(true)} icon={faEdit} style={{
                color: '#f26e21',
                fontSize: 24
              }} />
            ) : (
              <>

                <FontAwesomeIcon className="edit-icon" onClick={handleCancel} icon={faWindowClose} style={{
                  color: '#f26e21',
                  fontSize: 24
                }} />
                {`  `}
                <FontAwesomeIcon className="edit-icon" onClick={handleSave} icon={faSave} style={{
                  color: '#f26e21',
                  fontSize: 24
                }} />
              </>
            )
          }
        </div>
      </div>

      <div className='tableWrapper'>
        <table className='profileTrackingTable gradeLevelTable'>
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
                                  (enableEdit && (editable || row.is_new)) ? (

                                   
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
    </div>
  )
}