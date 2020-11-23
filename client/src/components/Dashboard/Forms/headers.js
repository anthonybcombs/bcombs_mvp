import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faArrowUp, faArrowDown, faTh, faBars } from '@fortawesome/free-solid-svg-icons'

export default ({ onChangeFilter }) => {
  return (
    <div>
      <div>
        <input
          id='search'
          name='search'
          placeholder='Search'
          onChange={({ target }) => {}}
        />
        <a
          type='button'
          href='/dashboard/builder'
          target='_blank'
        >
          <FontAwesomeIcon
            className='create-icon'
            icon={faPlusCircle}
          />
          Create a new form
        </a>
      </div>
      <div>
        <div>
          <select
            onChange={onChangeFilter}
          >
            <option value=''>All</option>
            <option value='sports'>Sports</option>
            <option value='teaching'>Teaching</option>
          </select>
          <button>
            Favorites
          </button>
        </div>
        <div>
          <div>
            <select
              onChange={({ target: { value } }) => {}}
            >
              <option value=''>Filter by date created</option>
            </select>
            <FontAwesomeIcon
              className='sort-icon'
              icon={faArrowUp}
            />
          </div>
          <div>
            <FontAwesomeIcon
              className='sort-icon'
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