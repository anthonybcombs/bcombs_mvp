import React from 'react'

import FormGroup from '../FormGroup'
import FieldConstructor from '../../FormBuilder/FieldConstructor'

export default ({ fields, currentStep, onSetStep, fieldState, fieldError, onChange, onCheckError }) => {
  return (
    <div className='wizard-content'>
      {
        fields.map((fieldProps, index) => {
          const specialComps = ['date', 'email', 'time', 'phone']
          return specialComps.includes(fieldProps.type) ?
              FieldConstructor[fieldProps.type]({
                key: `specialField-${index}`,
                ...fieldProps,
                value: fieldState[`${fieldProps.type}_${fieldProps.id}`] || '',
                // className: hasError ? 'hasError': '',
                onChange,
                onCheckError
              }) : (
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