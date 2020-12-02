import React from 'react'

import FormGroup from '../FormGroup'
import FieldConstructor from '../../FormBuilder/FieldConstructor'

export default ({ isReadOnly, fields, fieldError, id: pageId, addresses, onChange, onCheckError, onCopyFirstAddress }) => {

  const handleChange = (id, answers, bool) => {
    if (bool) {
      const newAsnwers = {}
      Object.entries(answers).forEach(([key, val]) => {
        newAsnwers[key] = JSON.stringify(val)
      })
      onChange(id, newAsnwers, bool)
      return
    }

    onChange(id, JSON.stringify(answers))
  }

  return (
    <div className='wizard-content' id={`page_${pageId}`}>
      {
        fields.map((fieldProps, index) => {
          const specialComps = ['date', 'email', 'time', 'phone', 'login', 'price', 'website']
          return specialComps.includes(fieldProps.type) ?
            FieldConstructor[fieldProps.type]({
              key: `specialField-${fieldProps.id}-${index}`,
              ...fieldProps,
              fields: fieldProps.fields.map(e => ({ ...e, value: e.value ? JSON.parse(e.value) : '' })),
              onChange: handleChange,
              isReadOnly: isReadOnly,
              fieldError,
              onCheckError
            }) : (
            <FormGroup
              {...fieldProps}
              key={`formField-${fieldProps.id}-${index}`}
              index={index}
              addresses={addresses}
              fieldError={fieldError}
              isReadOnly={isReadOnly}

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