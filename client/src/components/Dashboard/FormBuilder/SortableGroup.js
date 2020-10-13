import React, { useState, useImperativeHandle, useRef, useEffect } from 'react'
import { DragSource, DropTarget, } from 'react-dnd'
import { uuid } from 'uuidv4'
import { getEmptyImage } from 'react-dnd-html5-backend'
import cloneDeep from 'lodash.clonedeep'

import { Items, StandardFields } from './Constants'
import FieldConstructor from './FieldConstructor'
import Settings from './Settings'

const SortableGroup = React.forwardRef(
  ({ 
    connectDragSource,connectDropTarget, connectDragPreview,
    previewStyle = {}, preview = false,
    hidden, name, fields, isDragging, id,
    onRemoveGroup, settings,
    isActive, onActive, onChangeSettings,
    groupType, onMergeStandardFields, onDuplicateGroup
  }, ref) => {
  const elementRef = useRef(null)
  connectDragSource(elementRef)
  connectDropTarget(elementRef)
  // connectDragPreview(previewElement)
  const opacity = (isDragging || hidden) ? 0 : 1
  useImperativeHandle(ref, () => ({
      getNode: () => elementRef.current,
  }))

  const [additionalField, handleSelectFieldToAdd] = useState('')

  useEffect(() => {
    connectDragPreview(getEmptyImage(), { captureDraggingState: true })
  }, [])

  return (
    <div
      ref={elementRef}
      className={`sortableGroup ${name.toLowerCase().replace(/ +/g, "")}`}
      style={{ opacity, ...previewStyle }}
      onClick={() => onActive(id)}
    >
        <p className='sortableGroup-name'>{name}</p>
        <div className='sortableGroup-row' style={{ gridTemplateColumns: `repeat(3, 1fr)`}}>
          {
            fields.map(({ key, label, placeholder = '', type = '', tag }) => {

              return FieldConstructor[tag]({
                name: key,
                key: key + uuid(),
                placeholder,
                type,
                label
              })
            })
          }
        </div>
        {
          isActive && groupType === 'standard' && (
            <div>
              <select
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
                onClick={e => {
                  e.stopPropagation()
                  let newField = StandardFields.find(e => e.type === additionalField)
                  if (newField) {
                    newField = cloneDeep(newField) //avoid mutating the array of objects
                    onMergeStandardFields(id, newField)
                  }
                }}
              >
                Add
              </button>
            </div>
          )
        }
        {
          (!preview && isActive && !isDragging) &&
          (
            <Settings
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

    // if (source.groupType === 'standard' && destination.groupType === 'standard') {
    //   return null
    // }

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
