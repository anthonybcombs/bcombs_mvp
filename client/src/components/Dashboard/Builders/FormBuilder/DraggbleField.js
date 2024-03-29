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

export default ({
  label, type, groupType, fields, previewStyle = {}, gridMax = 3, allowAddField = false,
  includeLogic = true, includeValidation = false, displayLabel, hasSettings = true,
  supportMultiple = false, showLabel = true, format, getItem
}) => {
  if (!format.trim()) {
    format = JSON.stringify({ presetColors: ['#ff007b','#8f5772','#a5a4b7','#1d13d2'] })
  }
  const newFields = cloneDeep(fields) //avoid mutating the array of objects
  const settings = {}
  const [{ opacity, background }, drag] = useDrag({
    item: { type },
    begin: () => ({
      label, type, fields: newFields, groupType, settings, id: uuid(), allowAddField,
      includeLogic, includeValidation, gridMax, hasSettings, supportMultiple, showLabel, format
    }),
    end: (props, monitor) => {
      const item = monitor.getItem()
      const didDrop = monitor.didDrop()
      getItem({ ...item, didDrop })
    },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
    })
  })

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
      <span>{displayLabel || label}</span>
    </div>
  )
}
