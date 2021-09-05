import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'

export default (props) => {
  const { isReadOnly = false, showLabel, settings, label, fields, fieldError, type, id: fieldId, onChange, onCheckError, format } = props
  const errors = fieldError[fields[0].id] || []
  const parsedValue = fields[0].value ? JSON.parse(fields[0].value) : {}
  const date = parsedValue.date || moment().format('L');

  const handleAnswer = ({ target: { value } }) => {
    onChange(fields[0].id, JSON.stringify({ value, date }))
    onCheckError(fields[0].id, !value ? ['Electronic Signature is required'] : '')
  }

  const { include, value: instructionValue } = settings.instruction || {}
  const formatObj = format ? JSON.parse(format) : {}
  const color = formatObj?.color || '#000'

  return (
    <div
      className={`formGroup ${type}`}
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
      <div className='formGroup-row'>
        <div className='title'>
          {fields[0].placeholder}
        </div>
        <div className='content'>
          {fields[1].placeholder}
        </div>
        <div className='signature'>
          <input
            readOnly={isReadOnly}
            className={`field-input`}
            value={parsedValue.value || ''}
            placeholder={'Electronic Signature *'}
            onChange={handleAnswer}
          />
          <input
            readOnly={true}
            className={`field-input`}
            value={date}
          />
        </div>
        <div>
          {
            (errors.length > 0) && (
              <div className='error'>Electronic Signature is required</div>
            )
          }
        </div>
      </div>
    </div>
  )
}