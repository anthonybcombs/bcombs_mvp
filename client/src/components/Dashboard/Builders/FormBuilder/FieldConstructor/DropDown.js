import React from 'react'
import update from 'immutability-helper'
import cloneDeep from 'lodash.clonedeep'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons'

export default ({ options, column, onChangeFieldSettings, isBuilder, index, isActive, id: fieldId, onChange, onCheckError, value = {} }) => {
  const hasOthers = options.find(e => e.name === 'other')

  const handleCheckError = (data) => {
    const newErrors = !!data.find(e => e.label.replace(/\s/g, '') === '')
      ? ['Option labels are required.']
      : []

    onCheckError(newErrors)
  }

  const handleChangeOption = ({ target }, optionIndex) => {
    const newOptions = update(options, { [optionIndex]: { $merge: { label: target.value } } })
    onChangeFieldSettings({ options: newOptions })
    handleCheckError(newOptions)
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

  const handleRemoveField = (optionIndex) => {
    const newOptions = update(options, { $splice: [[optionIndex, 1]] })
    onChangeFieldSettings({ options: newOptions })
    handleCheckError(newOptions)
  }

  const handleAnswer = ({ target: { value: dropDownValue } }) => {
    const { name, label } = options.find(e => e.name === dropDownValue)
    onChange({ target: { id: fieldId, value: { [name]: label } } })
  }

  const groupClassLabel = isBuilder ? 'sortableGroup' : 'formGroup'

  return (
    <>
      {
        isBuilder
          ? (
            <>
              {
                options.map((option, optionIndex) => {
                  return (
                    <div key={`${index}-option-${optionIndex}`} className={`${groupClassLabel}-column`} style={{ gridColumn: `span ${column}`}}>
                      <div className='option'>
                        <span>{optionIndex + 1}.</span>
                        {
                          isBuilder
                            ? <input
                                type='text'
                                className={`field-input`}
                                value={option.label}
                                onChange={(e) => handleChangeOption(e, optionIndex)}
                              />
                            : <span className='labelName'> {option.label}</span>
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
                </div>
              )}
            </>
          )
          : (
            <div className='field select-field-wrapper'>
              <select
                className={`field-input`}
                value={Object.keys(value)[0]}
                onChange={(e) => handleAnswer(e)}
              >
                <option value=''>Choose</option>
                {
                  options.map(({ label, name }, index) => {
                    return (<option key={name + index} value={name}>{label}</option>)
                  })
                }
              </select>
            </div>
          )
      }
    </>
  )
}