import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

export default () => {
  return (
    <div className='thankyouPage'>
      <FontAwesomeIcon icon={faCheckCircle}/>
      <div className='message'>Thank You! <span>Your response has been recorded.</span></div>
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