import React from 'react'
import STATES from '../../ApplicationForm/states.json'
import COUNTRIES from '../../ApplicationForm/country.json'

const selectMappings = {
  state: STATES.map(({ name, abbreviation }) => ({ label: name, value: abbreviation })),
  country: COUNTRIES.map(({ name, code }) => ({ label: name, value: code })),
  title: [{ label: 'Mr.', value: 'Mr.' }, { label: 'Mrs.', value: 'Mrs.' }]
}

export default {
  input: ({ label, className, isBuilder, onChangeFieldSettings, isActive, ...rest }) => {
    return (
      <input
        className={`field-input ${className}`}
        {...rest}
      />
    )
  },
  textarea: ({ label, className, isBuilder, onChangeFieldSettings, isActive, ...rest }) => {
    return <textarea
      className={`field-input ${className}`}
      {...rest}
    />
  },
  checkbox: ({ label, name, isBuilder, onChange }) => {
    return (
      <label htmlFor={name} className='checkboxContainer'>
        <input
          type='checkbox'
          onChange={onChange}
          disabled={isBuilder}
        />
        <span className='checkmark' />
        {
          isBuilder
            ? <input
                type='text'
                className={`field-input`}
                value={label}
                onChange={onChange}
              />
            : <span className='labelName'> {label}</span>
        }
      </label>
    )
  },
  radio: ({ label, name, isBuilder, onChange }) => {
    return (
      <div className='radiobuttonContainer'>
        <input
          type='radio'
          onChange={onChange}
          disabled={isBuilder}
        />
        {
          (isBuilder && name !== 'other')
            ? (
              <>
                <label/>
                <input
                  type='text'
                  className={`field-input`}
                  value={label}
                  onChange={onChange}
                />
              </>
            )
            : <label htmlFor={name}>{label}</label>
        }
      </div>
    )
  },
  dropdown: ({ label, name, isBuilder, onChange, index }) => {
    return (
      <div className='option'>
        <span>{index + 1}.</span>
        {
          isBuilder
            ? <input
                type='text'
                className={`field-input`}
                value={label}
                onChange={onChange}
              />
            : <span className='labelName'> {label}</span>
        }
      </div>
    )
  },
  select: ({ options, label: fieldLabel, type, className, isBuilder = false, ...rest }) => {
    return (
      <select
        className={`field-input ${className}`}
        {...rest}
        disabled={isBuilder}
        style={{ opacity: 1 }}
      >
        <option value=''>{rest.placeholder}</option>
        {
          !isBuilder &&
          (
            selectMappings[type].map(({ label, value }, index) => {
              return (<option key={value + index} value={value}>{label}</option>)
            })
          )
        }
      </select>
    )
  },
  rating: ({ label }) => {
    return <div>{label}</div>
  },
  linear: ({ label }) => {
    return <div>{label}</div>
  },
  slider: ({ label }) => {
    return <div>{label}</div>
  },
  ranking: ({ label }) => {
    return <div>{label}</div>
  },
  file: ({ label }) => {
    return <div>{label}</div>
  },
  sectionBreak: ({ label }) => {
    return <div>{label}</div>
  },
  pageBreak: ({ label }) => {
    return <div>{label}</div>
  },
}