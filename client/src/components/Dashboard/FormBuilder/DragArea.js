import React, { useEffect, useState } from 'react'

import { StandardFields, PrimeFields } from './Constants'
import DraggableField from './DraggbleField'

export default () => {
  const [standardFields] = useState([...StandardFields])
  const [primeFields] = useState([...PrimeFields])

  return (
    <div className='drag-area-wrapper'>
      <h3 className='header'>Form Builder</h3>

      <h4 className='sub-header'>Standard</h4>
      <div className='draggble-container standard-items'>    
        {
          standardFields.map(({ label, type, ...rest }) => {
            return (
              <DraggableField key={type} label={label} type={type} {...rest} groupType='standard' />
            )
          })
        }
      </div> 

      <h4 className='sub-header'>Prime</h4>
      <div className='draggble-container prime-items'>    
        {
          primeFields.map(({ label, type, ...rest }) => {
            return (
              <DraggableField key={type} label={label} type={type} {...rest} groupType='prime' />
            )
          })
        }
      </div> 
    </div>
  )
}