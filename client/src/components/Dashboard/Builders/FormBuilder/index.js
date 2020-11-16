import React, { useEffect, useState } from "react";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import FormBuilderStyled from './styles'
import DragArea from './DragArea'
import DropArea from './DropArea'

import Loading from "../../../../helpers/Loading.js";

import { useSelector, useDispatch } from "react-redux";

import { requestVendor } from "../../../../redux/actions/Vendors";
import { requestGetFormById, setViewMode } from "../../../../redux/actions/FormBuilder"

const FormBuilder = ({ form_id, type, history }) => {
  const [builderDrawerOpen, setBuilderDrawerOpen] = useState(false)
  
  const handleBuilderDrawerOpen = () => {
    setBuilderDrawerOpen(!builderDrawerOpen)
  }

  const {
    auth, vendors, loading, 
    form: { addForm, updateForm, selectedForm: { form_contents }, isFormView }
  } = useSelector(
    ({ auth, vendors, loading, form }) => {
      return { auth, vendors, loading, form };
    }
  );
  let isLoading = loading.addForm || loading.updateForm || loading.getForm
  const { formData = [], formTitle = '' } = form_contents || {}

  const [vendor, setVendor] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.user_id) {
      dispatch(requestVendor(auth.user_id));
      isLoading = true
    }
    if (form_id && type === 'edit') {
      dispatch(requestGetFormById({ form_id }))
    }
    if (form_id && type === 'view') {
      dispatch(setViewMode(true))
      document.querySelector('.btn.preview').click()
      setTimeout(() => {
        window.location.replace(`/dashboard/builder/${form_id}/edit`)
      }, 1000)
    }
  }, []);

  useEffect(() => {
    if(vendors && vendors.length > 0 && !form_id) {
      setVendor(vendors[0])
      isLoading = false
    }
  }, [vendors])

  if(addForm && addForm.message == "successfully created your application form" && addForm.form) {
    window.location.replace(`/dashboard/builder/${addForm.form.form_id}/${addForm.isViewMode ? 'view': 'edit'}`)
  }

  if (updateForm && updateForm.message == 'successfully update your application form') {
    window.location.replace(`/dashboard/builder/${form_id}/edit`)
    isLoading = true
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

  return (
    <FormBuilderStyled>
      <h2>New Application</h2>
      <div id='formBuilder' className={builderDrawerOpen ? 'show': 'hide'}>
        <DragArea form_id={form_id} handleBuilderDrawerOpen={handleBuilderDrawerOpen}/>
        <DropArea
          form_data={formData.map(e => cleanFormData(e))}
          form_title={formTitle}
          form_id={form_id}
          vendor={vendor}
          user={auth}
          isLoading={isLoading}
          isFormView={isFormView}
          handleBuilderDrawerOpen={handleBuilderDrawerOpen}
        />
      </div>
    </FormBuilderStyled>
  )

}

export default (props) => (
  <DndProvider backend={HTML5Backend}>
    <FormBuilder {...props} />
  </DndProvider>
)