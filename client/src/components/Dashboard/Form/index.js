import React, { useState } from 'react'

import FormrStyled from './styles'
import FormGroup from './FormGroup'

export default ({
  location: { search }
}) => {

  const query = new URLSearchParams(search)
  const formData = JSON.parse(query.get('formData'))
  const formTitle = query.get('formTitle')
  
  const [fieldState, setField] = useState({})
  const handleChange = ({ target: { id, value } }) => {
    setField({
      ...fieldState,
      [id]: value
    })
  }
  console.log('@@@fieldState', fieldState)
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
                  onChange={handleChange}
                />
              )
            })
          }
        </div>
      </div>
    </FormrStyled>
  )
}