import React, { useState } from 'react'

import FormrStyled from './styles'
import FORM_DATA from './sample.json'
import { groupFieldsByPageBreak } from '../utils'

import Stepper from './Wizard/stepper'
import Content from './Wizard/content'
import Actions from './Wizard/actions'

export default ({
  location: { search }
}) => {

  const query = new URLSearchParams(search)
  const formData = JSON.parse(query.get('formData'))
  const formTitle = query.get('formTitle')
  // const formData = FORM_DATA //JSON.parse(query.get('formData'))
  // const formTitle = 'Sample' //query.get('formTitle')
  
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

  const [currentStep, setStep] = useState(0)
  const handleChangeStep = (step) => {
    setStep(step)
  }

  const hasWizard = !!formData.find(e => e.type === 'pageBreak')
  const fields = hasWizard ? groupFieldsByPageBreak(formData) : formData
  console.log('@groupedFields', groupFieldsByPageBreak(fields))
  console.log('@fieldState', fieldState)
  return (
    <FormrStyled>
      <div id='form'>
        <div className='form-title'>
          {formTitle}
        </div>
        <div className='form-content'>
          {
            hasWizard ? (
              <div className='wizard-wrapper'>
                <Stepper
                  fields={fields}
                  currentStep={currentStep}
                  onSetStep={handleChangeStep}
                />
                <Content
                  fields={fields[currentStep].formFields}
                  currentStep={currentStep}
                  fieldState={fieldState}
                  fieldError={fieldError}
                  onSetStep={handleChangeStep}
                  onChange={handleChange}
                  onCheckError={handleCheckError}
                />
              </div>
            ) : (
              <Content
                fields={fields}
                currentStep={currentStep}
                fieldState={fieldState}
                fieldError={fieldError}
                onSetStep={handleChangeStep}
                onChange={handleChange}
                onCheckError={handleCheckError}
              />
            )
          }
          <Actions
            hasWizard={hasWizard}
            fields={fields}
            currentStep={currentStep}
            onSetStep={handleChangeStep}
          />
        </div>
      </div>
    </FormrStyled>
  )
}