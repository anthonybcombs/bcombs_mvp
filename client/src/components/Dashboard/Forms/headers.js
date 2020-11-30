import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearch, faArrowUp, faArrowDown, faTh, faBars, faHeart } from '@fortawesome/free-solid-svg-icons'
import { Multiselect } from 'multiselect-react-dropdown'

export default ({ onChangeFilter }) => {

  const CATEGORIES_OPTIONS = [
    { label: 'all', name: 'All' },
    { label: 'sports', name: 'Sports' },
    { label: 'teaching', name: 'Teaching' }
  ]

  const [categories, setCategories] = useState([])

  const handleSelectCategory = (data) => {
    if (data.find(e => e.label === 'all')) {
      onChangeFilter([])
      setCategories
    } else {
      onChangeFilter(data.map(e => e.label))
    }
  }

  return (
    <div className='formManager-header'>
      <div className='header-searchBar'>
        <div className='search-input'>
          <input
            id='search'
            name='search'
            placeholder='Search'
            className='field-input'
            onChange={({ target }) => {}}
          />
          <FontAwesomeIcon
            className='search-icon'
            icon={faSearch}
          />
        </div>
        <a
          href='/dashboard/builder'
          // target='_blank'
          className='newFrom-btn'
        >
          <FontAwesomeIcon
            className='create-icon'
            icon={faPlus}
          />
          Create a new form
        </a>
      </div>

      <div className='header-actions'>
        <div className='left-actions'>
          <div className='field select-field-wrapper active'>
            {/* <select
              className='field-input'
              onChange={onChangeFilter}
            >
              <option value=''>All</option>
              <option value='sports'>Sports</option>
              <option value='teaching'>Teaching</option>
            </select> */}
            <Multiselect
              className='field-input'
              options={CATEGORIES_OPTIONS}
              // hasSelectAll={hasSelectAll}
              onSelect={selectedList => handleSelectCategory(selectedList)}
              onRemove={selectedList => handleSelectCategory(selectedList)}
              displayValue='name'
              closeIcon='cancel'
              // name={'ethinicity
              placeholder='Filter by categories'
              closeOnSelect={false}
              showCheckbox={true}
              autcomplete='false'
              selectedValues={categories}
            />
          </div>
          {/* <button className='favorites-btn'>
            Favorites
          </button> */}
        </div>
        <div className='right-actions'>
          <button className='favorites-btn'> {/* add active class if selected*/}
            <FontAwesomeIcon
              className='sort-icon'
              icon={faHeart}
            />
            Favorites
          </button>
          <div className='dateFilter'>
            <div className='field select-field-wrapper'>
              <select
                className='field-input'
                onChange={({ target: { value } }) => {}}
              >
                <option value=''>Filter by date created</option>
              </select>
            </div>
            <FontAwesomeIcon
              className='sort-icon'
              icon={faArrowUp}
            />
          </div>
          <div className='viewType'>
            <FontAwesomeIcon
              className='sort-icon active'
              icon={faTh}
            />
             <FontAwesomeIcon
              className='sort-icon'
              icon={faBars}
            />
          </div>
        </div>
      </div>
    </div>
  )
}