import React from 'react'
import { useDragLayer } from 'react-dnd'

import DraggableField from '../DraggbleField'
import SortableGroup from '../SortableGroup'

import { Items } from '../Constants' 

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
          <SortableGroup
            {...item.restProps}
            key={`preview-${item.restProps.id}`}
            previewStyle={{ width: offsetWidth, border: '1px dashed gray' }}
            preview
          />
        )
      }

      if (Object.values(Items).includes(itemType)) {
        // Temporary style
        // console.log('basin pa diay', {initialOffset, currentOffset})
        // const style = {}
        // return <DraggableField { ...item } previewStyle={style} />
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
