import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

import FieldConstructor from '../../FormBuilder/FieldConstructor'

export default ({ showLabel, settings, label, fields, type, id, onChange, value = {} }) => {
  const fieldId = `${type}_${id}`
  const handleAnswer = ({ target: { id, value: emailValue } }) => {
    onChange(fieldId, { ...value, [id]: emailValue })
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
      {
        (!showLabel && include) && <div className='formGroup-name-instruction'>{instructionValue}</div>
      }
      <div className='formGroup-row' style={{ gridTemplateColumns: `repeat(3, 1fr)`}}>

        <div
            className={`formGroup-column`}
            style={{ gridColumn: `span 1`}}
          >
            {
              fields.map((field, index) => {
                return FieldConstructor[field.tag]({
                  key: `field-${index}`,
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