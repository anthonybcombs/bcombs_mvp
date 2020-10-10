import React from 'react'

export default {
  input: ({ label, ...rest }) => {
    return (
      <input
        className='field-input'
        {...rest}
      />
    )
  }
}