import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

const RenameModalStyled = styled.div`
  .modal-body {
    padding: 2rem 25px 2rem;
  }
  .field-input {
    position: relative;

    border: 0;
    cursor: text;
    color: #555;
    width: 100%;
    padding: 5px 0;
    font-size: 16px;
    line-height: 1.8;
    border-radius: 0;
    text-indent: 5px;
    font-family: inherit;
    border-bottom: 1.65px solid #ccc;

    -webkit-appearance: none;
    -moz-appearance: none;
  }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    padding: 1.5rem 1rem;
  }
  .modalBtn {
    width: 100%;
    border: none;
    color: white;
    padding: 10px;
    max-width: 120px;
    margin-left: .5rem;
    background-color: #f26e21;
    font-size: 0.8em !important;
    border-radius: 0 !important;
    transition: .15s ease-in-out;
  }
  .modalBtn:hover {
    box-shadow: 0 3px 3px #ddd;
  }
  .discardAndPreviewBtn:hover {
    background-color: #e26218;
  }
  .saveAndPreviewBtn {
    color: #f26e21;
    border: 1px solid #f26e21;
    background-color: transparent;
  }
  .saveAndPreviewBtn:hover {
    background-color: rgb(242 110 33 / 5%);
  }
  .closeBtn {
    color: #ffffff;
    max-width: 80px;
    margin-right: auto;
    border: 1px solid #bfbfbf;
    background-color: #bfbfbf;
  }
  .closeBtn:hover {
    // background-color: rgb(242 110 33 / 5%);
  }
  .cancelBtn {
    width: 100%;
    color: #f26e21;
    padding: 10px;
    max-width: 80px;
    font-size: 0.8em !important;
    border-radius: 0px !important;
    border: 1px solid #eaedf1;
    background: transparent;
    transition: .15s ease-in-out;
  }
  .cancelBtn:hover {
    font-weight: bold;
    background: #efefef;
  }




  @media (max-width: 500px) {
    .modal-content {
      max-width: 300px;
    }
  }
`;
export default function index({ title, onClose, actions, isError = false }) {

  return ReactDOM.createPortal(
    <RenameModalStyled
      data-testid='app-big-calendar-create-modal'
      className='modal'>
      <div className='modal-content'>
        <div className={`modal-header${isError ? ' error' : ''}`}>
          <h2>{isError ? 'Error' : 'Warning'}</h2>
          <span
            className="close"
            onClick={onClose}
          >
            &times;
          </span>
        </div>
        <div className='modal-body'>
          {title}
        </div>

        <div className='modal-footer'>
          <button
            className='modalBtn closeBtn'
            onClick={onClose}
          >
            Close
          </button>
          {
            actions && actions()
          }
        </div>
      </div>
    </RenameModalStyled>,
    document.getElementById('modal')
  );
}
