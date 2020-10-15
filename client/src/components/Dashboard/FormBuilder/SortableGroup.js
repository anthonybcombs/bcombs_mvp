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
  // const [editGroupNameDrawerShow, setEditGroupNameDrawerShow] = useState(false)

  const [editGroupNameDrawerShow, setEditGroupNameDrawerShow] = useState({
    show: false,
    anchorEl: null
  })


  useEffect(() => {
    connectDragPreview(getEmptyImage(), { captureDraggingState: true })
  }, [])

  const itemActive = isActive ? 'active' : ''
  const itemGroup = name.toLowerCase().replace(/ +/g, "")
  const isEditFieldDrawerShow = editFieldDrawerShow ? 'show' : ''
  const isAddingFieldDrawerShow = addingFieldDrawerShow ? 'show' : ''
  const isEditGroupNameDrawerShow = editGroupNameDrawerShow.show ? 'show' : ''

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
              <div className='tooltip-wrapper tooltip-left add-field'>
                <FontAwesomeIcon
                  size='2x' 
                  icon={faPlusCircle}
                  className='add-icon'
                  onClick={() => setAddingFieldDrawerShow(!addingFieldDrawerShow) }
                />
                <span className='tooltip'>Add Field</span>
              </div>
              <div className='tooltip-wrapper tooltip-left edit-groupName'>
                <FontAwesomeIcon
                  size='2x' 
                  icon={faEdit}
                  className='edit-icon'
                  // onClick={() => setEditGroupNameDrawerShow(!editGroupNameDrawerShow) }
                  onClick={(e) => setEditGroupNameDrawerShow({
                    show: true,
                    anchorEl: e.currentTarget
                  }) }
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
            fields.map((field, index) => {
              const { type = '', tag, options } = field
              if (type !== 'group') {
                return (
                  <div className={`sortableGroup-column`} style={{ gridColumn: `span ${fieldColumn}`}}>
                    {
                      FieldConstructor[tag]({
                        key: tag + uuid(),
                        ...field
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
              } else {
                return options.map(option => {
                  return (
                    <div className={`sortableGroup-column`} style={{ gridColumn: `span 3`}}>
                      {
                        FieldConstructor[option.tag]({
                          key: option.tag + uuid(),
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
        </div>
        {
          (!isDragging && isActive && groupType === 'standard') && (
            <>
              {/* Edit Group Name Drawer */}
              <div className={`sortableGroup-drawer ${isEditGroupNameDrawerShow}`}>
                <div className='field'>
                  <label for='group-name' className='field-label'>Group Name</label>
                  <input
                    type='text'
                    id='group-name'
                    className='field-input'
                    placeholder='Group Name'
                    // value={name}
                    // onChange={() => console.log('eee')}
                  />
                </div>
                <div className='addField-actions'>
                  <button
                    type='button'
                    className='add-btn'
                    // onClick={() => setEditGroupNameDrawerShow(!editGroupNameDrawerShow) }
                    onClick={() => setEditGroupNameDrawerShow({
                      show: false,
                      anchorEl: null
                    }) }
                  >
                    Update
                  </button>
                </div>
              </div>

              {/* Add Fields Drawer */}
              <div className={`sortableGroup-drawer drawer-right ${isAddingFieldDrawerShow}`}>
                <div className='field select-field-wrapper'>
                  <label for='add-field' className='field-label'>Select a field to add</label>
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
              <div className={`sortableGroup-drawer drawer-right ${isEditFieldDrawerShow}`}>
                <div className='field'>
                  <label for='placeholder' className='field-label'>Placeholder</label>
                  <input
                    type='text'
                    id='placeholder'
                    className='field-input'
                    placeholder='Edit Placeholder'
                    // value={name}
                    // onChange={() => console.log('eee')}
                  />
                </div>
                
                <div className='field select-field-wrapper'>
                <label for='column' className='field-label'>Column</label>
                  <select
                    id='column'
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
