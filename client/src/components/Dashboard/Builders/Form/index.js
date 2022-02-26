import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

import { useSelector, useDispatch } from 'react-redux'
import update from 'immutability-helper'
import cloneDeep from 'lodash.clonedeep'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPrint, faEdit } from '@fortawesome/free-solid-svg-icons'
import { useReactToPrint } from 'react-to-print'
import { format } from "date-fns";

import FormStyled from './styles'
import FORM_DATA from './sample.json'
import { groupFieldsByPageBreak } from '../utils'
import { requestGetFormById, requestSubmitForm } from '../../../../redux/actions/FormBuilder'
import Loading from '../../../../helpers/Loading.js'

import Stepper from './Wizard/stepper'
import Content from './Wizard/content'
import Actions from './Wizard/actions'
import ThankyouPage from './ThankyouPage'

export default (props) => {
  const {
    form_id,
    form_contents: application_form_contents,
    isReadOnly = false,
    onChangeToEdit,
    form,
    application_date = 'Most Up to date Application',
    vendor: applicationVendor,
    onGetUpdatedApplication,
    onSubmitApplication,
    onSelectLatest,
    isFormHistory,
    historyList
  } = props

  const isApplication = !form_id

  const { auth, loading, form: { selectedForm: { form_contents, vendor }, submitForm } } = useSelector(
    ({ auth, loading, form }) => {
      return { auth, loading, form }
    }
  )

  const isSuccessfulSubmit = submitForm.message === 'successfully submitted your application form'

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

  let { formData = [], formTitle = '' } = (!isApplication ? form_contents : application_form_contents) || {}
  // TESTING
  // formData = FORM_DATA
  // TESTING
  formData = formData.map(e => cleanFormData(e))

  const hasWizard = !!formData.find(e => e.type === 'pageBreak') && !isApplication

  const [actualFormFields, setFormFields] = useState([])
  const [formIsSet, setForm] = useState(false)
  const [currentStep, setStep] = useState(0)
  const [backSteps, setBackSteps] = useState([])
  const [addresses, setAddresses] = useState([])
  const [behavior, setBehaviour] = useState('')
  const [fieldError, setFieldError] = useState({})
  const [nextPage, setNextPage] = useState('')

  useEffect(() => {
    if (formData.length && !formIsSet) {
      const newAddresses = formData.filter(e => e.type === 'address')
      setAddresses(newAddresses)

      const fields = hasWizard ? groupFieldsByPageBreak(formData) : formData
      setFormFields(fields)
      setForm(true)
    }
  }, [formData])
  
  useEffect(() => {

    let newFormFields = actualFormFields

    if(auth.status == "SIGNED_IN") {
      if(auth.user && 
        auth.user.address) {
          for(let f of newFormFields) {
            if(f.type == 'address') {
              for(let x of f.fields) {
                if(x.label == 'Street Address') {
                  x.value = JSON.stringify(auth.user.address);
                  break;
                }
              }
              break;
            }
          }
      }

      if(auth.user && 
        auth.user.zip_code) {
          for(let f of newFormFields) {
            if(f.type == 'address') {
              for(let x of f.fields) {
                if(x.label == 'Postal / Zip Code') {
                  x.value = JSON.stringify(auth.user.zip_code);
                  break;
                }
              }
              break;
            }
          }
      }

      if(auth.user && 
        auth.user.email) {
          for(let f of newFormFields) {
            if(f.type == 'login') {
              for(let x of f.fields) {
                if(x.label == 'Email Address') {
                  x.value = JSON.stringify(auth.user.email);
                  break;
                }
              }
              break;
            }
          }

          for(let f of newFormFields) {
            if(f.type == 'email') {
              for(let x of f.fields) {
                if(x.label == 'Email') {
                  x.value = JSON.stringify(auth.user.email);
                  break;
                }
              }
              break;
            }
          }
      }

      if(auth.user && 
        auth.user.first_name) {
          for(let f of newFormFields) {
            if(f.type == 'name') {
              for(let x of f.fields) {
                if(x.label == 'First Name') {
                  x.value = JSON.stringify(auth.user.first_name);
                  break;
                }
              }
              break;
            }
          }
      }

      if(auth.user && 
        auth.user.last_name) {
          for(let f of newFormFields) {
            if(f.type == 'name') {
              for(let x of f.fields) {
                if(x.label == 'Last Name') {
                  x.value = JSON.stringify(auth.user.last_name);
                  break;
                }
              }
              break;
            }
          }
      }

      if(auth.user && 
        auth.user.birth_date) {
          const bdate = format(new Date(parseInt(auth.user.birth_date)), "MM/dd/yyyy");
          const splitDate = bdate.split('/');

          console.log('splitDate', splitDate);
          for(let f of newFormFields) {
            if(f.type == 'date') {
              for(let x of f.fields) {
                if(x.label == "MM")
                  x.value = splitDate[0] ? JSON.stringify(splitDate[0]) : "";
                else if(x.label == "DD")
                  x.value = splitDate[1] ? JSON.stringify(splitDate[1]) : "";
                else if(x.label == "YYYY")
                  x.value = splitDate[2] ? JSON.stringify(splitDate[2]) : "";

              }
              break;
            }
          }
      }
    }
  }, [auth])

  const dispatch = useDispatch()

  useEffect(() => {
    // if (auth.user_id) {
    //   dispatch(requestVendor(auth.user_id));
    // }
    if (form_id) {
      dispatch(requestGetFormById({ form_id }))
    }
  }, []);

  useEffect(() => {
    if (hasWizard) {
      const [field] = actualFormFields[currentStep]?.fields || []
      setNextPage(field?.value || '')
    }
  })

  const flattenFields = () => {
    if (hasWizard) {
      return actualFormFields.reduce((acc, curr) => [...acc, ...curr.formFields], [])
    } else {
      return actualFormFields
    }
  }

  const beforeSetStep = (step, isBack = false) => {
    if (!isBack) {
      setBackSteps([...backSteps, currentStep])
    } else {
      const newBackSteps = [...backSteps]
      if (newBackSteps.length) {
        step = newBackSteps[newBackSteps.length - 1]
      }
      newBackSteps.splice(newBackSteps.length - 1, 1)
      setBackSteps(newBackSteps)
    }
    setStep(step)
  }

  const handleChange = (id, value, isMultiple = false) => {

    const [, groupId] = id.split('_')
    const { settings: { logic } } = flattenFields().find(e => e.id === groupId)

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

    // Apply logic and PRAY
    const { include, items } = logic || {}
    if (include && !isApplication) {
      const newItems = items ? JSON.parse(items) : ''
      const newValue = value ? JSON.parse(value) : ''
      const [name] = Object.keys(newValue)
      const selectedLogic = newItems.find(e => e.name === name)
      if (selectedLogic) {
        const { pageId = '', fieldId = '' } = selectedLogic
        if (pageId === 'end') {
          handleSubmit(true)
          return
        }
        if (hasWizard) {
          const pageIndex = actualFormFields.findIndex(e => e.id === pageId)
          if (currentStep !== pageIndex && pageIndex !== 'firstPage') {
            beforeSetStep(pageIndex)
            setTimeout(() => setFieldError({}), 100)
          }
        }
        if (fieldId) {
          setTimeout(() => {
            const elmnt = document.getElementById(`group_${fieldId}`)
            elmnt.style.background = '#ffe5d5'
            setTimeout(() => {
              elmnt.style.cssText = 'color: transparent !important; transition: all 1s'
            }, 100)
            elmnt.scrollIntoView({
              // behavior: 'smooth',
              block: 'center'
            })
          }, 100)
        }
      }
    }
  }

  const handleCheckError = (id, errors, isMultiple = false) => {
    let newErrors = { ...fieldError }

    if (!isMultiple) {
      newErrors[id] = errors
    } else {
      newErrors = {
        ...newErrors,
        ...(errors || {})
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
    .forEach(({ required, value, id, placeholder, label, tag, type }) => {
      const newVal = value  ? typeof value === 'boolean' ? value : JSON.parse(value) : ''
 
      if (required && !newVal && tag !== 'icon' && tag !== 'checkbox') {
        const requiredError = `${placeholder || label || 'This'} is required.`
        if (!newFielderrors[id] || !newFielderrors[id].find(e => e === requiredError)) {
          newFielderrors[id] = [
            ...(newFielderrors[id] || []),
            requiredError
          ]
        }
      }
      if (type === 'terms' && (tag === 'input' || tag === 'checkbox')) {
        let parsedValue = null;
    
        if(typeof newVal === 'object') {
          parsedValue = newVal ? JSON.parse(newVal) : {};
          newFielderrors[id] = parsedValue?.value ? [] : ['Electronic Signature is required']
        }
        else if(tag === 'checkbox'){
          parsedValue = newVal && newVal !== '' ? newVal : null;

          newFielderrors[id] = parsedValue ? [] : ['Checkbox is required']
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
      beforeSetStep(step, true)
      setFieldError({})
      return
    }

    const { formHasError, errors } = handleCheckRequired()
    if (!formHasError) {
      if (nextPage && nextPage !== 'end') {
        step = actualFormFields.findIndex(e => e.id === nextPage)
      }

      if (nextPage === 'end') {
        handleSubmit(true)  
      }
      
      beforeSetStep(step)
    }

    setFieldError(errors)
  }

  const handleCopyFirstAddress = ({ target: { checked } }, id) => {
    const { id: firstAddressId } = addresses[0]
    const { fields: firstAddressFields } = flattenFields().find(e => e.id === firstAddressId)
    const { fields: targetAddressFields, type } = flattenFields().find(e => e.id === id)
    if (checked) {
      const fieldValues = firstAddressFields.map(e => e.value)
      const targetAddressValues = targetAddressFields.reduce((acc, curr, index) => {
        acc[curr.id] = fieldValues[index]
        return acc
      }, {})

      handleChange(`${type}_${id}`, targetAddressValues, true)
    }
  }

  const handleSubmit = (forceSubmit = false) => {
    const { formHasError, errors } = handleCheckRequired()
    if (!formHasError || forceSubmit) {
      const newFormContents = (hasWizard ? actualFormFields.reduce((acc, curr) => [...acc, ...curr.formFields], []) : actualFormFields)
        .map(e => {
          return {
            ...e,
            fields: cloneDeep(e.fields).map(f => {
              const fValue = f.value ? JSON.parse(f.value) : f.value
              if (
                fValue === '' ||
                (Array.isArray(fValue) && fValue.length === 0) ||
                (typeof fValue === 'object' && Object.keys(fValue).length === 0)
              ) {
                f.required = false
              }
              return f
            })
          }
        })

      // Submit for update custom application form
      if (isApplication) {
        onSubmitApplication({
          formTitle,
          formData: newFormContents
        })
        return
      }

      dispatch(requestSubmitForm({
        form_contents: {
          formTitle,
          formData: newFormContents
        },
        vendor: vendor || applicationVendor,
        form: form_id || form
      }))

      if (onGetUpdatedApplication) {
        onGetUpdatedApplication({
          formTitle,
          formData: newFormContents
        })
      }

      window.scrollTo({ top: 0 })
    }
    setFieldError(errors)
  }

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    copyStyles: true,
    pageStyle:`
    #form .highlights{

      border-top: none !important;
      border-left: none !important;
      border-right: none !important;
      border-bottom: 2px solid #ccc !important;
  
      background: none !important ;
      color: #555 !important;
    }
    #form .highlights-textarea {
      border: 2px solid #ccc !important;
      background: none !important ;
      color: #555 !important;
    }
    
    `,
    onBeforeGetContent: () => {
      setBehaviour('print')
    },
    onAfterPrint: () => {
      setBehaviour('')
    }
  })

  const handleGetGroupById = (id, field) => {
    return flattenFields().find(e => e.id === id)[field]
  }


  // console.log('@fieldError', fieldError)
  
  // For application
  const { form_contents: historyContents } = historyList && historyList.length ? JSON.parse(historyList[0].details) : {}
  const { formData: historyfields } = historyContents || {}
  const hideStepper = hasWizard && !!actualFormFields.find(e => !e.showLabel)
  
  // console.log('@actualFormFields', { actualFormFields, nextPage, fieldError })
  // console.log('flattenFields ', flattenFields());

  const hasLoginField = !!(flattenFields().find(e => e.type === 'login'))

  return (
    <FormStyled ref={componentRef}>
      <div id='form' >
        <div style={{ position: 'relative' }}>
          <div className='form-title'>
            {!loading.getForm ? formTitle : ''}
          </div>
          {
            (!form_id && behavior !== 'print') && (
              <div className='app-date'>{application_date}</div>
            )
          }
          {
            (!form_id && behavior !== 'print') && (
              <>
                <button type='button' className='print-button' onClick={handlePrint}>
                  {' '}
                  <FontAwesomeIcon icon={faPrint} />
                </button>
                {
                  !isFormHistory ? (
                    <button
                      className={`edit-button ${!isReadOnly ? 'activeEdit' : ''}`}
                      type='button'
                      onClick={onChangeToEdit}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  ) : (
                    <a 
                      href=''
                      className='view-latest'
                      target='_blank' 
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectLatest()
                      }}
                    >
                      View Latest
                    </a>
                  )
                }
              </>
            )
          }
        </div>
        <div className={`form-content ${isApplication ? 'read-only' : ''}`}>
          <> 
            {
              (isSuccessfulSubmit && form_id) ? (
                <ThankyouPage hasLoginField={hasLoginField}/>
              ) : (
                (loading.getForm || loading.submitForm) ? (
                  <Loading />
                ) : (
                  <>
                    {
                      hasWizard ? (
                        <div className='wizard-wrapper'>
                          {
                            !hideStepper && (
                              <Stepper
                                fields={actualFormFields}
                                currentStep={currentStep}
                                onSetStep={handleChangeStep}
                              />
                            )
                          }
                          <Content
                            id={(actualFormFields[currentStep] || {}).id}
                            isReadOnly={isReadOnly}
                            fields={(actualFormFields[currentStep] || {}).formFields || []}
                            historyFields={(isReadOnly && !isFormHistory) ? historyfields : []}
                            currentStep={currentStep}
                            fieldError={fieldError}
                            addresses={addresses}
                            onCopyFirstAddress={handleCopyFirstAddress}
                            onSetStep={handleChangeStep}
                            onChange={handleChange}
                            onCheckError={handleCheckError}
                            onGetGroupById={handleGetGroupById}
                          />
                        </div>
                      ) : (
                        <Content
                          id={'firstPage'}
                          isReadOnly={isReadOnly}
                          fields={actualFormFields}
                          historyFields={(isReadOnly && !isFormHistory) ? historyfields : []}
                          currentStep={currentStep}
                          fieldError={fieldError}
                          addresses={addresses}
                          onCopyFirstAddress={handleCopyFirstAddress}
                          onSetStep={handleChangeStep}
                          onChange={handleChange}
                          onCheckError={handleCheckError}
                          onGetGroupById={handleGetGroupById}
                        />
                      )
                    }
                    {
                      (behavior !== 'print' && !isReadOnly) && (
                        <Actions
                          hasWizard={hasWizard}
                          fields={actualFormFields}
                          currentStep={currentStep}
                          hasBackSteps={backSteps.length > 0}
                          onSetStep={handleChangeStep}
                          onSubmit={handleSubmit}
                        />
                      )
                    }
                  </>
                )
              )
            }
          </>
        </div>
      </div>
    </FormStyled>
  )
}