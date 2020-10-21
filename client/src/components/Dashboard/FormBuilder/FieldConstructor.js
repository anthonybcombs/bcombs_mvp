import React from 'react'
import STATES from '../ApplicationForm/states.json'
import COUNTRIES from '../ApplicationForm/country.json'

const selectMappings = {
  state: STATES.map(({ name, abbreviation }) => ({ label: name, value: abbreviation })),
  country: COUNTRIES.map(({ name, code }) => ({ label: name, value: code }))
}

export default {
  input: ({ label, ...rest }) => {
    return (
      <input
        className='field-input'
        {...rest}
      />
    )
  },
  textarea: ({ label, ...rest }) => {
    return <textarea
      className='field-input'
      {...rest}
    />
  },
  checkbox: ({ label, name }) => {
    return (
      <label for={name} className='checkboxContainer'>
        <input
          type='checkbox'
          id={name}
          name={name}
          // onChange={e => {
          //   e.stopPropagation()
          //   handleChangeSettings({ include: e.target.checked }, 'instruction')
          // }}
        />
        <span className='checkmark' />
        <span className='labelName'> {label}</span>
      </label>
    )
  },
  multipleChoice: ({ label }) => {
    return <div>{label}</div>
  },
  select: ({ options, label: fieldLabel, type, isFormBuilder = false, ...rest }) => {
    return (
      <select
        className='field-input'
        {...rest}
      >
        <option value=''>{fieldLabel}</option>
        {
          !isFormBuilder &&
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
  radio: ({ label }) => {
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