import styled from "styled-components";
//  top: 10px;
export default styled.div`
  .modal-content {
    position: relative;
    width: auto;
    top: 100%;
    // max-width: 830px;
    max-width: 940px;
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
    padding: 1.5rem;
  }
  .modal-container table th:last-child {
    max-width: 100px !important;
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

  .populate {
    padding: 8px 0;
    text-align: right;
  }

  .populate label {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .populate label span.labelName {
    padding: 0;
    cursor: pointer;
    margin-left: 10px;
  }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    padding: 1.5rem;
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
  .modalBtn:disabled {
    color: #ccc;
    border: 1px solid #ccc;
    background-color: transparent;
    box-shadow: unset!important;
  }
  .discardAndPreviewBtn:hover {
    background-color: #e26218;
  }
  .cancelBtn {
    color: #f26e21;
    max-width: 80px;
    margin-right: auto;
    border: 1px solid #f26e21;
    background-color: transparent;
  }
  .cancelBtn:hover {
    background-color: rgb(242 110 33 / 5%);
  }

  @media (max-width: 500px) {
    .modal-content {
      max-width: 450px;
    }
  }
`;