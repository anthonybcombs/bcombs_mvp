import React from 'react'

export default () => {
  const [editFieldDrawerShow, setEditFieldDrawerShow] = useState(false)
  const isEditFieldDrawerShow = editFieldDrawerShow ? 'show' : ''

  return (
    <div className={`sortableGroup-drawer drawer-right ${isEditFieldDrawerShow}`}>
      <div className='field'>
        <label for='placeholder' className='field-label'>Placeholder</label>
        <input
          type='text'
          id='placeholder'
          className='field-input'
          placeholder='Edit Placeholder'
          // value={name}
          // onChange={() => console.log('eee')}
        />
      </div>
      
      <div className='field select-field-wrapper'>
      <label for='column' className='field-label'>Column</label>
        <select
          id='column'
          className='field-input'
          defaultValue={fieldColumn}
          onChange={({ target }) => {
            handleFieldColumn(target.value)
          }}
        >
          <option value=''>Select Field Size</option>
          <option value='1'>Small</option>
          <option value='2'>Medium</option>
          <option value='3'>Large</option>
        </select>
      </div>
      
      <div className='addField-actions'>
        <button
          type='button'
          className='add-btn'
          onClick={() => setEditFieldDrawerShow(!editFieldDrawerShow) }
        >
          Update
        </button>
      </div>
    </div>
  )
}