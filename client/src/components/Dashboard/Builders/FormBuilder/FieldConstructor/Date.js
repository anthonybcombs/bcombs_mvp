import React from 'react'
import cloneDeep from 'lodash.clonedeep'

export default ({ fields, type, id, onChange, value = {} }) => {
  const fieldId = `${type}_${id}`
  const handleAnswer = (rate) => {
    onChange({ target: { id: fieldId, value: rate } })
  }

  return (
    <div
      className={`formGroup ${type}`}
    > 
      <div className='formGroup-row' style={{ gridTemplateColumns: `repeat(3, 1fr)`}}>
        <input
          className={`field-input`}
        />
      </div>
    </div>
  )
}