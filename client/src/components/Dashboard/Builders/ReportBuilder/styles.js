import styled from "styled-components";

export default styled.div`
  width: auto;
  margin: auto;
  max-width: 1920px;
  padding: 0rem 3em 2rem;

  #reportBuilder {
    display: grid;
    grid-gap: 1%;
  }
  #reportBuilder > div {
    padding: 1rem;
    background-color: white;
    box-shadow: 0 0 25px #eae9e9;
  }
  #reportBuilder .field-label {
    color: gray;
    font-size: 14px;
    font-weight: 600;
  }
  #reportBuilder textarea.field-input {
    background: #f4f4f5;
  }
  #reportBuilder .field-input {
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
  #reportBuilder .field-input.hasError {
    border-bottom: 1.65px solid red;
    color: red;
  }
  #reportBuilder .select-field-wrapper {
    position: relative;
  }
  #reportBuilder .select-field-wrapper:after {
    content: "\f078";
    position: absolute;
    right: 0;
    bottom: 18px;
    font-size: 12px;
    color: #555 !important;
    font-family: "fontawesome";
  }
  #reportBuilder .select-field-wrapper label {
    position: absolute;
    top: -10px;
    color: grey;
    font-size: 12px;
  }
  #reportBuilder .select-field-wrapper select {
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
  }


  .drag-area-wrapper .arrow-left {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 18px;
    height: 18px;
    padding: 8px;
    color: grey;
    cursor: pointer;
    font-weight: bold;
    border-radius: 100px;
    transition: all .15s ease-in-out;
  }
  .drag-area-wrapper .arrow-left:hover {
    color: #f5812f;
    background: #f7f7f7;
  }
  .drag-area-wrapper .header-tabs {
    display: flex;
    align-items: center;
  }
  .drag-area-wrapper .header {
    position: relative;
    margin-bottom: 2rem;
    font-weight: 100;
    cursor: pointer;
    color: gray;
  }
  .drag-area-wrapper .header:hover {
    color: rgb(0 0 0 / 85%);
    transition: .15s ease-in-out;
  }
  .drag-area-wrapper .header:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 110px;
    height: 5px;
    background: #f5812f;
  }
  .drag-area-wrapper .header.form:after {
    background: transparent;
  }
  .drag-area-wrapper .header.report {
    margin-left: auto;
    margin-right: auto;
  }
  .drag-area-wrapper .header.report:after {
    width: 122px;
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
    display: flex;
    align-items: center;

    padding: 0 8px;
  }
  .drop-area-wrapper .form-title > input {
    margin-bottom: 1rem;
    font-weight: bold;
    font-size: 20px !important;
  }
  .drop-area-wrapper .form-title  svg.menu-bar-builder {
    position: relative;
    top: -8px;
    left: -8px;
    width: 18px;
    height: 18px;
    padding: 8px;
    color: grey;
    cursor: pointer;
    font-weight: bold;
    border-radius: 100px;
    transition: all .15s ease-in-out;
  }
  .drop-area-wrapper .form-title  svg.menu-bar-builder:hover {
    color: #f5812f;
    background: #f7f7f7;
  }
  .drop-area-wrapper .empty-area {
    color: gray;
    padding: 2rem;
    text-align: center;
    border: 1px dashed #ddd;
  }
  .drop-area-wrapper-actions {
    display: flex;
    padding: 1rem 0;
    margin-top: 2rem;
    align-items: stretch;
    justify-content: flex-end;
    border-top: 1px solid #ddd;
  }
  .drop-area-wrapper-actions .btn {
    color: #fff;
    margin: 5px;
    border: none;
    padding: 8px 2rem;
    background: #2196f3;
    border-radius: 3px;
    text-decoration: none;
    transition: all .3s ease-in-out;

    display: flex;
    align-items: center
  }
  .drop-area-wrapper-actions .btn >span {
    padding: 0 .5rem;
  }
  .drop-area-wrapper-actions .btn:hover {
    background: #1976d2;
    box-shadow: 0 3px 6px #ddd;
  }
  .drop-area-wrapper-actions .btn.save {
    color: #fff;
    border: 2px solid #18ab27;
    background: #18ab27;
  }
  .drop-area-wrapper-actions .btn.save:hover {
    background: #128D15;
  }
  .drop-area-wrapper-actions .btn.preview {
    color: #1e98f3;
    background: transparent;
    border: 2px solid #1e98f3;
  }
  .drop-area-wrapper-actions .btn.preview:hover{
    background: rgb(30 152 243 / 15%)
  }
  // ===============================================
  // ********* START SORTABLE FIELD GROUPS *********
  // ===============================================

  .sortableGroup {
    position: relative;
    overflow: hidden;

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
    transition: all .15s ease-in-out;
  }
  .sortableGroup:hover .sortableGroup-dragger,
  .sortableGroup.active .sortableGroup-dragger {
    opacity: 1;
    visibility: visible;
    transition: all .15s ease-in-out;
  }

  .sortableGroup:hover .sortableGroup-actions >div svg {
    opacity: 1;
    visibility: visible;
    transition: all .15s ease-in-out;
  }

  // default svg
  .sortableGroup svg:not(.exclude-global) {
    color: intial;
    padding: 10px;
    font-size: 18px;
    cursor: pointer;
    border-radius: 100px;
    transition: all .15s ease-in-out;
  }
  .sortableGroup svg:not(.exclude-global):hover {
    background: #f1f1f1;
    box-shadow: 0 3px 6px #ddd;
  }


  // specific Group Fields
  .sortableGroup.checkboxes .sortableGroup-column .checkboxContainer .checkmark {
    top: 12px;
  }
  .sortableGroup.multipleChoice .sortableGroup-column .checkboxContainer .checkmark {
    top: 11px;
  }
  .sortableGroup.dropDown .addCheckboxOption {
    margin: 1rem 1.5rem;
  }
  .sortableGroup.dropDown .sortableGroup-column .option {
    display: flex;
    align-items: center;
  }
  .sortableGroup.dropDown .sortableGroup-column .option >span {
    padding: 0 5px;
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



  .sortableGroup-dragger {
    cursor: grab;
    margin: -8px;
    background: #f1f1f1;
    text-align: center;
    margin-bottom: 5px;

    visibility: hidden;
    opacity: 0;
  }
  .sortableGroup-dragger.custom-dragger {
    visibility: visible;
    opacity: 1;
  }
  .sortableGroup-dragger > svg {
    color: grey;
  }
  .sortableGroup-dragger:hover > svg {
    color: #5a5757;
    transition: color .15s ease-in-out
  }
  .sortableGroup-dragger > svg:hover {
    box-shadow: none;
  }
  
  

  .sortableGroup-name {
    position: relative;
    margin: 0;
    letter-spacing: 1.3px;    
  }
  .sortableGroup-name >input {
    color: #f5812f !important;
    font-weight: bold !important;
    background: transparent !important;
  }
  .sortableGroup-name >div {
    position: absolute;
    right: -8px;
    top: 0px;
  }
  .sortableGroup-name >div >svg {
    color: #2097f3;
  }


  .sortableGroup-row {
    display: grid;
    align-items: end;
    grid-column-gap: 2%;
  }
  .sortableGroup-row .addCheckboxOption {
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0;
    width: 100%;
    color: #1d99f3;
    font-weight: 600;
    margin: 1rem 2rem 1rem;
    background: transparent;
    border: 1.9px dashed #1d99f3;
    transition: all .15s ease-in-out 
  }
  .sortableGroup-row .addCheckboxOption:hover {
    background: rgb(29 153 243 / 15%);
  }
  .sortableGroup-row .addCheckboxOption svg {
    font-size: 12px;
  }
  .sortableGroup-row .addCheckboxOption svg:hover {
    box-shadow: none;
    background: transparent;
  }

  .sortableGroup-column {
    position: relative;
    padding-top: 1rem !important;
  }  
  .sortableGroup-column.active .field-input,
  .sortableGroup-column.active textarea.field-input {
    background: #fde8db !important;
  }
  .sortableGroup-column.addField-column > button {
    border: 0;
    color: #fff;
    padding: 2px 13px;
    border-radius: 3px;
  }
  .sortableGroup-column.addField-column > button.add-btn {
    position: absolute;
    bottom: -45px;
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0;
    width: 100%;
    color: #1d99f3;
    font-weight: 600;
    background: transparent;
    border: 1.9px dashed #1d99f3;
    transition: all .15s ease-in-out 
  }
  .sortableGroup-column.addField-column > button.add-btn:hover {
    background: rgb(29 153 243 / 15%);
  }
  .sortableGroup-column.addField-column > button.add-btn svg {
    font-size: 12px;
  }
  .sortableGroup-column.addField-column > button.add-btn svg:hover {
    box-shadow: none;
    background: transparent;
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
  .sortableGroup-column > textarea.field-input {
    margin-bottom: -5px;
  }

  .sortableGroup-column .column-adjuster {
    position: absolute;
    right: 1px;
    bottom: -35px;
    z-index: 999;

    display: flex;
    align-items: center;
  }
  .sortableGroup-column .column-adjuster >div svg {
    color: #9e9d9d;
    transition: .15s ease-in-out;
  }
  .sortableGroup-column .column-adjuster >div svg:hover {
    color: #000;
    background: transparent;
  }



  // Start Group Drawer
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
  // End Group Drawer
 



  // start Group Fields Seetings
  .group-settings {
    margin-top: 10rem;
  }
  .group-settings .settings-validation {
    display: grid;
    grid-gap: 2%;
    margin-bottom: 1rem;
    grid-template-columns: repeat(4, 1fr);
  }
  .group-settings .settings-validation .addRemove-validation {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    grid-column: none;
    width: 80px;
  }
  .group-settings .settings-validation .add-validation,
  .group-settings .settings-validation .remove-validation {
    grid-column: none;
    cursor: pointer!important;
  }
  .group-settings .settings-validation .add-validation > svg {
    color: #1d99f3;
  }
  .group-settings .settings-validation .remove-validation > svg {
    color: red;
  }
  .group-settings .settings-validation .add-validation >span.tooltip {
    left: -55px;
    white-space: pre;
  }
  .group-settings .settings-validation .remove-validation >span.tooltip {
    left: -75px;
    white-space: pre;
  }

  .group-settings .settings-control {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    align-items: center;

    padding: 1rem;
    margin: 5px -8px -8px;
    border-top: 1px solid #ccc;
    background: hsl(25deg 91% 57% / 18%);
  }
  .group-settings .settings-control .settings-control-item p.label {
    position: relative;
    margin: 0 0 .5rem 0;
  }
  .group-settings .settings-control .settings-control-item p.label > svg {
    position: absolute;
    left: 100px;
    top: -4px;
    color: #808080;
  }

  .group-settings .settings-control .settings-control-item.hidden {
    visibility: hidden;
    height: 0px;
  }

  .group-settings .settings-control .settings-control-item .settings-content {
    // display: flex;
    // align-items: center;
  }
  .group-settings .settings-control .settings-control-item.field {
    // margin-right: auto;
  }
  .group-settings .settings-control .settings-control-item.group p.label > svg  {
    left: 112px;
  }
  .group-settings .settings-control .settings-control-item.group .checkboxContainer {
    margin-right: 1rem;
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
  .group-settings .settings-iconActions  .copy-icon svg:hover {
    position: relative;
    color: #ffffff;
    background: #f5812f;
    box-shadow: 0 3px 6px #ddd;
    transition: all .15s ease-in-out
  }
  .group-settings .settings-iconActions  .delete-icon svg:hover {
    position: relative;
    color: #ffffff;
    background: #f44336;
    box-shadow: 0 3px 6px #ddd;
    transition: all .15s ease-in-out
  }
  // End Group Fields Seetings


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

  .tooltip-wrapper.tooltip-left {

  }
  .tooltip-wrapper.tooltip-left .tooltip {
    left: 0;
    top: 8px;
    white-space: pre;
    letter-spacing: 0;
    transform: translate(-100px, 0);
  }
  .tooltip-wrapper.tooltip-left:hover .tooltip {
    transform: translate(-120px, 0);
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
      color: #666;
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
  
  @media (min-width: 600px) {
    #reportBuilder {
      grid-gap: 1%;
      grid-template-columns: 1fr 2fr;
    }
  }
  @media (min-width: 980px) {
    .drag-area-wrapper .arrow-left,
    svg.menu-bar-builder {
      display: none;
    }
  }

  @media (max-width: 980px) {
    #reportBuilder {
      display: block;
    }
    #reportBuilder .drag-area-wrapper {
      position: fixed;
      top: 0;
      z-index: 10;

      left: -400px;
      box-shadow: 3px 3px 6px #ddd;
      transition: left .8s cubic-bezier(.77,0,.175,1);
    }
    #reportBuilder.show .drag-area-wrapper {
      left: 0;
    }
    #reportBuilder .drop-area-wrapper {
      min-height: 600px;
    }
  }
  @media (max-width: 840px) {
    padding: 0rem 1rem 2rem;
  }
  
  @media (max-width: 640px) {
    #reportBuilder .drag-area-wrapper {
      max-width: 200px;
      overflow-y: auto;
      height: 100%;
    }
    .drag-area-wrapper .draggble-container {
      display: block;
    }
  }
  

`;