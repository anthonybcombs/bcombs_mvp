import React, { useState } from 'react'
import cloneDeep from 'lodash.clonedeep'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons'

import CustomSelect from '../../../CustomComponents/CustomSelect'

export default ({ activeFilter, filters, onChangeFilter, columns, rows }) => {

  const handleChangeFilter = ({ target: { value } }, index, key, filterKey) => {
    const clonedFilters = cloneDeep(filters)
    const newFilters = clonedFilters[filterKey].map((nf, i) => {
      if (i === index) {
        nf[key] = value
      }
      return nf
    })

    onChangeFilter(filterKey, newFilters)
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
                sortFilters.map((sf, si) => {
                  return (
                    <tr>
                      <td align='left'>
                        <CustomSelect
                          value={sf.column}
                          placeholder='Select Column'
                          options={Object.entries(columns).map(([key, val]) => ({ value: key, label: val.label }))}
                          onChange={(e) => handleChangeFilter(e, si, 'column', 'sort')}
                        />
                      </td>
                      <td align='left'>
                        <CustomSelect
                          value={sf.value}
                          options={getSortOrder(sf.column ? columns[sf.column].type : 'string')}
                          onChange={(e) => handleChangeFilter(e, si, 'value', 'sort')}
                        />
                      </td>
                      <td className='actions'>
                        {
                          sortFilters.length > 1 && (
                            <FontAwesomeIcon icon={faMinusCircle} onClick={() => handleRemoveFilter('sort', si)} />
                          )
                        }
                        {
                          si === (sortFilters.length - 1) && (
                            <FontAwesomeIcon icon={faPlusCircle} onClick={() => handleAddFilter('sort', { column: '', value: 'asc' })} />
                          )
                        }
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      )
    case 'column': 
      return 'Column'
    case 'highlight': 
      return 'Highlight'
    case 'date': 
      return 'Date'    
    default: 
      return null
  }
}