import React, { useEffect, useState } from "react";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import FormBuilderStyled from './styles'
import DragArea from './DragArea'
import DropArea from './DropArea'

import { useSelector, useDispatch } from "react-redux";

import { requestVendor } from "../../../../redux/actions/Vendors";

const FormBuilder = ({ form_id }) => {
  const [builderDrawerOpen, setBuilderDrawerOpen] = useState(false)
  
  const handleBuilderDrawerOpen = () => {
    setBuilderDrawerOpen(!builderDrawerOpen)
  }

  const { auth, vendors, loading, form } = useSelector(
    ({ auth, vendors, loading, form }) => {
      return { auth, vendors, loading, form };
    }
  );

  const [vendor, setVendor] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.user_id) {
      dispatch(requestVendor(auth.user_id));
    }
  }, []);

  useEffect(() => {
    if(vendors && vendors.length > 0) {
      setVendor(vendors[0]);
    }
  }, [vendors])

  if(form.addForm && form.addForm.message == "successfully created your application form") {
    //form successfully created
    //window.location.reload();

    console.log("newly created form", form);
  }

  return (
    <FormBuilderStyled>
      <h2>New Application</h2>
      <div id='formBuilder' className={builderDrawerOpen ? 'show': 'hide'}>
        <DragArea form_id={form_id} handleBuilderDrawerOpen={handleBuilderDrawerOpen}/>
        <DropArea vendor={vendor} user={auth} handleBuilderDrawerOpen={handleBuilderDrawerOpen}/>
      </div>
    </FormBuilderStyled>
  )
}

export default (props) => (
  <DndProvider backend={HTML5Backend}>
    <FormBuilder {...props} />
  </DndProvider>
)