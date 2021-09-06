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

.modal-footer:not(.loading) {
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
  max-width: 100px;
  background-color: #f26e21;
  font-size: 0.8em !important;
  border-radius: 0 !important;
  transition: .15s ease-in-out;
}
.submitBtn:hover {
  background: #e47120;
}



@media (max-width: 500px) {
  .modal-content {
    max-width: 300px;
  }
}
`;
export default function index({ onCancel, onSubmit, title = '', loading }) {

  const [formTitle, setFormTitle] = useState(title)

  return ReactDOM.createPortal(
    <RenameModalStyled
      data-testid='app-big-calendar-create-modal'
      className='modal'>
      <div className='modal-content'>
        <div className='modal-header'>
          <h2>Rename form</h2>
          <span
            className="close"
            onClick={onCancel}
          >
            &times;
          </span>
        </div>
        <div className='modal-container'>
          <input
            id='title'
            name='title'
            className='field-input'
            placeholder='Form Title'
            value={formTitle}
            onChange={({ target: { value } }) => setFormTitle(value)}
          />
        </div>
        <div className={`modal-footer ${loading ? 'loading' : ''}`}>
          {
            loading ? (
              <Loading />
            ) : (
              <>
                <button
                  className='submitBtn'
                  onClick={() => {
                    onSubmit(formTitle)
                  }}
                >
                  Submit
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
