import React, { useEffect, useState } from 'react'
import { useDispatch } from "react-redux";
import { useDrop } from 'react-dnd'
import { uuid } from 'uuidv4'
import update from 'immutability-helper'
import cloneDeep from 'lodash.clonedeep'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faCheck, faBars } from '@fortawesome/free-solid-svg-icons'

import { Items } from './Constants'
import SortableGroup from './SortableGroup'
import CustomDragLayer from './CustomDragLayer'

import { requestAddForm } from "../../../../redux/actions/FormBuilder";

export default ({ handleBuilderDrawerOpen }) => {
  const dispatch = useDispatch()
  const [droppedFields, setDrop] = useState([])
  const [formTitle, setFormTitle] = useState('Untitled')

  const reMapFields = (fields, id) => {
    return fields.map(e => ({ ...e, id: `${e.tag}_${uuid()}_${id}`, value: '' }))
  }

  const handleDrop = (field) => {
    const newField = { ...field, fields: reMapFields(field.fields, field.id) }
    let newFields = [...droppedFields]
    if (!newFields.find(e => e.id === newField.id)) {
      if(newFields.find(e => e.isActive)) {
        newFields = update(droppedFields, {
          [droppedFields.findIndex(e => e.isActive)]: { $merge: { isActive: false } }
        })
      }

      newFields.push({ ...newField, isActive: true })
      setDrop(newFields)
    } else {
      setDrop(newFields.map(e => {
        if (e.id === newField.id) {
          delete e.hidden
        }
        return e
      }))
    }
  }

  const handleMoveGroup = (dragIndex, hoverIndex, draggedGroup) => {
    let newFields = [...droppedFields]
    if (dragIndex === undefined) {
      const newField = { ...draggedGroup, fields: reMapFields(draggedGroup.fields, draggedGroup.id) }
      newFields = update(droppedFields, {
        [droppedFields.findIndex(e => e.isActive)]: { $merge: { isActive: false } },
        $push: [{ ...newField, hidden: true, isActive: true }]
      })

      dragIndex = newFields.length - 1
    }
    const dragGroup = newFields[dragIndex]
    setDrop(update(newFields, {
        $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragGroup],
        ],
    }))
  }

  const handleShowHiddenGroup = (id) => {
    setDrop(droppedFields.map(e => {
      if (e.id === id) {
        delete e.hidden
      }
      return e
    }))
  }

  const handleRemoveGroup = (id) => {
    setDrop(droppedFields.filter(e => e.id !== id))
  }

  const handleActive = (id) => {
    setDrop(droppedFields.map(e => ({ ...e, isActive: e.id === id })))
  }

  const handleChangeGeneralSettings = ({ id, ...rest }) => {
    setDrop(update(droppedFields, {
      [droppedFields.findIndex(e => e.id === id)]: { settings: { $merge: rest } }
    }))
  }

  const handleChangeFieldSettings = (data, index, id) => {
    setDrop(update(droppedFields, {
      [droppedFields.findIndex(e => e.id === id)]: { fields: { [index]: { $merge: data } } }
    }))
  }

  const handleMergeStandardFields = (id, source) => {
    setDrop(update(droppedFields, {
      [droppedFields.findIndex(e => e.id === id)]: { fields: { $push: reMapFields(source.fields, source.id) } }
    }))
  }

  const handleDuplicateGroup = (id) => {
    const newField = cloneDeep(droppedFields.find(e => e.id === id))
    setDrop(update(droppedFields, { $push: [{ ...newField, id: uuid(), isActive: false }] }))
  }

  const handleRemoveGroupField = (id, index) => {
    setDrop(update(droppedFields, {
      [droppedFields.findIndex(e => e.id === id)]: { fields: { $splice: [[index, 1]] } }
    }))
  }

  const handleUpdateGroupName = (label, id) => {
    setDrop(update(droppedFields, {
      [droppedFields.findIndex(e => e.id === id)]: { $merge: { label } }
    }))
  }

  const handleApplyValidationToAll = (validation, id) => {
    const fields = cloneDeep(droppedFields.find(e => e.id === id).fields)
    
    setDrop(update(droppedFields, {
      [droppedFields.findIndex(e => e.id === id)]: { fields: { $set: fields.map(e => ({ ...e, validation })) } }
    }))
  }

  const [{ item, didDrop }, drop] = useDrop({
    accept: [...Object.values(Items.standard), ...Object.values(Items.prime)],
    drop: () => handleDrop(item, didDrop),
    collect: monitor => {
      return {
        isOver: !!monitor.isOver(),
        item: monitor.getItem()
      }
    },
  })
  console.log('droppedFields', droppedFields)
  return (
    <>
      <div className='drop-area-wrapper' ref={drop}>
        <div className='form-title'>
          <FontAwesomeIcon
            icon={faBars}
            className='menu-bar-builder'
            onClick={handleBuilderDrawerOpen}
          />
          <input
            type='text'
            id='title'
            name='title'
            className='field-input'
            placeholder='Form Title'
            value={formTitle}
            onChange={({ target }) => setFormTitle(target.value)}
          />
        </div>
        {
          droppedFields.length === 0 && (
            <div className='empty-area'>Drag fields here.</div>
          )
        }
        {
          droppedFields.map((fieldProps, index) => {
            return (
              <SortableGroup
                {...fieldProps}
                key={fieldProps.id}
                index={index}
                onMoveGroup={handleMoveGroup}
                onShowHiddenGroup={handleShowHiddenGroup}
                onRemoveGroup={handleRemoveGroup}
                onActive={handleActive}
                onChangeGeneralSettings={handleChangeGeneralSettings}
                onChangeFieldSettings={handleChangeFieldSettings}
                onMergeStandardFields={handleMergeStandardFields}
                onDuplicateGroup={handleDuplicateGroup}
                onRemoveGroupField={handleRemoveGroupField}
                onChangeGroupName={handleUpdateGroupName}
                onApplyValidationToAll={handleApplyValidationToAll}
              />
            )
          })
        }
        <CustomDragLayer />
        <div className='drop-area-wrapper-actions'>
          {
            droppedFields.length > 0 && (
              <>
                <a
                  type='button'
                  target='_blank'
                  className='btn preview'
                  href={`/form/test123?formData=${JSON.stringify(droppedFields)}&formTitle=${formTitle}`}
                >
                  <FontAwesomeIcon
                    className='preview-icon'
                    icon={faEye}
                  />
                  <span>View</span>
                </a>
                <button
                  type='button'
                  target='_blank'
                  className='btn save'
                  onClick={() => {
                    dispatch(requestAddForm({
                      formTitle,
                      formData: droppedFields
                    }))
                  }}
                >
                  <FontAwesomeIcon
                    className='save-icon'
                    icon={faCheck}
                  />
                  <span>Save</span>
                </button>
              </>
            )
          }
        </div>
      </div>
      
    </>
  )
}