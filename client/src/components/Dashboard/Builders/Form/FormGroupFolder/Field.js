import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faArrowLeft, faTimes } from '@fortawesome/free-solid-svg-icons'

import FieldConstructor from '../FieldConstructor'

export default ({
  id, index, field, fieldsCount, isActive, isActiveField, columnInt, isStandard, gridColRepeat,
  setActiveFieldIndex, onActive, onChangeFieldSettings, onRemoveGroupField,
}) => {
  const { tag, column, placeholder, fixedWidth = false } = field
  return (
    <div
      className={`formGroup-column ${isActiveField ? 'active' : ''}`}
      style={{ gridColumn: `span ${column}`}}
      onClick={() => {
        setActiveFieldIndex(index)
        if (!isActive) {
          onActive(id)
        }
      }}
    >
      {
        FieldConstructor[tag]({
          ...field,
          key: field.id,
          isBuilder: true,
          value: placeholder,
          isActive,
          onChangeFieldSettings, // for direct change of fields in the field constructor
          onChange: ({ target }) => onChangeFieldSettings({ placeholder: target.value }, index, id)
        })
      }
    </div>
  )
}