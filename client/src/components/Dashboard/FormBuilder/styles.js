import styled from "styled-components";

export default styled.div`
  width: auto;
  margin: auto;
  max-width: 1920px;
  padding: 0rem 3em 2rem;

  #formBuilder {
    display: grid;
    grid-gap: 3%;
  }
  #formBuilder > div {
    padding: 1rem;
    background-color: white;
    box-shadow: 0 0 25px #eae9e9;
  }
  #formBuilder textarea.field-input {
    background: #f4f4f5;
  }
  #formBuilder .field-input {
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
  #formBuilder .select-field-wrapper {
    position: relative;
  }
  #formBuilder .select-field-wrapper:after {
    content: "\f078";
    position: absolute;
    right: 0;
    bottom: 18px;
    font-size: 12px;
    color: #555 !important;
    font-family: "fontawesome";
  }
  #formBuilder .select-field-wrapper select {
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
  }
  

  .drag-area-wrapper .header {
    position: relative;
    margin-bottom: 2rem;
    font-weight: 100;
    color: gray;
  }
  .drag-area-wrapper .header:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 80px;
    height: 5px;
    background: #f5812f;
  }
  .drag-area-wrapper .sub-header {
    margin: 0;
    font-weight: 100;
    padding-bottom: 1rem;
    text-transform: uppercase;
  }

  .drag-area-wrapper .draggble-container {
    display: grid;
    grid-column-gap: 2%;
    grid-template-columns: 1fr 1fr;

    margin-bottom: 2.5rem;
  }
  .draggble-container.prime-items .draggble-item > svg {
    width: 12px;
    height: 12px;
    padding: 5px;
    color: #ffffff;
    border-radius: 100px;
    background: #f5812f;
  }

  .draggble-container .draggble-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    
    cursor: grab;
    padding: 1rem;
    overflow: hidden;
    margin: 0 0 4px 0;
    border-radius: 4px;
    text-transform: uppercase;
    border: 1px solid #EAEAEA;
    box-shadow: 0 2px 6px rgb(0 0 0 / 8%);
  }
  .draggble-container .draggble-item > svg {
    padding: 0 8px;
    color: #f5812f;
  }
  .draggble-container .draggble-item > span {
    margin-left: .5rem;
    letter-spacing: 1px;
    font-size: 12px;
    max-width: 150px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .draggble-container .draggble-item:before {
    content: '';
    position: absolute;
    left: -5px;
    
    width: 5px;
    height: 100%;
    background:  #f5812f;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .draggble-container .draggble-item:hover:before {
    left: 0;
    transition: all .15s ease-in-out;
  }
  .draggble-container .draggble-item:hover > svg {
    transform: translate(3px, 0);
    transition: all .15s ease-in-out;
  }
  .draggble-container .draggble-item:hover > span {
    color: #f5812f;
    font-weight: 600;
    transform: translate(3px, 0);
    transition: all .15s ease-in-out;
  }


  .drop-area-wrapper {
    padding: 1.5rem !important;
  }
  .drop-area-wrapper .form-title {
    padding: 0 8px;
  }
  .drop-area-wrapper .form-title > input {
    margin-bottom: 1rem;
    font-weight: bold;
    font-size: 18px !important;
  }

  // ===============================================
  // ********* START SORTABLE FIELD GROUPS *********
  // ===============================================

  .sortableGroup {
    position: relative;

    cursor: move;
    padding: 8px;
    background: #fff;
    margin-bottom: 1rem;
    border-radius: 3px;
    border: 1px dashed transparent;
  }
  .sortableGroup:hover,
  .sortableGroup.active {
    background: #fff;
    border-radius: 3px;
    border-color: #f5812f;
    box-shadow: 0 3px 6px 3px #ddd;
    transition: all .15s ease-in-out
  }
  .sortableGroup:hover >svg.drag-icon {
    opacity: 1;
    visibility: visible;
    transition: all .15s ease-in-out
  }

  // specific for ADDRESS ROW
  .sortableGroup.address .sortableGroup-row {
    grid-template-columns: repeat(2, 1fr) !important;
  }
  .sortableGroup.address .sortableGroup-row .field-input:nth-child(1),
  .sortableGroup.address .sortableGroup-row .field-input:nth-child(2) {
    grid-column: span 2; /* Spans two columns */
  }

  .sortableGroup >svg.drag-icon {
    position: absolute;
    right: 12px;
    cursor: move;
    color: #f5812f;
    font-size: 18px;
    padding: 8px 9px;
    cursor: row-resize;
    border-radius: 100px;

    opacity:0;
    visibility: hidden;
  }
  .sortableGroup >svg.drag-icon:hover {
    background: #f4f4f5;
    transition: all .15s ease-in-out
  }
  .sortableGroup-name {
    margin: 0;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  .sortableGroup-row {
    display: grid;
    align-items: center;
    grid-column-gap: 2%;
    // grid-template-columns: repeat(1, 1fr);
  }
  .sortableGroup-row .field-input {
    padding-top: 1rem !important;
  }


  .sortableGroup:hover > .sortablePreviewActions {
    display: block;
  }
  .sortablePreviewActions {
    position: absolute;
    right: 5px;
    top: 0;
    display: none;
    cursor: pointer;
  }
  .sortablePreviewActions svg {
    width: 18px;
    height: 18px;
    padding: 10px;
    border-radius: 100px;
  }
  .sortablePreviewActions svg:hover {
    background: #f5f5f5;
    box-shadow: 0 2px 6px #dddd;
    transition: all .25s ease-in-out
  }
  .sortablePreviewActions svg:first-child {
    color: red;
  }
  .sortablePreviewActions svg:last-child {
    color: #504c4c;
  }


  .group-settings {
    margin-top: 3rem;
  }
  .group-settings .settings-validation {
    display: grid;
    grid-gap: 2%;
    margin-bottom: 1rem;
    grid-template-columns: repeat(4, 1fr);
  }
  .group-settings .settings-control {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;

    padding: 1rem;
    margin: 5px -8px -8px;
    border-top: 1px solid #ccc;
    background: hsl(25deg 91% 57% / 18%);
  }
  .group-settings .settings-control >div {
    display: flex;
    align-items: center;
  }
  .group-settings .settings-checkbox {
    color: #555;
    cursor: pointer;
  }
  .group-settings .settings-checkbox > input {
    width: 16px;
    height: 16px;
    margin: .5rem;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
  }
  .group-settings .settings-checkbox > label {
    cursor: pointer;
  }
  .group-settings .settings-checkbox:hover {
    color: #000;
    transition: all .15s ease-in-out
  }
  .group-settings .settings-iconActions > svg {
    color: gray;
    padding: 10px;
    margin: 0 3px;
    font-size: 18px;
    cursor: pointer;
    border-radius: 100px;
  }
  .group-settings .settings-iconActions > svg:hover {
    background: rgb(239 239 239 / 55%);
    transition: all .25s ease-in-out
  }
  .group-settings .settings-iconActions > svg:hover:nth-child(1) {
    color: #ffffff;
    background: #f5812f;
    box-shadow: 0 3px 6px #ddd;
    transition: all .15s ease-in-out
  }
  .group-settings .settings-iconActions > svg:hover:nth-child(2) {
    color: #ffffff;
    background: #f44336;
    box-shadow: 0 3px 6px #ddd;
    transition: all .15s ease-in-out
  }

  // =============================================
  // ********* END SORTABLE FIELD GROUPS *********
  // =============================================




  // ====================================
  // ********* Custom Checkbox **********
  // ====================================
  .settings-checkbox {
    position: relative;
  }
  .checkmark {
    position: absolute;
    top: 8px;
    left: 8px;
    height: 14px;
    width: 14px;
    border-radius: 2px;
    background-color: #eee;
    border: 1px solid #2196F3;
  }
  /* On mouse-over, add a grey background color */
  .settings-checkbox:hover input ~ .checkmark {
    // background-color: #ccc;
  }

  /* When the checkbox is checked, add a blue background */
  .settings-checkbox input:checked ~ .checkmark {
    background-color: #2196F3;
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  .settings-checkbox input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the checkmark/indicator */
  .settings-checkbox .checkmark:after {
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


  // =================================
  // ********* MEDIA QUERIES *********
  // =================================

  @media (min-width: 600px) {
    #formBuilder {
      grid-gap: 1%;
      grid-template-columns: 1fr 2fr;
    }
  }
  @media (max-width: 840px) {
    padding: 0rem 1rem 2rem;
  }
  
  

`;