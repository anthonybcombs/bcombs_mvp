import React from 'react'
import cloneDeep from 'lodash.clonedeep'

export default ({ label, type, id, onChange, value = {} }) => {
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
      <p className='formGroup-name'>{label}</p>
      <div className='formGroup-row' style={{ gridTemplateColumns: `repeat(3, 1fr)`}}>

        <div
            className={`formGroup-column okoi`}
            style={{ gridColumn: `span 1`}}
          >
            <input
              type='number'
              id='hour'
              className='field-input'
              placeholder='Hour'
              value={value.hour}
              onChange={handleAnswer}
            />
            <span>:</span>
            <input
              type='number'
              id='minutes'
              className='field-input'
              placeholder='Min'
              value={value.minutes}
              onChange={handleAnswer}
            />
            <div className='field select-field-wrapper'>
              <select
                id='type'
                value={value.type}
                className='field-input'
                onChange={handleAnswer}
              >
                <option value='AM'>AM</option>
                <option value='PM'>PM</option>
              </select>
            </div>
             
          </div>
      </div>
    </div>
  )
}