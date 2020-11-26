import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import update from 'immutability-helper'
import cloneDeep from 'lodash.clonedeep'

import FormrStyled from './styles'
import FORM_DATA from './sample.json'
import { groupFieldsByPageBreak } from '../utils'
import { requestGetFormById } from "../../../../redux/actions/FormBuilder"
import Loading from "../../../../helpers/Loading.js"

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
  // TESTING
  // formData = FORM_DATA
  // TESTING
  formData = formData.map(e => cleanFormData(e))

  const hasWizard = !!formData.find(e => e.type === 'pageBreak')
  const fields = hasWizard ? groupFieldsByPageBreak(formData) : formData

  const [formFields, setFormFields] = useState([])
  const [formIsSet, setForm] = useState(false)

  useEffect(() => {
    if (fields.length && !formIsSet) {
      setForm(true)
      setFormFields(fields)
    }
  }, [fields])

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
    
    const [, groupId] = id.split('_')

    const fields = cloneDeep(formFields.find(e => e.id === groupId).fields)
    setFormFields(update(formFields, {
      [formFields.findIndex(e => e.id === groupId)]: {
        fields: {
          $set: fields.map(e => ({
            ...e, value: e.id === id ? value : e.value
          }))
        }
      }
    }))

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

  const handleSubmit = () => {
    // Check for required
    let newFielderror = cloneDeep(fieldError)
    formFields
      .reduce((acc, curr) => {
        acc = [
          ...acc,
          ...curr.fields
        ]
        return acc
      }, [])
      .forEach(({ required, value, id, placeholder, label }) => {
        if (required && !value) {
          const requiredError = `${placeholder || label || 'This'} is required.`
          if (!newFielderror[id] || !newFielderror[id].find(e => e === requiredError)) {
            newFielderror[id] = [
              ...(newFielderror[id] || []),
              requiredError
            ]
          }
        }
      })
    setFieldError(newFielderror)
  }
  
  console.log('@fieldState', fieldState)
  console.log('@formFields', formFields)

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
                        fields={formFields}
                        currentStep={currentStep}
                        onSetStep={handleChangeStep}
                      />
                      <Content
                        fields={formFields[currentStep].formFields}
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
                      fields={formFields}
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
                  fields={formFields}
                  currentStep={currentStep}
                  onSetStep={handleChangeStep}
                  onSubmit={handleSubmit}
                />
              </>
            )
          }
        </div>
      </div>
    </FormrStyled>
  )
}