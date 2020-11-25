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
  const [category, setCategory] = useState('')

  const [renameModal, setRenameModal] = useState(false)
  const [cloneModal, setCloneModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  const GetRequestFormList = (value) => {
    if (value !== undefined) {
      setCategory(value)
    }
    console.log('yawaaaaaaaa', value)
    dispatch(requestGetForms({ vendor: vendors[0].id, category: value }))
    setIsLoading(true)
  }

  useEffect(() => {
    if (auth.user_id) {
      dispatch(requestVendor(auth.user_id))
      setIsLoading(true)
    }
  }, [])

  useEffect(() => {
    if(vendors && vendors.length > 0) {
      GetRequestFormList()
    }
  }, [vendors])
 
  useEffect(() => {
    if (isLoading && !loading.getForm) {
      setIsLoading(false)
    }
  }, [loading.getForm])

  useEffect(() => {
    // if (formList.length) {
      setList(formList)
    // }
  }, [formList])

  useEffect(() => {
    if (updateForm.form && Object.keys(updateForm.form).length && !loading.updateForm) {
      setList(update(list, {
        [list.findIndex(e => e.form_id === updateForm.form.form_id)]: { $merge: updateForm.form }
      }))
      setRenameModal(false)
    }
  }, [updateForm])

  useEffect(() => {
    if (addForm && addForm.message == 'successfully created your application form') {
      GetRequestFormList()
      setCloneModal(false)
    }
  }, [addForm])

  useEffect(() => {
    if (deleteForm && deleteForm.message == 'successfully delete you application form') {
      GetRequestFormList()
      setDeleteModal(false)
    }
  }, [deleteForm])

  const handleUpdateList = (data) => {
    dispatch(requestUpdateForm(data))
  }

  const handleCloneForm = (data) => {
    dispatch(requestAddForm(data))
  }

  const handleDeleteForm = (form_id) => {
    dispatch(requestDeleteForm(form_id))
  }

  const handleChangeFilter = ({ target: { value } }) => {
    GetRequestFormList(value)
  }
  
  // console.log('wewwwwwwwwwwww', { loading, list })

  return (
    <FormStyled>
      <h2>Form Manager</h2>
      <div id='formManager'>
        <Headers
          onChangeFilter={handleChangeFilter}
        />
        {
          isLoading ? (
            <Loading />
          ) : (
            <List
              list={list}
              loading={loading.updateForm || loading.addForm || loading.deleteForm}
              onUpdateList={handleUpdateList}
              onCloneForm={handleCloneForm}
              onDeleteForm={handleDeleteForm}

              //for modals
              renameModal={renameModal}
              cloneModal={cloneModal}
              deleteModal={deleteModal}
              setRenameModal={(data) => setRenameModal(data)}
              setCloneModal={(data) => setCloneModal(data)}
              setDeleteModal={(data) => setDeleteModal(data)}
            />
          )
        }
      </div>
    </FormStyled>
  )
}