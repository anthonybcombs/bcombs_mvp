import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import cloneDeep from 'lodash.clonedeep'

export default ({ items, onChangeFieldSettings }) => {
  const handleChangeValues = ({ target: { value } }, index) => {
    onChangeFieldSettings({
      items: items.map((item, i) => ({
        ...item, label: index === i ? value : item.value
      }))
    })
  }

  const handleAddRow = () => {
    onChangeFieldSettings({
      items: [...items, { label: '', rank: '' }]
    })
  }

  const handleRemoveRow = (index) => {
    const newItems = cloneDeep(items)
    newItems.splice(index, 1)
    onChangeFieldSettings({ items: newItems })
  }
  
  return (
    <div>
      {
        items.map((item, index) => {
          return (
            <div key={`rankingItems-${index}`} className='option'>
              <input
                type='text'
                placeholder='Lowest Scale Label (optional)'
                value={item.label}
                onChange={(e) => handleChangeValues(e, index)}
              />
              {
                items.length > 2 && (
                  <FontAwesomeIcon
                    icon={faTimes}
                    onClick={e => {
                      e.stopPropagation()
                      handleRemoveRow(index)
                    }}
                  />
                )
              }
            </div>
          )
        })
      }
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleAddRow()
        }}
      >
        Add row
      </button>
    </div>
  )
}