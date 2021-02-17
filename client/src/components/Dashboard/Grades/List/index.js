import React, { useEffect, useState } from "react";
import cloneDeep from 'lodash.clonedeep'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'

import GradesStyled from './styles'
import Headers from '../Headers'

import Loading from "../../../../helpers/Loading.js";

import { useSelector, useDispatch } from "react-redux";

import { requestVendor } from "../../../../redux/actions/Vendors";

export default ({ form_id, type, history }) => {
  const data = cloneDeep([
    {
      name: 'John Doe',
      address: 'Address 1',
      grade: '1',
      math: 'A',
      science: 'B',
      english: 'C',
      history: 'B',
      date: '2021-02-16T18:26:16.468Z',
    },
    {
      name: 'John Smith',
      address: 'Address 2',
      grade: '2',
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
      date: '2021-02-16T18:26:16.468Z',
    },
    {
      name: 'John Legend',
      address: 'Address 4',
      grade: '2.1',
      math: 'C',
      science: 'A',
      english: 'B',
      history: 'C',
      date: '2021-02-16T18:26:16.468Z',
    },
    {
      name: 'Legend Doe',
      address: 'Address 5',
      grade: '2.5',
      math: 'C',
      science: 'C',
      english: 'C',
      history: 'C',
      date: '2021-02-16T18:26:16.468Z',
    },
    {
      name: 'Doe Smith',
      address: 'Address 6',
      grade: '1.1',
      math: 'A',
      science: 'C',
      english: 'B',
      history: 'C',
      date: '2021-02-16T18:26:16.468Z',
    },
  ])

  const columns = {
    name: { type: 'string', label: 'Name' },
    address: { type: 'string', label: 'Address' },
    grade: { type: 'string', label: 'Grade' },
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
  
  const activeSubjectColumns = subjectColumns.slice(subjectCounter - subjectDisplayCount, subjectCounter)
  const activeColumns = ['name', 'address', 'grade', ...activeSubjectColumns, 'date']

  const renderTableData = () => {
    return rows.map((row, index) => {
      const { name, address, grade, date } = row
      return (
        <tr key={`grades-list-${index}`}>
          <td>
            <table>
              <tr>
                <td>{name}</td>
                <td>{address}</td>
              </tr>
            </table>
          </td>
          <td>
            <table>
              <tr>
                <td>{grade}</td>
                {
                  activeSubjectColumns.map(e => (
                    <td>{row[e]}</td>
                  ))
                }
              </tr>
            </table>
          </td>
          <td>
            <table>
              <tr>
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
      <h2>Grade List View</h2>
      <Headers
         filterOptions={['date', 'sort', 'highlight', 'column', 'clear']}
      />
      <table>
        <tbody>
          <tr>
            <th>Student</th>
            <th>Grades</th>
            <th>Standard Test</th>
          </tr>

          <tr>
            <td>
              <table>
                <tr>
                  <td>Name</td>
                  <td>Address</td>
                </tr>
              </table>
            </td>

            <td>
              <table>
                <tr>
                  <td>Grade</td>
                  {
                    activeSubjectColumns.map((e, index) => {
                      const isFirst = index === 0
                      const isLast = index === (subjectDisplayCount - 1)
                      const showFirst = isFirst && subjectCounter > activeSubjectColumns.length
                      const showLast = isLast && subjectColumns.length > subjectCounter
                      return (
                        <td>
                          {
                            showFirst && (
                              <FontAwesomeIcon icon={faAngleLeft} onClick={() => setSubjectCounter(subjectCounter - subjectDisplayCount)} />
                            )
                          }
                          {columns[e].label}
                          {
                            showLast && (
                              <FontAwesomeIcon icon={faAngleRight} onClick={() => setSubjectCounter(subjectCounter + subjectDisplayCount)} />
                            )
                          }
                        </td>
                      )
                    })
                  }
                </tr>
              </table>
            </td>

            <td>
              <table>
                <tr>
                  <td>Date</td>
                </tr>
              </table>
            </td>
          </tr>

          {renderTableData()}
        </tbody>
      </table>
    </GradesStyled>
  )
}
