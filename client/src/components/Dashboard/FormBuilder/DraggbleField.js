import React, { useEffect } from 'react'
import { useDrag } from 'react-dnd'
import { uuid } from 'uuidv4'
import cloneDeep from 'lodash.clonedeep'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUser,
  faClock,
  faGlobe,
  faEnvelope,
  faPhoneAlt,
  faDollarSign,
  faFileUpload,
  faStarHalfAlt,
  faCalendarAlt,
  faMapMarkerAlt,
  faGripVertical,
} from "@fortawesome/free-solid-svg-icons"

export default ({ name, type, groupType, fields, previewStyle = {} }) => {
  const newFields = cloneDeep(fields) //avoid mutating the array of objects
  const settings = {}
  const [{ opacity, background }, drag, preview] = useDrag({
    item: { type },
    begin: () => ({ name, type, fields: newFields, groupType, settings, id: uuid() }),
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
      // background: monitor.isDragging() ? 'red' : 'blue'
      // drag
    })
  })

  // useEffect(() => {
  //   preview(getEmptyImage(), { captureDraggingState: true });
  // }, []);

  let primeIcon
  if (type === 'name') {
    primeIcon = faUser
  } else if (type === 'primeFile') {
    primeIcon = faFileUpload
  } else if (type === 'address') {
    primeIcon = faMapMarkerAlt
  } else if (type === 'primeRating') {
    primeIcon = faStarHalfAlt
  } else if (type === 'email') {
    primeIcon = faEnvelope
  } else if ( type === 'date') {
    primeIcon = faCalendarAlt
  } else if (type === 'phone') {
    primeIcon = faPhoneAlt
  } else if (type === 'time') {
    primeIcon = faClock
  } else if (type === 'price') {
    primeIcon = faDollarSign
  } else if (type === 'website') {
    primeIcon = faGlobe
  } else primeIcon = faGripVertical

  return (
    <div
      className='draggble-item'
      ref={drag}
      style={{ opacity, background, ...previewStyle }}
    >
      <FontAwesomeIcon icon={primeIcon}/>
      <span>{name}</span>
    </div>
  )
}
