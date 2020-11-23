import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faCopy } from '@fortawesome/free-solid-svg-icons'
import {
  format,
} from 'date-fns'

import RenameModal from './Modals/rename'
import CloneModal from './Modals/clone'
import DeleteModal from './Modals/delete'

export default ({
  created_at, updated_at, form_contents, form_id, category, loading, vendor, user,
  renameModal, cloneModal, deleteModal,

  onUpdateList, onCloneForm, onDeleteForm, setRenameModal, setCloneModal, setDeleteModal
}) => {

  // useEffect(() => {
  //   if (renameModal) {
  //     setRenameModal({ bool: false, form_id })
  //   }
  //   if (deleteModal) {
  //     setDeleteModal({ bool: false, form_id })
  //   }
  //   if (deleteModal) {
  //     setDeleteModal({ bool: false, form_id })
  //   }
  // }, [renameModal, cloneModal, deleteModal])
  
  const handleClickForm = () => {
    document.getElementById(`trigger-click-${form_id}`).click()
  }

  return (
    <>
      <div
        className='form-list-item'
        onClick={handleClickForm}
      >
        {/* START - This is a hidden button to be triggered(click) on clicking the parent div */}
        {/* Reason is window.open will be blocked at some browser */}
        <a id={`trigger-click-${form_id}`} style={{ display: 'none' }} href={`/dashboard/builder/${form_id}/edit`} target='_blank' />
        {/* END  */}

        <div className='form-title'>
          <label>{form_contents.formTitle}</label>
          <FontAwesomeIcon
            className='edit-icon'
            icon={faEdit}
            onClick={e => {
              e.stopPropagation()
              setRenameModal({ bool: true, form_id })
            }}
          />
        </div>
        <div className='form-date'>
          <span>Created: {format(new Date(created_at), 'MMMM dd, yyyy hh:mm')}</span><br />
          {
            updated_at && <span>Modified: {format(new Date(updated_at), 'MMMM dd, yyyy hh:mm')}</span>
          }
        </div>
        <div className='form-category'>
          <label>{category || 'No Category'}</label>
          <div className='category-actions'>
            <FontAwesomeIcon
              className='copy-icon'
              icon={faCopy}
              onClick={e => {
                e.stopPropagation()
                setCloneModal({ bool: true, form_id })
              }}
            />
            <FontAwesomeIcon
              className='delete-icon'
              icon={faTrash}
              onClick={e => {
                e.stopPropagation()
                setDeleteModal({ bool: true, form_id })
              }}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {
        (renameModal.bool && renameModal.form_id === form_id) && (
          <RenameModal
            title={form_contents.formTitle}
            onCancel={() => setRenameModal({ bool: false, form_id })}
            loading={loading}
            onSubmit={data => 
              onUpdateList({
                form_contents: { ...form_contents, formTitle: data },
                form_id,
                category
              })
            }
          />
        )
      }
      {
        (cloneModal.bool && cloneModal.form_id === form_id) && (
          <CloneModal
            title={form_contents.formTitle}
            onCancel={() => setCloneModal({ bool: false, form_id })}
            loading={loading}
            onSubmit={data => 
              onCloneForm({
                form_contents: { ...form_contents, formTitle: data },
                category,
                vendor,
                user
              })
            }
          />
        )
      }
      {
        (deleteModal.bool && deleteModal.form_id === form_id) && (
          <DeleteModal
            title={form_contents.formTitle}
            onCancel={() => setDeleteModal({ bool: false, form_id })}
            loading={loading}
            onSubmit={() => onDeleteForm(form_id)}
          />
        )
      }
    </>
  )
}