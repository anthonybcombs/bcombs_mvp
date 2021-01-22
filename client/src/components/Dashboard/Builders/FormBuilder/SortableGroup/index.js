import React, { useState, useImperativeHandle, useRef, useEffect } from 'react'
import { DragSource, DropTarget, } from 'react-dnd'
import cloneDeep from 'lodash.clonedeep'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGripHorizontal, faTint, faPlus, faCopy, faTrashAlt, faEye, faEyeSlash, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

import { Items, StandardFields } from '../Fields'
import GeneralSettings from '../Settings/GeneralSettings'
import Field from './Field'
import { SketchPicker } from 'react-color'

const SortableGroup = React.forwardRef(
  ({ 
    connectDragSource, connectDropTarget, connectDragPreview,
    onActive, onChangeGeneralSettings,  onMergeStandardFields, onDuplicateGroup,
    onRemoveGroupField, onChangeFieldSettings, onChangeGroupName, onApplyValidationToAll,
    onChangeDefaultProps, errors, format,

    hidden, label, fields, isDragging, id, type: fieldGroupType, gridMax: gridColRepeat,
    includeValidation, isActive, hasSettings, groupType, pageBreaks, lastField = {},
    onRemoveGroup, settings: generalSettings, allowAddField, includeLogic, supportMultiple,
    isMultiple, showLabel, onCheckError, breakedFields, hasPageBreak
  }, ref) => {
  
  const [fieldIndex, setActiveFieldIndex] = useState(0)
  const [additionalField, handleSelectFieldToAdd] = useState('')
  const [enableEditGroupName, handleEnableEditGroupName] = useState(false)
  const [validationAppliedToAll, applyValidationToAll] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const elementRef = useRef(null)
  const dropElement = useRef(null)
  connectDragSource(elementRef)
  connectDropTarget(dropElement)

  const opacity = (isDragging || hidden) ? 0 : 1
  const height = (isDragging || hidden) ? 100 : ''
  useImperativeHandle(ref, () => ({
    getNode: () => elementRef.current,
  }))

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
  const isPageBreak = fieldGroupType === 'pageBreak'
  const pageBreakIndex = isPageBreak ? pageBreaks.findIndex(e => e.id === id) + 1 : 0
  const isLastPageBreak = lastField.id === id && isPageBreak
  const fieldErrors = errors[id] || []
  const hasError = fieldErrors.length > 0
  const fieldSettings = fieldIndex !== '' ? fields[fieldIndex] : {}
  let formatObj = {}
  let color = ''
  let presetColors = []
  let applyToAll = false

  if (format) {
    formatObj = JSON.parse(format)
    color = formatObj?.color || '#000'
    presetColors = [...(formatObj?.presetColors || [])]
    applyToAll = formatObj?.applyToAll || false
  }

  const [colorPickerShown, setColorPickerShown] = useState(false)

  return (
    <div
      className={`sortableGroup ${fieldGroupType} ${isGroupActive}`}
      style={{ opacity, height }}
      onClick={(e) => {
        e.stopPropagation()
        onActive(id)
        setColorPickerShown(false)
      }}
      onMouseOver={() => setShowSettings(true)}
      onMouseLeave={() => setShowSettings(false)}
      ref={!isLastPageBreak ? dropElement : null}
    >
      {
        !isLastPageBreak && (
          <div
            ref={!isLastPageBreak ? elementRef : null}
            className='sortableGroup-dragger'
          >
            <FontAwesomeIcon
              icon={faGripHorizontal}
              className='drag-icon'
            />
          </div>
        )
      }
      <div>
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
            className={`field-input group-name-input-${id} ${showLabel ? 'shown-title' : 'hidden-title'}`}
            value={label}
            disabled={!enableEditGroupName}
            readOnly={!showLabel}
            style={{ color }}
            onBlur={() => {
              handleEnableEditGroupName(false)
            }}
            onChange={({ target }) => onChangeGroupName(target.value || 'Untitled', id)}
            onKeyPress={(e) => console.log('e: ', e)}
          />
          {
            isActive && (
              <div className='title-action editName'>
                <div className='tooltip-wrapper tooltip-left editGroupName'>
                  <FontAwesomeIcon
                    icon={showLabel ? faEye : faEyeSlash}
                    className='show-icon'
                    onClick={e => {
                      e.stopPropagation()
                      onChangeDefaultProps({ showLabel: !showLabel, id, isPageBreak })
                      handleEnableEditGroupName(true)
                      if (!isActive) {
                        onActive(id)
                      }
                    }}
                  />
                  <span className='tooltip'>{`${showLabel ? 'Hide' : 'Show'} Title`}</span>
                </div>
              </div>
            )
          }
          {
            isActive && (
              <div className='title-action'>
                <div className='tooltip-wrapper tooltip-left'>
                  <FontAwesomeIcon
                    icon={faTint}
                    className='show-icon'
                    onClick={e => {
                      e.stopPropagation()
                      setColorPickerShown(!colorPickerShown)
                    }}
                  />
                  <span className='tooltip'>Set Color</span>
                </div>
              </div>
            )
          }
          {
            colorPickerShown && isActive && (
              <div className='colorPicker' onClick={e => e.stopPropagation()}>
                <SketchPicker
                  color={color.length > 0 ? color : "red"}
                  disableAlpha
                  presetColors={presetColors}
                  onChangeComplete={(e) => {
                    presetColors = presetColors.filter(pc => pc !== e.hex)
                    onChangeDefaultProps({
                      id,
                      format: JSON.stringify({
                        ...formatObj,
                        color: e.hex,
                        presetColors: [e.hex, ...presetColors].slice(0, 6)
                      })
                    }, {
                      isColor: true,
                      applyToAll
                    })
                  }}
                />
                <label htmlFor='applyToAll' className={`checkboxContainer`} >
                  <input
                    type='checkbox'
                    id='applyToAll'
                    name='applyToAll'
                    // disabled={!hasSelectedField}
                    checked={applyToAll}
                    onChange={e => {
                      e.stopPropagation()
                      onChangeDefaultProps({
                        id,
                        format: JSON.stringify({
                          ...formatObj,
                          applyToAll: e.target.checked
                        })
                      })
                    }}
                  />
                  <span className='checkmark'/>
                  <div className='tooltip-wrapper' style={{ position: 'absolute', left: '35px' }}>
                    <p className='label'>Apply to all
                      <FontAwesomeIcon className='exclude-global' icon={faQuestionCircle} style={{ marginLeft: '10px' }}/>
                    </p>
                    <span className='tooltip' style={{ top: '-140px' }} >Make sure to tick the apply to all button first, then select the color you want to apply to all headers.</span>
                  </div>
                  {/* <span className='labelName'></span> */}
                </label>
              </div>
            )
          }
        </div>
        {
          isPageBreak && (
            <div className='pageBreak-counter'>
              {pageBreakIndex}/{pageBreaks.length} 
            </div>
          )
        }
      </div>
      <div className='sortableGroup-row' style={{ gridTemplateColumns: `repeat(${gridColRepeat}, 1fr)`}}>
        {
          fields.map((field, index) => {
            const { column } = field
            const columnInt = column * 1
            const isActiveField = fieldIndex === index
            return (
              <Field
                key={`field-${index}`}
                id={id}
                index={index}
                field={field}
                type={fieldGroupType}
                fieldsCount={fields.length}
                isActive={isActive}
                isActiveField={isActiveField}
                columnInt={columnInt}
                isStandard={isStandard}
                gridColRepeat={gridColRepeat}
                errors={errors}
                label={label}
                fieldErrors={fieldErrors}
                hasPageBreak={hasPageBreak}
                pageBreaks={pageBreaks}
                isLastPageBreak={isLastPageBreak}
                format={format}

                setActiveFieldIndex={setActiveFieldIndex}
                onActive={onActive}
                onChangeFieldSettings={(data) => onChangeFieldSettings(data, index, id)}
                onRemoveGroupField={onRemoveGroupField}
                onCheckError={(errArr) => onCheckError(id, errArr)}
              />
            )
          })
        }
        
        {
          (isStandard && allowAddField && !!isActive) &&  (
            <div
              className={`sortableGroup-column addField-column`}
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
              </div>
              <button
                type='button'
                className='outlined-addBtn'
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
        (hasError && !fieldSettings.requireAddOption) && 
          fieldErrors.map((e, i) => {
            return e && <div key={`error-${i}`} className='error groupError'> {e}</div>
          })
      }

      {
        (hasSettings && !isDragging && isActive && !isLastPageBreak) ? (
          <GeneralSettings
            onChangeDefaultProps={(data) => onChangeDefaultProps({ ...data, id })}
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
            onCheckError={(errArr) => onCheckError(id, errArr)}

            fields={fields}
            generalSettings={generalSettings}
            includeLogic={includeLogic}
            includeValidation={includeValidation}
            fieldSettings={fieldSettings}
            hasSelectedField={fieldIndex !== ''}
            allowAddField={allowAddField}
            validationAppliedToAll={validationAppliedToAll}
            showSettings={showSettings}
            isActive={isActive}
            isStandard={isStandard}
            fieldGroupType={fieldGroupType}
            supportMultiple={supportMultiple}
            hasError={hasError}
            fieldErrors={fieldErrors}
            hasPageBreak={hasPageBreak}
            pageBreaks={pageBreaks}
            breakedFields={breakedFields}
          />
        ) : (showSettings && !isLastPageBreak)
            ? (
                <div className='floating-settings-iconActions'>
                  <div className='tooltip-wrapper copy-icon'>
                    <FontAwesomeIcon
                      icon={faCopy}
                      onClick={e => {
                        e.stopPropagation()
                        onDuplicateGroup(id)
                      }}
                    />
                    <span className='tooltip'>Copy</span>
                  </div>
                  <div className='tooltip-wrapper delete-icon'>
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      onClick={e => {
                        e.stopPropagation()
                        onRemoveGroup(id)
                      }}
                    />
                    <span className='tooltip'>Delete</span>
                  </div>
                </div>
              ) : null
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
