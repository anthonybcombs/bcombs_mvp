import React, { useEffect, useState } from 'react'
import { useDispatch } from "react-redux";
import { useDrop } from 'react-dnd'
import { uuid } from 'uuidv4'
import update from 'immutability-helper'
import cloneDeep from 'lodash.clonedeep'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faCheck, faBars } from '@fortawesome/free-solid-svg-icons'

import { Items } from '../Fields'
import SortableGroup from '../SortableGroup'
import CustomDragLayer from '../CustomDragLayer'

import { requestAddForm, requestUpdateForm, setViewMode } from "../../../../../redux/actions/FormBuilder"
import Loading from '../../../../../helpers/Loading';

export default ({ vendor = {}, user = {}, form_data, isLoading, form_title = 'Untitled', form_id, isFormView, handleBuilderDrawerOpen }) => {
  const dispatch = useDispatch()
  const [droppedFields, setDrop] = useState([])
  const [formTitle, setFormTitle] = useState('Untitled')
  const [hasPageBreak, checkHasPageBreak] = useState(false)
  const [pageBreaks, getPageBreaks] = useState([])
  const [lastField, getLastField] = useState({})

  const reMapFields = (fields, id) => {
    return fields.map(e => ({ ...e, id: `${e.tag}_${id}`, value: '' }))
  }

  const checkPageBreaks = (newFields) => {
    newFields = (newFields || droppedFields)
    const pageBreakFields = newFields.filter(e => e.type === 'pageBreak')
    checkHasPageBreak(!!pageBreakFields.length)
    getPageBreaks(pageBreakFields)
    getLastField(newFields[newFields.length - 1])

    return {
      hasPageBreak: !!pageBreakFields.length,
      lastField: newFields[newFields.length - 1] || {}
    }
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
    } else {
      newFields = newFields.map(e => {
        if (e.id === newField.id) {
          delete e.hidden
        }
        return e
      })
    }

    if (field.type === 'pageBreak' && !hasPageBreak) {
      const { index, ...rest } = field
      newFields.push({ ...rest, id: uuid() })
    }
    setDrop(newFields)
    checkPageBreaks(newFields)
  }

  const handleMoveGroup = (dragIndex, hoverIndex, draggedGroup) => {
    let newFields = [...droppedFields]
    if (dragIndex === undefined) {
      const newField = { ...draggedGroup, fields: reMapFields(draggedGroup.fields, draggedGroup.id) }
      if (droppedFields.find(e => e.isActive)) {
        newFields = update(droppedFields, {
          [droppedFields.findIndex(e => e.isActive)]: { $merge: { isActive: false } }
        })
      }
      newFields.push({ ...newField, hidden: true, isActive: true })

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

  const handleRemoveGroup = (id, type) => {
    let newFields = droppedFields
    if (type === 'pageBreak' && pageBreaks.length === 2) {
      newFields = newFields.filter(e => e.type !== 'pageBreak')
    } else {
      newFields = newFields.filter(e => e.id !== id)
    }
    setDrop(newFields)
    checkPageBreaks(newFields)
  }

  const handleActive = (id) => {
    setDrop(droppedFields.map(e => ({ ...e, isActive: e.id === id })))
  }

  const handleChangeDefaultProps = ({ id, ...rest }) => {
    setDrop(update(droppedFields, {
      [droppedFields.findIndex(e => e.id === id)]: { $merge: rest }
    }))
  }

  const handleChangeGeneralSettings = ({ id, ...rest }) => {
    setDrop(update(droppedFields, {
      [droppedFields.findIndex(e => e.id === id)]: { settings: { $merge: rest } }
    }))
  }

  const handleChangeFieldSettings = (data, index, id) => {
    console.log('kayata', { data, index, id })
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

  const handleClearActive = () => {
    if (droppedFields.find(e => e.isActive)) {
      setDrop(update(droppedFields, {
        [droppedFields.findIndex(e => e.isActive)]: { $merge: { isActive: false } }
      }))
    }
  }

  const handleSubmitForm = () => {
    if (form_id) {
      dispatch(requestUpdateForm({
        form_id,
        form_contents: {
          formTitle,
          formData: droppedFields
        }
      }))
    } else {
      console.log("create form payload")
      dispatch(requestAddForm({
        user: user.user_id,
        vendor: vendor.id,
        form_contents: {
          formTitle,
          formData: droppedFields
        }
      }))
    }
  }

  const handleViewForm = () => {
    if (!form_id) {
      dispatch(requestAddForm({
        user: user.user_id,
        vendor: vendor.id,
        isViewMode: true,
        form_contents: {
          formTitle,
          formData: droppedFields
        }
      }))
    } else {
      dispatch(setViewMode(true))
    }
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

  useEffect(() => {
    if (form_data && form_data.length) {
      setDrop(form_data)
      checkPageBreaks(form_data)
    }
  }, [form_data])

  useEffect(() => {
    if (form_title) {
      setFormTitle(form_title)
    }
  }, [form_title])

  
  useEffect(() => {
    if (form_id && isFormView) {
      window.open(`/form/${form_id}`, '_blank')
      dispatch(setViewMode(false))
    }
  }, [isFormView])

  console.log('toinks', { isFormView, droppedFields, form_data, form_title })

  return ((user && user.user_id && vendor && vendor.id || form_id) && !isLoading) ? (
    <div className='drop-area-wrapper' onClick={handleClearActive}>
      <div ref={drop} className='drop-area-wrapper-droppable'>
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
                // hasPageBreak={hasPageBreak}
                lastField={lastField}
                pageBreaks={pageBreaks}
                onMoveGroup={handleMoveGroup}
                onShowHiddenGroup={handleShowHiddenGroup}
                onRemoveGroup={(id) => handleRemoveGroup(id, fieldProps.type)}
                onActive={handleActive}
                onChangeGeneralSettings={handleChangeGeneralSettings}
                onChangeFieldSettings={handleChangeFieldSettings}
                onMergeStandardFields={handleMergeStandardFields}
                onDuplicateGroup={handleDuplicateGroup}
                onRemoveGroupField={handleRemoveGroupField}
                onChangeGroupName={handleUpdateGroupName}
                onApplyValidationToAll={handleApplyValidationToAll}
                onChangeDefaultProps={handleChangeDefaultProps}
              />
            )
          })
        }
      </div>
      <CustomDragLayer />
      <div className='drop-area-wrapper-actions'>
        <button
          type='button'
          className='btn preview'
          onClick={e => {
            e.stopPropagation()
            handleViewForm()
          }}
        >
          <FontAwesomeIcon
            className='preview-icon'
            icon={faEye}
          />
          <span>View</span>
        </button>
        <button
          type='button'
          className='btn save'
          onClick={e => {
            e.stopPropagation()
            handleSubmitForm()
          }}
        >
          <FontAwesomeIcon
            className='save-icon'
            icon={faCheck}
          />
          <span>Save</span>
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  )
}