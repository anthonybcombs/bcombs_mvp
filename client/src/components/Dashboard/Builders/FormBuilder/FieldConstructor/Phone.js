import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

import FieldConstructor from '../../FormBuilder/FieldConstructor'

export default ({ showLabel, settings, label, fields, type, id, onChange, value = {} }) => {
  const fieldId = `${type}_${id}`
  const handleAnswer = ({ target: { id, value: phoneValue } }) => {
    onChange(fieldId, { ...value, [id]: phoneValue })
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
                return FieldConstructor[field.tag]({
                  key: `phoneField-${index}`,
                  ...field,
                  id: field.type,
                  value: value[field.type] || '',
                  onChange: handleAnswer
                })
              })
            }
          </div>
      </div>
    </div>
  )
}