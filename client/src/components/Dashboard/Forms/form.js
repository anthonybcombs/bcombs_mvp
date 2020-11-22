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
  created_at, updated_at, form_contents, form_id, category, forceCloseDialogs, loading, vendor, user,

  onUpdateList, onCloneForm, onDeleteForm
}) => {

  const [renameModal, setRenameModal] = useState(false)
  const [cloneModal, setCloneModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  useEffect(() => {
    if (renameModal && forceCloseDialogs) {
      setRenameModal(false)
    }
  }, [forceCloseDialogs])
  
  const handleClickForm = () => {
    document.getElementById(`trigger-click-${form_id}`).click()
  }

  return (
    <>
      <div
        style={{ border: '1px solid red', padding: '10px' }}
        onClick={handleClickForm}
      >
        {/* START - This is a hidden button to be triggered(click) on clicking the parent div */}
        {/* Reason is window.open will be blocked at some browser */}
        <a id={`trigger-click-${form_id}`} style={{ display: 'none' }} href={`/dashboard/builder/${form_id}/edit`} target='_blank' />
        {/* END  */}

        <div>
          <label>{form_contents.formTitle}</label>
          <FontAwesomeIcon
            className='edit-icon'
            icon={faEdit}
            onClick={e => {
              e.stopPropagation()
              setRenameModal(true)
            }}
          />
        </div>
        <div>
          <span>Created: {format(new Date(created_at), 'MMMM dd, yyyy hh:mm')}</span><br />
          {
            updated_at && <span>Modified: {format(new Date(updated_at), 'MMMM dd, yyyy hh:mm')}</span>
          }
        </div>
        <div>
          <label>{category || 'No Category'}</label>
          <FontAwesomeIcon
            className='copy-icon'
            icon={faCopy}
            onClick={e => {
              e.stopPropagation()
              setCloneModal(true)
            }}
          />
          <FontAwesomeIcon
            className='delete-icon'
            icon={faTrash}
            onClick={e => {
              e.stopPropagation()
              setDeleteModal(true)
            }}
          />
        </div>
      </div>

      {/* Modals */}
      {
        renameModal && (
          <RenameModal
            title={form_contents.formTitle}
            onCancel={() => setRenameModal(false)}
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
        cloneModal && (
          <CloneModal
            title={form_contents.formTitle}
            onCancel={() => setCloneModal(false)}
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
        deleteModal && (
          <DeleteModal
            title={form_contents.formTitle}
            onCancel={() => setDeleteModal(false)}
            loading={loading}
            onSubmit={() => onDeleteForm(form_id)}
          />
        )
      }
    </>
  )
}