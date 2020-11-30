import React, { useEffect, useState } from "react";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import ReportBuilderStyled from './styles'
import DragArea from './DragArea'
import DropArea from './DropArea'
import { useSelector } from "react-redux";

const ReportBuilder = ({ form_id }) => {
  const [builderDrawerOpen, setBuilderDrawerOpen] = useState(false)
  
  const handleBuilderDrawerOpen = () => {
    setBuilderDrawerOpen(!builderDrawerOpen)
  }

  return (
    <ReportBuilderStyled>
      <h2>New Application</h2>
      <div id='reportBuilder' className={builderDrawerOpen ? 'show': 'hide'}>
        <DragArea form_id={form_id} handleBuilderDrawerOpen={handleBuilderDrawerOpen}/>
        <DropArea handleBuilderDrawerOpen={handleBuilderDrawerOpen}/>
      </div>
    </ReportBuilderStyled>
  )
}

export default (props) => (
  <DndProvider backend={HTML5Backend}>
    <ReportBuilder {...props} />
  </DndProvider>
)