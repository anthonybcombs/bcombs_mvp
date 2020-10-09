import React from 'react'
import { useDrag } from 'react-dnd'
import { uuid } from 'uuidv4'

export default ({ name, type, fields, isDropped }) => {
  const [{ opacity }, drag] = useDrag({
    item: { type },
    begin: () => ({ name, type, fields, id: uuid() }),
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.4 : 1
    })
  })

  return (
    <div
      className='draggble-items'
      ref={drag}
      style={{ opacity }}
    >
      {name}
    </div>
  )
}