import React from 'react'
import { uuid } from 'uuidv4'

import FieldConstructor from '../FieldConstructor'

export default ({ fields, name, previewStyle, itemActive }) => {
  const itemGroup = name.toLowerCase().replace(/ +/g, "")
  return (
    <div
      className={`sortableGroup ${itemGroup} ${itemActive}`}
      style={previewStyle}
    >   
        <p className='sortableGroup-name'>{name}</p>
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
