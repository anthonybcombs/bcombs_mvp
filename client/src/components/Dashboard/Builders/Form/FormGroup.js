import React, { useState } from 'react'
import { uuid } from 'uuidv4'
import cloneDeep from 'lodash.clonedeep'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

import FieldConstructor from '../FormBuilder/FieldConstructor'
import { Sources } from '../FormBuilder/Settings/Sources'

export default ({ 
  label, fields, fieldError, onChange, type: itemGroup, settings, onCheckError, historyFields,
  gridMax, showLabel, addresses, id: groupId, onCopyFirstAddress, isReadOnly, onGetGroupById
}) => {
  
  const isAddress = itemGroup === 'address'

  const gridColRepeat = isAddress ? 4 : gridMax

  const { validationOptions } = Sources

  const handleChange = ({ target: { id, value } }, { type, placeholder }, isBlur = false) => {
    const { validation } = fields.find(e => e.id === id) || {}
    const { include: validate, items } = validation || {}
    let errors = []
    if (validate) {
      errors = items.map(({ type: itemType, option: itemOption, value: itemValue, error: itemError }) => {
        return !validationOptions[itemType][itemOption].func(
            itemType === 'number' ? value * 1 : value,
            itemType === 'number' ? itemValue * 1 : itemValue
          ) ? itemError : ''
      })
    }

    if (type === 'zipcode') {
      if (isNaN(value) || value.length > 5) {
        return
      }
      if (value && value.length < 5 && isBlur) {
        errors.push(`${placeholder} is invalid.`)
      }
    }

    if (errors.length === 1 && errors[0] === '') {
      errors = []
    }

    onChange(id, JSON.stringify(value))
    onCheckError(id, errors)
  }

  const { include, value } = settings.instruction || {}
  const isNotFirstAddress = isAddress && addresses.findIndex(e => e.id === groupId) > 0
  let issameAsFirstAddress = true

  if (isNotFirstAddress) {
    const firstAddress = onGetGroupById(addresses[0].id, 'fields')
    const currAddress = fields
    const isNotemptyAddress = fields.find(e => !!(e.value ? JSON.parse(e.value) : e.value))
    if (!!isNotemptyAddress) {
      currAddress.forEach(({ value }, index) => {
        if (value !== firstAddress[index].value) {
          issameAsFirstAddress = false
        }
      })
    } else {
      issameAsFirstAddress = false
    }
  }

  const isRequired = fields.find(e => e.required)
  const finalLabel = isRequired
    ? label.slice(-1) === '*' ? label : label + ' *'
    : label

  return (
    <div
      className={`formGroup ${itemGroup}`}
      id={`group_${groupId}`}
    >
      <p className='formGroup-name'>
        {showLabel ? (
          <span>
            {finalLabel}
            {
              (include && value) && (
                <span className='tooltip-wrapper'>
                  <FontAwesomeIcon className='exclude-global' icon={faQuestionCircle}/>
                  <span className='tooltip'>{value}</span>
                </span>
              )
            }
          </span>
        ) : ''}
      </p>
      {
        (!showLabel && include) && (
          <div className='formGroup-name-instruction'>
            <FontAwesomeIcon className='exclude-global' icon={faQuestionCircle}/>
            {value}
          </div>
        )
      }
      <div className='formGroup-row' style={{ gridTemplateColumns: `repeat(${gridColRepeat}, 1fr)`}}>
        {
          cloneDeep(fields).map((field, index) => {
            const { type = '', tag, options, column = 1, id: fieldId, placeholder, required } = field
            const errors = fieldError[fieldId] || []
            const hasError = errors.length ? !!errors.find(e => e) : false
            const historyValue = historyFields.find(e => e.id === field.id)?.value
            const className = historyValue && historyValue !== field.value ? 'highlights' : ''
            // console.log('basta di mogana', { historyFields, field })
            return (
              <div
                key={`formGroupField-${index}`}
                className={`formGroup-column`}
                style={{ gridColumn: `span ${column}`}}
              >
                {
                  FieldConstructor[tag]({
                    key: `field-${index}`,
                    ...field,
                    placeholder: `${placeholder} ${required ? '*' : ''}`,
                    value: field.value ? JSON.parse(field.value) : '',
                    onChange: (e) => handleChange(e, field),
                    onBlur:  (e) => handleChange(e, field, true),
                    onCheckError,
                    errors,
                    isReadOnly,
                    className: `${className} ${hasError ? 'hasError': ''}`
                  })
                }
                {
                  hasError && 
                    errors.map((e, i) => {
                      return e && <div key={`error-${i}`} className='error'> {e}</div>
                    })
                }
              </div>
            )
          })
        }
      </div>
      {
        isNotFirstAddress && (
          <label htmlFor={`sameAddress-${groupId}`} className='checkboxContainer'>
            <input
              type='checkbox'
              id={`sameAddress-${groupId}`}
              checked={issameAsFirstAddress}
              onChange={(e) => onCopyFirstAddress(e, groupId)}
            />
            <span className='checkmark' />
            <span className='labelName'>Same as first address</span>
          </label>
        )
      }
    </div>
  )
}
