import React, { useEffect, useState } from "react";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import FormBuilderStyled from './styles'
import DragArea from './DragArea'
import DropArea from './DropArea'

const FormBuilder = () => {
  return (
    <FormBuilderStyled>
      <div className='form-builder'>
        <DragArea />
        <DropArea />
      </div>
    </FormBuilderStyled>
  )
}

export default () => (
  <DndProvider backend={HTML5Backend}>
    <FormBuilder />
  </DndProvider>
)