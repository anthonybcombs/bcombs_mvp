import React from 'react'

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
  select: ({ label }) => {
    return <div>{label}</div>
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