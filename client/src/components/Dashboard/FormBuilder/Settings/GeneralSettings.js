import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faCopy, faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import cloneDeep from 'lodash.clonedeep'

import { Sources } from './Sources'

export default ({
  settings,
  onChangeSettings,
  onRemoveGroup,
  onDuplicateGroup
}) => {
  const { validationTypes, validationOptions } = Sources

  const validationOptionsArr = (valType) => Object.entries(validationOptions[valType || 'text'])
  const defaultValidation = { type: 'text', option: 'contains', value: '', error: '', errorField: 'value' }

  const handleChangeSettings = (data, key, index) => {
    let newSettings = { ...settings }
    if (key === 'validation' && index !== undefined) {
      const [fieldKey, value] = Object.entries(data)[0]
      let errorField = ''
      if (fieldKey === 'value' && value) {
        errorField = ''
      } else if (fieldKey === 'value' && !value) {
        errorField = 'value'
      }

      // Automatic get first option if type is changed
      let optionData = {}
      let valueData = {}
      if (fieldKey === 'type') {
        optionData = { option: validationOptionsArr(value)[0][0] }
        valueData = { value: '' }
        errorField = 'value'
      }

      if (fieldKey === 'option') {
        errorField = !['emailAddress', 'isNumber'].includes(value) ? 'value' : ''
      }

      newSettings[key] = {
        ...newSettings[key],
        items: newSettings[key].items
          ? newSettings[key].items.map((e, i) => {
              if (i === index) {
                return { ...e, ...optionData, ...valueData, ...data, errorField }
              }
              return e
            })
          : [{ ...defaultValidation, ...optionData, ...valueData, ...data, errorField }]
      }
      onChangeSettings(newSettings)
      return
    }

    if (key === 'removeValidation') {
      newSettings.validation = {
        ...newSettings.validation,
        items: newSettings.validation.items.filter((e, i) => i !== index)
      }
      onChangeSettings(newSettings)
      return
    }

    if (key === 'addValidation') {
      newSettings.validation = {
        ...newSettings.validation,
        items: newSettings.validation.items.push(data)
      }
      onChangeSettings(newSettings)
      return
    }

    if (key) {
      newSettings[key] = {
        ...newSettings[key],
        ...data
      }
    } else {
      newSettings = {
        ...newSettings,
        ...data
      }
    }

    onChangeSettings(newSettings)
  }

  const { validation = {}, instruction = {}, logic = {}, required = false } = settings
  const { include, items = [{ ...defaultValidation }] } = validation
  const hasValidationError = items.find(e => e.errorField)

  return (
    <div className='group-settings'>
      {/* Start For Validation */}
      {
        include && items.map(({ type = 'text', option, value, error, errorField }, index) => {
          return (
            <div key={`validation-${index}`} className='settings-validation'>
              <div className='field select-field-wrapper'>
                <select
                  className='field-input'
                  value={type}
                  onChange={({ target }) => {
                    handleChangeSettings({ type: target.value }, 'validation', index)
                  }}
                >
                  {
                    Object.entries(validationTypes).map(([key, label], valIndex) => (
                      <option key={`validationType-${valIndex}`} value={key}>{label}</option>
                    ))
                  }
                </select>
              </div>
              <div className='field select-field-wrapper'>
                <select
                  className='field-input'
                  value={option}
                  onChange={({ target }) => {
                    handleChangeSettings({ option: target.value }, 'validation', index)
                  }}
                >
                  {
                    validationOptionsArr(type).map(([key, { label }], optIndex) => (
                      <option key={`validationOption-${optIndex}`} value={key}>{label}</option>
                    ))
                  }
                </select>
              </div>
              {
                (!['emailAddress', 'isNumber'].includes(option)) &&
                <input
                  className={`field-input ${errorField === 'value' ? 'hasError' : ''}`}
                  value={value}
                  type={type === 'length' ? 'number' : type}
                  placeholder={type === 'text' ? 'Text' : 'Number'}
                  onChange={({ target }) => {
                    handleChangeSettings({ value: target.value }, 'validation', index)
                  }}
                />
              }
              <input
                type='text'
                className='field-input'
                placeholder='Custom error text'
                value={error}
                onChange={({ target }) => {
                  handleChangeSettings({ error: target.value }, 'validation', index)
                }}
              />
              {
                items.length > 1 &&
                (
                  <div className='tooltip-wrapper remove-validation'>
                    <FontAwesomeIcon
                      size='2x' 
                      icon={faMinusCircle}
                      className='remove-icon'
                      onClick={() => handleChangeSettings(null, 'removeValidation', index)}
                    />
                    <span className='tooltip'>Remove Validation</span>
                  </div>
                )
              }
              {
                (!hasValidationError && (index === items.length - 1)) && (
                  <div className='tooltip-wrapper add-validation'>
                    <FontAwesomeIcon
                      size='2x' 
                      icon={faPlusCircle}
                      className='add-icon'
                      onClick={() => handleChangeSettings(defaultValidation, 'addValidation') }
                    />
                    <span className='tooltip'>Add Validation</span>
                  </div>
                )
              }
            </div>
          )
        })
      }
      {/* End for validation */}

      {/* Start for Instruction */}
      {
        instruction.include && (
          <div className='settings-instruction'>
            <textarea
              id='instructions'
              name='instructions'
              className='field-input'
              placeholder='Instructions'
              value={instruction.value}
              onChange={({ target }) => {
                handleChangeSettings({ value: target.value }, 'instruction')
              }}
            />
          </div>
        )
      }
      {/* End for Instruction */}

      {/* Start Lower Control */}
      <div className='settings-control'>
        <label for='instruction' className='checkboxContainer'>
          <input
            type='checkbox'
            id='instruction'
            name='instruction'
            checked={!!instruction.include}
            onChange={e => {
              e.stopPropagation()
              handleChangeSettings({ include: e.target.checked }, 'instruction')
            }}
          />
          <span className='checkmark' />
          <span className='labelName'> Instruction for Use</span>
        </label>
        
        <label for='validation' className='checkboxContainer' >
          <input
            type='checkbox'
            id='validation'
            name='validation'
            checked={!!validation.include}
            onChange={e => {
              e.stopPropagation()
              handleChangeSettings({ include: e.target.checked }, 'validation')
            }}
          />
          <span className='checkmark'/>
          <span className='labelName'> Validation</span>
        </label>

        <label for='logic' className='checkboxContainer'>
          <input
            type='checkbox'
            id='logic'
            name='logic'
            checked={!!logic.include}
            onChange={e => {
              e.stopPropagation()
              handleChangeSettings({ include: e.target.checked }, 'logic')
            }}
          />
          <span className='checkmark'/>
          <span className='labelName'> Logic</span>
        </label>

        <label for='required' className='checkboxContainer'>
          <input
            type='checkbox'
            id='required'
            name='required'
            checked={required}
            onChange={e => {
              e.stopPropagation()
              handleChangeSettings({ required: e.target.checked })
            }}
          />
          <span className='checkmark'/>
          <span className='labelName'> Required</span>
        </label>

        <div className='settings-iconActions'>
          <div className='tooltip-wrapper copy-icon'>
            <FontAwesomeIcon
              icon={faCopy}
              onClick={e => {
                e.stopPropagation()
                onDuplicateGroup()
              }}
            />
            <span className='tooltip'>Copy</span>
          </div>
          <div className='tooltip-wrapper delete-icon'>
            <FontAwesomeIcon
              icon={faTrashAlt}
              onClick={e => {
                e.stopPropagation()
                onRemoveGroup()
              }}
            />
            <span className='tooltip'>Delete</span>
          </div>
        </div>
      </div>
      {/* End Lower control */}
    </div>
  )
}