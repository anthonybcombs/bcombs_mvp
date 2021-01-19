import React from 'react'

export default ({ label, onChangeFieldSettings, isBuilder }) => {
  return (
    <div className='sectionBreak-desc'>
      {
        isBuilder ? (
          <input
            value={label}
            className='field-input'
            placeholder='Section break description here.'
            onChange={({ target: { value } }) => onChangeFieldSettings({ label: value })}
          />
        ) : (
          <label>{label}</label>
        )
      }
    </div>
  )
}