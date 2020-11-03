import React, { useState  } from 'react'

export default (props) => {
  const { column, placeholder, onCloseUpdate, onUpdateFieldSetting, index, shownClassName, itemGroup } = props
  const handleUpdateField = ({ target: { id, value } }) => {
    onUpdateFieldSetting({ [id]: value }, index)
  }

  return (
    <div className={`sortableGroup-drawer drawer-right ${shownClassName}`}>
      <div className='field'>
        <label for='placeholder' className='field-label'>Placeholder</label>
        <input
          type='text'
          id='placeholder'
          className='field-input'
          placeholder='Edit Placeholder'
          value={placeholder}
          onChange={handleUpdateField}
        />
      </div>
      
      {
        itemGroup !== 'address' && (
          <div className='field select-field-wrapper'>
            <label for='column' className='field-label'>Column</label>
            <select
              id='column'
              className='field-input'
              value={column}
              onChange={handleUpdateField}
            >
              <option value=''>Select Field Size</option>
              <option value='1'>Small</option>
              <option value='2'>Medium</option>
              <option value='3'>Large</option>
            </select>
          </div>
        )
      }
      
      <div className='addField-actions'>
        <button
          type='button'
          className='outlined-addBtn'
          onClick={(e) => {
            e.stopPropagation()
            onCloseUpdate()
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}