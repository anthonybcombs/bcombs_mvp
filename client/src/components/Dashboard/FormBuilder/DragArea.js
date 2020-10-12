import React, { useEffect, useState } from 'react'

import { Fields } from './Constants'
import DraggableField from './DraggbleField'

export default () => {
  const [fields] = useState([...Fields])

  return (
    <div className='drag-area-wrapper'>
      <h3 className='header'>Add Field</h3>

      <h4 className='sub-header'>Standard</h4>
      <div className='draggble-container standard-items'>    
        {
          fields.map(({ label, type, ...rest }) => {
            return (
              <DraggableField key={type} name={label} type={type} {...rest} />
            )
          })
        }
      </div> 

      <h4 className='sub-header'>Prime</h4>
      <div className='draggble-container prime-items'>    
        {
          fields.map(({ label, type, ...rest }) => {
            return (
              <DraggableField key={type} name={label} type={type} {...rest} />
            )
          })
        }
      </div> 
    </div>
  )
}