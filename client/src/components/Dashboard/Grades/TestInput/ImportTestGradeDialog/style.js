import styled from 'styled-components'

export default styled.div`
  .modal-content {
    position: relative;
    top: 100px;
    width: auto;
    // max-width: 830px;
    max-width: 940px;
    padding: 0;
  }

  .modal-header {
    padding: 1em;
    background-color: #f26e21;
    color: #fff;
  }

  .modal-container {
    padding: 1.5rem;
  }

  .modal-container > div {
    padding: 10px 20px;
  }

  .modal-container li {
    margin: 0 0 3px 0;
  }

  .modal-footer {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: end;
    -webkit-justify-content: flex-end;
    -ms-flex-pack: end;
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

  span {
    padding-left: 0.5rem;
  }

`;