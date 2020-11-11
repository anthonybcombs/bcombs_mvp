import React from 'react'

export default ({ fields, currentStep, onSetStep }) => {
  return (
    <ul className='wizard-stepper' style={{ gridTemplateColumns: `repeat(${fields.length}, 1fr)`}}>
      {
        fields.map((field, index) => {
        const stepLabel = index + 1
         return (
          <li className={`step ${currentStep === index ? 'active' : ''}`}>
            <div className='step-number'>{stepLabel}</div>
            <div  className='step-label'>{field.fields[0].label}</div>
          </li>
         )
        })
      }
    </ul>
  )
}