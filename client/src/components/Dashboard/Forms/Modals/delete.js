import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

import Loading from '../loading'

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
export default function index({ onCancel, onSubmit, title = '', loading }) {

  return ReactDOM.createPortal(
    <RenameModalStyled
      data-testid='app-big-calendar-create-modal'
      className='modal'>
      <div className='modal-content'>
        <h2>
          Delete form confirmation
        </h2>

        <div className='details'>
          Are you sure you want to delete form {title}?
        </div>
        <div className='modal-footer'>
          {
            loading ? (
              <Loading />
            ) : (
              <>
                <button
                  className='closeBtn'
                  onClick={onCancel}
                >
                  Cancel
                </button>
                <button
                  className='submitBtn'
                  onClick={onSubmit}
                >
                  Confirm
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
