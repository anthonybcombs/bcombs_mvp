import React from 'react'

export default {
  input: ({ label, ...rest }) => {
    console.log('zzzz', rest)
    return (
      <input
        {...rest}
      />
    )
  }
}