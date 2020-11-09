import React from 'react'

export default ({ fields, currentStep, onSetStep }) => {
  return (
    <div className='wizard-stepper'>
      {
        fields.map((field, index) => {
        const stepLabel = index + 1
         return (
          <div className={`step ${currentStep === index ? 'active' : ''}`}>
            <div>{stepLabel}</div>
            <div>{field.fields[0].label}</div>
          </div>
         )
        })
      }
    </div>
  )
}