import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGripHorizontal } from '@fortawesome/free-solid-svg-icons'

export default ({ fields, label, previewStyle, itemActive }) => {
  const itemGroup = label.toLowerCase().replace(/ +/g, "")
  return (
    <div
      className={`sortableGroup ${itemGroup} ${itemActive}`}
      style={{ ...previewStyle, height: 100 }}
    >   
      <div className='sortableGroup-dragger custom-dragger'>
        <FontAwesomeIcon
          icon={faGripHorizontal}
          className='drag-icon'
        />
      </div>
      <p className='sortableGroup-name'>{label}</p>
      {/* <div className='sortableGroup-row' style={{ gridTemplateColumns: `repeat(3, 1fr)`}}>
        {
          fields.map(({ key, label, placeholder = '', type = '', tag }, index) => {
            return (
              <div className='sortableGroup-column'>
                {
                  FieldConstructor[tag]({
                    name: key,
                    key: key + uuid(),
                    placeholder,
                    type,
                    label
                  })
                }
              </div>
            )
          })
        }
      </div> */}
    </div>
  )
}
