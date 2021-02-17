import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faSearch } from '@fortawesome/free-solid-svg-icons'

import HeaderStyled from './styles'
import CustomSelect from '../../CustomComponents/CustomSelect'
import { FilterOptionsObj } from './options'
import FilterDialog from './FilterDialog'

export default ({ 
  filterOptions, enableClearFilter, // Filter Props
  onSearch, // Search Props
}) => {

  const [filterValue, setFilterValue] = useState(filterOptions[0])
  const [searchValue, setSearchValue] = useState('')
  const [filterDialogOpen, setFilterDialogOpen] = useState(true)

  const handleChangeFilter = ({ target }) => {
    setFilterValue(target.value)
    setFilterDialogOpen(true)
  }
  
  const handleChangeSearch = ({ target }) => {
    setSearchValue(target.value)
    onSearch(target.value)
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
        onChange={handleChangeFilter}
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
            enableClearFilter={enableClearFilter}
            activeFilter={filterValue}
            filterOptions={filterOptions.map(e => ({ ...FilterOptionsObj[e], key: e }))}
            onChangeActiveFilter={(e) => setFilterValue(e)}
            onClose={() => setFilterDialogOpen(false)}
          />
        )
      }
    </HeaderStyled>
  )
}
