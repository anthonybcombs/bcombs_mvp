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
  textarea: ({ label }) => {
    return <div>{label}</div>
  },
  checkbox: ({ label }) => {
    return <div>{label}</div>
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