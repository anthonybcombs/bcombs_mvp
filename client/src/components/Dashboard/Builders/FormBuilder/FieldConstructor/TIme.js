import React from 'react'
import cloneDeep from 'lodash.clonedeep'

export default ({ fields, type, id, onChange, value = {} }) => {
  const fieldId = `${type}_${id}`
  const handleAnswer = ({ target: { id: timeId, value: timeVal } }) => {
    if (
      (timeId === 'hour' && (timeVal * 1) > 24) ||
      (timeId === 'minutes' && (timeVal * 1) > 59)
    ) {
      return
    }
    onChange(fieldId, { ...value, [timeId]: (timeVal * 1) || '' })
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
            <input
              type='number'
              id='hour'
              value={value.hour}
              onChange={handleAnswer}
            />
            <input
              type='number'
              id='minutes'
              value={value.minutes}
              onChange={handleAnswer}
            />
             <select
                id='type'
                value={value.type}
                onChange={handleAnswer}
              >
                <option value='AM'>AM</option>
                <option value='PM'>PM</option>
              </select>
          </div>
      </div>
    </div>
  )
}