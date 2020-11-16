import React from 'react'
import FieldConstructor from '../../FormBuilder/FieldConstructor'

export default ({ fields, type, id, onChange, value = {} }) => {
  const fieldId = `${type}_${id}`
  const handleAnswer = ({ target: { id, value: phoneValue } }) => {
    onChange(fieldId, { ...value, [id]: phoneValue })
  }

  return (
    <div
      className={`formGroup ${type}`}
    > 
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