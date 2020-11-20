import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faArrowUp, faArrowDown, faTh, faBars } from '@fortawesome/free-solid-svg-icons'

export default () => {
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
          <button>
            All
          </button>
          <button>
            Favorites
          </button>
          <select
            onChange={({ target: { value } }) => {}}
          >
            <option value=''>Filter by category</option>
            <option value='sports'>Sorts</option>
            <option value='teaching'>Teaching</option>
          </select>
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