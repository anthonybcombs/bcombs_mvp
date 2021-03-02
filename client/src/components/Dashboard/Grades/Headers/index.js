import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faSearch } from '@fortawesome/free-solid-svg-icons'

import HeaderStyled from './styles'
import CustomSelect from '../../CustomComponents/CustomSelect'
import { FilterOptionsObj } from './options'
import FilterDialog from './FilterDialog'

export default ({ 
  filterOptions, enableClearFilter, onApplyFilter, // Filter Props
  onSearch, // Search Props
  columns, rows // Table props
}) => {

  const defaultFilters = {
    sort: [{ column: '', value: 'asc' }]
  }

  const [filterValue, setFilterValue] = useState(filterOptions[0])
  const [searchValue, setSearchValue] = useState('')
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [filters, setFilters] = useState(defaultFilters)
  const [filterErrors, setFilterErrors] = useState([])

  const handleChangeFilter = (key, data) => {
    setFilters({
      ...filters,
      [key]: data
    })
  }

  const handleSelectFilter = ({ target }) => {
    setFilterValue(target.value)
    setFilterDialogOpen(true)
  }
  
  const handleChangeSearch = ({ target }) => {
    setSearchValue(target.value)
    onSearch(target.value)
  }

  const handleApplyFilter = () => {
    const checkSort = filters.sort.reduce((acc, { column }) => {
      return {
        ...acc,
        [column]: (acc[column] || 0) + 1
      }
    }, {})

    let newErrors = [...filterErrors]
    if (Object.values(checkSort).find(e => e > 1)) {
      newErrors = [
        ...filterErrors.filter(e => e !== 'Please remove duplicate sort column.'),
        'Please remove duplicate sort column.'
      ]
    } else {
      newErrors = filterErrors.filter(e => e !== 'Please remove duplicate sort column.')
    }

    setFilterErrors(newErrors)

    if (newErrors.length === 0) {
      onApplyFilter(filters)
      setFilterDialogOpen(false)
    }
  }

  const renderActions = () => {
    return (
      <>
        <button
          className='applyFilterBtn'
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
      <div>
        <FontAwesomeIcon className='search-icon' icon={faSearch} />
        <input
          id='search'
          name='search'
          placeholder='Search'
          className='field-input'
          value={searchValue}
          onChange={handleChangeSearch}
        />
        <label className="field-label" htmlFor='search'>
          Search
        </label>
      </div>
      {
        filterDialogOpen && (
          <FilterDialog
            title='Filters'
            filters={filters}
            enableClearFilter={enableClearFilter}
            activeFilter={filterValue}
            filterOptions={filterOptions.map(e => ({ ...FilterOptionsObj[e], key: e }))}
            filterErrors={filterErrors}
            
            columns={columns}
            rows={rows}
            actions={renderActions}

            onChangeActiveFilter={(e) => setFilterValue(e)}
            onChangeFilter={handleChangeFilter}
            onClose={() => setFilterDialogOpen(false)}
          />
        )
      }
    </HeaderStyled>
  )
}
