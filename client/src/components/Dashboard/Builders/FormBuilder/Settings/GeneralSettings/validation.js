import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons'

export default ({
  items,
  validationAppliedToAll,
  validationTypes,
  validationOptionsArr,
  defaultValidation,
  fieldSettings,

  onApplyValidationToAll,
  onChangeFieldSettings
}) => {

  const handleApplyValidationToAll = (checked) => {
    onApplyValidationToAll(fieldSettings.validation, checked)
  }

  const hasValidationError = items.find(e => e.errorField)

  return (
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
                    onChangeFieldSettings({ type: target.value }, 'validation', index)
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
                    onChangeFieldSettings({ option: target.value }, 'validation', index)
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
                    onChangeFieldSettings({ value: target.value }, 'validation', index)
                  }}
                />
              }
              <input
                type='text'
                className='field-input'
                placeholder='Custom error text'
                value={error}
                onChange={({ target }) => {
                  onChangeFieldSettings({ error: target.value }, 'validation', index)
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
                        onClick={() => onChangeFieldSettings(defaultValidation, 'addValidation') }
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
                          onChangeFieldSettings(null, 'removeValidation', index)
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