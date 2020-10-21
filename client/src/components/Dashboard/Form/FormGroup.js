import React, { useState } from 'react'
import { uuid } from 'uuidv4'
import cloneDeep from 'lodash.clonedeep'

import FieldConstructor from '../FormBuilder/FieldConstructor'

export default ({ 
  label, fields, fieldState, onChange, type: itemGroup
}) => {
  const gridColRepeat = itemGroup === 'address' ? 4 : 3
  return (
    <div
      className={`sortableGroup`}
    >   
      <p className='sortableGroup-name'>{label}</p>
      <div className='sortableGroup-row' style={{ gridTemplateColumns: `repeat(${gridColRepeat}, 1fr)`}}>
        {
          cloneDeep(fields).map((field, index) => {
            const { type = '', tag, options, column = 1, id: fieldId } = field
            if (type !== 'group') {
              return (
                <div
                  className={`sortableGroup-column`}
                  style={{ gridColumn: `span ${column}`}}
                >
                  {
                    FieldConstructor[tag]({
                      key: fieldId,
                      ...field,
                      value: fieldState[fieldId] || '',
                      onChange
                    })
                  }
                </div>
              )
            } else {
              return options.map(option => {
                return (
                  <div className={`sortableGroup-column`} style={{ gridColumn: `span 3`}}>
                    {
                      FieldConstructor[option.tag]({
                        key: option.tag + uuid(),
                        ...option
                      })
                    }
                  </div>
                )
              })
            }
          })
        }
      </div>
    </div>
  )
}
