import React, { useEffect, useState } from "react";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import FormBuilderStyled from './styles'
import DragArea from './DragArea'
import DropArea from './DropArea'



const FormBuilder = () => {
  const [builderDrawerOpen, setBuilderDrawerOpen] = useState(false)
  console.log('isOpen: ', builderDrawerOpen)
  
  const handleBuilderDrawerOpen = () => {
    setBuilderDrawerOpen(!builderDrawerOpen)
  }

  return (
    <FormBuilderStyled>
      <h2>New Application</h2>
      <div id='formBuilder' className={builderDrawerOpen ? 'show': 'hide'}>
        <DragArea handleBuilderDrawerOpen={handleBuilderDrawerOpen}/>
        <DropArea handleBuilderDrawerOpen={handleBuilderDrawerOpen}/>
      </div>
    </FormBuilderStyled>
  )
}

export default () => (
  <DndProvider backend={HTML5Backend}>
    <FormBuilder />
  </DndProvider>
)