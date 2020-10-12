import React, { useEffect } from 'react'
import { useDrag } from 'react-dnd'
import { uuid } from 'uuidv4'
import { getEmptyImage } from "react-dnd-html5-backend";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGripVertical } from "@fortawesome/free-solid-svg-icons"

export default ({ name, type, fields, previewStyle = {} }) => {
  const [{ opacity, background }, drag, preview] = useDrag({
    item: { type },
    begin: () => ({ name, type, fields, id: uuid() }),
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
      // background: monitor.isDragging() ? 'red' : 'blue'
      // drag
    })
  })

  // useEffect(() => {
  //   preview(getEmptyImage(), { captureDraggingState: true });
  // }, []);

  return (
    <div
      className='draggble-item'
      ref={drag}
      style={{ opacity, background, ...previewStyle }}
    >
      <FontAwesomeIcon icon={faGripVertical}/>
      <span>{name}</span>
    </div>
  )
}