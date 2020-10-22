import React, { useState, useImperativeHandle, useRef, useEffect } from 'react'
import { DragSource, DropTarget, } from 'react-dnd'
import { uuid } from 'uuidv4'
import cloneDeep from 'lodash.clonedeep'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faArrowLeft, faTimes, faCogs, faEdit } from '@fortawesome/free-solid-svg-icons'

import { Items } from './Constants'
import FieldConstructor from './FieldConstructor'
import GeneralSettings from './Settings/GeneralSettings'
import { StandardFields } from './Constants'

const SortableGroup = React.forwardRef(
  ({ 
    connectDragSource, connectDropTarget, connectDragPreview,
    hidden, label, fields, isDragging, id, type: itemGroup,
    onRemoveGroup, settings,
    isActive, onActive, onChangeSettings,
    groupType, onMergeStandardFields, onDuplicateGroup,
    onRemoveGroupField, onUpdateFieldSettings, onChangeGroupName
  }, ref) => {
  
  const [fieldIndex, setActiveFieldIndex] = useState('')
  const [additionalField, handleSelectFieldToAdd] = useState('')
  const [disableDrag, handleDisableDrag] = useState(false)

  const elementRef = useRef(null)
  connectDragSource(!disableDrag ? elementRef : null)
  connectDropTarget(elementRef)
  // connectDragPreview(previewElement)
  const opacity = (isDragging || hidden) ? 0 : 1
  useImperativeHandle(ref, () => ({
    getNode: () => elementRef.current,
  }))

  useEffect((props) => {
    connectDragPreview(getEmptyImage(), { captureDraggingState: true })
    if (!isActive) {
      setActiveFieldIndex('')
    }
  })

  const itemActive = isActive ? 'active' : ''
  const isStandard = groupType === 'standard'
  const gridColRepeat = itemGroup === 'address' ? 4 : 3
  return (
    <div
      ref={elementRef}
      className={`sortableGroup ${itemGroup} ${itemActive}`}
      style={{ opacity }}
      onClick={() => onActive(id)}
    >   
      <p className='sortableGroup-name'>
        <input
          type='text'
          className='field-input'
          value={label}
          onMouseDown={() => handleDisableDrag(true)}
          onBlur={() => handleDisableDrag(false)}
          onChange={({ target }) => onChangeGroupName(target.value || 'Untitled', id)}
        />
      </p>
      <div className='sortableGroup-row' style={{ gridTemplateColumns: `repeat(${gridColRepeat}, 1fr)`}}>
        {
          fields.map((field, index) => {
            const { type = '', tag, options, column, placeholder } = field
            const columnInt = column * 1
            const isActiveField = fieldIndex === index
            if (type !== 'group') {
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
                      isFormBuilder: true,
                      value: placeholder,
                      onMouseDown: () => handleDisableDrag(true),
                      onBlur: () => handleDisableDrag(false),
                      onChange: ({ target }) => onUpdateFieldSettings({ placeholder: target.value }, index, id)
                    })
                  }
                  {
                    (isActive && isActiveField) && (
                      <>
                        {
                          columnInt > 1 && (
                            <FontAwesomeIcon
                              className='minusColumn-icon'
                              icon={faArrowLeft}
                              onClick={e => {
                                e.stopPropagation()
                                onUpdateFieldSettings({ column: (columnInt - 1).toString() }, index, id)
                              }}
                            />
                          )
                        }
                        {
                          columnInt < gridColRepeat && (
                            <FontAwesomeIcon
                              className='addColumn-icon'
                              icon={faArrowRight}
                              onClick={e => {
                                e.stopPropagation()
                                onUpdateFieldSettings({ column: (columnInt + 1).toString() }, index, id)
                              }}
                            />
                          )
                        }
                      </>
                    )
                  }
                  {
                    (isActive && fields.length > 1) &&
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
            } else {
              return options.map(option => {
                return (
                  <div className={`sortableGroup-column`} style={{ gridColumn: `span 3`}}>
                    {
                      FieldConstructor[option.tag]({
                        key: option.tag + uuid(),
                        isFormBuilder: true,
                        ...option
                      })
                    }
                    {
                      options.length > 1 &&
                      (
                        <FontAwesomeIcon
                          className='removeField-icon'
                          icon={faTimes}
                          onClick={e => {
                            e.stopPropagation()
                            // onRemoveGroupField(id, index)
                          }}
                        />
                      )
                    }
                  </div>
                )
              })
            }
          })
        }
        {
          isStandard && (
            <div
              className={`sortableGroup-column`}
              style={{ gridColumn: `span 1`}}
            >
              <div className='field select-field-wrapper'>
                <select
                  id='add-field'
                  className='field-input'
                  defaultValue={additionalField}
                  onChange={({ target }) => {
                    handleSelectFieldToAdd(target.value)
                  }}
                >
                  <option value=''>Select a field to add</option>
                  {
                    StandardFields
                      .filter(e => e.canBeGrouped)
                      .map(e => (
                        <option key={e.type} value={e.type}>{e.label}</option>
                      ))
                  }
                </select>
                <button
                  type='button'
                  className='add-btn'
                  onClick={e => {
                    e.stopPropagation()
                    let newField = StandardFields.find(e => e.type === additionalField)
                    if (newField) {
                      newField = cloneDeep(newField) //avoid mutating the array of objects
                      onMergeStandardFields(id, newField)
                    }
                  }}
                >
                  Add Field
                </button>
              </div>
            </div>
          )
        }
      </div>
      {
        (!isDragging && isActive && !isDragging) &&
        (
          <GeneralSettings
            onChangeSettings={(data) => onChangeSettings({ ...data, id })}
            onRemoveGroup={() => onRemoveGroup(id)}
            onDuplicateGroup={() => onDuplicateGroup(id)}
            settings={settings}
          />
        )
      }
    </div>
  )
})

export default DropTarget([...Object.values(Items.standard), ...Object.values(Items.prime), 'sortableGroup'], {
  hover(props, monitor, component) {
    let source = monitor.getItem()
    let destination = props
    if (!component) {
      return null
    }

    // node = HTML Div element from imperative API
    const node = component.getNode()
    if (!node) {
        return null
    }

    const dragIndex = source.index
    const hoverIndex = destination.index

    if (dragIndex === hoverIndex) {
      return
    }

    const hoverBoundingRect = node.getBoundingClientRect()
    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
    // Determine mouse position
    const clientOffset = monitor.getClientOffset()
    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top
    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%
    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return
    }
    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
    }
    // Time to actually perform the action
    destination.onMoveGroup(dragIndex, hoverIndex, source)
    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    source.index = hoverIndex
  },
  drop(props, monitor) {
    let source = monitor.getItem()
    let destination = props

    if (destination.hidden) {
      destination.onShowHiddenGroup(destination.id)
    }
    // if (source.groupType === 'standard' && destination.groupType === 'standard') {
    //   destination.onMergeStandardFields(destination, source)
    // }
  }
}, (connect) => ({
  connectDropTarget: connect.dropTarget(),
}))(DragSource('sortableGroup', {
  beginDrag: (props, monitor, component) => ({
    index: props.index,
    restProps: props,
    component
  })
}, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
}))(SortableGroup))
