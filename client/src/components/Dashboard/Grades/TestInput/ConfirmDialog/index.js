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
          {title}
        </div>

        <div className='modal-container'>
          {content}
        </div>

        <div className='modal-footer'>
          <button
            className='modalBtn cancelBtn'
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className='modalBtn'
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </ConfirmDialogStyled>,
    document.getElementById('modal')
  );
}
