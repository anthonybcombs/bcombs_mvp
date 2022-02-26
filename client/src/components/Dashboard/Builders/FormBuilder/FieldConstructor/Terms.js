import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment'

export default (props) => {
  const { isReadOnly = false, showLabel, settings, label, fields, fieldError, type, id: fieldId, onChange, onCheckError, format } = props

  const errors = fieldError[fields[1].id] || []
  const checkBoxError = fieldError[fields[0].id] || []
  // const parseCheckBoxValue = fields[0].checked ? JSON.parse(fields[0].value) : {};
  const parsedValue = fields[1].value ? JSON.parse(fields[1].value) : {}
  const date = parsedValue.date || moment().format('L');

  const handleAnswer = ({ target: { value } }) => {
    

    onChange(fields[1].id, JSON.stringify({ value, date }))
    onCheckError(fields[1].id, !value ? ['Electronic Signature is required'] : '')
  }

  const handleChecked = (e) => {

    onChange(fields[0].id, e.target.checked)
    onCheckError(fields[0].id, !e.target.checked ? ['Please Tick Above the Terms & Condition'] : '')
 

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
                  <FontAwesomeIcon className='exclude-global' icon={faQuestionCircle} />
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
            <FontAwesomeIcon className='exclude-global' icon={faQuestionCircle} />
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
              required={true}
           //   name="term_checkbox"
              type="checkbox"
              style={{ width: '12px' }}
              checked={fields[0]?.value}
              vvalue={fields[0]?.value}
              onChange={handleChecked}
              style={{ marginTop: 12 }}
       
            />
      

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
          {
               (checkBoxError.length > 0) && (
                <div className='error'>Please Tick Above the Terms & Condition</div>
              )
          }
        </div>
      </div>
    </div>
  )
}