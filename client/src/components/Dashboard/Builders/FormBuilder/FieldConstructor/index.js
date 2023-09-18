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
import ProfileImage from './ProfileImage'
import SectionBreak from './SectionBreak'
import PageBreak from './PageBreak'
import Rating from './Rating'
import Email from './Email'
import Date from './Date'
import Time from './Time'
import Phone from './Phone'
import Price from './Price'
import Login from './Login'
import Website from './Website'
import Terms from './Terms'

import StaticImage from './StaticImage'
import FormattedText from './FormattedText'


import STATES from '../../../ApplicationForm/states.json'
import COUNTRIES from '../../../ApplicationForm/country.json'

const selectMappings = {
  state: STATES.map(({ name, abbreviation }) => ({ label: name, value: abbreviation })),
  country: COUNTRIES.map(({ name, code }) => ({ label: name, value: code }))
}

export default {
  input: ({ className = '', onChange = () => {}, value = '', id = '', placeholder = '', onBlur = () => {}, isBuilder, type, key, isReadOnly = false }) => {
    let specialProp = {}
    if (!isBuilder && type === 'password') {
      specialProp = { type: 'password' }
    }
    return (
      <input
        {...specialProp}
        key={key}
        readOnly={isReadOnly}
        className={`field-input ${className}`}
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
      />
    )
  },
  icon: ({ type, label, isReadOnly = false }) => {
    // if (isReadOnly) {
    //   return null
    // }
    switch(type) {
      case 'date':
        return (
          <FontAwesomeIcon
            key={type}
            className='date-icon'
            icon={faCalendarDay}
          />
        )
      case 'time': 
        return (
          <FontAwesomeIcon
            key={type}
            className='time-icon'
            icon={faClock}
          />
        )
      case 'currency': 
        return (
          <FontAwesomeIcon
            key={type}
            className='price-icon'
            icon={faDollarSign}
          />
        )
      default:
        return <span>{label}</span>
    }
  },
  textarea: ({ className = '', onChange = () => {}, value = '', id = '', placeholder = '', isReadOnly = false }) => {
    return <textarea
      className={`field-input ${className}`}
      id={id}
      readOnly={isReadOnly}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      rows={4}
    />
  },
  checkbox: ({ label, name, isBuilder, onChange, isReadOnly = false }) => {
    return (
      <label htmlFor={name} className='checkboxContainer'>
        <input
          type='checkbox'
          readOnly={isReadOnly}
          onChange={onChange}
          disabled={isBuilder}
        />
        <span className='checkmark' />
        {
          (isBuilder && name !== 'other')
            ? <input
                disabled={name === undefined}
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
  radio: ({ label, name, isBuilder, onChange, isReadOnly = false }) => {
    return (
      <>
        <div className='radiobuttonContainer'>
          <input
            type='radio'
            readOnly={isReadOnly}
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
  },
  select: ({ options, type, className = '', isBuilder = false, onChange = () => {}, value = '', id = '', placeholder = '', isReadOnly = false }) => {
    return (
      isBuilder
        ? (<div className='field select-field-wrapper'>
            <input
              className={`field-input input-select ${className}`}
              id={id}
              value={value}
              placeholder={placeholder}
              onChange={onChange}
            />
          </div>)
        :(
          <div className='field select-field-wrapper'>
            <select
              className={`field-input ${className}`}
              id={id}
              readOnly={isReadOnly}
              value={value}
              placeholder={placeholder}
              onChange={!isReadOnly ? onChange : () => {}}
              style={{ opacity: 1 }}
            >
              <option value=''>{placeholder}</option>
              {
                (options || selectMappings[type]).map(({ label, value }, index) => {
                  return (<option key={`options_${value}${index}`} value={value}>{label}</option>)
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
  profileImage: (props) => {
    return <ProfileImage {...props} />
  },
  staticImage: (props) => {
    return <StaticImage  {...props} /> 
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
  },
  website: (props) => {
    return <Website {...props} />
  },
  login: (props) => {
    return <Login {...props} />
  },
  terms: (props) => {
    return <Terms {...props} />
  },

  formattedText: (props) => {
    return <FormattedText {...props} />
  },
  // address: (props) => {
  //   return <Address {...props} />
  // }
}