import React, { useState } from 'react'
import { uuid } from 'uuidv4'
import cloneDeep from 'lodash.clonedeep'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

import FieldConstructor from '../FormBuilder/FieldConstructor'
import { Sources } from '../FormBuilder/Settings/Sources'

import { isValidJSONString } from '../../../../helpers/Arrays';

// function isValidJSONString(str) {
//   try {
//     JSON.parse(str);
//     return true;
//   } catch (error) {
//     return false;
//   }
// }

export default ({ 
  label, fields, fieldError, onChange, type: itemGroup, settings, onCheckError, historyFields, format,
  gridMax, showLabel, addresses, id: groupId, onCopyFirstAddress, isReadOnly, onGetGroupById, isApplication
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

      console.log('errorsvss',errors)
    onChange(id, JSON.stringify(value))
    onCheckError(id, errors)
  }

  const { include, value } = settings.instruction || {}
  const isNotFirstAddress = isAddress && addresses.findIndex(e => e.id === groupId) > 0
  let issameAsFirstAddress = true

  if (isNotFirstAddress) {
    const firstAddress = onGetGroupById(addresses[0].id, 'fields')
    const currAddress = fields
    const isNotemptyAddress =  fields.find(e => !!(e.value ? JSON.parse(e.value) : e.value))
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
  const formatObj = format ? isValidJSONString(format) ? JSON.parse(format) : {} : {}
  const color = formatObj?.color || '#000'
  console.log('fieldsvssss', fields)
  return (
    <div
      className={`formGroup ${itemGroup}`}
      id={`group_${groupId}`}
    >
      <p className='formGroup-name' style={{ color }}>
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
            const className = historyFields.length && historyValue !== field.value ? 'highlights' : ''

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
                    ...( tag === 'checkbox' ? { checked: field.value  } : {}),
                    placeholder: `${placeholder} ${required ? '*' : ''}`,
                    value: field.value ? isValidJSONString(field.value) ? JSON.parse(field.value) : field.value || field.value : '',
                    onChange: (e) => handleChange(e, field),
                    // onFileChange: (e, fieldName)=> {
                    //   console.log('eeeeeeeeee', e)
                    //   console.log('eeeeeeeeee fieldName', fieldName)
                    // },
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
              readOnly={isReadOnly}
              onChange={(e) => isReadOnly ? () => {} : onCopyFirstAddress(e, groupId)}
            />
            <span className='checkmark' />
            <span className='labelName'>Same as first address</span>
          </label>
        )
      }
    </div>
  )
}
