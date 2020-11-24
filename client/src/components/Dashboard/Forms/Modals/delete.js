import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

import Loading from '../loading'

const RenameModalStyled = styled.div`
  .modal-content {
    position: relative;
    top: 100px;
    width: auto;
    max-width: 500px;
    padding: 0;
  }
  .close {
    position: absolute;
    top: 5px;
    right: 10px;
    color: #fff;
  }
  .modal-header {
    padding: 1em;
    background-color: #f26e21;
    color: #fff;
  }
  .modal-container {
    background-color: #fff;
    padding: 20px 25px;
    padding-top: 3rem;
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

    padding: 1.5rem;
  }
  .submitBtn {
    width: 100%;
    color: white;
    border: none;
    padding: 10px;
    max-width: 80px;
    margin-left: 1rem;
    background-color: #f26e21;
    font-size: 0.8em !important;
    border-radius: 0 !important;
    transition: .15s ease-in-out;
  }
  .submitBtn:hover {
    background: #e47120;
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
export default function index({ onCancel, onSubmit, title = '', loading }) {

  return ReactDOM.createPortal(
    <RenameModalStyled
      data-testid='app-big-calendar-create-modal'
      className='modal'>
      <div className='modal-content'>
        {/* <span
          className="close"
          onClick={onCancel}
        >
          &times;
        </span> */}
        {/* <h2>Delete form confirmation</h2> */}
        <div className='modal-container'>
          Are you sure you want to delete form {title}?
        </div>
        <div className='modal-footer'>
          {
            loading ? (
              <Loading />
            ) : (
              <>
                <button
                  className='cancelBtn'
                  onClick={onCancel}
                >
                  No
                </button>
                <button
                  className='submitBtn'
                  onClick={onSubmit}
                >
                  Yes
                </button>
              </>
            )
          }
        </div>
      </div>
    </RenameModalStyled>,
    document.getElementById('modal')
  );
}
