import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDay, faClock, faDollarSign } from '@fortawesome/free-solid-svg-icons'

import Checkboxes from './Checkboxes'
import MultipleChoice from './MultipleChoice'
import DropDown from './DropDown'
import Matrix from './Matrix'
import Linear from './Linear'
import Slider from './Slider'
import Ranking from './Ranking'
import FileUpload from './FileUpload'
import SectionBreak from './SectionBreak'
import PageBreak from './PageBreak'
import Rating from './Rating'
import Email from './Email'
import Date from './Date'
import Time from './Time'
import Phone from './Phone'
import Price from './Price'


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
  icon: ({ type, label }) => {
    switch(type) {
      case 'date':
        return (
          <FontAwesomeIcon
            className='date-icon'
            icon={faCalendarDay}
          />
        )
      case 'time': 
        return (
          <FontAwesomeIcon
            className='time-icon'
            icon={faClock}
          />
        )
      case 'currency': 
        return (
          <FontAwesomeIcon
            className='price-icon'
            icon={faDollarSign}
          />
        )
      default:
        return <span>{label}</span>
    }
  },
  textarea: ({ label, className = '', ...rest }) => {
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
  checkboxes: (props) => {
    return <Checkboxes {...props} />
  },
  multipleChoice: (props) => {
    return <MultipleChoice {...props} />
  },
  radio: ({ label, name, isBuilder, onChange }) => {
    return (
      <>
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
      </>
    )
  },
  dropdown: (props) => {
    return <DropDown {...props} />
    // return (
    //   <div className='option'>
    //     <span>{index + 1}.</span>
    //     {
    //       isBuilder
    //         ? <input
    //             type='text'
    //             className={`field-input`}
    //             value={label}
    //             onChange={onChange}
    //           />
    //         : <span className='labelName'> {label}</span>
    //     }
    //   </div>
    // )
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
                (options || selectMappings[type]).map(({ label, value }, index) => {
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
  matrix: (props) => {
    return <Matrix {...props} />
  },
  sectionBreak: (props) => {
    return <SectionBreak {...props} />
  },
  pageBreak: (props) => {
    return <PageBreak {...props} />
  },
  email: (props) => {
    return <Email {...props} />
  },
  date: (props) => {
    return <Date {...props} />
  },
  time: (props) => {
    return <Time {...props} />
  },
  phone: (props) => {
    return <Phone {...props} />
  },
  price: (props) => {
    return <Price {...props} />
  }
}