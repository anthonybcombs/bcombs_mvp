import React, { useEffect, useState } from "react";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { parse } from "query-string";


import FormBuilderStyled from './styles'
import DragArea from './DragArea'
import DropArea from './DropArea'

import ImportExportApplication from '../../Application/import_export_application';

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
  const { formData = [], formTitle = '' } = form_contents || {};
  
  const queryParams = parse(location.search);
  const parsedVendorId2 = queryParams?.vendor ? parseInt(queryParams?.vendor) : null;

  const [vendor, setVendor] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.user_id && !Array.isArray(vendors)) {
 
      dispatch(requestVendor(auth.user_id));
      isLoading = true
    }
    if (form_id && type === 'edit') {
      dispatch(requestGetFormById({ form_id }))
    }
  }, []);

  useEffect(() => {
    // && !form_id
    if (Array.isArray(vendors) && vendors.length > 0 ) {
      if(queryParams?.vendor) {
        const currentVendor = vendors.find(item => item.id2 === parsedVendorId2)
        setVendor(currentVendor)
      }
      else {
        const currentVendor = vendors.find(item => item.is_default)
        setVendor(currentVendor)
      }
  
      isLoading = false
    }
  }, [vendors])

  if (addForm && addForm.message == "successfully created your application form" && addForm.form) {
    window.location.replace(`/dashboard/builder/${addForm.form.form_id}/edit`)
  }

  if (updateForm && updateForm.message == 'successfully update your application form') {
    if (isFormView) {
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
  console.log('form_contents2222 vendor', vendor)
  console.log('form_contents', form_contents)
  return (
    <div>

      <div style={{
        width: 'auto',
        margin: 'auto',
        maxWidth: 1920,
        // padding: '0rem 3em 2rem'
        paddingTop: 24,
        paddingBottom: 5,
        paddingLeft: 32,
        paddingRight: 32,
        display: 'flex',
        justifyContent: 'space-between'
      }}>

        <h2>{type !== 'edit' ? 'New Forms' : 'Existing Forms'}</h2>
        {type === 'edit' &&   <ImportExportApplication
          form={{
            form_contents,
            form: form_id,
            form_id
          }}
          formType="custom"
          vendor={vendor?.id}
          isLot={false}
          createProfileFeature={true}
          refreshData={() => {
            // handleGetForms(selectedForm)
          }}
        />}
      
      </div>
      <FormBuilderStyled>

        <div id='formBuilder' className={builderDrawerOpen ? 'show' : 'hide'}>

          <DragArea
            form_id={form_id}
            getItem={(e) => getItem(e)}
            handleBuilderDrawerOpen={handleBuilderDrawerOpen}
            vendor={queryParams?.vendor}
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

    </div>

  )

}

export default (props) => (
  <DndProvider backend={HTML5Backend}>
    <FormBuilder {...props} />
  </DndProvider>
)