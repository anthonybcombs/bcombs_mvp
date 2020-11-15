import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";

import FormrStyled from './styles'
import FORM_DATA from './sample.json'
import { groupFieldsByPageBreak } from '../utils'
import { requestGetFormById } from "../../../../redux/actions/FormBuilder"
import Loading from "../../../../helpers/Loading.js";

import Stepper from './Wizard/stepper'
import Content from './Wizard/content'
import Actions from './Wizard/actions'

export default ({
  form_id
}) => {

  const { auth, loading, form: { selectedForm: { form_contents } } } = useSelector(
    ({ auth, loading, form }) => {
      return { auth, loading, form };
    }
  )

  const dispatch = useDispatch()

  useEffect(() => {
    // if (auth.user_id) {
    //   dispatch(requestVendor(auth.user_id));
    // }
    if (form_id) {
      dispatch(requestGetFormById({ form_id }))
    }
  }, []);
  
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

  const cleanFormData = (formData) => {
    const objArr = Object.entries(formData)
    const newObj = {}
    objArr.forEach(([key, value], index) => {
      if (value !== null) {
        if (Array.isArray(value)) {
          newObj[key] = value.map(e => cleanFormData(e))
        } else if (typeof value === 'object') {
          newObj[key] = cleanFormData(value)
        } else {
          newObj[key] = value
        }
      }
    })
    return newObj
  }

  let { formData = [], formTitle = '' } = form_contents || {}
  formData = formData.map(e => cleanFormData(e))

  const hasWizard = !!formData.find(e => e.type === 'pageBreak')
  const fields = hasWizard ? groupFieldsByPageBreak(formData) : formData

  // console.log('@groupedFields', groupFieldsByPageBreak(fields))
  // console.log('@fieldState', fieldState)
  console.log('@@loading', loading.getForm)

  return (
    <FormrStyled>
      <div id='form'>
        <div className='form-title'>
          {!loading.getForm ? formTitle : ''}
        </div>
        <div className='form-content'>
          {
            loading.getForm ? (
              <Loading />
            ) : (
              <>
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
                  onSubmit={() => dispatch(requestGetFormById(form_id))}
                />
              </>
            )
          }
        </div>
      </div>
    </FormrStyled>
  )
}