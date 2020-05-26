import React from "react";
import styled from "styled-components";

const ConfirmedModalContainer = styled.div`

  .modal {
    padding: 0;
  }

  .modal-content {
    position: relative;
    top: 100px;
    width: auto;
    max-width: 500px;
  }

  .modal-header {
    padding: 1em;
  }

  .btn-container {
    clear: both;
    display: table;
    content: " ";
    width: 100%;
    padding: 1rem;
    box-sizing: border-box;
  }

  .btn-container button {
    float: right;
    margin-left: 20px;
  }

  button {
    border: 0;
    background: none;
    box-shadow: none;
    border-radius: 0px;
    background-color: #f26e21;
    padding: 10px;
    width: 90px;
    display: block;
    color: white;
    max-width: 200px;
    -webkit-text-decoration: none;
    text-decoration: none;
    text-align: center;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
  }

  button.cancel {
    background-color: white;
    color: #f26e21;
    border: 1px solid #eaedf1;
  }
`;

const ConfirmedModal = ({
  handleOkClick,
  handleCancelClick,
  message
}) => {
  return (
    <ConfirmedModalContainer>
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            {message}
          </div>
          <div className="btn-container">
            <button onClick={handleOkClick}>OK</button>
            <button className="cancel" onClick={handleCancelClick}>Cancel</button>
          </div>
        </div>
      </div>
    </ConfirmedModalContainer>
  );
}

export default ConfirmedModal;