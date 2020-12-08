import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

import FieldConstructor from '../../FormBuilder/FieldConstructor'

export default ({ isReadOnly = false, showLabel, settings, label, fields, type, onChange, id: groupId, fieldError, onCheckError, historyFields }) => {
  const handleAnswer = ({ target: { id, value } }, isBlur = false) => {
    if (!isBlur) {
      const [whole, decimal = ''] = value.split('.')
      if (isNaN(whole) || decimal.length > 2) {
        return
      }
    } else if(!value) {
      return
    }
    onChange(id, isBlur ? Number(value).toFixed(2) : value)
    onCheckError(id, [])
  }

  const { include, value: instructionValue } = settings.instruction || {}

  return (
    <div
      className={`formGroup ${type}`}
      id={`group_${groupId}`}
    > 
      <p className='formGroup-name'>
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
      <div className='formGroup-row' style={{ gridTemplateColumns: `repeat(3, 1fr)`}}>
        {
          fields.map((field, index) => {
            const { column = 1, id: fieldId, required, placeholder, tag, type } = field
            const errors = fieldError[fieldId] || []
            const hasError = errors.length ? !!errors.find(e => e) : false
            const historyValue = historyFields.find(e => e.id === field.id)?.value
            const className = historyValue && JSON.parse(historyValue) !== field.value ? 'highlights' : ''

            return (
              <div
                key={`formGroupField-${index}`}
                className={`formGroup-column`}
                style={{ gridColumn: `span ${column}`}}
              >
                {
                  FieldConstructor[tag]({
                    key: `emailField-${index}`,
                    ...field,
                    placeholder: `${placeholder} ${required ? '*' : ''}`,
                    onChange: handleAnswer,
                    isReadOnly,
                    onBlur: (e) => handleAnswer(e, true),
                    type: tag !== 'icon' ? 'number' : type,
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