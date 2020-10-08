import React, { useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import { uuid } from 'uuidv4'
import update from 'immutability-helper'

import { Items } from './Constants'
import SortableGroup from './SortableGroup'

export default () => {
  const [droppedFields, setDrop] = useState([])

  const handleDrop = (field) => {
    const newFields = [...droppedFields]
    if (!newFields.find(e => e.id === field.id)) {
      newFields.push(field)
      setDrop(newFields)
    }
  }

  const handleMoveGroup = (dragIndex, hoverIndex, draggedGroup) => {
    let newFields = [...droppedFields]
    if (dragIndex === undefined) {
      newFields.push({ ...draggedGroup })
      dragIndex = newFields.length - 1
    }
    const dragGroup = newFields[dragIndex]
    setDrop(update(newFields, {
        $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragGroup],
        ],
    }))
  }

  const [{ item, didDrop }, drop] = useDrop({
    accept: Object.values(Items),
    drop: () => handleDrop(item, didDrop),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      item: monitor.getItem()
    }),
  })

  return (
    <div className='fb-drop-area' ref={drop}>
      Drop here
      {
        droppedFields.map((fieldProps, index) => {
          return (
            <SortableGroup key={fieldProps.id} {...fieldProps} index={index} onMoveGroup={handleMoveGroup} />
          )
        })
      }
    </div>
  )
}