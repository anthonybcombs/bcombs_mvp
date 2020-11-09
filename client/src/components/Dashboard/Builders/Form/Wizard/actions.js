import React from 'react'

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
          </button>
        )
      }
    </div>
  )
}