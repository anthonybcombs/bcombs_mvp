import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearch, faArrowUp, faArrowDown, faTh, faBars } from '@fortawesome/free-solid-svg-icons'

export default ({ onChangeFilter }) => {
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
            <select
              className='field-input'
              onChange={onChangeFilter}
            >
              <option value=''>All</option>
              <option value='sports'>Sports</option>
              <option value='teaching'>Teaching</option>
            </select>
          </div>
          <button className='favorites-btn'>
            Favorites
          </button>
        </div>
        <div className='right-actions'>
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