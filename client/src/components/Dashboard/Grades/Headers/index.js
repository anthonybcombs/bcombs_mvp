import React, { useEffect, useCallback, useState } from 'react'
import debounce from 'lodash.debounce'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faSearch } from '@fortawesome/free-solid-svg-icons'

import HeaderStyled from './styles'
import CustomSelect from '../../CustomComponents/CustomSelect'
import { FilterOptionsObj } from './options'
import FilterDialog from './FilterDialog'
import cloneDeep from 'lodash.clonedeep'

export default ({ 
  filterOptions, enableClearFilter, onApplyFilter, // Filter Props
  onSearch, // Search Props
  columns, rows // Table props
}) => {

  const defaultFilters = {
    sort: [{ column: '', value: 'asc' }],
    search: ''
  }

  const [filterValue, setFilterValue] = useState(filterOptions[0])
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [filters, setFilters] = useState(defaultFilters)
  const [previousFilter, setPreviousFilter] = useState({}) // For cancelation of filter dialog
  const [filterErrors, setFilterErrors] = useState([])

  const handleChangeFilter = (key, data) => {
    setFilters({
      ...filters,
      [key]: data
    })
  }

  const handleSelectFilter = ({ target }) => {
    setFilterValue(target.value)
    setPreviousFilter(cloneDeep(filters))
    setFilterDialogOpen(true)
  }

  const debounceSearch = (...args) => {
    const debouncedSearch = useCallback(debounce(...args), [])
    return e => {
      handleChangeFilter('search', e.target.value)
      e.persist()
      return debouncedSearch(e)
    }
  }

  const handleApplyFilter = ({ target }, isSearch = false) => {
    let newErrors = [...filterErrors]
    console.log('kayama')
    // START Sort Filter Logic
    const checkSort = filters.sort.reduce((acc, { column }) => {
      return {
        ...acc,
        [column]: (acc[column] || 0) + 1
      }
    }, {})
    if (Object.values(checkSort).find(e => e > 1)) {
      newErrors = [
        ...filterErrors.filter(e => e !== 'Please remove duplicate sort column.'),
        'Please remove duplicate sort column.'
      ]
    } else {
      newErrors = filterErrors.filter(e => e !== 'Please remove duplicate sort column.')
    }
    // END Sort Filter Logic

    setFilterErrors(newErrors)

    if (newErrors.length === 0) {
      onApplyFilter({
        ...filters,
        search: isSearch ? target.value : filters.search
      })
      setFilterDialogOpen(false)
    }
  }

  const renderActions = () => {
    return (
      <>
        <button
          className='modalBtn applyFilterBtn'
          onClick={handleApplyFilter}
        >
          Apply Filter
        </button>
      </>
    )
  }

  return (
    <HeaderStyled>
      <CustomSelect
        value={''}
        options={filterOptions.map(e => ({
          value: e, label: FilterOptionsObj[e].label
        }))}
        placeholder='Filter by'
        icon={<FontAwesomeIcon icon={faFilter} />}
        onChange={handleSelectFilter}
      />
      <div className='field search-input'>
        <FontAwesomeIcon className='search-icon' icon={faSearch} />
        <input
          id='search'
          name='search'
          placeholder='Search'
          className='field-input'
          value={filters?.search || ''}
          onChange={debounceSearch((e) => handleApplyFilter(e, true), 500)}
        />
        <label className='field-label' htmlFor='search'>
          Search
        </label>
      </div>
      {
        filterDialogOpen && (
          <FilterDialog
            title='Filters'
            filters={filters}
            previousFilter={previousFilter}
            enableClearFilter={enableClearFilter}
            activeFilter={filterValue}
            filterOptions={filterOptions.map(e => ({ ...FilterOptionsObj[e], key: e }))}
            filterErrors={filterErrors}
            
            columns={columns}
            rows={rows}
            actions={renderActions}

            onChangeActiveFilter={(e) => setFilterValue(e)}
            onChangeFilter={handleChangeFilter}
            onClose={() => {
              setFilters(previousFilter)
              setFilterDialogOpen(false)
            }}
          />
        )
      }
    </HeaderStyled>
  )
}
