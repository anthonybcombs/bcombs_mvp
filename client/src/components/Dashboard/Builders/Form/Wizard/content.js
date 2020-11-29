import React from 'react'

import FormGroup from '../FormGroup'
import FieldConstructor from '../../FormBuilder/FieldConstructor'

export default ({ fields, fieldError, addresses, onChange, onCheckError, onCopyFirstAddress }) => {
  return (
    <div className='wizard-content'>
      {
        fields.map((fieldProps, index) => {
          const specialComps = ['date', 'email', 'time', 'phone', 'login', 'price', 'website']
          return specialComps.includes(fieldProps.type) ?
            FieldConstructor[fieldProps.type]({
              key: `specialField-${fieldProps.id}-${index}`,
              ...fieldProps,
              onChange,
              fieldError,
              onCheckError
            }) : (
            <FormGroup
              {...fieldProps}
              key={`formField-${fieldProps.id}-${index}`}
              index={index}
              addresses={addresses}
              fieldError={fieldError}

              onCopyFirstAddress={onCopyFirstAddress}
              onChange={onChange}
              onCheckError={onCheckError}
            />
          )
        })
      }
    </div>
  )
}