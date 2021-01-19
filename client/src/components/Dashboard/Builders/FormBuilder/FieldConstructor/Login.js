import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

import FieldConstructor from '../../FormBuilder/FieldConstructor'

export default ({ isReadOnly= false, format, showLabel, settings, label, fields, type, onChange, id: groupId, fieldError = [], onCheckError, historyFields }) => {
  const handleAnswer = ({ target: { id, value } }, type) => {
    let errors = fieldError[id] || []

    const validatePassword = (condition, message, errorArr) => {
      return !condition
        ? [...errorArr, message]
        : errorArr.filter(e => e !== message)
    }

    if (type === 'email') {
      errors = !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
        ? [`Invalid email address`]
        : []
    }
    if (type === 'password') {
      value = value.replace(/\s/g, '')
      if (value) {
        errors = []
        errors = validatePassword(value.length >= 8, 'Password minimum length must be at least 8 characters.', errors)
        errors = validatePassword(/(?=.*[A-Z])/.test(value), 'Must contain atleast one upper case', errors)
        errors = validatePassword(/(?=.*[a-z])/.test(value), 'Must contain atleast one lower case.', errors)
        errors = validatePassword(/(?=.*\d)/.test(value), 'Must contain atleast one number.', errors)
        errors = validatePassword(/(?=.*[!@#$%^&+=])/.test(value), 'Must contain atleast one special character.', errors)
      }
    }
    if (type === 'confirmPassword') {
      value = value.replace(/\s/g, '')
      if (value) {
        errors = []
        const { value: passVal } = (fields.find(e => e.type === 'password') || {})
        errors = validatePassword(passVal === value, 'Password do not match.', errors)
      }
    }
    onChange(id, value)
    onCheckError(id, errors)
  }

  const { include, value: instructionValue } = settings.instruction || {}
  const formatObj = format ? JSON.parse(format) : {}
  const color = formatObj?.color || '#000'

  return (
    <div
      className={`formGroup ${type}`}
      id={`group_${groupId}`}
    > 
      <p className='formGroup-name' style={{ color }}>
        {showLabel ? (
          <span>
            {label}
            {
              (include && instructionValue) && (
                <span className='tooltip-wrapper'>
                  <FontAwesomeIcon className='exclude-global' icon={faQuestionCircle}/>
                  <span className='tooltip'>{instructionValue}</span>
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
            {instructionValue}
          </div>
        )
      }
      <div className='formGroup-row' style={{ gridTemplateColumns: `repeat(4, 1fr)`}}>
        {
          fields.map((field, index) => {
            const { tag, column, placeholder, required, type: fieldType } = field
            const errors = fieldError[field.id] || []
            const hasError = errors.length ? !!errors.find(e => e) : false
            const historyValue = historyFields.find(e => e.id === field.id)?.value
            const className = historyValue && JSON.parse(historyValue) !== field.value ? 'highlights' : ''

            return (
              <div
                key={`formGroupField-${index}`}
                className={`formGroup-column`}
                style={{ gridColumn: `span ${column}` }}
              >
                {
                  FieldConstructor[tag]({
                    key: `field-${index}`,
                    ...field,
                    isReadOnly,
                    type: fieldType !== 'email' ? 'password' : fieldType,
                    placeholder: `${placeholder} ${required ? '*' : ''}`,
                    onChange: e => handleAnswer(e, field.type),
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
    </div>
  )
}