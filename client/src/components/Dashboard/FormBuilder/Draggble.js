import React from 'react'
import { useDrag } from 'react-dnd'

export default ({ name, type, fields, isDropped }) => {
  const [{ opacity }, drag] = useDrag({
    item: { name, type, fields },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
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