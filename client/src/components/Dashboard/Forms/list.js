import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faCopy } from '@fortawesome/free-solid-svg-icons'
import {
  format,
} from 'date-fns'

export default ({
  list
}) => {

  const recentList = list.splice(0, 4)
  const allList = list

  const handleClickForm = (form_id) => {
    window.open(`/dashboard/builder/${form_id}/edit`, '_blank')
  }

  return (
    <div>
      <div>
        <label>Recent</label>
        <div style={{ display: 'flex' }}>
          {
            recentList.map(({ created_at, updated_at, form_contents, form_id }, index) => {
              return (
                <div
                  key={`recent-${index}`}
                  style={{ border: '1px solid red', padding: '10px' }}
                  onClick={() => handleClickForm(form_id)}
                >
                  <div>
                    <label>{form_contents.formTitle}</label>
                    <FontAwesomeIcon
                      className='edit-icon'
                      icon={faEdit}
                      onClick={e => {
                        e.stopPropagation()
                      }}
                    />
                  </div>
                  <div>
                    <span>Created: {format(new Date(created_at), 'MMMM dd, yyyy')}</span><br />
                    {
                      updated_at && <span>Modified: {format(new Date(updated_at), 'MMMM dd, yyyy')}</span>
                    }
                  </div>
                  <div>
                    <button>
                      <FontAwesomeIcon
                        className='copy-icon'
                        icon={faCopy}
                      />
                      Duplicate Form
                    </button>
                    <button>
                      <FontAwesomeIcon
                        className='delete-icon'
                        icon={faTrash}
                      />
                      Delete Form
                    </button>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
      <div>
        <label>All</label>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {
            allList.map(({ created_at, updated_at, form_contents, form_id }, index) => {
              return (
                <div
                  key={`all-${index}`}
                  style={{ border: '1px solid red', padding: '10px' }}
                  onClick={() => handleClickForm(form_id)}
                >
                  <div>
                    <label>{form_contents.formTitle}</label>
                    <FontAwesomeIcon
                      className='edit-icon'
                      icon={faEdit}
                      onClick={e => {
                        e.stopPropagation()
                      }}
                    />
                  </div>
                  <div>
                    <span>Created: {format(new Date(created_at), 'MMMM dd, yyyy')}</span><br />
                    {
                      updated_at && <span>Modified: {format(new Date(updated_at), 'MMMM dd, yyyy')}</span>
                    }
                  </div>
                  <div>
                    <button>
                      <FontAwesomeIcon
                        className='copy-icon'
                        icon={faCopy}
                      />
                      Duplicate Form
                    </button>
                    <button>
                      <FontAwesomeIcon
                        className='delete-icon'
                        icon={faTrash}
                      />
                      Delete Form
                    </button>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}