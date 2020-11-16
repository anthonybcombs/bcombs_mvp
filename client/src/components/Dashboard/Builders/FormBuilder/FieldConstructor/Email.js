import React from 'react'
import cloneDeep from 'lodash.clonedeep'
import FieldConstructor from '../../FormBuilder/FieldConstructor'

export default ({ label, fields, type, id, onChange, value = {} }) => {
  const fieldId = `${type}_${id}`
  const handleAnswer = ({ target: { id, value: emailValue } }) => {
    onChange(fieldId, { ...value, [id]: emailValue })
  }

  return (
    <div
      className={`formGroup ${type}`}
    > 
      <p className='formGroup-name'>{label}</p>
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