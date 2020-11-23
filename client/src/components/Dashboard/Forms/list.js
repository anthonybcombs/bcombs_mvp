import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faCopy } from '@fortawesome/free-solid-svg-icons'
import {
  format,
} from 'date-fns'

import Form from './form'
import cloneDeep from 'lodash.clonedeep'

export default ({
  list, loading, renameModal, cloneModal, deleteModal,
  
  onUpdateList, onCloneForm, onDeleteForm, setRenameModal, setCloneModal, setDeleteModal
}) => {
  const newList = cloneDeep(list)
  const recentList = newList.splice(0, 4)
  const allList = newList

  return (
    <div className='form-list-wrapper'>
      <div className='form-listGroup form-list-recent'>
        <h4 class="sub-header">Recent</h4>
        <div className='form-list'>
          {
            recentList.map((e, index) => {
              return (
                <Form
                  {...e}
                  key={`recent-${index}`}
                  loading={loading}

                  onUpdateList={onUpdateList}
                  onCloneForm={onCloneForm}
                  onDeleteForm={onDeleteForm}

                  renameModal={renameModal}
                  cloneModal={cloneModal}
                  deleteModal={deleteModal}
                  setRenameModal={setRenameModal}
                  setCloneModal={setCloneModal}
                  setDeleteModal={setDeleteModal}
                />
              )
            })
          }
        </div>
      </div>
      <div className='orm-listGroup form-list-all'>
        <h4 class="sub-header">All</h4>
        <div className='form-list'>
          {
            allList.map((e, index) => {
              return (
                <Form
                  {...e}
                  key={`all-${index}`}
                  loading={loading}

                  onUpdateList={onUpdateList}
                  onCloneForm={onCloneForm}
                  onDeleteForm={onDeleteForm}

                  renameModal={renameModal}
                  cloneModal={cloneModal}
                  deleteModal={deleteModal}
                  setRenameModal={setRenameModal}
                  setCloneModal={setCloneModal}
                  setDeleteModal={setDeleteModal}
                />
              )
            })
          }
        </div>
      </div>
    </div>
  )
}