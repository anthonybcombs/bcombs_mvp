import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { maxBy } from 'lodash'
import cloneDeep from 'lodash.clonedeep'
import { Link } from '@reach/router'
import Collapsible from 'react-collapsible'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faPencilAlt, faCheck, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'

import GradesStyled from './styles'
import ProfileImg from '../../../../../images/defaultprofile.png'
import Loading from '../../../../../helpers/Loading.js'
import StandardTestTable from './StandardTestTable'
import GradeCumulativeTable from './GradeCumulativeTable'
import IndividualGrades from './IndividualGrades'

import { requestGetStudentCumulativeGradeByUser  } from '../../../../../redux/actions/Grades'

export default ({ child_id }) => {
  const dispatch = useDispatch()
  const { gradeInput, loading: { gradeLoading } } = useSelector(({ gradeInput, loading }) => ({
    gradeInput, loading
  }))

  const testOptions = [{ value: 'act', label: 'ACT' }, { value: 'sat', label: 'SAT' }, { value: 'eog', label: 'EOG' }]
  const testOptionsObj = cloneDeep(testOptions.reduce((acc, curr) => ({ ...acc, [curr.value]: 0 }), {}))

  const [data, setData] = useState({})
  const [schoolPaneOpen, setSchoolPaneOpen] = useState(false)
  const [personalPaneOpen, setPersonalPaneOpen] = useState(false)
  const [familylPaneOpen, setFamilyPaneOpen] = useState(false)

  useEffect(() => {
    dispatch(requestGetStudentCumulativeGradeByUser(child_id))
  }, [])

  useEffect(() => {
    if (gradeInput?.individualList) {
      setData(gradeInput.individualList)
    }
  }, [gradeInput])

  const { firstname, lastname, hobbies, career_goals, accomplishments } = data?.info || {}
  const { school_name, year_level, gpa_final, gpa_sem_1, gpa_sem_2, final_student_rank, mid_student_rank } = maxBy((data?.cumulative_grades || []), 'year_level') || {}
  console.log('@DATA', {...data })
  return (
    <GradesStyled>
      <h2>Grades and Tracking</h2>
        <div id='gradesAndTracking'>
          {
            gradeLoading ? (
              <Loading />
            ) : (
              <>
                <Link to={`/dashboard/grades/${child_id}`} className='back-btn'>
                  <FontAwesomeIcon className='back-icon' icon={faAngleLeft} />
                  Back
                </Link>

                <div className='content'>
                  <div className='left'>
                    <div className='profile'>
                      <img src={ProfileImg} />
                      <div>{firstname} {lastname}</div>
                    </div>
                    <Link
                      className='applyFilterBtn'
                      to={`/dashboard/grades/input`}
                    >
                        {`Grades & Test Input`}
                    </Link>
                    <Collapsible
                      trigger={(
                        <div>
                          <span>School</span>
                          <FontAwesomeIcon className='back-icon' icon={schoolPaneOpen ? faCaretDown : faCaretUp} />
                        </div>
                      )}
                      onOpen={() => setSchoolPaneOpen(false)}
                      onClose={() => setSchoolPaneOpen(true)}
                      open lazyRender
                    >
                      <div>
                        <div>School: {school_name || '--'}</div>
                        <div>Grade: {year_level || '--'}</div>
                        <div>Cum GPA: {gpa_final || gpa_sem_1 || gpa_sem_2 || '--'}</div>
                        <div>Class Rank: {final_student_rank || mid_student_rank || '--'}</div>
                      </div>
                    </Collapsible>
                    {/* <Collapsible
                      trigger={(
                        <div>
                          <span>Personal</span>
                          <FontAwesomeIcon className='back-icon' icon={personalPaneOpen ? faCaretDown : faCaretUp} />
                        </div>
                      )}
                      onOpen={() => setPersonalPaneOpen(false)}
                      onClose={() => setPersonalPaneOpen(true)}
                      open lazyRender
                    >
                      <div>
                        <div>
                          <div>Interests / hobbies:</div>
                          <div>{hobbies || '--'}</div>
                        </div>
                        <div>
                          <div>Career:</div>
                          <div>{career_goals || '--'}</div>
                        </div>
                        <div>
                          <div>Accomplishments:</div>
                          <div>{accomplishments || '--'}</div>
                        </div>
                      </div>
                    </Collapsible> */}
                    {/* <Collapsible
                      trigger={(
                        <div>
                          <span>Family</span>
                          <FontAwesomeIcon className='back-icon' icon={familylPaneOpen ? faCaretDown : faCaretUp} />
                        </div>
                      )}
                      onOpen={() => setFamilyPaneOpen(false)}
                      onClose={() => setFamilyPaneOpen(true)}
                      open lazyRender
                    >
                      <div>
                        --
                      </div>
                    </Collapsible> */}
                  </div>
                  <div className='right'>
                    <StandardTestTable
                      rows={data?.standardized_test || []}
                      testOptions={testOptions}
                    />
                    <GradeCumulativeTable
                      rows={data?.cumulative_grades || []}
                    />
                    <IndividualGrades
                      rows={data?.cumulative_grades || []}
                    />
                  </div>
                </div>
              </>
            )
          }
        </div>
    </GradesStyled>
  )
}
