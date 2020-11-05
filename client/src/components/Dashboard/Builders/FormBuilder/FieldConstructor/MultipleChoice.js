import React from 'react'
import update from 'immutability-helper'
import cloneDeep from 'lodash.clonedeep'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons'

export default ({ options, column, onChangeFieldSettings, isBuilder, index, isActive, id: fieldId, onChange, value = {} }) => {
  const hasOthers = options.find(e => e.name === 'other')

  const handleChangeOption = ({ target }, optionIndex) => {
    onChangeFieldSettings({ options: update(options, { [optionIndex]: { $merge: { label: target.value } } }) })
  }

  const handleAddOption = () => {
    const incrementNum = hasOthers ? 0 : 1
    const newOption =  { ...options[0], name: `option${options.length + incrementNum}`, label: `Option ${options.length + incrementNum}` }
    const newOptions = cloneDeep(options)
    if (hasOthers) {
      newOptions.splice(newOptions.length-1, 0, newOption)
    } else {
      newOptions.push(newOption)
    }
    onChangeFieldSettings({ options: newOptions })
  }

  const handleAddOthers = () => {
    const newOption =  { ...options[0], name: 'other', label: 'Other...' }
    onChangeFieldSettings({ options: update(options, { $push: [newOption] }) })
  }

  const handleRemoveField = (optionIndex) => {
    onChangeFieldSettings({ options: update(options, { $splice: [[optionIndex, 1]] }) })
  }

  const handleAnswer = ({ target: { value: radioValue, checked } }, id) => {
    onChange({ target: { id: fieldId, value: { [id]: checked ? radioValue : '' } } })
  }

  const groupClassLabel = isBuilder ? 'sortableGroup' : 'formGroup'

  console.log('yawa', value)
  return (
    <>
      {
        options.map((option, optionIndex) => {
          return (
            <div key={`${index}-option-${optionIndex}`} className={`${groupClassLabel}-column`} style={{ gridColumn: `span ${column}`}}>
              <div className='radiobuttonContainer'>
                <input
                  type='radio'
                  id={`${fieldId}_${option.name}`}
                  value={option.label}
                  checked={!!value[`${option.name}`]}
                  onChange={(e) => {
                    if (!isBuilder) {
                      handleAnswer(e, option.name)
                    }
                  }}
                  disabled={isBuilder}
                />
                {
                  (isBuilder && option.name !== 'other')
                    ? (
                      <>
                        <label/>
                        <input
                          type='text'
                          className={`field-input`}
                          value={option.label}
                          onChange={(e) => handleChangeOption(e, optionIndex)}
                        />
                      </>
                    )
                    : <label for={`${fieldId}_${option.name}`}>{option.label}</label>
                }
              </div>
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
      { isActive && (
        <div className='actions'>
          {
            isActive && (
              <button
                type='button'
                target='_blank'
                className='btn outlined-addBtn options'
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
          {
            !hasOthers && (
              <button
                type='button'
                target='_blank'
                className='btn outlined-addBtn other'
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddOthers()
                }}
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  className='addField-icon'
                />
                <span>Add Other</span>
              </button>
            )
          }
        </div>
      )}
    </>
  )
}