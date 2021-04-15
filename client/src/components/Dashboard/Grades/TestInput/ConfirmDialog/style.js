import styled from "styled-components";

export default styled.div`
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
    background-color: #f72121;
    color: #fff;
  }

  .modal-container {
    padding: 1.5rem;
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
    background-color: #f72121;
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
  .cancelBtn {
    color: #f72121;
    max-width: 80px;
    margin-right: auto;
    border: 1px solid #f72121;
    background-color: transparent;
  }
  .cancelBtn:hover {
    background-color: rgb(242 110 33 / 5%);
  }
`;