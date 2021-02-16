import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter, faSearch } from '@fortawesome/free-solid-svg-icons'

import HeaderStyled from './styles'
import CustomSelect from '../../CustomComponents/CustomSelect'
import { FilterOptionsObj } from './options'

export default ({ 
  filterOptions, // Filter Props
}) => {

  const [filterValue, setFilterValue] = useState('')
  const [searchValue, setSearchValue] = useState('')

  const handleChangeFilter = ({ target }) => {
    setFilterValue(target.value)
  }
  
  const handleChangeSearch = ({ target }) => {
    setSearchValue(target.value)
  }

  return (
    <HeaderStyled>
      <CustomSelect
        value={filterValue}
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
    </HeaderStyled>
  )
}
