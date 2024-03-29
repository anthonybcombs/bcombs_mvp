import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

import FieldConstructor from '../../FormBuilder/FieldConstructor'

export default ({ isReadOnly = false, showLabel, settings, label, fields, id: groupId, type: groupType, onChange, fieldError, onCheckError, historyFields, format }) => {
  const handleAnswer = ({ target: { id, value } }, type) => {
    let errors = fieldError[id] || []
    if (type === 'email') {
      errors = !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
        ? [`Invalid email address`]
        : []
      onCheckError(id, errors)
    } else {
      onCheckError(id, [])
    }
    onChange(id, value)
  }

  const { include, value: instructionValue } = settings.instruction || {}
  const formatObj = format ? JSON.parse(format) : {}
  const color = formatObj?.color || '#000'

  return (
    <div
      className={`formGroup ${groupType}`}
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
      <div className='formGroup-row' style={{ gridTemplateColumns: `repeat(3, 1fr)`}}>
        <div
          className={`formGroup-column`}
          style={{ gridColumn: `span 1`}}
        >
        {
          fields.map((field, index) => {
            const { column = 1, id: fieldId, required, placeholder, tag, type } = field
            const errors = fieldError[fieldId] || []
            const hasError = errors.length ? !!errors.find(e => e) : false
            const historyValue = historyFields.find(e => e.id === field.id)?.value
            const className = historyFields.length && (historyValue ? JSON.parse(historyValue) : '') !== field.value ? 'highlights' : ''

            return (
                <div>
                  {
                    FieldConstructor[tag]({
                      key: `emailField-${index}`,
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