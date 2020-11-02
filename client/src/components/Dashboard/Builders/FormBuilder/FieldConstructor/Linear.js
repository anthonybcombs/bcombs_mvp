import React from 'react'

export default ({ min, max, onChangeFieldSettings }) => {
  const handleChangeValues = ({ target: { value } }, type, subType) => {
    const currentTypeData = type === 'min' ? { ...min } : { ...max }
    onChangeFieldSettings({ [type]: { ...currentTypeData, [subType]: value } })
  }
  return (
    <div>
      <select
        value={min.value}
        onChange={(e) => handleChangeValues(e, 'min', 'value')}
      >
        {
          [0, 1].map((num, index) => {
            return (<option key={'min' + index} value={num}>{num}</option>)
          })
        }
      </select>
      to
      <select
        value={max.value}
        onChange={(e) => handleChangeValues(e, 'max', 'value')}
      >
        {
          Array(10).fill(null).map((num, index) => {
            const val = index + 1
            return val > 1
              ? <option key={'max' + val} value={val}>{val}</option>
              : null
          })
        }
      </select>

      <div className='option'>
        <span>{min.value}</span>
        <input
          type='text'
          placeholder='Lowest Scale Label (optional)'
          value={min.label}
          onChange={(e) => handleChangeValues(e, 'min', 'label')}
        />
      </div>
      <div className='option'>
        <span>{max.value}</span>
        <input
          type='text'
          placeholder='Highest Scale Label (optional)'
          value={max.label}
          onChange={(e) => handleChangeValues(e, 'max', 'label')}
        />
      </div>
    </div>
  )
}