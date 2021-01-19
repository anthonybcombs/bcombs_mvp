import React from 'react'
import update from 'immutability-helper'
import cloneDeep from 'lodash.clonedeep'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons'

export default ({
  options, column, onChangeFieldSettings, isBuilder, isMultiple, index, isActive, id: fieldId, value = {},
  onChange, onCheckError, isReadOnly = false, className
}) => {
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

  const handleAddOthers = () => {
    const newOption =  { ...options[0], name: 'other', label: 'Other:' }
    onChangeFieldSettings({ options: update(options, { $push: [newOption] }) })
  }

  const handleRemoveField = (optionIndex) => {
    const newOptions = update(options, { $splice: [[optionIndex, 1]] })
    onChangeFieldSettings({ options: newOptions })
    handleCheckError(newOptions)
  }

  const handleAnswer = ({ target: { value: optionValue, checked } }, id) => {
    if (id === 'other') {
      optionValue = ''
    }

    if (id === 'otherInput') {
      const newValue = { ...value, other: optionValue }
      onChange({ target: { id: fieldId, value: newValue } })  
      return
    }
    if (!checked) {
      let newValue = { ...value }
      delete newValue[id]
      onChange({ target: { id: fieldId, value: newValue } })  
      return  
    }
    onChange({ target: { id: fieldId, value: { ...(isMultiple ? value : {}), [id]: checked ? optionValue : '' } } })
  }

  const groupClassLabel = isBuilder ? 'sortableGroup' : 'formGroup'

  return (
    <div className={className}>
      {
        options.map((option, optionIndex) => {
          const isOther = option.name === 'other'
          const isSelected = Object.keys(value).includes(option.name)
          let style = { gridColumn: `span ${column}` }
          if (isOther && isSelected) {
            style.display = 'flex'
            style.alignItems = 'end'
          }
          return (
            <div key={`${index}-option-${optionIndex}`} className={`${groupClassLabel}-column`} style={style}>
              {
                !isMultiple ? (
                  <div className='radiobuttonContainer'>
                    <input
                      type='radio'
                      id={`${fieldId}_${option.name}`}
                      value={option.label}
                      checked={isSelected}
                      onChange={(e) => {
                        if (!isBuilder && !isReadOnly) {
                          handleAnswer(e, option.name)
                        }
                      }}
                      readOnly={isReadOnly}
                      disabled={isBuilder}
                    />
                    {
                      (isBuilder && !isOther)
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
                        : <label htmlFor={`${fieldId}_${option.name}`}>{option.label}</label>
                    }
                  </div>
                ) : (
                  <label htmlFor={`${fieldId}_${option.name}`} className='checkboxContainer'>
                    <input
                      type='checkbox'
                      id={`${fieldId}_${option.name}`}
                      value={option.label}
                      checked={isSelected}
                      onChange={(e) => {
                        if (!isBuilder && !isReadOnly) {
                          handleAnswer(e, option.name)
                        }
                      }}
                      readOnly={isReadOnly}
                      disabled={isBuilder}
                    />
                    <span className='checkmark' />
                    {
                      (isBuilder && !isOther)
                        ? <input
                            type='text'
                            className={`field-input`}
                            value={option.label}
                            onChange={(e) => handleChangeOption(e, optionIndex)}
                          />
                        : <span className='labelName'> {option.label}</span>
                    }
                  </label>
                )
              }
              {
                (isOther && isSelected) && (
                  <input
                    className='field-input'
                    placeholder='Enter other option'
                    value={value?.other || ''}
                    onChange={(e) => handleAnswer(e, 'otherInput')}
                    style={{ marginLeft: '10px', position: 'relative', bottom: '5px' }}
                  />
                )
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
    </div>
  )
}