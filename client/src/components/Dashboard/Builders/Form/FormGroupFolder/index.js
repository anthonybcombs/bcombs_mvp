import React, { useState, useImperativeHandle, useRef, useEffect } from 'react'
import { DragSource, DropTarget, } from 'react-dnd'
import cloneDeep from 'lodash.clonedeep'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGripHorizontal, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons'

import { Items, StandardFields } from '../Fields'
import Field from './Field'
import OptionField from './OptionField'

export default ({
  label, fields, fieldState, fieldError, onChange, type: itemGroup, settings, onCheckError
}) => {
  console.log('@settings', { settings, fieldError })
  const gridColRepeat = itemGroup === 'address' ? 4 : 3

  const { validationOptions } = Sources
  const { validation } = settings
  const { include: validate, items } = validation || {}

  const handleChange = ({ target: { id, value } }) => {
    let errors = []
    if (validate) {
      errors = items.map(({ type: itemType, option: itemOption, value: itemValue, error: itemError }) => {
        return !validationOptions[itemType][itemOption].func(
            itemType === 'number' ? value * 1 : value,
            itemType === 'number' ? itemValue * 1 : itemValue
          ) ? itemError : ''
      })
    }
    onChange(id, value)
    onCheckError(id, errors)
  }

  return (
    <div className={`formGroup ${itemGroup}`}>
      <p className='formGroup-name'>{label}</p>
      <div className='formGroup-row' style={{ gridTemplateColumns: `repeat(${gridColRepeat}, 1fr)`}}>
        {
          fields.map((field, index) => {
            const { type = '', tag, options, column, placeholder } = field
            const columnInt = column * 1
            const isActiveField = fieldIndex === index
            if (type !== 'option') {
              return (
                <>
                  <Field
                    key={`field-${index}`}
                    id={id}
                    index={index}
                    field={field}
                    fieldsCount={fields.length}
                    isActive={isActive}
                    isActiveField={isActiveField}
                    columnInt={columnInt}
                    isStandard={isStandard}
                    gridColRepeat={gridColRepeat}
                    setActiveFieldIndex={setActiveFieldIndex}
                    onActive={onActive}
                    onChangeFieldSettings={(data) => onChangeFieldSettings(data, index, id)}
                    onRemoveGroupField={onRemoveGroupField}
                  />
                  {
                    hasError && 
                      errors.map(e => {
                        return e && <div className='error'>- {e}</div>
                      })
                  }
                </>
              )
            } else {
              return (
                <OptionField
                  key={`optionField-${field}`}
                  type={itemGroup}
                  options={options}
                  column={column}
                  id={id}
                  index={index}
                  isActive={isActive}
                  onChangeFieldSettings={onChangeFieldSettings}
                />
              )
            }
          })
        }
      </div>
    </div>
  )
}
