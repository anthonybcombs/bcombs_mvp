import styled from 'styled-components'

export default styled.div`
  .modal-content {
    position: absolute;
    top: 30%;
    width: auto;
    // max-width: 830px;
    max-width: 940px;
    padding: 0;
    
    &.export {
      max-width: 500px;

      .modal-container > div {
        padding: 0;
        margin-bottom: 25px;
      }
  
      .form-control {
        display: block;
        width: 100%;
        height: auto;
        padding: 6px 12px;
        font-size: 14px;
        line-height: 1.42857;
        color: rgb(85, 85, 85);
        background-color: rgb(255, 255, 255);
        background-image: none;
        border: 1px solid rgb(204, 204, 204);
        border-radius: 4px;
        box-shadow: rgb(0 0 0 / 8%) 0px 1px 1px inset;
        transition: border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s;
        box-sizing: border-box;
      }
    }

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