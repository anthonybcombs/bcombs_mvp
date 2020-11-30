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
import PreviewWarningModal from '../PreviewWarningModal'

import { requestAddForm, requestUpdateForm } from "../../../../../redux/actions/FormBuilder"
import Loading from '../../../../../helpers/Loading'
import { groupFieldsByPageBreak } from '../../utils'

export default ({ vendor = {}, user = {}, form_data, category = '', isLoading, form_title = 'Untitled', form_id, handleBuilderDrawerOpen }) => {
  const dispatch = useDispatch()
  const [droppedFields, setDrop] = useState([])
  const [formTitle, setFormTitle] = useState('Untitled')
  const [formCategory, setFormCategory] = useState(category)
  const [hasPageBreak, checkHasPageBreak] = useState(false)
  const [pageBreaks, getPageBreaks] = useState([])
  const [lastField, getLastField] = useState({})
  const [fieldHasChanged, setFieldHasChanged] = useState(!form_id)
  const [previewWarning, setPreviewWarning] = useState(false)
  const [previewLabel, setPreviewLabel] = useState('Please save your changes to enable preview.')
  const [errors, setErrors] = useState({})

  const reMapFields = (fields, id) => {
    return fields.map((e, i) => ({ ...e, id: `${e.tag}${i}_${id}`, value: '' }))
  }

  const beforeSetDrop = (fields, changed = true) => {
    setFieldHasChanged(changed)
    setDrop(fields)
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
    beforeSetDrop(newFields)
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
    beforeSetDrop(update(newFields, {
        $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragGroup],
        ],
    }))
  }

  const handleShowHiddenGroup = (id) => {
    beforeSetDrop(droppedFields.map(e => {
      if (e.id === id) {
        delete e.hidden
      }
      return e
    }))
  }

  const handleCheckError = (id, errArr) => {
    if (errArr.length === 0) {
      const newErrors = cloneDeep(errors)
      delete newErrors[id]
      setErrors(newErrors)
      return
    }
    setErrors({
      ...errors,
      [id]: errArr
    })
  }

  const handleRemoveGroup = (id, type) => {
    let newFields = droppedFields
    if (type === 'pageBreak' && pageBreaks.length === 2) {
      newFields = newFields.filter(e => e.type !== 'pageBreak')
    } else {
      newFields = newFields.filter(e => e.id !== id)
    }
    beforeSetDrop(newFields)
    checkPageBreaks(newFields)
    handleCheckError(id, [])
  }

  const handleActive = (id) => {
    setDrop(droppedFields.map(e => ({ ...e, isActive: e.id === id })))
  }

  const handleChangeDefaultProps = ({ id, ...rest }) => {
    beforeSetDrop(update(droppedFields, {
      [droppedFields.findIndex(e => e.id === id)]: { $merge: rest }
    }))
  }

  const handleChangeGeneralSettings = ({ id, ...rest }) => {
    beforeSetDrop(update(droppedFields, {
      [droppedFields.findIndex(e => e.id === id)]: { settings: { $merge: rest } }
    }))
  }

  const handleChangeFieldSettings = (data, index, id) => {
    beforeSetDrop(update(droppedFields, {
      [droppedFields.findIndex(e => e.id === id)]: { fields: { [index]: { $merge: data } } }
    }))
  }

  const handleMergeStandardFields = (id, source) => {
    beforeSetDrop(update(droppedFields, {
      [droppedFields.findIndex(e => e.id === id)]: { fields: { $push: reMapFields(source.fields, source.id) } }
    }))
  }

  const handleDuplicateGroup = (id) => {
    const newField = cloneDeep(droppedFields.find(e => e.id === id))
    beforeSetDrop(update(droppedFields, { $push: [{ ...newField, id: uuid(), isActive: false }] }))
  }

  const handleRemoveGroupField = (id, index) => {
    beforeSetDrop(update(droppedFields, {
      [droppedFields.findIndex(e => e.id === id)]: { fields: { $splice: [[index, 1]] } }
    }))
  }

  const handleUpdateGroupName = (label, id) => {
    beforeSetDrop(update(droppedFields, {
      [droppedFields.findIndex(e => e.id === id)]: { $merge: { label } }
    }))
  }

  const handleApplyValidationToAll = (validation, id) => {
    const fields = cloneDeep(droppedFields.find(e => e.id === id).fields)
    
    beforeSetDrop(update(droppedFields, {
      [droppedFields.findIndex(e => e.id === id)]: { fields: { $set: fields.map(e => ({ ...e, validation })) } }
    }))
  }

  const handleClearActive = () => {
    if (droppedFields.find(e => e.isActive)) {
      beforeSetDrop(update(droppedFields, {
        [droppedFields.findIndex(e => e.isActive)]: { $merge: { isActive: false } }
      }))
    }
  }

  const handleSubmitForm = () => {
    if (Object.keys(errors).length) {
      setPreviewLabel('Please clear all fields/options label errors.') 
      setPreviewWarning(true)
      return
    }
    if (form_id) {
      dispatch(requestUpdateForm({
        form_id,
        category: formCategory,
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
        category: formCategory,
        form_contents: {
          formTitle,
          formData: droppedFields
        }
      }))
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
      beforeSetDrop(form_data, false)
      checkPageBreaks(form_data)
    }
  }, [form_data])

  useEffect(() => {
    if (form_title) {
      setFormTitle(form_title)
    }
  }, [form_title])

  useEffect(() => {
    if (category) {
      setFormCategory(category)
    }
  }, [category])

  console.log('@@@@@FORM BUILD LOGS', { droppedFields })

  return ((user && user.user_id && vendor && vendor.id || form_id) && !isLoading) ? (
    <div className='drop-area-wrapper' onClick={handleClearActive}>
      <div ref={drop} className='drop-area-wrapper-droppable'>
        <div className='form-title'>
          {/* <FontAwesomeIcon
            icon={faBars}
            className='menu-bar-builder'
            onClick={handleBuilderDrawerOpen}
          /> */}
          <input
            type='text'
            id='title'
            name='title'
            className='field-input'
            placeholder='Form Title'
            value={formTitle}
            onChange={({ target }) => setFormTitle(target.value)}
          />
          <div className='field select-field-wrapper'>
            <select
            className='field-input'
              value={formCategory}
              onChange={({ target: { value } }) => setFormCategory(value)}
            >
              <option value=''>Select form category</option>
              <option value='sports'>Sports</option>
              <option value='teaching'>Teaching</option>
            </select>
          </div>
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
                lastField={lastField}
                pageBreaks={pageBreaks}
                errors={errors}
                hasPageBreak={hasPageBreak}
                breakedFields={hasPageBreak ? groupFieldsByPageBreak(droppedFields) : droppedFields}

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
                onCheckError={handleCheckError}
              />
            )
          })
        }
      </div>
      <CustomDragLayer />
      <div className='drop-area-wrapper-actions'>
        {
          !fieldHasChanged ? (
            <a
              type='button'
              className='btn preview'
              target='_blank'
              href={`/form/${form_id}`}
            >
              <FontAwesomeIcon
                className='preview-icon'
                icon={faEye}
              />
              <span>View</span>
            </a>
          ) : (
            <button
              type='button'
              className='btn preview'
              onClick={e => {
                e.stopPropagation()
                setPreviewWarning(true)
              }}
            >
              <FontAwesomeIcon
                className='preview-icon'
                icon={faEye}
              />
              <span>View</span>
            </button>
          )
        }
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
      {
        previewWarning && (
          <PreviewWarningModal
            title={previewLabel}
            onClose={(e) => {
              e.stopPropagation()
              setPreviewWarning(false)
              setPreviewLabel('Please save your changes to enable preview.')
            }}
          />
        )
      }
    </div>
  ) : (
    <Loading />
  )
}