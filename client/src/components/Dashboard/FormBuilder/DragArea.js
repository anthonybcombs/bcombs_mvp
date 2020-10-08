import React, { useEffect, useState } from 'react'

import { Fields } from './Constants'
import DraggableField from './DraggbleField'

export default () => {
  const [fields] = useState([...Fields])

  return (
    <div className='fb-draggables'>
      {
        fields.map(({ label, type, ...rest }) => {
          return (
            <DraggableField key={type} name={label} type={type} {...rest} />
          )
        })
      }
    </div>
  )
}