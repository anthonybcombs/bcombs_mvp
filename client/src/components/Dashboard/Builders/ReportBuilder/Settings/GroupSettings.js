import React, { useState } from 'react'
import { StandardFields } from '../Constants'
import cloneDeep from 'lodash.clonedeep'

export default ({
  onHideSettings, onMergeStandardFields, id, shownClassName, label, onChangeGroupName, isStandard
}) => {
  const [additionalField, handleSelectFieldToAdd] = useState('')

  return (
    <>
      {/* Edit Group Name Drawer */}
      <div className={`sortableGroup-drawer drawer-right ${shownClassName}`}>
        <div className='field'>
          <label for='group-name' className='field-label'>Group Name</label>
          <input
            type='text'
            id='group-name'
            className='field-input'
            placeholder='Group Name'
            value={label}
            onChange={({ target }) => onChangeGroupName(target.value || 'Untitled', id)}
          />
        </div>

        {
          isStandard && (
            <>
              <div className='field select-field-wrapper'>
                <label for='add-field' className='field-label'>Select a field to add</label>
                <select
                  id='add-field'
                  className='field-input'
                  defaultValue={additionalField}
                  onChange={({ target }) => {
                    handleSelectFieldToAdd(target.value)
                  }}
                >
                  <option value=''>Select a field to add</option>
                  {
                    StandardFields
                      .filter(e => e.canBeGrouped)
                      .map(e => (
                        <option key={e.type} value={e.type}>{e.label}</option>
                      ))
                  }
                </select>
              </div>
              <div className='addField-actions'>
                <button
                  type='button'
                  className='add-btn'
                  onClick={e => {
                    e.stopPropagation()
                    let newField = StandardFields.find(e => e.type === additionalField)
                    if (newField) {
                      newField = cloneDeep(newField) //avoid mutating the array of objects
                      onMergeStandardFields(id, newField)
                    }
                  }}
                >
                  Add Field
                </button>
              </div>
            </>
          )
        }
        <div className='addField-actions'>
          <button
            type='button'
            className='close-btn'
            onClick={onHideSettings}
          >
            Close
          </button>
        </div>
      </div>
    </>
  )
}