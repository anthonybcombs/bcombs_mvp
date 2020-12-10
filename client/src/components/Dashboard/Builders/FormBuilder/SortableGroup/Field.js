import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faArrowLeft, faTimes } from '@fortawesome/free-solid-svg-icons'

import FieldConstructor from '../FieldConstructor'

export default ({
  id, index, field, fieldsCount, isActive, isActiveField, columnInt, isStandard, gridColRepeat, errors, hasPageBreak, pageBreaks, label, isLastPageBreak,
  setActiveFieldIndex, onActive, onChangeFieldSettings, onRemoveGroupField, onCheckError,
}) => {
  const { tag, column, placeholder, fixedWidth = false } = field

  return (
    <div
      className={`sortableGroup-column ${isActiveField ? 'active' : ''}`}
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
          value: tag === 'pageBreak' ? field.value : placeholder,
          isActive,
          errors,
          label,
          
          hasPageBreak,
          pageBreaks,
          isLastPageBreak,

          onCheckError,
          onChangeFieldSettings, // for direct change of fields in the field constructor
          onChange: ({ target }) => onChangeFieldSettings({ placeholder: target.value }, index, id)
        })
      }
      {
        (!fixedWidth && isActive && isActiveField) && (
          <div className='column-adjuster'>
            {
              columnInt > 1 && (
                <div className='tooltip-wrapper tooltip-left'>
                  <FontAwesomeIcon
                    className='minusColumn-icon'
                    icon={faArrowLeft}
                    onClick={e => {
                      e.stopPropagation()
                      onChangeFieldSettings({ column: (columnInt - 1).toString() }, index, id)
                    }}
                  />
                  <span className='tooltip'>Decrease width size</span>
                </div>
              )
            }
            {
              columnInt < gridColRepeat && (
                <div className='tooltip-wrapper tooltip-left'>
                  <FontAwesomeIcon
                    className='addColumn-icon'
                    icon={faArrowRight}
                    onClick={e => {
                      e.stopPropagation()
                      onChangeFieldSettings({ column: (columnInt + 1).toString() }, index, id)
                    }}
                  />
                  <span className='tooltip'>Increase width size</span>
                </div>
              )
            }
          </div>
        )
      }
      {
        (isStandard && isActive && fieldsCount > 1) &&
        (
          <FontAwesomeIcon
            className='removeField-icon'
            icon={faTimes}
            onClick={e => {
              e.stopPropagation()
              onRemoveGroupField(id, index)
            }}
          />
        )
      }
    </div>
  )
}