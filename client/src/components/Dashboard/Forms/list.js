import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faCopy } from '@fortawesome/free-solid-svg-icons'
import {
  format,
} from 'date-fns'

import Form from './form'
import cloneDeep from 'lodash.clonedeep'

export default ({
  list, forceCloseDialogs, loading,
  
  onUpdateList, onCloneForm, onDeleteForm, onSetForceCloseDialogs
}) => {
  const newList = cloneDeep(list)
  const recentList = newList.splice(0, 4)
  const allList = newList

  return (
    <div>
      <div>
        <label>Recent</label>
        <div style={{ display: 'flex' }}>
          {
            recentList.map((e, index) => {
              return (
                <Form
                  {...e}
                  key={`recent-${index}`}
                  loading={loading}
                  forceCloseDialogs={forceCloseDialogs}

                  onUpdateList={onUpdateList}
                  onCloneForm={onCloneForm}
                  onDeleteForm={onDeleteForm}
                  onSetForceCloseDialogs={onSetForceCloseDialogs}
                />
              )
            })
          }
        </div>
      </div>
      <div>
        <label>All</label>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {
            allList.map((e, index) => {
              return (
                <Form
                  {...e}
                  key={`all-${index}`}
                  loading={loading}
                  forceCloseDialogs={forceCloseDialogs}

                  onUpdateList={onUpdateList}
                  onCloneForm={onCloneForm}
                  onDeleteForm={onDeleteForm}
                  onSetForceCloseDialogs={onSetForceCloseDialogs}
                />
              )
            })
          }
        </div>
      </div>
    </div>
  )
}