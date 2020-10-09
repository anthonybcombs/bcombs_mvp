import React, { useEffect } from 'react'
import { useDrag } from 'react-dnd'
import { uuid } from 'uuidv4'
import { getEmptyImage } from "react-dnd-html5-backend";

export default ({ name, type, fields, previewStyle = {} }) => {
  const [{ opacity }, drag, preview] = useDrag({
    item: { type },
    begin: () => ({ name, type, fields, id: uuid() }),
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
      drag
    })
  })

  // useEffect(() => {
  //   preview(getEmptyImage(), { captureDraggingState: true });
  // }, []);

  return (
    <div
      className='draggble-items'
      ref={drag}
      style={{ opacity, ...previewStyle }}
    >
      {name}
    </div>
  )
}