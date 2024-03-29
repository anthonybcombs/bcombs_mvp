import React, { useState, useImperativeHandle, useRef, useEffect } from 'react'
import { DragSource, DropTarget, } from 'react-dnd'
import cloneDeep from 'lodash.clonedeep'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGripHorizontal, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons'

import { Items } from '../Constants'
import GeneralSettings from '../Settings/GeneralSettings'
import { StandardFields } from '../Constants'
import Field from './Field'
import OptionField from './OptionField'

const SortableGroup = React.forwardRef(
  ({ 
    connectDragSource, connectDropTarget, connectDragPreview,
    hidden, label, fields, isDragging, id, type: itemGroup, gridMax: gridColRepeat,
    onRemoveGroup, settings: generalSettings, allowAddField,
    isActive, onActive, onChangeGeneralSettings,
    groupType, onMergeStandardFields, onDuplicateGroup,
    onRemoveGroupField, onChangeFieldSettings, onChangeGroupName,
    onApplyValidationToAll
  }, ref) => {
  
  const [fieldIndex, setActiveFieldIndex] = useState('')
  const [additionalField, handleSelectFieldToAdd] = useState('')
  const [enableEditGroupName, handleEnableEditGroupName] = useState(false)
  const [validationAppliedToAll, applyValidationToAll] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const elementRef = useRef(null)
  const dropElement = useRef(null)
  connectDragSource(elementRef)
  connectDropTarget(dropElement)

  const opacity = (isDragging || hidden) ? 0 : 1
  useImperativeHandle(ref, () => ({
    getNode: () => elementRef.current,
  }))

  const groupTitle = useRef(null)
  useEffect((props) => {
    connectDragPreview(getEmptyImage(), { captureDraggingState: true })
    if (!isActive) {
      setActiveFieldIndex('')
    }
    if (enableEditGroupName) {
      const input = document.querySelector(`.group-name-input-${id}`);
      input.focus();
    }
  })


  const isGroupActive = isActive ? 'active' : ''
  const isStandard = groupType === 'standard'

  return (
    <div
      className={`sortableGroup ${itemGroup} ${isGroupActive}`}
      style={{ opacity }}
      onClick={() => onActive(id)}
      onMouseEnter={() => setShowSettings(true)}
      onMouseLeave={() => setShowSettings(false)}
      ref={dropElement}
    >
      <div ref={elementRef} className='sortableGroup-dragger'>
        <FontAwesomeIcon
          icon={faGripHorizontal}
          className='drag-icon'
        />
      </div>
      <div className='sortableGroup-name'
        onClick={e => {
          e.stopPropagation()
          handleEnableEditGroupName(true)
          if (!isActive) {
            onActive(id)
          }
        }}
      >
        <input
          type='text'
          className={`field-input group-name-input-${id}`}
          value={label}
          disabled={!enableEditGroupName}
          onBlur={() => {
            handleEnableEditGroupName(false)
          }}
          onChange={({ target }) => onChangeGroupName(target.value || 'Untitled', id)}
          onKeyPress={(e) => console.log('e: ', e)}
        />
        {
          (isActive && !enableEditGroupName) && (
            <div className='tooltip-wrapper tooltip-left editGroupName'>
              <FontAwesomeIcon
                icon={faEdit}
                className='edit-icon'
                onClick={e => {
                  e.stopPropagation()
                  handleEnableEditGroupName(true)
                  if (!isActive) {
                    onActive(id)
                  }
                }}
              />
              <span className='tooltip'>Edit Group Name</span>
            </div>
            
          )
        }
      </div>
      <div className='sortableGroup-row' style={{ gridTemplateColumns: `repeat(${gridColRepeat}, 1fr)`}}>
        {
          fields.map((field, index) => {
            const { type = '', tag, options, column, placeholder } = field
            const columnInt = column * 1
            const isActiveField = fieldIndex === index
            if (type !== 'option') {
              return (
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
                  onChangeFieldSettings={onChangeFieldSettings}
                  onRemoveGroupField={onRemoveGroupField}
                />
              )
            } else {
              return (
                <OptionField
                  key={`optionField-${field}`}
                  options={options}
                  id={id}
                  index={index}
                  isActive={isActive}
                  onChangeFieldSettings={onChangeFieldSettings}
                />
              )
            }
          })
        }
        {
          (isStandard && allowAddField && !!isActive) &&  (
            <div
              className={`sortableGroup-column addField-column`}
              style={{ gridColumn: `span 1`}}
            >
              <div className='field select-field-wrapper'>
                {/* <label htmlFor='applyAll'>Select a field to add</label> */}
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
              <button
                type='button'
                className='add-btn'
                onClick={e => {
                  e.stopPropagation()
                  let newField = StandardFields.find(e => e.type === additionalField)
                  if (newField) {
                    const validationDefault = validationAppliedToAll ? fields[0].validation : {}
                    newField = cloneDeep(newField) //avoid mutating the array of objects
                    newField.fields = newField.fields.map(e => ({ ...e, validation: cloneDeep(validationDefault) }))
                    onMergeStandardFields(id, newField)
                  }
                }}
              >
                <FontAwesomeIcon
                  className='addField-icon'
                  icon={faPlus}
                />
                <span>Add Field</span>
              </button>
            </div>
          )
        }
      </div>
      {
        (!isDragging && (showSettings || isActive)) &&
        (
          <GeneralSettings
            onChangeGeneralSettings={(data) => onChangeGeneralSettings({ ...data, id })}
            onChangeFieldSettings={(data) => onChangeFieldSettings(data, fieldIndex, id)}
            onRemoveGroup={() => onRemoveGroup(id)}
            onDuplicateGroup={() => onDuplicateGroup(id)}
            onApplyValidationToAll={(data, checked) => {
              applyValidationToAll(checked)
              if (checked) {
                onApplyValidationToAll(data, id)
              }
            }}
            generalSettings={generalSettings}
            fieldSettings={fieldIndex !== '' ? fields[fieldIndex] : {}}
            hasSelectedField={fieldIndex !== ''}
            allowAddField={allowAddField}
            validationAppliedToAll={validationAppliedToAll}
            showSettings={showSettings}
            isActive={isActive}
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
      // destination.onShowHiddenGroup(destination.id)
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
