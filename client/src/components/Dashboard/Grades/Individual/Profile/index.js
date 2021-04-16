import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cloneDeep from 'lodash.clonedeep'
import orderBy from 'lodash.orderby'
import { Link } from '@reach/router'
import Collapsible from 'react-collapsible'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faPencilAlt, faCheck, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'

import GradesStyled from './styles'
import ProfileImg from '../../../../../images/defaultprofile.png'
import Loading from '../../../../../helpers/Loading.js'
import StandardTestTable from './StandardTestTable'
import GradeCumulativeTable from './GradeCumulativeTable'

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

//   useEffect(() => {
//     dispatch(requestGetStudentCumulativeGradeByUser(child_id))
//   }, [])

  useEffect(() => {
    if (gradeInput?.individualList) {
      setData(gradeInput.individualList)
    }
  }, [gradeInput])

  console.log('@DATA', data)
  const { firstname, lastname, hobbies, career_goals, accomplishments } = data?.info || {}
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
                        <div>School: John Hopkins</div>
                        <div>Grade: 11</div>
                        <div>Cum GPA: 3.2</div>
                        <div>Class Rank: 3/302</div>
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
                    <Collapsible
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
                    </Collapsible>
                  </div>
                  <div className='right'>
                    <StandardTestTable
                      rows={data?.standardized_test || []}
                      testOptions={testOptions}
                    />
                    <GradeCumulativeTable
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
