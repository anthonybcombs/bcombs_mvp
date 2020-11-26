import React, { useState } from 'react'
import { uuid } from 'uuidv4'
import cloneDeep from 'lodash.clonedeep'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

import FieldConstructor from '../FormBuilder/FieldConstructor'
import { Sources } from '../FormBuilder/Settings/Sources'

export default ({ 
  label, fields, fieldState, fieldError, onChange, type: itemGroup, settings, onCheckError, gridMax, showLabel
}) => {
  // console.log('@settings', { settings, fieldError })
  const gridColRepeat = itemGroup === 'address' ? 4 : gridMax

  const { validationOptions } = Sources
  const { validation } = settings || {}
  const { include: validate, items } = validation || {}

  const handleChange = ({ target: { id, value } }) => {
    let errors = []
    if (validate) {
      errors = items.map(({ type: itemType, option: itemOption, value: itemValue, error: itemError }) => {
        return !validationOptions[itemType][itemOption].func(
            itemType === 'number' ? value * 1 : value,
            itemType === 'number' ? itemValue * 1 : itemValue
          ) ? itemError : ''
      })
    }
    
    onChange(id, value)
    onCheckError(id, errors)
  }

  return (
    <div
      className={`formGroup ${itemGroup}`}
    >
      <p className='formGroup-name'>{showLabel ? label : ''}</p>
      <div className='tooltip-wrapper'>
        <FontAwesomeIcon className='exclude-global' icon={faQuestionCircle}/>
        <span className='tooltip'>Instruction here..........................</span>
      </div>
      <div className='formGroup-row' style={{ gridTemplateColumns: `repeat(${gridColRepeat}, 1fr)`}}>
        {
          cloneDeep(fields).map((field, index) => {
            const { type = '', tag, options, column = 1, id: fieldId, placeholder, required } = field
            const errors = fieldError[fieldId] || []
            const hasError = errors.length ? !!errors.find(e => e) : false
 
            if (type !== 'option') {
              return (
                <div
                  className={`formGroup-column`}
                  style={{ gridColumn: `span ${column}`}}
                >
                  {
                    FieldConstructor[tag]({
                      key: `field-${index}`,
                      ...field,
                      placeholder: `${placeholder} ${required ? '*' : ''}`,
                      value: fieldState[fieldId] || '',
                      onChange: handleChange,
                      className: hasError ? 'hasError': ''
                    })
                  }
                  {
                    hasError && 
                      errors.map(e => {
                        return e && <div className='error'>- {e}</div>
                      })
                  }
                </div>
              )
            } else {
              return options.map(option => {
                return (
                  <div className={`formGroup-column`} style={{ gridColumn: `span 3`}}>
                    {
                      FieldConstructor[option.tag]({
                        key: `field_${option.tag}_${uuid()}`,
                        ...option
                      })
                    }
                  </div>
                )
              })
            }
          })
        }
      </div>
    </div>
  )
}
