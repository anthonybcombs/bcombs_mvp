import React, { useImperativeHandle, useRef, useEffect } from 'react'
import { DragSource, DropTarget, } from 'react-dnd'
import { uuid } from 'uuidv4'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faCog, faArrowsAlt } from '@fortawesome/free-solid-svg-icons'

import { Items } from './Constants'
import FieldConstructor from './FieldConstructor'

const SortableGroup = React.forwardRef(
  ({ 
    connectDragSource,connectDropTarget, connectDragPreview,
    previewStyle = {}, preview = false,
    hidden, name, fields, isDragging, id,
    onRemoveGroup, columnNumber
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


  return (
    <div ref={elementRef} className='sortableGroup' style={{ opacity, ...previewStyle }}>
        {
          !preview && (
            <div className='sortablePreviewActions'>
              <FontAwesomeIcon
                className='info-icon'
                icon={faTimes}
                onClick={() => onRemoveGroup(id)}
              />
              <FontAwesomeIcon
                className='info-icon'
                icon={faCog}
              />
              <FontAwesomeIcon
                className='info-icon'
                icon={faArrowsAlt}
              />
            </div>
          )
        }
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
                key: uuid(),
                placeholder,
                type,
                label
              })
            })
          }
        </div>
      </div>
  )
})

export default DropTarget([...Object.values(Items.standard), ...Object.values(Items.prime), 'sortableGroup'], {
  hover(props, monitor, component) {
    if (!component) {
      return null
    }
    // node = HTML Div element from imperative API
    const node = component.getNode()
    if (!node) {
        return null
    }

    const dragIndex = monitor.getItem().index
    const hoverIndex = props.index

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
    props.onMoveGroup(dragIndex, hoverIndex, monitor.getItem())
    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex
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
