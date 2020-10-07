import React, { useEffect, useState } from 'react'
import { useDrag } from 'react-dnd'

import { Items, Fields } from './Constants'
import Draggable from './Draggble'

export default () => {
  const [fields] = useState([...Fields])

  return (
    <div className='fb-draggables'>
      {
        fields.map(({ label, type, ...rest }) => {
          return (
            <Draggable key={type} name={label} type={type} {...rest} />
          )
        })
      }
    </div>
  )
}