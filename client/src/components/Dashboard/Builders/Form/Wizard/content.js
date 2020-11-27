import React from 'react'

import FormGroup from '../FormGroup'
import FieldConstructor from '../../FormBuilder/FieldConstructor'

export default ({ fields, fieldError, onChange, onCheckError }) => {
  return (
    <div className='wizard-content'>
      {
        fields.map((fieldProps, index) => {
          const specialComps = ['date', 'email', 'time', 'phone', 'login']
          return specialComps.includes(fieldProps.type) ?
              FieldConstructor[fieldProps.type]({
                key: `specialField-${fieldProps.id}`,
                ...fieldProps,
                // value: fieldState[`${fieldProps.type}_${fieldProps.id}`] || '',
                // className: hasError ? 'hasError': '',
                onChange,
                fieldError,
                onCheckError
              }) : (
              <FormGroup
                {...fieldProps}
                key={`formField-${fieldProps.id}`}
                index={index}
                // fieldState={fieldState}
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