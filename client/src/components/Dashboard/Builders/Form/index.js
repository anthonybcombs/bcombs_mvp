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
        if (Array.isArray(value) && !value.find(e => typeof e === 'object')) {
          newObj[key] = value
        } else if (Array.isArray(value)) {
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

  const [actualFormFields, setFormFields] = useState([])
  const [formIsSet, setForm] = useState(false)
  const [currentStep, setStep] = useState(0)

  useEffect(() => {
    if (formData.length && !formIsSet) {
      const fields = hasWizard ? groupFieldsByPageBreak(formData) : formData
      setFormFields(fields)
      setForm(true)
    }
  }, [formData])

  const dispatch = useDispatch()

  useEffect(() => {
    // if (auth.user_id) {
    //   dispatch(requestVendor(auth.user_id));
    // }
    if (form_id) {
      dispatch(requestGetFormById({ form_id }))
    }
  }, []);

  const handleChange = (id, value) => {
    console.log('jawa na', { id, value })
    const [, groupId] = id.split('_')
    let fields = []
    if (hasWizard) {
      fields = cloneDeep(actualFormFields[currentStep].formFields.find(e => e.id === groupId).fields)
      setFormFields(update(actualFormFields, {
        [currentStep]: {
          formFields: {
            [actualFormFields[currentStep].formFields.findIndex(e => e.id === groupId)]: {
              fields: {
                $set: fields.map(e => ({
                  ...e, value: e.id === id ? value : e.value
                }))
              }
            }
          }
        }
      }))
    } else {
      fields = cloneDeep(actualFormFields.find(e => e.id === groupId).fields)
      setFormFields(update(actualFormFields, {
        [actualFormFields.findIndex(e => e.id === groupId)]: {
          fields: {
            $set: fields.map(e => ({
              ...e, value: e.id === id ? value : e.value
            }))
          }
        }
      }))
    }
  }

  const [fieldError, setFieldError] = useState({})
  const handleCheckError = (id, errors) => {
    setFieldError({
      ...fieldError,
      [id]: errors
    })
  }

  const handleCheckRequired = () => {
    // Check for required
    let newFielderrors = cloneDeep(fieldError)
    const fields = hasWizard 
      ? actualFormFields[currentStep].formFields
      : actualFormFields
    
    fields.reduce((acc, curr) => {
      acc = [
        ...acc,
        ...curr.fields
      ]
      return acc
    }, [])
    .forEach(({ required, value, id, placeholder, label }) => {
      if (required && !value) {
        const requiredError = `${placeholder || label || 'This'} is required.`
        if (!newFielderrors[id] || !newFielderrors[id].find(e => e === requiredError)) {
          newFielderrors[id] = [
            ...(newFielderrors[id] || []),
            requiredError
          ]
        }
      }
      if (newFielderrors[id] && !newFielderrors[id].length) {
        delete newFielderrors[id]
      }
    })

    return {
      formHasError: Object.keys(newFielderrors).length > 0,
      errors: newFielderrors
    }
  }

  const handleChangeStep = (step) => {
    const { formHasError, errors } = handleCheckRequired()
    console.log('@handleChangeStep', { formHasError, errors })
    if (!formHasError) {
      setStep(step)
    }

    setFieldError(errors)
  }

  const handleSubmit = () => {
    const { formHasError, errors } = handleCheckRequired()
    console.log('@handleSubmit', { formHasError, errors })
    setFieldError(errors)
  }

  console.log('@fieldError', fieldError)
  console.log('@actualFormFields', actualFormFields)

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
                        fields={actualFormFields}
                        currentStep={currentStep}
                        onSetStep={handleChangeStep}
                      />
                      <Content
                        fields={(actualFormFields[currentStep] || {}).formFields || []}
                        currentStep={currentStep}
                        fieldError={fieldError}
                        onSetStep={handleChangeStep}
                        onChange={handleChange}
                        onCheckError={handleCheckError}
                      />
                    </div>
                  ) : (
                    <Content
                      fields={actualFormFields}
                      currentStep={currentStep}
                      fieldError={fieldError}
                      onSetStep={handleChangeStep}
                      onChange={handleChange}
                      onCheckError={handleCheckError}
                    />
                  )
                }
                <Actions
                  hasWizard={hasWizard}
                  fields={actualFormFields}
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