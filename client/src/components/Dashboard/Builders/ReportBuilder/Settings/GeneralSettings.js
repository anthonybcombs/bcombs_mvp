import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faCopy, faPlusCircle, faMinusCircle, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import cloneDeep from 'lodash.clonedeep'

import { Sources } from './Sources'

export default ({
  generalSettings,
  fieldSettings,
  hasSelectedField,
  showSettings,
  isActive,
  validationAppliedToAll,
  onChangeGeneralSettings,
  onChangeFieldSettings,
  onRemoveGroup,
  onDuplicateGroup,
  onApplyValidationToAll,
}) => {

  const { validationTypes, validationOptions } = Sources

  const validationOptionsArr = (valType) => Object.entries(validationOptions[valType || 'text'])
  const defaultValidation = { type: 'text', option: 'contains', value: '', error: '', errorField: 'value' }

  const handleChangeGeneralSettings = (data, key) => {
    let newSettings = { ...generalSettings }

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

    onChangeGeneralSettings(newSettings)
  }

  const handleChangeFieldSettings = (data, key, index) => {
    let validationSettings = fieldSettings.validation || {}

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

      validationSettings = {
        ...validationSettings,
        items: validationSettings.items
          ? validationSettings.items.map((e, i) => {
              if (i === index) {
                return { ...e, ...optionData, ...valueData, ...data, errorField }
              }
              return e
            })
          : [{ ...defaultValidation, ...optionData, ...valueData, ...data, errorField }]
      }

      if (validationAppliedToAll) {
        onApplyValidationToAll(validationSettings, true)
      } else {
        onChangeFieldSettings({ validation: validationSettings })
      }
      
      return
    }

    if (key === 'removeValidation') {
      validationSettings = {
        ...validationSettings,
        items: validationSettings.items.filter((e, i) => i !== index)
      }
      if (validationAppliedToAll) {
        onApplyValidationToAll(validationSettings, true)
      } else {
        onChangeFieldSettings({ validation: validationSettings })
      }
      return
    }

    if (key === 'addValidation') {
      validationSettings = {
        ...validationSettings,
        items: validationSettings.items.push(data)
      }
      if (validationAppliedToAll) {
        onApplyValidationToAll(validationSettings, true)
      } else {
        onChangeFieldSettings({ validation: validationSettings })
      }
      return
    }

    onChangeFieldSettings(data)
  }

  const handleApplyValidationToAll = (checked) => {
    onApplyValidationToAll(fieldSettings.validation, checked)
  }

  const { instruction = {}, logic = {}, } = generalSettings
  const { validation = {}, required = false } = fieldSettings || {}
  const { include, items = [{ ...defaultValidation }] } = validation
  const hasValidationError = items.find(e => e.errorField)

  const showOptions = !showSettings || isActive

  return (
    <div className='group-settings' style={{ marginTop: isActive ? '10rem' : '2rem' }}>
      {/* Start For Validation */}
      {
        include && 
          (
            <div>
              <label htmlFor='applyValidation'  className={`checkboxContainer`} >
                <input
                  type='checkbox'
                  id='applyValidation'
                  name='applyValidation'
                  checked={validationAppliedToAll}
                  onChange={e => {
                    e.stopPropagation()
                    handleApplyValidationToAll(e.target.checked)
                  }}
                />
                <span className='checkmark'/>
                <span className='labelName'> Apply to all fields</span>
              </label>
              {
                items.map(({ type = 'text', option, value, error, errorField }, index) => {
                  return (
                    <div key={`validation-${index}`} className='settings-validation'>
                      <div className='field select-field-wrapper'>
                        <select
                          className='field-input'
                          value={type}
                          onChange={({ target }) => {
                            handleChangeFieldSettings({ type: target.value }, 'validation', index)
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
                            handleChangeFieldSettings({ option: target.value }, 'validation', index)
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
                            handleChangeFieldSettings({ value: target.value }, 'validation', index)
                          }}
                        />
                      }
                      <input
                        type='text'
                        className='field-input'
                        placeholder='Custom error text'
                        value={error}
                        onChange={({ target }) => {
                          handleChangeFieldSettings({ error: target.value }, 'validation', index)
                        }}
                      />
                      <div className='addRemove-validation'>
                        {
                          (!hasValidationError && (index === items.length - 1)) && (
                            <div className='tooltip-wrapper add-validation'>
                              <FontAwesomeIcon
                                size='2x' 
                                icon={faPlusCircle}
                                className='add-icon'
                                onClick={() => handleChangeFieldSettings(defaultValidation, 'addValidation') }
                              />
                              <span className='tooltip'>Add Validation</span>
                            </div>
                          )
                        }
                        {
                          items.length > 1 &&
                          (
                            <div className='tooltip-wrapper remove-validation'>
                              <FontAwesomeIcon
                                size='2x' 
                                icon={faMinusCircle}
                                className='remove-icon'
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleChangeFieldSettings(null, 'removeValidation', index)
                                }}
                              />
                              <span className='tooltip'>Remove Validation</span>
                            </div>
                          )
                        }
                      </div>
                      
                    </div>
                  )
                })
              }
            </div>
          )
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
                handleChangeGeneralSettings({ value: target.value }, 'instruction')
              }}
            />
          </div>
        )
      }
      {/* End for Instruction */}

      {/* Start Lower Control */}
      <div className='settings-control'>
        <div className={`settings-control-item field ${!showOptions ? 'hidden' : ''}`}>
          <div className='tooltip-wrapper'>
            <p className='label'>Field Settings
              <FontAwesomeIcon className='exclude-global' icon={faQuestionCircle}/>
            </p>
            <span className='tooltip'>Select a field first to enable these options.</span>
          </div>

          <div className='settings-content'>
            <label htmlFor='required'  className={`checkboxContainer ${!hasSelectedField ? 'disabled' : ''}`} >
              <input
                type='checkbox'
                id='required'
                name='required'
                disabled={!hasSelectedField}
                checked={required}
                onChange={e => {
                  e.stopPropagation()
                  handleChangeFieldSettings({ required: e.target.checked })
                }}
              />
              <span className='checkmark'/>
              <span className='labelName'> Required</span>
            </label>

            <label htmlFor='validation' className={`checkboxContainer ${!hasSelectedField ? 'disabled' : ''}`} >
              <input
                type='checkbox'
                id='validation'
                name='validation'
                disabled={!hasSelectedField}
                checked={!!validation.include}
                onChange={e => {
                  e.stopPropagation()
                  handleChangeFieldSettings({ validation: { include: e.target.checked, items: [defaultValidation] } })
                }}
              />
              <span className='checkmark'/>
              <span className='labelName'> Validation</span>
            </label>
          </div>
        </div>

        <div className={`settings-control-item group ${!showOptions ? 'hidden' : ''}`}>
          <div className='tooltip-wrapper'>
            <p className='label'>Group Settings
              <FontAwesomeIcon className='exclude-global' icon={faQuestionCircle}/>
            </p>
            <span className='tooltip'>These options are for the entire group.</span>
          </div>

          <div className='settings-content'>
          <label htmlFor='logic' className={`checkboxContainer`} >
              <input
                type='checkbox'
                id='logic'
                name='logic'
                disabled={!hasSelectedField}
                checked={!!logic.include}
                onChange={e => {
                  e.stopPropagation()
                  handleChangeGeneralSettings({ include: e.target.checked }, 'logic')
                }}
              />
              <span className='checkmark'/>
              <span className='labelName'> Logic</span>
            </label>

            <label htmlFor='instruction' className='checkboxContainer'>
              <input
                type='checkbox'
                id='instruction'
                name='instruction'
                checked={!!instruction.include}
                onChange={e => {
                  e.stopPropagation()
                  handleChangeGeneralSettings({ include: e.target.checked }, 'instruction')
                }}
              />
              <span className='checkmark' />
              <span className='labelName'> Instruction for Use</span>
            </label>
          </div>
        </div>
        
        <div className='settings-control-item'>
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
      </div>
      {/* End Lower control */}
    </div>
  )
}