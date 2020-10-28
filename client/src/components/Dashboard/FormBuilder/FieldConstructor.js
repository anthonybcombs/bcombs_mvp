import React from 'react'
import STATES from '../ApplicationForm/states.json'
import COUNTRIES from '../ApplicationForm/country.json'

const selectMappings = {
  state: STATES.map(({ name, abbreviation }) => ({ label: name, value: abbreviation })),
  country: COUNTRIES.map(({ name, code }) => ({ label: name, value: code }))
}

export default {
  input: ({ label, className, ...rest }) => {
    return (
      <input
        className={`field-input ${className}`}
        {...rest}
      />
    )
  },
  textarea: ({ label, className, ...rest }) => {
    return <textarea
      className={`field-input ${className}`}
      {...rest}
    />
  },
  checkbox: ({ label, name, isBuilder, onChange }) => {
    return (
      <label for={name} className='checkboxContainer'>
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
      <label for={name} className='checkboxContainer'>
        <input
          type='radio'
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
  select: ({ options, label: fieldLabel, type, className, isBuilder = false, ...rest }) => {
    return (
      <select
        className={`field-input ${className}`}
        {...rest}
        disabled={true}
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