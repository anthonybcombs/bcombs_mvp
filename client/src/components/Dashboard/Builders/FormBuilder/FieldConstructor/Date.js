import React from 'react'
import DatePicker from 'react-datepicker'
import cloneDeep from 'lodash.clonedeep'
import FieldConstructor from '../../FormBuilder/FieldConstructor'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'

export default ({ showLabel, settings, label, fields, type, id, onChange, value = '' }) => {
  const fieldId = `${type}_${id}`
  const handleAnswer = (date) => {
    onChange(fieldId, date)
    // document.querySelector('.react-datepicker__input-container input').blur()
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
      <div className='formGroup-row' style={{ gridTemplateColumns: `repeat(3, 1fr)`}}>
        {/* <input
          className={`field-input`}
        /> */}
         <div
            className={`formGroup-column`}
            style={{ gridColumn: `span 1`}}
            onClick={() => {
              document.querySelector('.react-datepicker__input-container input').click()
            }}
          >
            {
              fields.map((field, index) => {
                const dateObj = value ? new Date(value) : ''
                let actualVal = ''
                switch (index) {
                  case 0:
                    actualVal = dateObj ? dateObj.getMonth() : ''
                    break
                  case 1:
                    actualVal = dateObj ? dateObj.getDate() : ''
                    break
                  case 2:
                    actualVal = dateObj ? dateObj.getFullYear() : ''
                    break
                  default: 
                    break
                }

                return FieldConstructor[field.tag]({
                  key: `field-${index}`,
                  readOnly: true,
                  ...field,
                  value: actualVal
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
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>

                  <select
                    value={months[date.getMonth()]}
                    onChange={({ target: { value } }) =>
                      changeMonth(months.indexOf(value))
                    }>
                    {months.map(option => (
                      <option key={option} value={option}>
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
              selected={value ? new Date(value) : ''}
              onChange={handleAnswer}
              // name={'ch_birthdate' + (counter - 1)}
              // customInput={
              //   <BirthdateCustomInput
              //     className={
              //       isReadonly &&
              //       !isVendorView &&
              //       pastChildInformation &&
              //       (pastChildInformation.birthdate ||
              //         pastChildInformation.birthdate == ') &&
              //       childProfile.date_of_birth.toString() !=
              //         new Date(pastChildInformation.birthdate).toString()
              //         ? 'field-input birthdate-field highlights'
              //         : 'field-input birthdate-field'
              //     }
              //   />
              // }
            />
          </div>
      </div>
    </div>
  )
}