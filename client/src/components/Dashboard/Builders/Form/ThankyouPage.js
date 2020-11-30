import React from 'react'

export default () => {
  return (
    <div className='thankyouPage'>
      <div>Thank you! Your response has been recorded.</div>
      <button
        onClick={() => {
          window.location.reload()
        }}
      >
        Fill out form again.
      </button>
    </div>
  )
}