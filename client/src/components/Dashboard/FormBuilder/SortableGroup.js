import React, { useState, useImperativeHandle, useRef, useEffect } from 'react'
import { DragSource, DropTarget, } from 'react-dnd'
import { uuid } from 'uuidv4'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGripHorizontal } from '@fortawesome/free-solid-svg-icons'

import { Items } from './Constants'
import FieldConstructor from './FieldConstructor'
import Settings from './Settings'

const SortableGroup = React.forwardRef(
  ({ 
    connectDragSource,connectDropTarget, connectDragPreview,
    previewStyle = {}, preview = false,
    hidden, name, fields, isDragging, id,
    onRemoveGroup, columnNumber, settings,
    isActive, onActive, onChangeSettings,
  }, ref) => {
  const elementRef = useRef(null)
  connectDragSource(elementRef)
  connectDropTarget(elementRef)
  // connectDragPreview(previewElement)
  const opacity = (isDragging || hidden) ? 0 : 1
  useImperativeHandle(ref, () => ({
      getNode: () => elementRef.current,
  }))

  useEffect(() => {
    connectDragPreview(getEmptyImage(), { captureDraggingState: true })
  }, [])

  const itemGroup = name.toLowerCase().replace(/ +/g, "")
  const itemActive = isActive ? 'active' : ''
  return (
    <div ref={elementRef} className={`sortableGroup ${itemGroup} ${itemActive}`} style={{ opacity, ...previewStyle }} onClick={() => onActive(id)}>
        <FontAwesomeIcon
          className='drag-icon'
          icon={faGripHorizontal}
        />
        <p className='sortableGroup-name'>{name}</p>
        <div className='sortableGroup-row' style={{ gridTemplateColumns: `repeat(${columnNumber}, 1fr)`}}>
          {
            fields.map(({ key, label, placeholder = '', type = '', tag, fullWidth }) => {
              // const colNum = columnNumber === 1 ? 1 : columnNumber + 0.5
              // const fieldCustomStyles = {
              //   width: `calc(100% / ${colNum})`,
              // }

              return FieldConstructor[tag]({
                // style: fieldCustomStyles,
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
          (!preview && isActive && !isDragging) &&
          (
            <Settings
              onChangeSettings={(data) => onChangeSettings({ ...data, id })}
              onRemoveGroup={() => onRemoveGroup(id)}
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

    if (source.groupType === 'standard' && destination.groupType === 'standard') {
      destination.onMergeStandardFields(destination, source)
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
  drop(props) {
    if (props.hidden) {
      props.onShowHiddenGroup(props.id)
    }
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
