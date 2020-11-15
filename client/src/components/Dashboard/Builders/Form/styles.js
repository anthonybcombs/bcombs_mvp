import styled from "styled-components";

export default styled.div`
  width: auto;
  margin: auto;
  max-width: 1920px;
  background: #fffefe;
  min-height: calc(100vh - 3rem);

  #form {
    min-height: 100vh;
    background-position: center;
    background-image: url(/loginbg.c1f1206f.png);
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

  // wizzard
  #form .wizard-wrapper {
    margin-top: 0;
  }
  .wizard-wrapper .wizard-stepper {
    display: grid;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    padding-inline-start: 0;
    border-bottom: 1px solid #e0e0e0;
  }
  .wizard-wrapper .wizard-stepper li.step {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .wizard-wrapper .wizard-stepper li.step .step-number {
    display: flex;
    align-items: center;
    justify-content: center;
    
    color: #fff;
    width: 35px;
    height: 35px;
    z-index: 2;
    border-radius: 100px;
    background: #E0E0E0;
  }
  .wizard-wrapper .wizard-stepper li.step .step-label {
    color: #E0E0E0;
    margin: .5rem;
    font-weight: 600;
  }
  .wizard-wrapper .wizard-stepper li.step.active .step-number {
    background: #f5812f;
  }
  .wizard-wrapper .wizard-stepper li.step.active .step-label {
    color: #f5812f;
  }
  .wizard-wrapper .wizard-stepper li.step:after {
    content: '';
    position: absolute;
    top: 18px;
    left: 50%;
    z-index: 1;
    width: 100%;
    height: 3px;
    display: block;
    background: #f1f1f1;
  }
  .wizard-wrapper .wizard-stepper li.step:last-child:after {
    display: none;
  }
  .wizard-actions {
    display: flex;
    padding: 1rem;
    background: #f9f9f9;
    margin: 3rem -2rem -2rem;
}
  }
  .wizard-actions button {
    color: #fff;
    margin: 5px;
    border: none;
    padding: 14px 2rem;
    background: #808080;
    border-radius: 3px;
    text-decoration: none;

    display: flex;
    align-items: center;
    transition: all .3s ease-in-out;
  }
  .wizard-actions button.nextBtn,
  .wizard-actions button.submitBtn {
    margin-left: auto;
    background: #f5812f;
  }
  .wizard-actions button.nextBtn svg,
  .wizard-actions button.submitBtn svg {
    margin-left: 8px;
  }
  .wizard-actions button.nextBtn:hover,
  .wizard-actions button.submitBtn:hover {
    background: #e47120;
  }

  .wizard-actions button.prevBtn {
    color: #f5812f;
    background: transparent;
    border: 1px solid #f5812f;
  }
  .wizard-actions button.prevBtn:hover {
    border-color: transparent;
    background: rgb(245 129 47 / 15%);
  }
  .wizard-actions button.prevBtn svg {
    margin-right: 8px;
  }





  // ===============================================
  // ********* START FORM FIELD GROUPS *********
  // ===============================================

  .formGroup {
    position: relative;
    overflow: hidden;

    padding: 0 8px;
    background: #fff;
    // margin-bottom: 2rem;
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
    margin: 1rem 0 -10px 0;
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
  // Section Break
  .formGroup.sectionBreak .formGroup-name {
    font-size: 20px;
    color: #000;
    font-weight: 700;
  }

  // Dropdown
  .formGroup.dropDown .formGroup-row {
    grid-template-columns: repeat(3, 1fr) !important;
  }

  // Checkbox & Radio Button
  .formGroup.checkboxes .formGroup-row >div,
  .formGroup.multipleChoice .formGroup-row >div {
    padding-top: 0 !important;
  }


  // Ranking Question
  .formGroup.ranking .rankingForm .draggable-item {
    display: flex;
    align-items: center;
    margin: 0 0 .5rem;
    cursor: pointer;
  }
  .formGroup.ranking .rankingForm .draggable-item:hover {
    opacity: 0.5;
    transition: .15s ease-in-out;
  }
  .formGroup.ranking .rankingForm .draggable-item .dragger-icon {

  }
  .formGroup.ranking .rankingForm .draggable-item .dragger-icon svg {
    color: grey;
  }
  .formGroup.ranking .rankingForm .draggable-item .label {
    margin-left: 1rem;
  }

  // Rating Question
  .formGroup.rating .ratingForm {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .formGroup.rating .ratingForm .ratingItem {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .formGroup.rating .ratingForm .ratingLabel {
    color: #555;
    margin-bottom: 8px;
  }

  // File Upload
  .formGroup.primeFile .uploadForm {
    position: relative;
    overflow: hidden;
  }
  .formGroup.primeFile:hover .uploadForm:before {
    background: #1388e0;
    transition: .15s ease-in-out;
  }
  .formGroup.primeFile .uploadForm > input {
    width: 100%;
    color: gray;
    font-size: 16px;
    cursor: pointer;
    margin-left: 15px;
    background: #f1f1f1;
    padding: .5rem 1rem .5rem 1rem;
  }
  .formGroup.primeFile .uploadForm:before {
    content: 'Upload';
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    height: 100%;
    color: #fff;
    font-weight: 700;
    z-index: 25;
    font-size: 16px;
    line-height: 56px;
    padding: 0 24px;
    background: #1e98f3;
    text-transform: uppercase;

    display: flex;
    align-items: center;
  }
  .formGroup.primeFile .uploadForm:after {
    content: '';
    position: absolute;
    top: 0;
    left: -70px;
    height: 100%;
    width: 200px;
    background: #f1f1f1;
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
  

  // star rating
  .starRating {
    // width: 208px;
    // height: 40px;
    // margin: 0 auto;
    // padding: 40px 50px;
    // border: 1px solid #cccccc;
    // background: #f9f9f9;
  }
  .starRating label {
    position: relative;
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
  .starRating label:not(:first-of-type) {
    padding-right: 2px;
  }
  .starRating label:before {
    content: "\f005";
    font-size: 24px;
    color: #cccccc;
    line-height: 1;
    font-family: "fontawesome";
  }
  .starRating input {
    display: none;
  }
  .starRating input:checked ~ label:before,
  .starRating:not(:checked) > label:hover:before,
  .starRating:not(:checked) > label:hover ~ label:before {
    color: #2196F3;
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