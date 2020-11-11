import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons'

export default ({ fields, currentStep, hasWizard, onSetStep }) => {
  const fieldCount = fields.length
  const showPrev = currentStep > 0 && hasWizard
  const showNext = currentStep + 1 < fieldCount && hasWizard
  const showSubmit = currentStep + 1 === fieldCount || !hasWizard
  return (
    <div className='wizard-actions'>
      {
        showPrev && (
          <button
            className='prevBtn'
            onClick={() => onSetStep(currentStep - 1)}
          >
            <FontAwesomeIcon
              className='save-icon'
              icon={faAngleLeft}
            />
            Previous
          </button>
        )
      }
      {
        showNext && (
          <button
            className='nextBtn'
            onClick={() => onSetStep(currentStep + 1)}
          >
            Next
            <FontAwesomeIcon
              className='save-icon'
              icon={faAngleRight}
            />
          </button>
        )
      }
      {
        showSubmit && (
          <button
            className='submitBtn'
            onClick={() => {}}
          >
            Submit
            <FontAwesomeIcon
              className='save-icon'
              icon={faCheck}
            />
          </button>
        )
      }
    </div>
  )
}