import styled from "styled-components";

export default styled.div`
  width: auto;
  margin: auto;
  max-width: 1920px;
  background: #fffefe;
  min-height: calc(100vh - 3rem);

  #form {
   
  }
  #form .form-title {
    padding: 1rem;
    color: #f26e21;
    font-weight: 600;    
    font-size: 1.8rem;
    padding-top: 2rem;
    text-align: center;
    background: #ffe5d5;
    padding-bottom: 5rem;
  }
  #form .form-content {
    position: relative;
    top: -55px;

    margin: auto;
    padding: 2rem;
    max-width: 900px;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 3px 6px #ddd;
  }
  #form > div {
    // padding: 1rem;
    // background-color: white;
    // box-shadow: 0 0 25px #eae9e9;
  }
  #form .field-label {
    color: gray;
    font-size: 14px;
    font-weight: 600;
  }
  #form textarea.field-input {
    background: #f4f4f5;
  }
  #form .field-input {
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
  #form .field-input.focus-visible {
    border-bottom: 2px solid #f26e21;
    transition: all .05s linear;
  }
  #form .field-input.hasError {
    border-bottom: 1.65px solid red;
    color: red;
  }
  
  #form div.error {
    color: red;
    font-size: 14px;
  }

  #form .select-field-wrapper {
    position: relative;
  }
  #form .select-field-wrapper:after {
    content: "\f078";
    position: absolute;
    right: 0;
    bottom: 18px;
    font-size: 12px;
    color: #555 !important;
    font-family: "fontawesome";
  }
  #form .select-field-wrapper select {
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
  }
  


  // ===============================================
  // ********* START FORM FIELD GROUPS *********
  // ===============================================

  .formGroup {
    position: relative;
    overflow: hidden;

    padding: 8px;
    background: #fff;
    margin-bottom: 1rem;
    border-radius: 3px;
    border: 1px dashed transparent;
  }
  .formGroup:hover .formGroup-actions >div svg {
    opacity: 1;
    visibility: visible;
    transition: all .15s ease-in-out
  }

  .formGroup-name {
    color: #f26e21;
    margin: 0 0 -10px 0;
    letter-spacing: 1.3px;
  }


  .formGroup-row {
    display: grid;
    align-items: center;
    grid-column-gap: 2%;
    // grid-template-columns: repeat(1, 1fr);
  }


  .formGroup-column {
    position: relative;
    padding-top: 1rem !important;
  }
 

  
  


  // =============================================
  // ********* END FORM FIELD GROUPS *********
  // =============================================




  // ====================================
  // ********* Customs  **********
  // ====================================
  .tooltip-wrapper {
    position: relative;
    margin: 0 3px;
  }
  .tooltip-wrapper .tooltip {
    position: absolute;
    top: -25px;
    left: -8px;
    color: #fff;
    font-size: 12px;
    padding: 3px 9px;
    border-radius: 3px;
    pointer-events: none;
    box-shadow: 0 3px 6px #ddd;
    background: rgb(87 84 84 / 92%);

    opacity: 0;
    visibility: hidden;
    transform: translateY(32px);
    transition: transform .5s cubic-bezier(0,1.62,0.38,0.96),
                opacity .8s cubic-bezier(0,1.62,0.38,0.96),
                visibility 1s cubic-bezier(0,1.62,0.38,0.96)
  }
  .tooltip-wrapper:hover .tooltip {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }


  // checkbox and radiobutton
  .checkboxContainer,
  .radiobuttonContainer {
    position: relative;
    color: #555;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .checkboxContainer.disabled,
  .radioButtonContainer.disabled {
    color: #a99595;
  }

  .checkboxContainer > input[type="checkbox"],
  .radiobuttonContainer > input[type="radio"] {
    width: 16px;
    height: 16px;
    margin: .5rem;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
  }
  .checkboxContainer > label,
  .radioButtonContainer > label {
    cursor: pointer;
  }

  .checkboxContainer:not(.disabled):hover,
  .radioButtonContainer:not(.disabled):hover {
    color: #000;
    transition: all .15s ease-in-out
  }
  .checkmark {
    position: absolute;
    top: 8px;
    left: 8px;
    height: 14px;
    width: 14px;
    border-radius: 2px;
    // background-color: #eee;
    background-color: #fff;
    border: 2px solid #2196F3;
  }
  .checkboxContainer.disabled .checkmark,
  .radioButtonContainer.disabled .checkmark {
    border: 1px solid #a99595;
  }
  /* On mouse-over, add a grey background color */
  .checkboxContainer:hover input ~ .checkmark,
  .radioButtonContainer:hover input ~ .checkmark {
    // background-color: #ccc;
  }

  /* When the checkbox is checked, add a blue background */
  .checkboxContainer input:checked ~ .checkmark {
    background-color: #2196F3;
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  .checkboxContainer input:checked ~ .checkmark:after,
  .radioButtonContainer input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the checkmark/indicator */
  .checkboxContainer .checkmark:after,
  .radioButtonContainer .checkmark:after {
    left: 4px;
    top: 0px;
    width: 3px;
    height: 8px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }



  .radiobuttonContainer .checkmark {
    top: 10px;
    border-radius: 100px;
  }




  // =================================
  // ********* MEDIA QUERIES *********
  // =================================

  @media (max-width: 640px) {
    .formGroup-row {
      display: block;
    }
  }
  
  

`;