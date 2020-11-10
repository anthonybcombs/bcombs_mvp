import React, { useRef, useEffect, useImperativeHandle } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DragSource, DropTarget, } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faPlus, faBars } from '@fortawesome/free-solid-svg-icons'
import cloneDeep from 'lodash.clonedeep'
import update from 'immutability-helper'

import CustomDragLayer from '../CustomDragLayer'

const SortableItem = DropTarget('sortableItem', {
  hover(props, monitor, component) {
    let source = monitor.getItem()
    let destination = props
    if (!component) {
      return null
    }
    
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
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
    const clientOffset = monitor.getClientOffset()
    const hoverClientY = clientOffset.y - hoverBoundingRect.top
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return
    }
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
    }
    destination.onMoveItem(dragIndex, hoverIndex)
    source.index = hoverIndex
  }
}, (connect) => ({
  connectDropTarget: connect.dropTarget(),
}))(DragSource('sortableItem', {
  beginDrag: ({ index, label }, monitor, component) => ({
    index,
    label,
    component
  })
}, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
}))(
  React.forwardRef(
    ({
      connectDragSource, connectDropTarget, connectDragPreview, label, isDragging
    }, ref) => {
    const elementRef = useRef(null)
    const dropElement = useRef(null)
    connectDragSource(elementRef)
    connectDropTarget(dropElement)
  
    const opacity = (isDragging) ? 0 : 1
    useImperativeHandle(ref, () => ({
      getNode: () => elementRef.current,
    }))

    useEffect(() => {
      connectDragPreview(getEmptyImage(), { captureDraggingState: true })
    })
    
    // Bai clark custom ang drag layer ani
    // Search lang "Custom drag layer for ranking"
    // naa sa CustomDragLayer/index.js
    // ingna lang ko bai if maglibog ka or naay mas dali nga paagi imong makita, di na mogana akong utok haha

    return (
      <div ref={dropElement} style={{ display: 'flex', opacity }}>
        <div ref={elementRef}>
          <FontAwesomeIcon
            icon={faBars}
            className='menu-bar-builder'
          />
        </div>
        <div>{label}</div>
      </div>
    )
  
  })
))

export default ({ items, onChangeFieldSettings, isActive, isBuilder, id: fieldId, onChange, value = [] }) => {
  const newItems = value.length ? value : items

  const handleChangeValues = ({ target: { value } }, index) => {
    onChangeFieldSettings({
      items: items.map((item, i) => ({
        ...item, label: index === i ? value : item.value
      }))
    })
  }

  const handleAddRow = () => {
    onChangeFieldSettings({
      items: [...items, { label: '', rank: items.length + 1 }]
    })
  }

  const handleRemoveRow = (index) => {
    const newItems = cloneDeep(items)
    newItems.splice(index, 1)
    onChangeFieldSettings({ items: newItems.map((e, i) => ({ ...e, rank: i + 1 })) })
  }

  const handleMoveItem = (dragIndex, hoverIndex) => {
    let sortedItems = cloneDeep(newItems)
    const dragItem = sortedItems[dragIndex]
    onChange({ target: { id: fieldId, value: update(sortedItems, {
      $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragItem],
      ],
    }) } })
  }

  return (
    <>
      {
        isBuilder ? (
          <div className='ranking-items'>
            {
              items.map((item, index) => {
                return (
                  <div key={`rankingItems-${index}`} className='ranking-item'>
                    <input
                      type='text'
                      className='field-input'
                      placeholder='Item Label'
                      value={item.label}
                      onChange={(e) => handleChangeValues(e, index)}
                    />
                    {
                      (isActive && items.length > 2) && (
                        <FontAwesomeIcon
                          icon={faTimes}
                          onClick={e => {
                            e.stopPropagation()
                            handleRemoveRow(index)
                          }}
                        />
                      )
                    }
                  </div>
                )
              })
            }
            {
              isActive && (
                <button
                  className='outlined-addBtn'
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddRow()
                  }}
                >
                  <FontAwesomeIcon
                    icon={faPlus}
                    className='addField-icon'
                  />
                  <span>Add row</span>
                </button>
              )
            }
          </div>
        ) : (
          <div>
            <DndProvider backend={HTML5Backend}>
              {
                newItems.map((item, itemIndex) => {
                  return (
                    <SortableItem
                      {...item}
                      key={`sortableItem-${item.rank}`}
                      index={itemIndex}
                      onMoveItem={handleMoveItem}
                    />
                  )
                })
              }
              <CustomDragLayer />
            </DndProvider>
          </div>
        )
      }
    </>
  )
}