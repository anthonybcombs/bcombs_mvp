import React, { useEffect, useState } from 'react'
import cloneDeep from 'lodash.clonedeep'
import orderBy from 'lodash.orderby'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'

import GradesStyled from './styles'
import Headers from '../Headers'

import Loading from '../../../../helpers/Loading.js'

import { useSelector, useDispatch } from 'react-redux'

import { requestVendor } from '../../../../redux/actions/Vendors'

export default ({ form_id, type, history }) => {
  const data = cloneDeep([
    {
      name: 'John Doe',
      address: 'Address 1',
      grade: '5.9',
      math: 'A',
      science: 'B',
      english: 'C',
      history: 'B',
      date: '2021-01-16T18:26:16.468Z',
    },
    {
      name: 'John Smith',
      address: 'Address 2',
      grade: '2.2',
      math: 'B',
      science: 'B',
      english: 'B',
      history: 'B',
      date: '2021-02-16T18:26:16.468Z',
    },
    {
      name: 'Smith Legend',
      address: 'Address 3',
      grade: '3.1',
      math: 'A',
      science: 'A',
      english: 'A',
      history: 'A',
      date: '2021-03-16T18:26:16.468Z',
    },
    {
      name: 'John Legend',
      address: 'Address 4',
      grade: '2.1',
      math: 'C',
      science: 'A',
      english: 'B',
      history: 'C',
      date: '2021-04-16T18:26:16.468Z',
    },
    {
      name: 'Legend Doe',
      address: 'Address 5',
      grade: '2.5',
      math: 'C',
      science: 'C',
      english: 'C',
      history: 'C',
      date: '2021-05-16T18:26:16.468Z',
    },
    {
      name: 'John Doe',
      address: 'Address 6',
      grade: '3.1',
      math: 'A',
      science: 'C',
      english: 'B',
      history: 'C',
      date: '2021-06-16T18:26:16.468Z',
    },
  ])

  const columns = {
    name: { type: 'string', label: 'Name' },
    address: { type: 'string', label: 'Address' },
    grade: { type: 'number', label: 'Grade' },
    math: { type: 'string', label: 'Math' },
    science: { type: 'string', label: 'Science' },
    english: { type: 'string', label: 'English' },
    history: { type: 'string', label: 'History' },
    date: { type: 'date', label: 'Date' },
  }
  const subjectColumns = ['math', 'science', 'english', 'history']
  const subjectDisplayCount = 3

  const [rows, setRows] = useState(data)
  const [subjectCounter, setSubjectCounter] = useState(subjectDisplayCount)
  
  let activeSubjectColumns = subjectColumns.slice(subjectCounter - subjectDisplayCount, subjectCounter)
  if (activeSubjectColumns.length < subjectDisplayCount) {
    activeSubjectColumns = subjectColumns.slice(subjectColumns.length - subjectDisplayCount, subjectColumns.length)
  }
  const activeColumns = ['name', 'address', 'grade', ...activeSubjectColumns, 'date']

  const handleApplyFilter = (filters) => {
    const { sort, search } = cloneDeep(filters)

    // Search always executes for the data to reset even if search is empty
    let newRows = cloneDeep(data).filter(({ id, ...rest }) => {
      const itemEntries = Object.entries(rest)
      return itemEntries.find(([key, val]) => {
        const isDate = columns[key].type === 'date'
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
      setRows(orderBy(newRows, sortColumns, sortOrder))
    }
  }

  const renderTableData = () => {
    return rows.map((row, index) => {
      const { name, address, grade, date } = row
      return (
        <tr key={`grades-list-${index}`}>
          <td className="subHeader">
            <table className="subTable student">
              <tr>
                <td  style={{ minWidth: '100px', wordBreak: 'break-word'}}>{name}</td>
                <td  style={{ minWidth: '100px', wordBreak: 'break-word'}}>Middle School</td>
                <td  style={{ minWidth: '100px', wordBreak: 'break-word'}}>6th</td>
                <td  style={{ minWidth: '50px', wordBreak: 'break-word'}}>{grade}</td>
                <td  style={{ minWidth: '100px', wordBreak: 'break-word'}}>85% (30/40)</td>
              </tr>
            </table>
          </td>
          <td className="subHeader">
            <table className="subTable">
              <tr>
                {
                  activeSubjectColumns.map(e => (
                    <td style={{ width: '25%' }}>{row[e]}</td>
                  ))
                }
              </tr>
            </table>
          </td>
          <td className="subHeader">
            <table className="subTable">
              <tr>
                <td>{moment(date).format('ll')}</td>
                <td>{moment(date).format('ll')}</td>
                <td>{moment(date).format('ll')}</td>
              </tr>
            </table>
          </td>
        </tr>
      )
    })
  }

  return (
    <GradesStyled>
      <h2>Grade List Views</h2>
      <div id='gradeListView'>
        <div className='gradeListFilter'>
          <Headers
            enableClearFilter
            filterOptions={['sort', 'column', 'highlight', 'date']}
            columns={columns}
            rows={rows}

            onApplyFilter={handleApplyFilter}
          />
          <button
            className='applyFilterBtn'
            onClick={handleApplyFilter}
          >
            {`Grades & Test Input`}
          </button>
        </div>
        <div id='gradeListTableWrapper'>
          <table id='gradeListView-table'>
            <tbody>
              <tr>
                <th>Student</th>
                <th>Grades</th>
                <th>Standard Test</th>
              </tr>

              <tr>
                <td className="subHeader">
                  <table className="subTable student">
                    <tr>
                      <td style={{ minWidth: '100px', whiteSpace: 'initial' }}>Name</td>
                      <td style={{ minWidth: '100px', whiteSpace: 'initial' }}>School Type</td>
                      <td style={{ minWidth: '100px', whiteSpace: 'initial' }}>Grade Level</td>
                      <td style={{ minWidth: '50px', whiteSpace: 'initial' }}>GPA Cum (Semester)</td>
                      <td style={{ minWidth: '100px', whiteSpace: 'initial' }}>Attendance Summary</td>
                    </tr>
                  </table>
                </td>

                <td className="subHeader">
                  <table className="subTable">
                    <tr>
                      {/* <td style={{ width: '25%' }}>Grade</td> */}
                      {
                        activeSubjectColumns.map((e, index) => {
                          const isFirst = index === 0
                          const isLast = index === (subjectDisplayCount - 1)
                          const showFirst = isFirst && subjectCounter > activeSubjectColumns.length
                          const showLast = isLast && subjectColumns.length > subjectCounter
                          return (
                            <td style={{ width: '25%' }} key={`subjectCol-${index}`}>
                              {
                                showFirst && (
                                  <span style={{ cursor: 'pointer', marginRight: '1rem' }} onClick={() => setSubjectCounter(subjectCounter - subjectDisplayCount)} >
                                    <FontAwesomeIcon icon={faAngleLeft}/>
                                  </span>
                                )
                              }
                              {columns[e]?.label || e}
                              {
                                showLast && (
                                  <span style={{ cursor: 'pointer', marginLeft: '1rem' }} onClick={() => setSubjectCounter(subjectCounter + subjectDisplayCount)} >
                                    <FontAwesomeIcon icon={faAngleRight} />
                                  </span>
                                )
                              }
                            </td>
                          )
                        })
                      }
                    </tr>
                  </table>
                </td>

                <td className="subHeader">
                  <table className="subTable">
                    <tr>
                      <td>Act 1</td>
                      <td>Act 2</td>
                      <td>SAT</td>
                    </tr>
                  </table>
                </td>
              </tr>

              {renderTableData()}
            </tbody>
          </table>
    
        </div>
      </div>
    </GradesStyled>
  )
}
