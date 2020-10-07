import React, { useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'

import { Items } from './Constants'
import FieldConstructor from './FieldConstructor'

export default () => {
  const [droppedFields, setDrop] = useState([])

  const handleDrop = (field) => {
    const newFields = [
      ...droppedFields,
      field
    ]
    setDrop(newFields)
  }

  const [{ item }, drop] = useDrop({
    accept: Object.values(Items),
    drop: () => handleDrop(item),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
      item: monitor.getItem()
    }),
  })

  return (
    <div className='fb-drop-area' ref={drop}>
      Drop here
      {
        droppedFields.map(({ fields, name }) => {
          return (
            <div>
              <div>{name}</div>
              {
                fields.map(({ key, label, placeholder = '', type, tag }) => {
                  return FieldConstructor[tag]({
                    name: key,
                    placeholder,
                    type,
                    label
                  })
                })
              }
            </div>
          )
        })
      }
    </div>
  )
}