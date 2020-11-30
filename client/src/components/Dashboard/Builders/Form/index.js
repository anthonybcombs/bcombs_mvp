import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import update from 'immutability-helper'
import cloneDeep from 'lodash.clonedeep'

import FormrStyled from './styles'
import FORM_DATA from './sample.json'
import { groupFieldsByPageBreak } from '../utils'
import { requestGetFormById, requestSubmitForm } from "../../../../redux/actions/FormBuilder"
import Loading from "../../../../helpers/Loading.js"

import Stepper from './Wizard/stepper'
import Content from './Wizard/content'
import Actions from './Wizard/actions'
import ThankyouPage from './ThankyouPage'

export default ({
  form_id
}) => {

  const { auth, loading, form: { selectedForm: { form_contents, vendor }, submitForm } } = useSelector(
    ({ auth, loading, form }) => {
      return { auth, loading, form };
    }
  )

  const isSuccessfulSubmit = true //submitForm.message === 'successfully submitted your application form'

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
  const [addresses, setAddresses] = useState([])

  useEffect(() => {
    if (formData.length && !formIsSet) {
      const newAddresses = formData.filter(e => e.type === 'address')
      setAddresses(newAddresses)

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

  const handleChange = (id, value, isMultiple = false) => {
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
                  ...e,
                  value: isMultiple
                    ? value[e.id]
                    : e.id === id ? value : e.value
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
              ...e,
              value: isMultiple
                ? value[e.id]
                : e.id === id ? value : e.value
            }))
          }
        }
      }))
    }
  }

  const [fieldError, setFieldError] = useState({})
  const handleCheckError = (id, errors, isMultiple = false) => {
    let newErrors = { ...fieldError }
    if (!isMultiple) {
      newErrors[id] = errors
    } else {
      newErrors = {
        ...newErrors,
        ...errors
      }
    }
    setFieldError(
      Object.entries(newErrors).reduce((acc, [key, val]) => {
        if (val.length) {
          acc[key] = val
        }
        return acc
      }, {})
    )
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
      const newVal = value ? JSON.parse(value) : ''
      if (required && !newVal) {
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
    const isPrev = currentStep > step

    if (isPrev) {
      setStep(step)
      setFieldError([])
      return
    }

    const { formHasError, errors } = handleCheckRequired()
    if (!formHasError) {
      setStep(step)
    }

    setFieldError(errors)
  }

  const handleCopyFirstAddress = ({ target: { checked } }, id) => {
    const { id: firstAddressId } = addresses[0]
    const flattenFields = hasWizard ? actualFormFields.reduce((acc, curr) => [...acc, ...curr.formFields], []) : actualFormFields
    const { fields: firstAddressFields } = flattenFields.find(e => e.id === firstAddressId)
    const { fields: targetAddressFields, type } = flattenFields.find(e => e.id === id)
    if (checked) {
      const fieldValues = firstAddressFields.map(e => e.value)
      const targetAddressValues = targetAddressFields.reduce((acc, curr, index) => {
        acc[curr.id] = fieldValues[index]
        return acc
      }, {})

      handleChange(`${type}_${id}`, targetAddressValues, true)
    }
  }

  const handleSubmit = () => {
    const { formHasError, errors } = handleCheckRequired()

    if (!formHasError) {
      const newFormContents = hasWizard ? actualFormFields.reduce((acc, curr) => [...acc, ...curr.formFields], []) : actualFormFields
      dispatch(requestSubmitForm({
        form_contents: {
          formTitle,
          formData: newFormContents
        },
        vendor,
        form: form_id
      }))
    }
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
          <> 
            {
              isSuccessfulSubmit ? (
                <ThankyouPage />
              ) : (
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
                            addresses={addresses}
                            onCopyFirstAddress={handleCopyFirstAddress}
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
                          addresses={addresses}
                          onCopyFirstAddress={handleCopyFirstAddress}
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
              )
            }
          </>
        </div>
      </div>
    </FormrStyled>
  )
}