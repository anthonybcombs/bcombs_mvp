import React from 'react'

export default ({ description, onChangeFieldSettings, isBuilder }) => {
  return (
    <div>
      <input
        placeholder='Section break description here.'
        value={description}
        onChange={({ target: { value } }) => onChangeFieldSettings({ description: value })}
      />
    </div>
  )
}