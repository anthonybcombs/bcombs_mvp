import React from 'react'
import { useDragLayer } from 'react-dnd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import CustomDraggable from './CustomDraggable'

import { Items } from '../Fields' 

const layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0
}
const getItemStyles = (initialOffset, currentOffset) => {
    if (!initialOffset || !currentOffset) {
        return {
            display: 'none',
        }
    }
    let { x, y } = currentOffset
    const transform = `translate(${x}px, ${y}px)`
    return {
        transform,
        WebkitTransform: transform,
    }
}
export default () => {
    const { itemType, isDragging, item, initialOffset, currentOffset } = useDragLayer((monitor) => ({
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging()
    }))

    const renderItem = () => {     
      if (itemType === 'sortableGroup') {
        const offsetWidth = item.component.getNode().getBoundingClientRect().width - 35
        return (
          <CustomDraggable
            {...item.restProps}
            key={`preview-${item.restProps.id}`}
            previewStyle={{ width: offsetWidth, border: `1px dashed #f5812f` }}
            preview
          />
        )
      }

      if (itemType === 'sortableItem') {
        return (
          <div className='draggable-item'>
            <div className='dragger-icon'>
              <FontAwesomeIcon
                icon={faBars}
                className='menu-bar-builder'
              />
            </div>
            <div className='label'>{item.label}</div>
          </div>
        )
      }

      if ([...Object.values(Items.standard), ...Object.values(Items.prime)].includes(itemType)) {
        return null
      }
    }
    if (!isDragging) {
        return null
    }
    return (<div style={layerStyles}>
			<div style={getItemStyles(initialOffset, currentOffset)}>
				{renderItem()}
			</div>
		</div>)
}
