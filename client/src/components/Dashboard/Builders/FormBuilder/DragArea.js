import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import { StandardFields, PrimeFields } from './Constants'
import DraggableField from './DraggbleField'

export default ({ handleBuilderDrawerOpen, form_id }) => {
  const [standardFields] = useState([...StandardFields])
  const [primeFields] = useState([...PrimeFields])

  const handleSelectFormType = (type) => {
    console.log('type: ', type)
    window.location.replace(`/dashboard/builder/${form_id}/${type}`)
  }

  return (
    <div className='drag-area-wrapper'>
      <FontAwesomeIcon // Show on tablet and mobile only
        icon={faArrowLeft}
        className='arrow-left'
        onClick={handleBuilderDrawerOpen}
      />
      
      <div className='header-tabs'>
        <h3
          className='header form'
          onClick={() => handleSelectFormType('edit')}
        >
          Form Builder
        </h3>
        <h3
          className='header report'
          onClick={() => handleSelectFormType('report')}
        >
          Report Builder
        </h3>
      </div>

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