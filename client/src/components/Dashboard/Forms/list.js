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
  
  onUpdateList, onCloneForm, onDeleteForm, setRenameModal, setCloneModal, setDeleteModal,

  vendor
}) => {
  const newList = cloneDeep(list)
  const recentList = newList.splice(0, 4)
  const allList = cloneDeep(list)

  return (
    <div className='form-list-wrapper'>
      <div className='form-listGroup form-list-recent'>
        <h4 className="sub-header">Recent</h4>
        <div className='form-list'>
          {
            recentList.length === 0
              ? 'No form found.'
              :  recentList.map((e, index) => {
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
                      vendor={vendor}
                    />
                  )
                })
          }
        </div>
      </div>
      <div className='orm-listGroup form-list-all'>
        <h4 className="sub-header">All</h4>
        <div className='form-list'>
          {
            allList.length === 0
              ? 'No form found.'
              :  allList.map((e, index) => {
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
                        vendor={vendor}
                      />
                    )
                  })
          }
        </div>
      </div>
    </div>
  )
}