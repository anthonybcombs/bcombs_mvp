import React from 'react'

import FormGroup from '../FormGroup'

export default ({ fields, currentStep, onSetStep, fieldState, fieldError, onChange, onCheckError }) => {
  console.log('zzzzzzzzzzzzzzzz', fields)
  return (
    <div className='wizard-content'>
      {
        fields.map((fieldProps, index) => {
          return (
            <FormGroup
              {...fieldProps}
              key={fieldProps.id}
              index={index}
              fieldState={fieldState}
              fieldError={fieldError}
              onChange={onChange}
              onCheckError={onCheckError}
            />
          )
        })
      }
    </div>
  )
}