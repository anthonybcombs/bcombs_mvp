import React, { useState, useImperativeHandle, useRef, useEffect } from 'react'
import { DragSource, DropTarget, } from 'react-dnd'
import { uuid } from 'uuidv4'
import { getEmptyImage } from 'react-dnd-html5-backend'
import cloneDeep from 'lodash.clonedeep'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGripHorizontal, faTimes, faPlusCircle, faEdit } from '@fortawesome/free-solid-svg-icons'

import { Items, StandardFields } from './Constants'
import FieldConstructor from './FieldConstructor'
import Settings from './Settings'

const SortableGroup = React.forwardRef(
  ({ 
    connectDragSource, connectDropTarget, connectDragPreview,
    hidden, name, fields, isDragging, id,
    onRemoveGroup, settings,
    isActive, onActive, onChangeSettings,
    groupType, onMergeStandardFields, onDuplicateGroup,
    onRemoveGroupField
  }, ref) => {
  const elementRef = useRef(null)
  connectDragSource(elementRef)
  connectDropTarget(elementRef)
  // connectDragPreview(previewElement)
  const opacity = (isDragging || hidden) ? 0 : 1
  useImperativeHandle(ref, () => ({
    getNode: () => elementRef.current,
  }))

  const [fieldColumn, handleFieldColumn] = useState(1)
  const [additionalField, handleSelectFieldToAdd] = useState('')
  const [editFieldDrawerShow, setEditFieldDrawerShow] = useState(false)
  const [addingFieldDrawerShow, setAddingFieldDrawerShow] = useState(false)
  const [editGroupNameDrawerShow, setEditGroupNameDrawerShow] = useState(false)


  useEffect(() => {
    connectDragPreview(getEmptyImage(), { captureDraggingState: true })
  }, [])

  const itemActive = isActive ? 'active' : ''
  const itemGroup = name.toLowerCase().replace(/ +/g, "")
  const isEditFieldDrawerShow = editFieldDrawerShow ? 'show' : ''
  const isAddingFieldDrawerShow = addingFieldDrawerShow ? 'show' : ''
  const isEditGroupNameDrawerShow = editGroupNameDrawerShow ? 'show' : ''

  return (
    <div
      ref={elementRef}
      className={`sortableGroup ${itemGroup} ${itemActive}`}
      style={{ opacity }}
      onClick={() => onActive(id)}
    >   
        {
          !isDragging && groupType === 'standard' && (
            <div className='sortableGroup-actions'>
              <div className='tooltip-wrapper add-field'>
                <FontAwesomeIcon
                  size='2x' 
                  icon={faPlusCircle}
                  className='add-icon'
                  onClick={() => setAddingFieldDrawerShow(!addingFieldDrawerShow) }
                />
                <span className='tooltip'>Add Field</span>
              </div>
              <div className='tooltip-wrapper edit-groupName'>
                <FontAwesomeIcon
                  size='2x' 
                  icon={faEdit}
                  className='edit-icon'
                  onClick={() => setEditGroupNameDrawerShow(!editGroupNameDrawerShow) }
                />
                <span className='tooltip'>Edit Group Name</span>
              </div>
            </div>
          )
        }
        <p className='sortableGroup-name'>{name}
          {`   `}
          <span
            style={{ textTransform: 'lowercase', letterSpacing: 0, color: 'red', cursor: 'pointer'}}
            onClick={() => setEditFieldDrawerShow(!editFieldDrawerShow)}
            >
              Show Edit Fields
          </span>
        </p>
        <div className='sortableGroup-row' style={{ gridTemplateColumns: `repeat(3, 1fr)`}}>
          {
            fields.map(({ key, label, placeholder = '', type = '', tag }, index) => {
              return (
                <div className={`sortableGroup-column`} style={{ gridColumn: `span ${fieldColumn}`}}>
                  {
                    FieldConstructor[tag]({
                      name: key,
                      key: key + uuid(),
                      placeholder,
                      type,
                      label
                    })
                  }
                  {
                    fields.length > 1 &&
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
            })
          }
        </div>
        {
          (!isDragging && isActive && groupType === 'standard') && (
            <>
              {/* Edit Group Name Drawer */}
              <div className={`sortableGroup-drawer ${isEditGroupNameDrawerShow}`}>
                <input
                  type='text'
                  className='field-input'
                  placeholder='Group Name'
                  // value={name}
                  // onChange={() => console.log('eee')}
                />
                <div className='addField-actions'>
                  <button
                    type='button'
                    className='add-btn'
                    onClick={() => setEditGroupNameDrawerShow(!editGroupNameDrawerShow) }
                  >
                    Update
                  </button>
                </div>
              </div>

              {/* Add Fields Drawer */}
              <div className={`sortableGroup-drawer ${isAddingFieldDrawerShow}`}>
                <div className='field select-field-wrapper'>
                  <select
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
                </div>
                <div className='addField-actions'>
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
                  <button
                    type='button'
                    className='close-btn'
                    onClick={() => setAddingFieldDrawerShow(!addingFieldDrawerShow) }
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Edit Fields Drawer */}
              <div className={`sortableGroup-drawer ${isEditFieldDrawerShow}`}>
                <input
                  type='text'
                  className='field-input'
                  placeholder='Edit Placeholder'
                  // value={name}
                  // onChange={() => console.log('eee')}
                />
                <div className='field select-field-wrapper'>
                  <select
                    className='field-input'
                    defaultValue={fieldColumn}
                    onChange={({ target }) => {
                      handleFieldColumn(target.value)
                    }}
                  >
                    <option value=''>Select Field Size</option>
                    <option value='1'>Small</option>
                    <option value='2'>Medium</option>
                    <option value='3'>Large</option>
                  </select>
                </div>
                
                <div className='addField-actions'>
                  <button
                    type='button'
                    className='add-btn'
                    onClick={() => setEditFieldDrawerShow(!editFieldDrawerShow) }
                  >
                    Update
                  </button>
                </div>
              </div>
            </>
          )
        }
        {
          (!isDragging && isActive && !isDragging) &&
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
