import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

export default ({ hasLoginField }) => {
  return (
    <div className='thankyouPage'>
      <FontAwesomeIcon icon={faCheckCircle}/>
      <div className='message'>Application succesfully submitted
        {
          hasLoginField ? (
            <div className='hasLogin'>
              <br/>
              <span>
                Thank you for completing your application. The final step in the application process is to setup your account. Here is what you'll need to do:
                <br/><br/>
                1. You will receive a verification email asking you to authenticate your email account.
                <br/><br/>
                2. Login to your account and set your password and security questions.
                <br/><br/>
                3. Once confirmed, you will have to access to your personalized BCombs account and have access to view and edit your application.
              </span>
            </div>
          ) : <span>Thank you for completing your application.</span>
        }
      </div>
      <button
        onClick={() => {
          window.location.reload()
        }}
      >
        Fill out form again
      </button>
    </div>
  )
}