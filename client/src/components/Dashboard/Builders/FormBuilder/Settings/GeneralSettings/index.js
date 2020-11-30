import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faCopy, faPlusCircle, faMinusCircle, faQuestionCircle, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons'
import cloneDeep from 'lodash.clonedeep'

import { Sources } from '../Sources'
import Logic from './logic'
import Validation from './validation'

export default ({
  generalSettings,
  fieldSettings,
  hasSelectedField,
  showSettings,
  isActive,
  allowAddField,
  includeLogic,
  includeValidation,
  validationAppliedToAll,
  supportMultiple,
  fieldGroupType,
  isStandard,
  hasError,
  fieldErrors,
  fields,
  pageBreaks,
  breakedFields,
  hasPageBreak,

  onChangeGeneralSettings,
  onChangeFieldSettings,
  onRemoveGroup,
  onDuplicateGroup,
  onApplyValidationToAll,
  onChangeDefaultProps,
  onCheckError
}) => {

  let { validationTypes, validationOptions } = Sources

  validationTypes = cloneDeep(validationTypes)

  const validationOptionsArr = (valType) => {
    const valOptions = Object.entries(validationOptions[valType || 'text'])
    return fieldGroupType === 'paragraphText'
      ? valOptions.filter(e => e[0] !== 'emailAddress')
      : valOptions
  }
  const defaultValidation = { type: 'text', option: 'contains', value: '', error: '', errorField: 'value' }

  if (fieldGroupType === 'paragraphText') {
    delete validationTypes.number
  }

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

  const handleCheckError = (data) => {
    const newErrors = !!data.find(e => e.label.replace(/\s/g, '') === '')
    ? [`Option labels for ${fieldSettings.label} are required.`]
    : []

    onCheckError(newErrors)
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

    if (key === 'addOption') {
      const options = fieldSettings.options
      const newOptions = options.map((option, i) => {
        const newLabel = i === index ? data : option.label
        return { ...option, label: newLabel, name: newLabel.toLowerCase() }
      })
      onChangeFieldSettings({ options: newOptions })
      handleCheckError(newOptions)
    
      return
    }
    onChangeFieldSettings(data)
  }

  const { instruction = {}, logic = {}, } = generalSettings
  const { validation = {}, required = false, options, requireAddOption = false, isMultiple } = fieldSettings || {}
  const { include, items = [{ ...defaultValidation }] } = validation

  const showOptions = !showSettings || isActive
  return (
    <div className='group-settings' style={{ marginTop: isActive ? '8rem' : '2rem' }}>
      {/* Start For Field with options */}
      {
        requireAddOption &&
        (
          <>
            <span className='option-label'> Options for {fieldSettings.label}:</span>
            {
              options.map((option, optionIndex) => {
                return (
                  <div key={`option-${optionIndex}`} className='option'>
                    <span>{optionIndex + 1}.</span>
                    <input
                      type='text'
                      className={`field-input`}
                      value={option.label}
                      onChange={({ target }) => handleChangeFieldSettings(target.value, 'addOption', optionIndex)}
                    />
                    {
                      options.length > 1 && (
                        <FontAwesomeIcon
                          className='removeField-icon'
                          icon={faTimes}
                          onClick={e => {
                            e.stopPropagation()
                            const newOptions = cloneDeep(options)
                            newOptions.splice(optionIndex, 1)
                            onChangeFieldSettings({ options: newOptions })
                            handleCheckError(newOptions)
                          }}
                        />
                      )
                    }
                  </div>
                )
              })
            }
            
            <button
              type='button'
              target='_blank'
              className='btn option-btn'
              onClick={(e) => {
                e.stopPropagation()
                onChangeFieldSettings({ options: [...options, { name: `title-${options.length + 1}`, label: `Title ${options.length + 1}`, tag: 'checkbox' },] })
              }}
            >
              <FontAwesomeIcon
                icon={faPlus}
                className='addField-icon'
              />
              <span>Add Option</span>
            </button>
          </>
        )
      }
      {/* End For Field with options */}
      
      {/* Start For Validation */}
      {
        include && 
          (
            <Validation
              items={items}
              validationAppliedToAll={validationAppliedToAll}
              validationTypes={validationTypes}
              validationOptionsArr={validationOptionsArr}
              defaultValidation={defaultValidation}
              fieldSettings={fieldSettings}
              
              onApplyValidationToAll={onApplyValidationToAll}
              onChangeFieldSettings={handleChangeFieldSettings}
            />
          )
      }
      {/* End for validation */}

      {/* Start for Logic */}
      {
        includeLogic && logic.include && (
          <Logic
            fields={fields}
            generalSettings={generalSettings}
            pageBreaks={pageBreaks}
            hasPageBreak={hasPageBreak}
            breakedFields={breakedFields}

            onChangeGeneralSettings={onChangeGeneralSettings}
          />
        )
      }
      {/* End for Logic  */}

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

      {/* Start for Group Validation */}
      {
        (hasError && (!fieldSettings.requireAddOption || requireAddOption)) && 
        fieldErrors.map((e, i) => {
          return e && <div
            key={`error-${i}`}
            className='error'
            style={{ padding: '1rem', background: '#ffe0dd'}}
          >
            {e}
          </div>
        })
      }
      {/* End for Group Validation */}

      {/* Start Lower Control */}
      <div className='settings-control'>
        <div className={`settings-control-item field ${!showOptions ? 'hidden' : ''}`}>
          {
            (allowAddField && isStandard) ? (
              <div className='tooltip-wrapper'>
                <p className='label'>Field Settings
                  <FontAwesomeIcon className='exclude-global' icon={faQuestionCircle}/>
                </p>
                <span className='tooltip'>Select a field first to enable these options.</span>
              </div>
            ) : (
              <p className='label'>Field Settings</p>
            )
          }

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
            {
              supportMultiple && (
                <label htmlFor='isMultiple'  className={`checkboxContainer ${!hasSelectedField ? 'disabled' : ''}`} >
                  <input
                    type='checkbox'
                    id='isMultiple'
                    name='isMultiple'
                    disabled={!hasSelectedField}
                    checked={isMultiple}
                    onChange={e => {
                      e.stopPropagation()
                      handleChangeFieldSettings({ isMultiple: e.target.checked })
                    }}
                  />
                  <span className='checkmark'/>
                  <span className='labelName'> Multiple</span>
                </label>
              )
            }
            {
              includeValidation && (
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
              )
            }
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
            {
              includeLogic && (
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
              )
            }

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

            {
              // (!isStandard && ['phone', 'email'].includes(fieldGroupType)) && (
              //   <label htmlFor='allowAddField'  className={`checkboxContainer`} >
              //     <input
              //       type='checkbox'
              //       id='allowAddField'
              //       name='allowAddField'
              //       checked={allowAddField}
              //       onChange={e => {
              //         e.stopPropagation()
              //         onChangeDefaultProps({ allowAddField: e.target.checked })
              //       }}
              //     />
              //     <span className='checkmark'/>
              //     <span className='labelName'> Allow add field row</span>
              //   </label>
              // )
            }
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