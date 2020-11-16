import React from 'react'

export default ({ description, onChangeFieldSettings, isBuilder }) => {
  return (
    <div className='pageBreak-desc'>
      {/* <input
        value={description}
        className='field-input'
        placeholder='Page break description here.'
        onChange={({ target: { value } }) => onChangeFieldSettings({ description: value })}
      /> */}
    </div>
  )
}