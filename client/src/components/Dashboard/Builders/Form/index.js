import React, { useState } from 'react'

import FormrStyled from './styles'
import FormGroup from './FormGroup'
import FORM_DATA from './sample.json'
import { groupFieldsByPageBreak } from '../utils'

export default ({
  location: { search }
}) => {

  const query = new URLSearchParams(search)
  const formData = FORM_DATA //JSON.parse(query.get('formData'))
  const formTitle = 'Sample' //query.get('formTitle')
  
  const [fieldState, setField] = useState({})
  const handleChange = (id, value) => {
    setField({
      ...fieldState,
      [id]: value
    })
  }

  const [fieldError, setFieldError] = useState({})
  const handleCheckError = (id, error) => {
    setFieldError({
      ...fieldError,
      [id]: error
    })
  }
  console.log('@groupedFields', groupFieldsByPageBreak(formData))
  console.log('@fieldState', fieldState)
  return (
    <FormrStyled>
      <div id='form'>
        <div className='form-title'>
          {formTitle}
        </div>
        <div className='form-content'>
          {
            formData.map((fieldProps, index) => {
              return (
                <FormGroup
                  {...fieldProps}
                  key={fieldProps.id}
                  index={index}
                  fieldState={fieldState}
                  fieldError={fieldError}
                  onChange={handleChange}
                  onCheckError={handleCheckError}
                />
              )
            })
          }
        </div>
      </div>
    </FormrStyled>
  )
}