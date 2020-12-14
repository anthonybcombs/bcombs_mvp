import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

import FieldConstructor from '../../FormBuilder/FieldConstructor'
import { formatPhoneNumber } from '../../utils'

export default ({ isReadOnly = false, showLabel, settings, label, fields, type: groupType, id: groupId, onChange, fieldError, onCheckError, historyFields }) => {
  const handleAnswer = ({ target: { id, value } }, type) => {
    if (type === 'text') {
      if (!Number(value.replace(/[^0-9a-zA-Z]/gi, ''))) {
        return
      }
      const lastChar = value.charAt(value.length - 1)
      if (lastChar && !isNaN(lastChar)) {
        if (value.match(/([\d]+)/g).join('').length > 10) {
          return
        }
        value = formatPhoneNumber(value)
      } else if (!lastChar) {
        value = ''
      }
    }
    onCheckError(id, [])
    onChange(id, value)
  }

  const { include, value: instructionValue } = settings.instruction || {}

  return (
    <div
      className={`formGroup ${groupType}`}
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
        <div
          className={`formGroup-column`}
          style={{ gridColumn: `span 1`}}
        >
          {
            fields.map((field, index) => {
              const { id: fieldId, required, placeholder, tag, type } = field
              const errors = fieldError[fieldId] || []
              const hasError = errors.length ? !!errors.find(e => e) : false
              const historyValue = historyFields.find(e => e.id === field.id)?.value
              const className = historyFields.length && (historyValue ? JSON.parse(historyValue) : '') !== field.value ? 'highlights' : ''

              return (
                <div>
                  {
                    FieldConstructor[tag]({
                      key: `phoneField-${index}`,
                      ...field,
                      placeholder: `${placeholder} ${required ? '*' : ''}`,
                      isReadOnly,
                      onChange: e => handleAnswer(e, type),
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
    </div>
  )
}