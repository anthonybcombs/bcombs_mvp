import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import update from 'immutability-helper'
import cloneDeep from 'lodash.clonedeep'

import FormStyled from './styles'
import Loading from '../../../helpers/Loading.js'

import { requestVendor } from '../../../redux/actions/Vendors'
import { requestGetForms, requestUpdateForm, requestAddForm, requestDeleteForm } from '../../../redux/actions/FormBuilder'

import Headers from './headers'
import List from './list'

export default (props) => {
  
  const {
    auth, vendors, loading, 
    form: { formList = [], updateForm, addForm, deleteForm }
  } = useSelector(
    ({ auth, vendors, loading, form }) => {
      return { auth, vendors, loading, form }
    }
  )
  const dispatch = useDispatch()
  
  const [isLoading, setIsLoading] = useState(false)
  const [list, setList] = useState(formList)
  const [forceCloseDialogs, setForceCloseDialogs] = useState(true)

  useEffect(() => {
    if (auth.user_id) {
      dispatch(requestVendor(auth.user_id))
      setIsLoading(true)
    }
  }, [])

  useEffect(() => {
    if(vendors && vendors.length > 0) {
      dispatch(requestGetForms({ vendor: vendors[0].id, category: '' }))
      setIsLoading(true)
    }
  }, [vendors])
 
  useEffect(() => {
    if (isLoading && !loading.getForm) {
      setIsLoading(false)
    }
  }, [loading.getForm])

  useEffect(() => {
    if (formList.length) {
      setList(formList)
    }
  }, [formList])

  useEffect(() => {
    if (updateForm.form && Object.keys(updateForm.form).length && !loading.updateForm) {
      setList(update(list, {
        [list.findIndex(e => e.form_id === updateForm.form.form_id)]: { $merge: updateForm.form }
      }))
      setForceCloseDialogs(true)
    }
  }, [updateForm])

  if(
    (addForm && addForm.message == 'successfully created your application form') ||
    (deleteForm && deleteForm.message == 'successfully delete you application form')
  ) {
    window.location.reload()
  }

  const handleUpdateList = (data) => {
    setForceCloseDialogs(false)
    dispatch(requestUpdateForm(data))
  }

  const handleCloneForm = (data) => {
    dispatch(requestAddForm(data))
  }

  const handleDeleteForm = (form_id) => {
    dispatch(requestDeleteForm(form_id))
  }
  
  console.log('wewwwwwwwwwwww', { loading, list })

  return (
    <FormStyled>
      <h2>Form Manager</h2>
      <Headers />
      {
        isLoading ? (
          <Loading />
        ) : (
          <List
            list={list}
            loading={loading.updateForm || loading.addForm || loading.deleteForm}
            forceCloseDialogs={forceCloseDialogs}
            onSetForceCloseDialogs={(bool) => setForceCloseDialogs(bool)}
            onUpdateList={handleUpdateList}
            onCloneForm={handleCloneForm}
            onDeleteForm={handleDeleteForm}
          />
        )
      }
    </FormStyled>
  )
}