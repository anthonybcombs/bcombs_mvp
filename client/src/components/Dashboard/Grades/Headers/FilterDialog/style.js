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
    background-color: #f26e21;
    color: #fff;
  }

  .modal-container {
    padding: 1.5rem;
  }
  .modal-container .tabs {
    display: flex;
    justify-content: space-around;

    background: #F9F9F9;
    padding: 1rem 0 0;
    margin: -1.5rem -1.5rem 1rem;
    border-bottom: 1px solid rgb(128 128 128 / 35%);
  }
  .modal-container .tabs div.filterTab {
    width: 100%;
    color: gray;
    cursor: pointer;
    text-align: center;
    padding: 5px 5px 12px;
    transition: .25s ease-in-out;
  }
  .modal-container .tabs div.filterTab:hover {
    color: #f26e21;;
  }
  .modal-container .tabs div.filterTab.active {
    position: relative;
    color: #f26e21;
    font-weight: bold;
  }
  .modal-container .tabs div.filterTab.active:after {
    content: '';
    position: absolute;
    left: 0;
    width: 100%;
    bottom: -1px;
    height: 2.5px;
    background: #f26e21;
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


  #filterTable th {
    font-size: 14px;
    color: gray;
  }
  #filterTable td.actions >svg {
    margin-left 1rem;
  }


  @media (max-width: 500px) {
    .modal-content {
      max-width: 300px;
    }
  }
`;