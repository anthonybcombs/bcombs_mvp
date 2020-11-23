import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

const RenameModalStyled = styled.div`
  h2 {
    color: #F26E21;
  }

  .details {
    text-align: justify;
  }

  .modal-footer {
    width: 100%;
    text-align: center
  }

  .closeBtn {
    font-size: 1em;
    color: #fff;
    background-color: #f26e21;
    border-radius: 4px;
    padding: 10px 15px;
    border: 0;
  }

  .modal-content {
    margin: 1em auto;
    padding: 0 2em 1em 2em;
    width: 20%;
    position: relative;
  }
  @media screen and (max-width: 1920px) {
    .modal-content {
      margin: 1.5em auto;
      width: 35%;
    }
    #content {
      justify-content: center;
      display: grid;
      grid-gap: 1%;
      margin: 0 50px;
    }
    button[type='submit'] {
      width: 30%;
    }
  }
  @media screen and (max-width: 1024px) {
    .modal-content {
      margin: 1.5em auto;
      width: 50%;
    }
  }
  @media screen and (max-width: 768px) {
    .modal-content {
      margin: 1.5em auto;
      width: 62%;
    }
  }
`;
export default function index({ onClose }) {

  return ReactDOM.createPortal(
    <RenameModalStyled
      data-testid='app-big-calendar-create-modal'
      className='modal'>
      <div className='modal-content'>
        <h2>
          Please save your changes to enable preview.
        </h2>

        <div className='details'>
          {/* Please save your changes to enable preview. */}
        </div>
        <div className='modal-footer'>
          <button
            className='closeBtn'
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </RenameModalStyled>,
    document.getElementById('modal')
  );
}
