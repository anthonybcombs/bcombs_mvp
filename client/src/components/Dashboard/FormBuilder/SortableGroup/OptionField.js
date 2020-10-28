import React from 'react'
import cloneDeep from 'lodash.clonedeep'
import update from 'immutability-helper'
import { uuid } from 'uuidv4'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons'

import FieldConstructor from '../FieldConstructor'

export default ({
  options, index, onChangeFieldSettings, id, isActive
}) => {

  const handleChangeOption = ({ target }, optionIndex) => {
    onChangeFieldSettings({ options: update(options, { [optionIndex]: { $merge: { label: target.value } } }) }, index, id)
  }

  const handleAddOption = () => {
    const newOption =  { name: `option${options.length + 1}`, label: `Option ${options.length + 1}`, tag: 'checkbox' }
    onChangeFieldSettings({ options: update(options, { $push: [newOption] }) }, index, id)
  }

  const handleRemoveField = (optionIndex) => {
    onChangeFieldSettings({ options: update(options, { $splice: [[optionIndex, 1]] }) }, index, id)
  }

  return (
    <>
      {
        options.map((option, optionIndex) => {
          return (
            <div key={`${index}-option-${optionIndex}`} className={`sortableGroup-column`} style={{ gridColumn: `span 3`}}>
              {
                FieldConstructor[option.tag]({
                  key: option.tag + uuid(),
                  isBuilder: true,
                  onChange: (e) => handleChangeOption(e, optionIndex),
                  ...option
                })
              }
              {
                (isActive && options.length > 2) &&
                (
                  <FontAwesomeIcon
                    className='removeField-icon'
                    icon={faTimes}
                    onClick={e => {
                      e.stopPropagation()
                      handleRemoveField(optionIndex)
                    }}
                  />
                )
              }
            </div>
          )
        })
      }
      {
        isActive && (
          <button
            type='button'
            target='_blank'
            className='btn addCheckboxOption'
            onClick={(e) => {
              e.stopPropagation()
              handleAddOption()
            }}
          >
            <FontAwesomeIcon
              icon={faPlus}
              className='addField-icon'
            />
            <span>Add Option</span>
          </button>
        )
      }
    </>
  )
}