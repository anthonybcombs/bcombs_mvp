import React from 'react'

export default ({ description, onChangeFieldSettings, isBuilder }) => {
  return (
    <div className='sectionBreak-desc'>
      <input
        value={description}
        className='field-input'
        placeholder='Section break description here.'
        onChange={({ target: { value } }) => onChangeFieldSettings({ description: value })}
      />
    </div>
  )
}