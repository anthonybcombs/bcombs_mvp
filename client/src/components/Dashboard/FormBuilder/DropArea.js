import React, { useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'
import { uuid } from 'uuidv4'
import update from 'immutability-helper'
import cloneDeep from 'lodash.clonedeep'

import { Items } from './Constants'
import SortableGroup from './SortableGroup'
import CustomDragLayer from './CustomDragLayer'

export default () => {
  const [droppedFields, setDrop] = useState([])

  const handleDrop = (field) => {
    let newFields = [...droppedFields]
    if (!newFields.find(e => e.id === field.id)) {
      if(newFields.find(e => e.isActive)) {
        newFields = update(droppedFields, {
          [droppedFields.findIndex(e => e.isActive)]: { $merge: { isActive: false } }
        })
      }

      newFields.push({ ...field, isActive: true })
      setDrop(newFields)
    } else {
      setDrop(newFields.map(e => {
        if (e.id === field.id) {
          delete e.hidden
        }
        return e
      }))
    }
  }

  const handleMoveGroup = (dragIndex, hoverIndex, draggedGroup) => {
    let newFields = [...droppedFields]
    if (dragIndex === undefined) {
      newFields = update(droppedFields, {
        [droppedFields.findIndex(e => e.isActive)]: { $merge: { isActive: false } },
        $push: [{ ...draggedGroup, hidden: true, isActive: true }]
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

  const handleChangeSettings = ({ id, ...rest }) => {
    setDrop(update(droppedFields, {
      [droppedFields.findIndex(e => e.id === id)]: { settings: { $merge: rest } }
    }))
  }

  const handleMergeStandardFields = (id, source) => {
    setDrop(update(droppedFields, {
      [droppedFields.findIndex(e => e.id === id)]: { fields: { $push: source.fields } }
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

  const handleUpdateFieldSettings = (data, index, id) => {
    setDrop(update(droppedFields, {
      [droppedFields.findIndex(e => e.id === id)]: { fields: { [index]: { $merge: data } } }
    }))
  }

  const handleUpdateGroupName = (label, id) => {
    setDrop(update(droppedFields, {
      [droppedFields.findIndex(e => e.id === id)]: { $merge: { label } }
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

  return (
    <div className='drop-area-wrapper' ref={drop}>
      <div className='form-title'>
        <input
          type='text'
          id='title'
          name='title'
          className='field-input'
          placeholder='Form Title'
          // defaultValue='Untitled Form'
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
              onChangeSettings={handleChangeSettings}
              onMergeStandardFields={handleMergeStandardFields}
              onDuplicateGroup={handleDuplicateGroup}
              onRemoveGroupField={handleRemoveGroupField}
              onUpdateFieldSettings={handleUpdateFieldSettings}
              onChangeGroupName={handleUpdateGroupName}
            />
          )
        })
      }
      <CustomDragLayer />
    </div>
  )
}