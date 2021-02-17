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
    background-color: #fff;
    padding: 20px 25px;
    padding-top: 3rem;
  }
  .modal-container .tabs {
    display: flex;
    justify-content: left;
  }
  .modal-container .tabs div.filterTab {
    padding: 5px;
    border: 1px solid #000;
    background-color: #eee;
    cursor: pointer;
  }
  .modal-container .tabs div.filterTab.active {
    background-color: #fff;
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
  .saveAndPreviewBtn {
    color: #f26e21;
    border: 1px solid #f26e21;
    background-color: transparent;
  }
  .saveAndPreviewBtn:hover {
    background-color: rgb(242 110 33 / 5%);
  }
  .closeBtn {
    color: #f26e21;
    max-width: 80px;
    margin-right: auto;
    border: 1px solid #f26e21;
    background-color: transparent;
  }
  .closeBtn:hover {
    background-color: rgb(242 110 33 / 5%);
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