import React, { useEffect, useState } from "react";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import FormBuilderStyled from './styles'
import DragArea from './DragArea'
import DropArea from './DropArea'

import Loading from "../../../../helpers/Loading.js";

import { useSelector, useDispatch } from "react-redux";

import { requestVendor } from "../../../../redux/actions/Vendors";
import { requestGetFormById, clearFormMessage } from "../../../../redux/actions/FormBuilder"

const FormBuilder = ({ form_id, type, history }) => {
  const [builderDrawerOpen, setBuilderDrawerOpen] = useState(false)
  const [item, getItem] = useState(null)
  
  const handleBuilderDrawerOpen = () => {
    setBuilderDrawerOpen(!builderDrawerOpen)
  }

  const {
    auth, vendors, loading, 
    form: { addForm, updateForm, selectedForm: { form_contents, category }, isFormView }
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
  }, []);

  useEffect(() => {
    if(vendors && vendors.length > 0 && !form_id) {
      setVendor(vendors[0])
      isLoading = false
    }
  }, [vendors])

  if(addForm && addForm.message == "successfully created your application form" && addForm.form) {
    window.location.replace(`/dashboard/builder/${addForm.form.form_id}/edit`)
  }

  if (updateForm && updateForm.message == 'successfully update your application form') {
    if(isFormView) {
      document.getElementById('previewButton') && document.getElementById('previewButton').click()
    }
    dispatch(clearFormMessage())
    // window.location.replace(`/dashboard/builder/${form_id}/edit`)
    // isLoading = true
  }

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

  return (
    <FormBuilderStyled>
      <h2>{type !== 'edit' ? 'New Forms' : 'Existing Forms'}</h2>
      <div id='formBuilder' className={builderDrawerOpen ? 'show': 'hide'}>
        <DragArea
          form_id={form_id}
          getItem={(e) => getItem(e)}
          handleBuilderDrawerOpen={handleBuilderDrawerOpen}
        />
        <DropArea
          item={item}
          form_data={formData.map(e => cleanFormData(e))}
          form_title={formTitle}
          category={category}
          form_id={form_id}
          vendor={vendor}
          user={auth}
          isLoading={isLoading}
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