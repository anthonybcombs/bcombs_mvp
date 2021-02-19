import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import FilterDialogStyled from './style'
import Filters from './filters'

export default function index({
  title, actions, activeFilter, filterOptions, enableClearFilter, filters, previousFilter, columns, rows, filterErrors,
  onClose, onChangeActiveFilter, onChangeFilter
}) {
  return ReactDOM.createPortal(
    <FilterDialogStyled
      data-testid='app-big-calendar-create-modal'
      className='modal'>
      <div className='modal-content'>
        <div className='modal-header'>
          {title}
        </div>

        <div className='modal-container'>
          <div className='tabs'>
            {
              filterOptions.map((options, index) => {
                return (
                  <div
                    key={`filterTab-${index}`}
                    className={`filterTab ${options.key === activeFilter ? 'active' : ''}`}
                    onClick={() => onChangeActiveFilter(options.key)}
                  >
                    {options.label}
                  </div>
                )
              })
            }
          </div>
          <Filters
            activeFilter={activeFilter}
            filters={filters}
            columns={columns}
            rows={rows}
            onChangeFilter={onChangeFilter}
          />
          {
            filterErrors.length > 0 && (
              filterErrors.map(e => (
                <div>{e}</div>
              ))
            )
          }
        </div>

        <div className='modal-footer'>
          <button
            className='modalBtn cancelBtn'
            onClick={onClose}
          >
            Cancel
          </button>
          {
            actions && actions()
          }
        </div>
      </div>
    </FilterDialogStyled>,
    document.getElementById('modal')
  );
}
