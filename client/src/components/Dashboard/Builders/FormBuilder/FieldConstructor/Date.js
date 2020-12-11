import React from 'react'
import DatePicker from 'react-datepicker'
import FieldConstructor from '../../FormBuilder/FieldConstructor'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleLeft, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

export default ({ isReadOnly = false, showLabel, settings, label, fields, type, id: groupId, onChange, fieldError, onCheckError, historyFields }) => {
  const fieldId = `${type}_${groupId}`
  const handleAnswer = (date) => {
    const dateObj = date ? new Date(date) : ''
    let answers = {}
    fields.forEach((e, index) => {
      switch (index) {
        case 0:
          answers[e.id] = dateObj ? dateObj.getMonth() + 1 : ''
          break
        case 1:
          answers[e.id] = dateObj ? dateObj.getDate() : ''
          break
        case 2:
          answers[e.id] = dateObj ? dateObj.getFullYear() : ''
          break
        default: 
          break
      }
    })

    onChange(fieldId, answers, true)
    const newErrors = {}
    fields.forEach(e => {
      newErrors[e.id] = []
    })
    onCheckError(fieldId, newErrors, true)
  }
  
  const range = (start, end) => {
    let arr = [];

    for (let i = start; i <= end; i++) {
      arr.push(i);
    }

    return arr;
  };
  const years = range(1900, new Date().getFullYear());
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const { include, value: instructionValue } = settings.instruction || {}

  const ansFields = fields.filter(e => e.tag !== 'icon')
  const newDate = ansFields.find(e => !e.value) ? '' : ansFields.map(e => e.value).join()
  const hasError = !!fields.find(e => fieldError[e.id])
  const isRequired = !!fields.find(e => e.required)
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
        {/* <input
          className={`field-input`}
        /> */}
        <div
          className={`formGroup-column`}
          style={{ gridColumn: `span 1`}}
          onClick={() => {
            if (!isReadOnly) {
              document.querySelector('.react-datepicker__input-container input').click()
            }
          }}
        >
          {
            fields.map((field, index) => {
              const { placeholder } = field
              const historyValue = historyFields.find(e => e.id === field.id)?.value
              const className = historyValue && JSON.parse(historyValue) !== field.value ? 'highlights' : ''

              return FieldConstructor[field.tag]({
                ...field,
                isReadOnly,
                key: `dateField${index}`,
                placeholder: `${placeholder} ${isRequired ? '*' : ''}`,
                readOnly: true,
                className
              })
            })
          }
          <DatePicker
            renderCustomHeader={({
              date,
              changeYear,
              changeMonth,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled
            }) => (
              <div
                style={{
                  margin: 0,
                  display: 'flex',
                  alignCenter: 'center',
                  justifyContent: 'center',
                  background: '#f36e22',
                  padding: '5px 3px'
                }}>
                <button
                  className='datepicker-btn'
                  onClick={e => {
                    e.preventDefault();
                  }}>
                  <FontAwesomeIcon
                    icon={faAngleLeft}
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                  />
                </button>
                <select
                  value={new Date(date).getFullYear()}
                  onChange={({ target: { value } }) => changeYear(value)}>
                  {years.map((option, index) => (
                    <option key={`year-${index}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <select
                  value={months[date.getMonth()]}
                  onChange={({ target: { value } }) =>
                    changeMonth(months.indexOf(value))
                  }>
                  {months.map((option, index) => (
                    <option key={`month-${index}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <button
                  className='datepicker-btn'
                  onClick={e => {
                    e.preventDefault();
                  }}>
                  <FontAwesomeIcon
                    icon={faAngleRight}
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                  />
                </button>
              </div>
            )}
            selected={newDate ? new Date(newDate) : ''}
            onChange={handleAnswer}
          />
        </div>
      </div>
      {
        hasError && (<div className='error'> Date is required.</div>)
      }
    </div>
  )
}