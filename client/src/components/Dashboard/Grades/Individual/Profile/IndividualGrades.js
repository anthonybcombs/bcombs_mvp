import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import cloneDeep from 'lodash.clonedeep'
import moment from 'moment'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave, faWindowClose, faPlusCircle } from '@fortawesome/free-solid-svg-icons'

import { requestAddUpdateStudentCumulative, clearGrades } from '../../../../../redux/actions/Grades'
import { uuid } from 'uuidv4';


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



const TABLE = (data) => {
  const { rows, columns, year_level = 0, school_year_start, school_year_end, gradeTakenOptions, enableEdit, handleInputChange, attendanceColumns } = data

  const attendanceRows = rows.map(item => {
    return attendanceColumns.reduce((accum, key) => {
      return {
        ...accum,
        [key]: item[key]
      }
    }, {})

  }).reduce((accum, item) => {
    return {
      attendance_quarter_1_total: accum.attendance_quarter_1_total + item.attendance_quarter_1_total,
      attendance_quarter_2_total: accum.attendance_quarter_2_total + item.attendance_quarter_2_total,
      attendance_quarter_3_total: accum.attendance_quarter_3_total + item.attendance_quarter_3_total,
      final_quarter_attendance: accum.final_quarter_attendance + item.final_quarter_attendance
    }
  }, {
    attendance_quarter_1_total: 0,
    attendance_quarter_2_total: 0,
    attendance_quarter_3_total: 0,
    final_quarter_attendance: 0
  })

  console.log('attendanceRows', attendanceRows)
  return (
    <div className='tableWrapper'>

      <table className='profileTrackingTable individualGradesTable'>
        <thead>
          <tr>
            <th colSpan={Object.keys(columns).length}>
              {(gradeTakenOptions.find(e => e.value === year_level) || {}).label}
              Grade
              ({moment(school_year_start).format('YY')}/{moment(school_year_end).format('YY')})
            </th>
          </tr>
          <tr>
            {
              Object.values(columns).map(({ label }, index) => {
                return (<th key={`st-th-${index}`}>{label}</th>)
              })
            }
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Attendance</td>
            <td></td>
            <td>{attendanceRows.attendance_quarter_1_total}</td>
            <td>{attendanceRows.attendance_quarter_2_total}</td>
            <td>{attendanceRows.attendance_quarter_3_total}</td>
            <td>{attendanceRows.final_quarter_attendance}</td>


          </tr>
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
                                (enableEdit && ( editable || row.is_new)) ? (
                                  <input
                                    type={type === 'number' ? 'number' : 'text'}
                                    value={row[key]}
                                    onChange={(e) => handleInputChange(e, key, index, row.student_grade_cumulative_id)}
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
  )
}

export default ({ appGroupId, rows: propRows, testOptions, refreshGrades }) => {
  const dispatch = useDispatch();
  const gradeTakenOptions = [
    { value: 1, label: '1st' }, { value: 2, label: '2nd' }, { value: 3, label: '3rd' },
    ...Array(9).fill().map((e, i) => ({ value: i + 4, label: `${i + 4}th` }))
  ]

  const [rows, setRows] = useState([])
  const [enableEdit, setEnableEdit] = useState(false)

  const formatValue = (row, key) => {
    switch (key) {
      case 'year':
        return `${moment(row.school_year_start).format('YY')}/${moment(row.school_year_end).format('YY')}`
      case 'beg_cum':
        const prevYL = row.year_level && row.year_level - 1
        return (rows.find(e => e.year_level === prevYL) || {}).gpa_final || '--'
      case 'attendance':
        return (row?.grades || [])[0]?.final_quarter_attendance || '--'
      default:
        return ''
    }
  }

  const semColumns = {
    class: { type: 'string', label: 'Class' },
    subject: { type: 'string', label: 'Subject'},
    letter_grade_quarter_1: { type: 'number', label: 'Q1' },
    letter_grade_quarter_2: { type: 'number', label: 'Q2' },
    letter_mid_final_grade: { type: 'number', label: 'Final' },
    letter_grade_quarter_3: { type: 'number', label: 'Q1' },
    letter_grade_quarter_4: { type: 'number', label: 'Q2' },
    letter_final_grade: { type: 'number', label: 'Final' },
    letter_year_final_grade: { type: 'number', label: 'Year Final', editable: false },
  }

  const quarterColumns = {
    class: { type: 'string', label: 'Class', editable: false },
    subject: { type: 'string', label: 'Subject', editable: false },
    letter_grade_quarter_1: { type: 'number', label: 'Q1' },
    letter_grade_quarter_2: { type: 'number', label: 'Q2' },
    letter_grade_quarter_3: { type: 'number', label: 'Q3' },
    letter_grade_quarter_4: { type: 'number', label: 'Q4' },
    letter_year_final_grade: { type: 'number', label: 'Year Final', editable: false },
  }

  const handleInputChange = ({ target: { value } }, key, gradeIndex, cumulativeId) => {
    let updatedRows = [...(rows || [])]
    const currentRowIndex = rows.findIndex(item => item.student_grade_cumulative_id === cumulativeId);
    updatedRows[currentRowIndex].grades[gradeIndex] = {
      ...(updatedRows[currentRowIndex].grades[gradeIndex] || {}),
      [key]: value
    }

    setRows(updatedRows)

  }

  useEffect(() => {
    if (propRows && propRows.length) {
      setRows(propRows)
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

  const handleAdd = id => {
    const grade = {
      attendance: null,
      attendance_quarter_1_absent: 0,
      attendance_quarter_1_present: 0,
      attendance_quarter_1_tardy: 0,
      attendance_quarter_1_total: 0,
      attendance_quarter_2_absent: 0,
      attendance_quarter_2_present: 0,
      attendance_quarter_2_tardy: 0,
      attendance_quarter_2_total: 0,
      attendance_quarter_3_absent: 0,
      attendance_quarter_3_present: 0,
      attendance_quarter_3_tardy: 0,
      attendance_quarter_3_total: 0,
      attendance_quarter_4_absent: 0,
      attendance_quarter_4_present: 0,
      attendance_quarter_4_tardy: 0,
      attendance_quarter_4_total: 0,
      class: "",
      designation: "",
      final_grade: 0,
      final_quarter_attendance: 0,
      final_quarter_remarks: "0",
      final_semestral_1_attendance: null,
      final_semestral_2_attendance: null,
      grade_quarter_1: 0,
      grade_quarter_2: 0,
      grade_quarter_3: 0,
      grade_quarter_4: 0,
      help_needed: "",
      help_q1: "",
      help_q2: "",
      help_q3: "",
      help_q4: "",
      letter_final_grade: "55",
      letter_grade_quarter_1: "55",
      letter_grade_quarter_2: "77",
      letter_grade_quarter_3: "88",
      letter_grade_quarter_4: "2",
      letter_mid_final_grade: "4",
      letter_year_final_grade: "77",
      mid_final_grade: 0,
      mid_quarter_remarks: "0",
      quarter_average: 0,
      semestral_1_average: null,
      semestral_2_average: null,
      semestral_final: null,
      student_grade_cumulative_id: id,
      subject: "",
      teacher_name: "",
      year_final_grade: 0,
      id: uuid(),
      is_new: true
    }
    const updateRows = rows.map((item, index) => {
      if(item.student_grade_cumulative_id === id) {
        return {
          ...item,
          grades: [...(item.grades || []), grade]
        }
      }
      return {
        ...item
      }
    });

    setRows(updateRows);
  };

  const isNoGrades = rows.every(item => item.grades.length === 0);

  return (
    <>
      <div style={{ paddingTop: 12, paddingLeft: 12, paddingBottom: 12 }}>
        {
          !isNoGrades && (!enableEdit ? (
            rows.length > 0 &&
            <FontAwesomeIcon className="edit-icon" onClick={() => setEnableEdit(true)} icon={faEdit} style={{
              color: '#f26e21',
              fontSize: 24,
              cursor:'pointer'
            }} />
          ) : (

            <>
              <FontAwesomeIcon className="edit-icon" onClick={() => setEnableEdit(false)} icon={faWindowClose} style={{
                color: '#f26e21',
                fontSize: 24,
                cursor:'pointer'
              }} />
              {`  `}
              <FontAwesomeIcon className="edit-icon" onClick={handleSave} icon={faSave} style={{
                color: '#f26e21',
                fontSize: 24,
                cursor:'pointer'
              }} />
            </>
          ))
        }
      </div>
      {
        rows.map(({ grades, school_year_frame, student_grade_cumulative_id, ...rest }, gi) => {

        
          return (
            <>
              <div style={{ paddingTop: 12, paddingLeft: 12, paddingBottom: 12 }}>
                {enableEdit && <FontAwesomeIcon className="plus-icon" onClick={() => {
                  handleAdd(student_grade_cumulative_id);
                }} icon={faPlusCircle} style={{
                  color: '#f26e21',
                  fontSize: 24,
                  cursor:'pointer'
                }} /> }
               
              </div>

              {school_year_frame === 'semestral' ? <div key={`individual-grades-${gi}`} className='rightContainer'>
                <div className='rightContainerHeader'>
                  <span className='header'>Individual Grades (Semester)</span>
                </div>
                <TABLE
                  {...rest}
                  rows={grades}
                  columns={semColumns}
                  gradeTakenOptions={gradeTakenOptions}
                  enableEdit={enableEdit}
                  handleInputChange={handleInputChange}
                  handleSave={handleSave}
                  attendanceColumns={['attendance_quarter_1_total', 'attendance_quarter_2_total', 'mid_final_attendance', 'attendance_quarter_3_total', 'attendance_quarter_4_total', 'final_attendance', 'final_quarter_attendance']}
                />
              </div> :

                <div className='rightContainer'>
                  <div className='rightContainerHeader'>
                    <span className='header'>Individual Grades (Quarter)</span>
                  </div>
                  <TABLE
                    {...rest}
                    rows={grades}
                    columns={quarterColumns}
                    gradeTakenOptions={gradeTakenOptions}
                    enableEdit={enableEdit}
                    handleInputChange={handleInputChange}
                    handleSave={handleSave}
                    attendanceColumns={['attendance_quarter_1_total', 'attendance_quarter_2_total', 'attendance_quarter_3_total', 'final_quarter_attendance']}
                  />
                </div>}

            </>
          )
        })
      }
    </>
  )
}