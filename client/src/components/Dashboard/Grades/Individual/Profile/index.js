import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { maxBy } from 'lodash'
import cloneDeep from 'lodash.clonedeep'
import { Link } from '@reach/router'
import Collapsible from 'react-collapsible'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faPencilAlt, faCheck, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { useLocation } from '@reach/router';
import { parse } from 'query-string';

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

  const queryLocation = useLocation();
	const { group_id, group_type } = parse(queryLocation.search)
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
              <Link to={`/dashboard/grades/individual/${child_id}?group_id=${group_id}&group_type=${group_type}`} className='back-btn'>
                <FontAwesomeIcon className='back-icon' icon={faAngleLeft} />
                Back
              </Link>
              <div className='content'>
                <div className='left'>
                  <div className='profile'>
                    <img src={ProfileImg} />
                    <div className='profile-name'>{firstname} {lastname}</div>
                  </div>
                  <div className='customLink'>
                    <Link
                      className='applyFilterBtn'
                      to={`/dashboard/grades/input/${child_id}?group_id=${group_id}&group_type=${group_type}`}
                    >
                        {`Grades & Test Input`}
                    </Link>
                  </div>
                  <Collapsible
                    trigger={(
                      <div className='CollapsibleHeader'>
                        <span>School</span>
                        <FontAwesomeIcon className='back-icon' icon={schoolPaneOpen ? faCaretDown : faCaretUp} />
                      </div>
                    )}
                    onOpen={() => setSchoolPaneOpen(false)}
                    onClose={() => setSchoolPaneOpen(true)}
                    open lazyRender
                  >
                    <div className='CollapsibleContent'>
                      <div className='CollapsibleContentList'><p className='label'>School:</p> <p className='value'>{school_name || '--'}</p></div>
                      <div className='CollapsibleContentList'><p className='label'>Grade:</p> <p className='value'>{year_level || '--'}</p></div>
                      <div className='CollapsibleContentList'><p className='label'>Cum GPA:</p>  <p className='value'>{gpa_final || gpa_sem_1 || gpa_sem_2 || '--'}</p></div>
                      <div className='CollapsibleContentList'><p className='label'>Class Rank:</p>  <p className='value'>{final_student_rank || mid_student_rank || '--'}</p></div>
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
