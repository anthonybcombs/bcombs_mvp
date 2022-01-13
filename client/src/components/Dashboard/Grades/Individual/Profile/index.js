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
import { getNameFromCustomForm } from '../../utils'

export default ({ child_id }) => {
  const dispatch = useDispatch()
  const { gradeInput, loading: { gradeLoading } } = useSelector(({ gradeInput, loading }) => ({
    gradeInput, loading
  }))


  const queryLocation = useLocation();
	const { group_id, parent_ids, group_type, request_type, is_parent } = parse(queryLocation.search)
  //const isVendor = request_type === 'vendor'
  const commonQueryStrings = `group_id=${group_id}&group_type=${group_type}&request_type=${request_type}`
  const testOptions = [{ value: 'act', label: 'ACT' }, { value: 'sat', label: 'SAT' }, { value: 'eog', label: 'EOG' }]
  const testOptionsObj = cloneDeep(testOptions.reduce((acc, curr) => ({ ...acc, [curr.value]: 0 }), {}))

  const [data, setData] = useState({})
  const [schoolPaneOpen, setSchoolPaneOpen] = useState(false)
  const [personalPaneOpen, setPersonalPaneOpen] = useState(false)
  const [familylPaneOpen, setFamilyPaneOpen] = useState(false)

  useEffect(() => {
    dispatch(requestGetStudentCumulativeGradeByUser({ child_id, application_type: group_type }))
  }, [])

  useEffect(() => {
    if (gradeInput?.individualList) {
      setData(gradeInput.individualList)
    }
  }, [gradeInput])

  let { firstname, lastname, form_contents } = data?.info || {}
  let profile = ''

  const { school_name, year_level, gpa_final, gpa_sem_1, gpa_sem_2, final_student_rank, mid_student_rank } = maxBy((data?.cumulative_grades || []), 'year_level') || {}
  
  if (form_contents) {
    const name = getNameFromCustomForm(form_contents)
    firstname = name.firstname
    lastname = name.lastname
  }


  if (!form_contents && data?.info?.image) {
    profile = data?.info?.image.includes('file/') ? 'https://bcombs.s3.amazonaws.com/' + data?.info?.image : data?.info?.image;
  } else if (form_contents) {
    const { formData = [] } = typeof form_contents === 'string' ? JSON.parse(form_contents) : form_contents
    const { fields = [] } = formData.find(e => e.fields[0].tag === 'profileImage') || {}
    if (fields.length) {
      const { value } = fields[0]
      const { url } = value ? JSON.parse(value) : {}
      profile = url.includes('file/') ? 'https://bcombs.s3.amazonaws.com/' + url : url;
    }
  }
  return (
    <GradesStyled>
      <h2>Grades and Tracking</h2>

      <div id='gradesAndTracking'>
        {
          gradeLoading ? (
            <Loading />
          ) : (
            <>
              <Link to={`/dashboard/grades/individual/${child_id}?${commonQueryStrings}`} className='back-btn'>
                <FontAwesomeIcon className='back-icon' icon={faAngleLeft} />
                Back
              </Link>
              <div className='content'>
                <div className='left'>
                  <div className='profile'>
                    <img src={profile || ProfileImg} />
                    <div className='profile-name'>{firstname} {lastname}</div>
                  </div>
                  <div className='customLink'>
                    <Link
                      className='applyFilterBtn'
                      to={is_parent ? `/dashboard/grades/input?appGroupIds=${group_id}&parent_ids=${parent_ids}&is_parent=true` : `/dashboard/grades/input/${child_id}?${commonQueryStrings}`}
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
                      <div className='CollapsibleContentList'><p className='label'>Group Rank:</p>  <p className='value'>{final_student_rank || mid_student_rank || '--'}</p></div>
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
                    appGroupId={group_id}
                    childId={child_id}
                    rows={data?.cumulative_grades || []}
                  />
                  <IndividualGrades
                    appGroupId={group_id}
                    childId={child_id}
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
