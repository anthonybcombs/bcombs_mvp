import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

export default ({ isReadOnly = false, showLabel, settings, fields, label, type, id: groupId, onChange, fieldError, onCheckError, historyFields }) => {
  const { id: fieldId, value, required } = fields[0]

  const handleFormatAnswer = (timeId, timeVal, isBlur) => {
    const newValue = value || []
    if (['hour', 'minutes'].includes(timeId)) {
      if (isBlur) {
        timeVal = timeVal.length === 1 ? `0${timeVal}` : timeVal
      } else if (timeVal.length >= 2 && timeVal[0] === '0' && timeVal !== '00') {
        timeVal = timeVal.replace('0', '')
      }
    }
    if (timeId === 'hour') {
      newValue[0] = timeVal
      newValue[1] = newValue[1] || '00'
      newValue[2] = newValue[2] || 'AM'
    }
    if (timeId === 'minutes') {
      newValue[1] = timeVal
      newValue[0] = newValue[0] || '00'
      newValue[2] = newValue[2] || 'AM'
    }
    if (timeId === 'type') {
      newValue[0] = newValue[0] || '01'
      newValue[1] = newValue[1] || '00'
      newValue[2] = timeVal
    }

    onChange(fieldId, newValue)
    onCheckError(fieldId, [])
  }

  const handleAnswer = ({ target: { id: timeId, value: timeVal } }, isBlur = false) => {
    if (
      (!timeVal) ||
      (timeId === 'hour' && (timeVal * 1) > 12) ||
      (timeId === 'minutes' && (timeVal * 1) > 59)
    ) {
      return
    }
    handleFormatAnswer(timeId, timeVal, isBlur)
  }

  const { include, value: instructionValue } = settings.instruction || {}
  const hasError = !!fieldError[fieldId]
  const historyValue = historyFields.find(e => e.id === fields[0].id)?.value
  const className = historyValue && JSON.parse(historyValue) !== fields[0].value ? 'highlights' : ''

  return (
    <div
      className={`formGroup ${type}`}
      id={`group_${groupId}`}
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
            className={`formGroup-column okoi`}
            style={{ gridColumn: `span 1`}}
          >
            <input
              type='number'
              id='hour'
              className={`${className} field-input`}
              placeholder={`Hour ${required ? '*' : ''}`}
              value={value ? value[0] : ''}
              readOnly={isReadOnly}
              onChange={handleAnswer}
              onBlur={(e) => handleAnswer(e, true)}
            />
            <span>:</span>
            <input
              type='number'
              id='minutes'
              className={`${className} field-input`}
              placeholder={`Minutes ${required ? '*' : ''}`}
              value={value ? value[1] : ''}
              readOnly={isReadOnly}
              onChange={handleAnswer}
              onBlur={(e) => handleAnswer(e, true)}
            />
            <div className='field select-field-wrapper'>
              <select
                id='type'
                value={value ? value[2] : ''}
                className={`${className} field-input`}
                readOnly={isReadOnly}
                onChange={handleAnswer}
                onBlur={(e) => handleAnswer(e, true)}
              >
                <option value='AM'>AM</option>
                <option value='PM'>PM</option>
              </select>
            </div>
             
          </div>
      </div>
      {
        hasError && (<div className='error'> Time is required.</div>)
      }
    </div>
  )
}
