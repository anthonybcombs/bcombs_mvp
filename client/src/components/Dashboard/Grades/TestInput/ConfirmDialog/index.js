import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

import ConfirmDialogStyled from './style'

export default function index({
  onClose, onConfirm, title = '', content = ''
}) {
  return ReactDOM.createPortal(
    <ConfirmDialogStyled
      data-testid='delete-modal'
      className='modal'>
      <div className='modal-content'>
        <div className='modal-header'>
          <h2>{title}</h2>
          <span className="close" onClick={onClose}>
            &times;
          </span>
        </div>

        <div className='modal-body'>
          {content}
        </div>

        <div className='modal-footer'>
          <button
            className='modalBtn cancelBtn'
            onClick={onClose}
          >
            No
          </button>
          <button
            className='modalBtn'
            onClick={onConfirm}
          >
            Yes
          </button>
        </div>
      </div>
    </ConfirmDialogStyled>,
    document.getElementById('modal')
  );
}
