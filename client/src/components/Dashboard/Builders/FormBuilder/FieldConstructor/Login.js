import React from 'react'
import FieldConstructor from '../../FormBuilder/FieldConstructor'

export default ({ showLabel, settings, label, fields, type, id, onChange, fieldError = [], onCheckError }) => {
  const fieldId = `${type}_${id}`
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

  return (
    <div
      className={`formGroup ${type}`}
    > 
      <p className='formGroup-name'>
        {showLabel ? (
          <span>
            {label}
            {
              (include && instructionValue) && (
                <div className='tooltip-wrapper'>
                  <FontAwesomeIcon className='exclude-global' icon={faQuestionCircle}/>
                  <span className='tooltip'>{instructionValue}</span>
                </div>
              )
            }
          </span>
        ) : ''}
      </p>
      <div className='formGroup-row' style={{ gridTemplateColumns: `repeat(4, 1fr)`}}>
        {
          fields.map((field, index) => {
            const { tag, column, placeholder, required } = field
            const errors = fieldError[field.id] || []
            const hasError = errors.length ? !!errors.find(e => e) : false
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
                    placeholder: `${placeholder} ${required ? '*' : ''}`,
                    onChange: e => handleAnswer(e, field.type),
                    className: hasError ? 'hasError': ''
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