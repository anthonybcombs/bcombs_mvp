import React, { useState } from 'react'
import cloneDeep from 'lodash.clonedeep'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons'

import CustomSelect from '../../../CustomComponents/CustomSelect'

export default ({ activeFilter, filters, onChangeFilter, columns, schoolYears }) => {

  const handleChangeFilter = (value, index, key, filterKey) => {
    const clonedFilters = cloneDeep(filters)
    const newFilters = clonedFilters[filterKey].map((nf, i) => {
      if (i === index) {
        nf[key] = value
      }
      return nf
    })

    onChangeFilter(filterKey, newFilters)
  }

  const handleChangeDateFilter = ({ target: { value } }, key) => {
    const clonedFilters = cloneDeep(filters)
    const newFilters = {
      ...clonedFilters.date,
      [key]: value
    }

    onChangeFilter('date', newFilters)
  }

  const handleAddFilter = (filterKey, objData) => {
    const clonedFilters = cloneDeep(filters)
    const newFilters = clonedFilters[filterKey]
    newFilters.push(objData)

    onChangeFilter(filterKey, newFilters)
  }

  const handleRemoveFilter = (filterKey, index) => {
    const clonedFilters = cloneDeep(filters)
    const newFilters = clonedFilters[filterKey].filter((nf, i) => i !== index)

    onChangeFilter(filterKey, newFilters)
  }

  const clonedFilters = cloneDeep(filters)

  switch(activeFilter) {
    case 'sort': 
      const sortFilters = clonedFilters?.sort || []
      const getSortOrder = (type = 'string') => {
        if (type === 'number') {
          return [{ value: 'asc', label: 'Smallest to Largest' }, { value: 'desc', label: 'Largest to Smallest' }]
        } else {
          return [{ value: 'asc', label: 'A to Z' }, { value: 'desc', label: 'Z to A' }]
        }
      } 

      return (
        <div className='filter-sort'>
          <table id='filterTable'>
            <thead>
              <tr>
                <th align='left'>Sort by</th>
                <th align='left'>Order</th>
              </tr>
            </thead>
            <tbody>
              {
                sortFilters.map((f, fi) => {
                  return (
                    <tr>
                      <td align='left'>
                        <CustomSelect
                          value={f.column}
                          placeholder='Select Column'
                          options={Object.entries(columns).map(([key, val]) => ({ value: key, label: val.label }))}
                          onChange={(e) => handleChangeFilter(e.target.value, fi, 'column', 'sort')}
                        />
                      </td>
                      <td align='left'>
                        <CustomSelect
                          value={f.value}
                          options={getSortOrder(f.column ? columns[f.column].type : 'string')}
                          onChange={(e) => handleChangeFilter(e.target.value, fi, 'value', 'sort')}
                        />
                      </td>
                      <td className='actions'>
                        <div className='actions-container'>
                          {
                            sortFilters.length > 1 && (
                              <FontAwesomeIcon icon={faMinusCircle} className='minusIcon' onClick={() => handleRemoveFilter('sort', fi)} />
                            )
                          }
                          {
                            fi === (sortFilters.length - 1) && (
                              <FontAwesomeIcon icon={faPlusCircle} className='addIcon' onClick={() => handleAddFilter('sort', { column: '', value: 'asc' })} />
                            )
                          }
                        </div>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      )
    case 'highlight':
      const highlightFilters = clonedFilters?.highlight || []
      const conditions = [
        { label: 'Greater Than', value: 'gt' },
        { label: 'Less Than', value: 'lt' },
        { label: 'Between', value: 'bt' },
        { label: 'Equal To', value: 'eq' },
        { label: 'Contains', value: 'contains' },
      ]
      const colors = [
        { label: 'Black fill with white text', value: JSON.stringify({ backgroundColor: '#000000', color: '#ffffff' }) }, // First value, being used in the Headers 
        { label: 'Orange fill with white text', value: JSON.stringify({ backgroundColor: '#F5812F', color: '#ffffff' }) },
        { label: 'Yellow fill with white text', value: JSON.stringify({ color: '#ffff00' }) },
        { label: 'Red text', value: JSON.stringify({ color: '#ff0000' }) },
        { label: 'Red border', value: JSON.stringify({ border: '1px solid #ff0000' }) },
      ]

      return (
        <div className='filter-highlight'>
          <div style={{ padding: '5px 5px 12px 10px', fontWeight: 'bolder' }}>Highlight cells that matches below conditions</div>
          <table id='filterTable' className='highlight'>
            <thead>
              <tr>
                <th align='left'>Column</th>
                <th align='left'>Condition</th>
                <th align='left'>Value</th>
                <th align='left'>Format</th>
              </tr>
            </thead>
            <tbody>
              {
                highlightFilters.map((f, fi) => {
                  const { column, condition, value, format } = f
                  return (
                    <tr>
                      <td align='left'>
                        <CustomSelect
                          isMultiple
                          value={column.map(e => ({ value: e, label: columns[e].label }))}
                          placeholder='Select Column'
                          displayValue='label'
                          options={Object.entries(columns).map(([key, val]) => ({ value: key, label: val.label }))}
                          onChange={(selected) => handleChangeFilter(selected.map(e => e.value), fi, 'column', 'highlight')}
                          onRemove={(selected) => handleChangeFilter(selected.map(e => e.value), fi, 'column', 'highlight')}
                        />
                      </td>
                      <td align='left'>
                        <CustomSelect
                          value={condition}
                          options={conditions}
                          onChange={(e) => handleChangeFilter(e.target.value, fi, 'condition', 'highlight')}
                        />
                      </td>
                      <td align='left'>
                        <div className='value'>
                          <input
                            className='field-input'
                            value={value[0] || ''}
                            onChange={(e) => handleChangeFilter([e.target.value, value[1]], fi, 'value', 'highlight')}
                          />
                          {
                            condition === 'bt' && (
                              <input
                                className='field-input'
                                value={value[1] || ''}
                                onChange={(e) => handleChangeFilter([value[0], e.target.value], fi, 'value', 'highlight')}
                              />
                            )
                          }
                        </div>
                      </td>
                      <td align='left'>
                        <CustomSelect
                          value={format}
                          place
                          options={colors}
                          onChange={(e) => handleChangeFilter(e.target.value, fi, 'format', 'highlight')}
                        />
                      </td>
                      <td className='actions'>
                        <div className='actions-container'>
                          {
                            highlightFilters.length > 1 && (
                              <FontAwesomeIcon icon={faMinusCircle} className='minusIcon' onClick={() => handleRemoveFilter('highlight', fi)} />
                            )
                          }
                          {
                            fi === (highlightFilters.length - 1) && (
                              <FontAwesomeIcon icon={faPlusCircle} className='addIcon' onClick={() => handleAddFilter('highlight', { column: [], condition: 'gt', value: [], format: JSON.stringify({ backgroundColor: '#000000', color: '#ffffff' }) })} />
                            )
                          }
                        </div>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      )
    case 'date': 
      const { year, quarter } = clonedFilters?.date || {}
      const sy = schoolYears.map(e => ({ value: e, label: `School Year ${e}` }))
      const yearQuarters = [
        { value: '1', label: 'First Quarter' },
        { value: '2', label: 'Second Quarter' },
        { value: '3', label: 'Third Quarter' },
        { value: '4', label: 'Fourth Quarter' },
        { value: '', label: 'Final Quarter' }
      ]
      return (
        <div className='filter-date'>
          <div className='dateSelectWrapper'>
            <label>School Year:</label>
            <CustomSelect
              value={year}
              placeholder='Select School Year'
              displayValue='label'
              options={sy}
              onChange={(e) => handleChangeDateFilter(e, 'year')}
            />
          </div>
          {
            year && (
              <div className='dateSelectWrapper'>
                <label>Quarters:</label>
                <CustomSelect
                  value={quarter}
                  // placeholder='Select Quarters'
                  displayValue='label'
                  options={yearQuarters}
                  onChange={(e) => handleChangeDateFilter(e, 'quarter')}
                />
              </div>
            )
          }
        </div>
      )    
    default: 
      return null
  }
}