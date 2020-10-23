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
  #formBuilder .field-label {
    color: gray;
    font-size: 14px;
    font-weight: 600;
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
  #formBuilder .field-input.hasError {
    border-bottom: 1.65px solid red;
    color: red;
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
    font-size: 20px !important;
  }
  .drop-area-wrapper .empty-area {
    color: gray;
    padding: 2rem;
    text-align: center;
    border: 1px dashed #ddd;
  }
  .drop-area-wrapper-actions {
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .drop-area-wrapper-actions .preview {
    color: #fff;
    padding: 8px 2rem;
    background: #2196f3;
    text-decoration: none;
    transition: all .3s ease-in-out;

    display: flex;
    align-items: center
  }
  .drop-area-wrapper-actions .preview >span {
    padding: 0 .5rem;
  }
  .drop-area-wrapper-actions .preview:hover {
    background: #1976d2;
    box-shadow: 0 3px 6px #ddd;
  }

  // ===============================================
  // ********* START SORTABLE FIELD GROUPS *********
  // ===============================================

  .sortableGroup {
    position: relative;
    overflow: hidden;

    // cursor: move;
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
  .sortableGroup:hover .sortableGroup-actions >div svg {
    opacity: 1;
    visibility: visible;
    transition: all .15s ease-in-out
  }


  .sortableGroup-actions {
    position: absolute;
    top: 0;
    right: 0;
    cursor: default;
    display: flex;
    flex-direction: row-reverse;
  }
  .sortableGroup-actions >div svg {
    cursor: move;
    color: #f5812f;
    font-size: 18px;
    cursor: pointer;
    padding: 8px;
    width: 28px;
    height: 28px;
    border-radius: 100px;

    opacity:0;
    visibility: hidden;
  }
  .sortableGroup-actions >div svg:hover {
    background: #f4f4f5;
    transition: all .15s ease-in-out
  }
  .sortableGroup-actions .tooltip-wrapper .tooltip-left {

  }
  .sortableGroup-actions .tooltip-wrapper.tooltip-left .tooltip {
    z-index: 10;
    top: unset;
    bottom: -22px;
    white-space: pre;
    transform: translateY(-32px);
  }
  .sortableGroup-actions .tooltip-wrapper.tooltip-left:hover .tooltip {
    transform: translateY(0);
  }
  .sortableGroup-actions .tooltip-wrapper.tooltip-left.add-field .tooltip {
    left: -33px;
  }
  .sortableGroup-actions .tooltip-wrapper.tooltip-left.edit-groupName .tooltip {
    left: -42px;
  }
  

  // specific for ADDRESS ROW
  // .sortableGroup.address .sortableGroup-row {
  //   grid-template-columns: repeat(2, 1fr) !important;
  // }
  // .sortableGroup.address .sortableGroup-row .sortableGroup-column:nth-child(1),
  // .sortableGroup.address .sortableGroup-row .sortableGroup-column:nth-child(2) {
  //   grid-column: span 2 !important; /* Spans two columns */
  // }


  .sortableGroup-name {
    margin: 0;
    letter-spacing: 1.3px;
    // text-transform: uppercase;
  }


  .sortableGroup-row {
    display: grid;
    align-items: center;
    grid-column-gap: 2%;
    // grid-template-columns: repeat(1, 1fr);
  }


  .sortableGroup-column {
    position: relative;
    padding-top: 1rem !important;
  }
  .sortableGroup-column.active {
    border: 1px solid red;
  }
  .sortableGroup-column .removeField-icon {
    position: absolute;
    right: -4px;
    bottom: 4px;
    color: #f44336;
    cursor: pointer;
    padding: 8px 10px;
    border-radius: 100px;
  }
  .sortableGroup-column .removeField-icon:hover {
    color: #d32f2f;
  }

  .sortableGroup-drawer {
    position: absolute;
    top: 2px;
    right: 4px;
    z-index: 1;
    padding: 8px;
    max-width: 210px;
    background: white;
    box-shadow: 0 3px 6px #b5b5b5;

    opacity: 0;
    visibility: hidden;
    transform: translateY(-62px);
    transition: transform .5s cubic-bezier(0,1.62,0.38,0.96),
                opacity 1s cubic-bezier(0,1.62,0.38,0.96),
                visibility 1.3s cubic-bezier(0,1.62,0.38,0.96)
  }
  .sortableGroup-drawer.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  .sortableGroup-drawer .field:not(:first-child) {
    padding: 12px 0 5px;
  }
  .sortableGroup-drawer .field >label {
    opacity: .85;
    color: #f5812f !important;
  }
  .sortableGroup-drawer .field >input,
  .sortableGroup-drawer .field >select {
    padding-top: 0 !important;
  }
  .sortableGroup-drawer .select-field-wrapper {
    position: relative;
  }
  .sortableGroup-drawer >div button {
    border-radius: 3px;
    padding: 2px 13px;
    color: #fff;
    border: 0;
  }
  .sortableGroup-drawer .addField-actions {
    margin-top: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .sortableGroup-drawer >div button.add-btn {
    background: #19AB27;
  }
  .sortableGroup-drawer >div button.add-btn:hover {
    background: #128d15;
    transition: .15s ease-in-out 
  }
  .sortableGroup-drawer >div button.close-btn {
    background: #f44336;
  }
  .sortableGroup-drawer >div button.close-btn:hover {
    background: #d32f2f;
    transition: .15s ease-in-out;
  }


  // Drawer Right
  .sortableGroup-drawer.drawer-right {
    top: 0;
    right: 0;
    width: 100%;
    padding: 16px;
    cursor: pointer;
    max-width: 214px;
    overflow-y: auto;
    height: calc(100% - 1.9rem);
    transform: translate(62px, 0);
    transition: transform .5s cubic-bezier(0, 1.62, 0.68, 0.68),
                opacity 1s cubic-bezier(0,1.62,0.38,0.96),
                visibility 1.3s cubic-bezier(0,1.62,0.38,0.96);
  }
  .sortableGroup-drawer.drawer-right.show {
    transform: translate(0, 0);
  }
  .sortableGroup-drawer.drawer-right .addField-actions {
    position: sticky;
    bottom: -16px;
    padding: 1rem;
    margin: 0 -16px;
    background: #fff;
  }
 


  .group-settings {
    margin-top: 4rem;
  }
  .group-settings .settings-validation {
    display: grid;
    grid-gap: 2%;
    margin-bottom: 1rem;
    grid-template-columns: repeat(4, 1fr);
  }
  .group-settings .settings-validation .add-validation,
  .group-settings .settings-validation .remove-validation {
    grid-column: none;
    cursor: pointer!important;
  }
  .group-settings .settings-validation .add-validation > svg {
    width: 24px;
    color: #f5812f;
  }
  .group-settings .settings-validation .remove-validation > svg {
    width: 24px;
    color: red;
  }
  .group-settings .settings-validation .add-validation >span.tooltip,
  .group-settings .settings-validation .remove-validation >span.tooltip {
    left: -76px;
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
  .group-settings .settings-iconActions {
    display: flex;
    align-items: center;
  }
  .group-settings .settings-iconActions  svg {
    color: gray;
    padding: 10px;
    font-size: 18px;
    cursor: pointer;
    border-radius: 100px;
  }
  .group-settings .settings-iconActions  svg:hover {
    background: rgb(239 239 239 / 55%);
    transition: all .25s ease-in-out
  }
  .group-settings .settings-iconActions  svg:hover:nth-child(1) {
    position: relative;
    color: #ffffff;
    background: #f5812f;
    box-shadow: 0 3px 6px #ddd;
    transition: all .15s ease-in-out
  }
  .group-settings .settings-iconActions  svg:hover:nth-child(2) {
    position: relative;
    color: #ffffff;
    background: #f44336;
    box-shadow: 0 3px 6px #ddd;
    transition: all .15s ease-in-out
  }
  


  // =============================================
  // ********* END SORTABLE FIELD GROUPS *********
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


  .checkboxContainer {
    position: relative;
    color: #555;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .checkboxContainer.disabled {
    color: #a99595;
  }

  .checkboxContainer > input {
    width: 16px;
    height: 16px;
    margin: .5rem;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
  }
  .checkboxContainer > label {
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
    background-color: #eee;
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
  .checkboxContainer .checkmark:after {
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