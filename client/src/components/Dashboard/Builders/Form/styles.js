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
    bottom: 1px;
    font-size: 10px;
    color: #555 !important;
    font-family: "fontawesome";

    width: 20px;
    height: 25px;
    padding-top: 10px;
    padding-left: 9px;
    background: #fff;
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
    margin-bottom: 2rem;
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
    margin: 0;
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


  // ********* Specific Group Fields  **********
    // Dropdown
  .formGroup.dropDown .formGroup-row {
    grid-template-columns: repeat(3, 1fr) !important;
  }

    // Checkbox & Radio Button
  .formGroup.checkboxes .formGroup-row >div,
  .formGroup.multipleChoice .formGroup-row >div {
    padding-top: 0 !important;
  }


  // Linear Scale
  .formGroup.linearScale .scaleForm,
  .formGroup.linearScale .scaleForm .scaleForm-choices {
    display: flex;
    align-items: center
  }
  .formGroup.linearScale .scaleForm .scaleForm-choices {
    margin: 1rem .5rem;
  }
  .formGroup.linearScale .scaleForm p {
    margin: 0;
  }
  .formGroup.linearScale .scaleForm .scaleForm-value {
    margin: 2px;
    text-align: center;
  }
  .formGroup.linearScale .scaleForm .scaleForm-value label {
    right: -9px;
  }
  .formGroup.linearScale .scaleForm .scaleForm-value label > span {
    position: relative;
    top: -22px;
    left: -22px;
    color: grey;
  }
  .formGroup.linearScale .scaleForm .scaleForm-value:last-child label > span {
    left: -28px;
  }


  // Matrix/Rating
  .matrixRating-container .table-scroll-wrapper {
    width: 100%;
    overflow-x: auto;
    max-width: unset;
  }
  .matrixRating-container .table-scroll-wrapper::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  .matrixRating-container .table-scroll-wrapper::-webkit-scrollbar-track {
    border-radius: 10px;
    transition: 0.5s ease-in-out;
    background: rgb(243 110 34 / 20%);
  }
  .matrixRating-container .table-scroll-wrapper::-webkit-scrollbar-thumb {
    background: #f36e22;
    border-radius: 10px;
  }

  .matrixRating-table {
    width: 100%;
    border-collapse: collapse;
    border: 0;
    margin-bottom: 32px;
    table-layout: auto;
  }
  .matrixRating-table > thead > tr th.column-head {
    color: #555;
    max-width: 150px;
    min-width: 100px;
    padding: 0 .5rem;
  }
  .matrixRating-table > thead > tr th.column-head input {
    font-weight: bold;
    text-align: center;
    color: #000 !important;
  }
  .matrixRating-table > tbody > tr.choiceRow {
    height: 50px;
  }
  .matrixRating-table > tbody > tr.choiceRow:nth-child(odd) {
    background: #f1f1f1;
  }
  .matrixRating-table > tbody > tr td.removeStatement svg {
    color: #f44336;
    cursor: pointer;
    padding: 8px 10px;
    border-radius: 100px;
  }
  .matrixRating-table > tbody > tr td.removeStatement {
    width: 10px !important;
  }
  .matrixRating-table > tbody > tr td input {
    width: 200px !important;
  }

  .matrixRating-table > tbody > tr td .checkboxContainer,
  .matrixRating-table > tbody > tr td .radiobuttonContainer {
    justify-content: center;
  }
  .matrixRating-table > tbody > tr td .checkboxContainer span.checkmark {
    left: unset;
  }
  .matrixRating-table > tbody > tr td .radiobuttonContainer label {
    top: -10px;
  }


  .matrixRating-table > tbody > tr td >div.actions {
    display: flex;
    position: relative;
    left: 37px;
    top: 5px;
  }
  .matrixRating-table > tbody > tr td >div.actions .outlined-addBtn {
    padding: 8px 17px !important;
    margin: 0 8px!important;
    white-space: pre;
  }
  .matrixRating-table > tbody > tr td >div.removeScale {
    width: 88px !important;
  }
  .matrixRating-table > tbody > tr td >div.removeScale svg {
    color: #f44336;
    cursor: pointer;
    padding: 8px 10px;
    border-radius: 100px;
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


  // checkbox
  .checkboxContainer{
    position: relative;
    color: #555;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  .checkboxContainer.disabled {
    color: #a99595;
  }
  .checkboxContainer > input[type="checkbox"] {
    width: 16px;
    height: 16px;
    margin: .5rem;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
  }
  .checkboxContainer > label{
    cursor: pointer;
  }
  .checkboxContainer:not(.disabled):hover {
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
    background-color: #fff;
    border: 1px solid #2196F3;
  }
  .checkboxContainer.disabled .checkmark {
    border: 1px solid #a99595;
  }
  /* On mouse-over, add a grey background color */
  .checkboxContainer:hover input ~ .checkmark {
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
  .checkboxContainer input:checked ~ .checkmark:after {
    display: block;
  }
  /* Style the checkmark/indicator */
  .checkboxContainer .checkmark:after  {
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


  // radio button
  .radiobuttonContainer {
    display: flex;
    align-items: center;
    height: 32px;
  }
  .radiobuttonContainer [type="radio"]:checked,
  .radiobuttonContainer [type="radio"]:not(:checked) {
      position: absolute;
      left: -9999px;
  }
  .radiobuttonContainer [type="radio"]:checked + label,
  .radiobuttonContainer [type="radio"]:not(:checked) + label {
      position: relative;
      padding-left: 28px;
      cursor: pointer;
      line-height: 20px;
      display: inline-block;
      color: #555;
  }
  .radiobuttonContainer [type="radio"]:checked + label:hover,
  .radiobuttonContainer [type="radio"]:not(:checked) + label:hover {
    color: #000;
    transition: all .15s ease-in-out;
  }
  .radiobuttonContainer [type="radio"]:checked + label:before,
  .radiobuttonContainer [type="radio"]:not(:checked) + label:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 18px;
      height: 18px;
      background: #fff;
      border-radius: 100%;
      border: 1px solid #1e98f3;
  }
  .radiobuttonContainer [type="radio"]:checked + label:after,
  .radiobuttonContainer [type="radio"]:not(:checked) + label:after {
      content: '';
      width: 12px;
      height: 12px;
      background: #2097f3;
      position: absolute;
      top: 4px;
      left: 4.3px;
      border-radius: 100%;
      -webkit-transition: all 0.2s ease;
      transition: all 0.2s ease;
  }
  .radiobuttonContainer [type="radio"]:not(:checked) + label:after {
      opacity: 0;
      -webkit-transform: scale(0);
      transform: scale(0);
  }
  .radiobuttonContainer [type="radio"]:checked + label:after {
      opacity: 1;
      -webkit-transform: scale(1);
      transform: scale(1);
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