import React from 'react'

import Rating from './Rating'
import Linear from './Linear'
import Slider from './Slider'
import Ranking from './Ranking'
import FileUpload from './FileUpload'

import STATES from '../../../ApplicationForm/states.json'
import COUNTRIES from '../../../ApplicationForm/country.json'

const selectMappings = {
  state: STATES.map(({ name, abbreviation }) => ({ label: name, value: abbreviation })),
  country: COUNTRIES.map(({ name, code }) => ({ label: name, value: code }))
}

export default {
  input: ({ label, className = '', options = null, isBuilder, ...rest }) => {
    return (
      <input
        className={`field-input ${className}`}
        {...rest}
      />
    )
  },
  textarea: ({ label, className = '', ...rest }) => {
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
          (isBuilder && name !== 'other')
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
      <label for={name} className='radiobuttonContainer'>
        <input
          type='radio'
          onChange={onChange}
          disabled={isBuilder}
        />
        <span className='checkmark' />
        {
          (isBuilder && name !== 'other')
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
  select: ({ options, label: fieldLabel, type, className = '', isBuilder = false, ...rest }) => {
    return (
      isBuilder
        ? (<div className='field select-field-wrapper'>
            <input
              className={`field-input input-select ${className}`}
              {...rest}
            />
          </div>)
        :(
          <div className='field select-field-wrapper'>
            <select
              className={`field-input ${className}`}
              {...rest}
              style={{ opacity: 1 }}
            >
              <option value=''>{rest.placeholder}</option>
              {
                selectMappings[type].map(({ label, value }, index) => {
                  return (<option key={value + index} value={value}>{label}</option>)
                })
              }
            </select>
          </div>
        )
    )
  },
  rating: (props) => {
    return <Rating {...props} />
  },
  linear: (props) => {
    return <Linear {...props} />
  },
  slider: (props) => {
    return <Slider {...props} />
  },
  ranking: (props) => {
    return <Ranking {...props} />
  },
  file: (props) => {
    return <FileUpload {...props} />
  },
  checkboxGrid: (props) => {
    return <Rating {...props} isMultiple />
  },
  sectionBreak: ({ label }) => {
    return <div>{label}</div>
  },
  pageBreak: ({ label }) => {
    return <div>{label}</div>
  },
}