import styled from "styled-components";

export default styled.div`
  width: auto;
  margin: auto;
  max-width: 1920px;
  padding: 0rem 3em 2rem;

  #formManager {
    padding: 2rem;
    background-color: white;
    box-shadow: 0 0 25px #eae9e9;
  }

  #formManager .sub-header {
    font-weight: 100;
    font-size: 20px;
    margin-top: 3rem;
    margin-bottom: 1rem;
  }

  #formManager svg {
    // color: initial;
    padding: 10px;
    font-size: 18px;
    cursor: pointer;
    border-radius: 100px;
    transition: all .15s ease-in-out;
  }
  #formManager svg:hover {
    // background: #f1f1f1;
    box-shadow: 0 3px 6px #ddd;
  }
  #formManager textarea.field-input {
    background: #f4f4f5;
  }
  #formManager .field-input {
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
  #formManager .field-input.focus-visible {
    border-bottom: 2px solid #f26e21;
    transition: all .05s linear;
  }
  #formManager .field-input.hasError {
    border-bottom: 1.65px solid red;
    color: red;
  }
  #formManager .select-field-wrapper {
    position: relative;
  }
  #formManager .select-field-wrapper:after {
    content: "\f078";
    position: absolute;
    right: 0;
    bottom: 18px;
    font-size: 10px;
    color: #555;
    font-family: "fontawesome";
  }
  #formManager .select-field-wrapper label {
    position: absolute;
    top: -10px;
    color: grey;
    font-size: 12px;
  }
  #formManager .select-field-wrapper select {
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
  }





  // Header
  // =========================
  .formManager-header {
    margin-bottom: 4rem;
  }
  .formManager-header .header-searchBar {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid #ddd;
  }
  .formManager-header .header-searchBar .search-input {
    flex: 1;
    display: flex;
    align-items: center;
    border: 1.65px solid #ccc;
    max-width: 400px;
  }
  .formManager-header .header-searchBar .search-input > input {
    padding-left: 8px !important;
    border-bottom: 0 !important;
  }
  .formManager-header .header-searchBar .search-input > svg {
    color: grey;
    opacity: 0.5;
    pointer-events: none;
  }
  .formManager-header .header-searchBar .search-input > svg:hover {
    box-shadow: none !important;
  }
  .formManager-header .header-searchBar .newFrom-btn {
    margin-left: auto;

    display: flex;
    align-items: center;
    white-space: nowrap;

    color: #fff;
    font-size: 14px;
    font-weight: 600;
    padding: 4px 22px;
    border-radius: 3px;
    background: #f5812f;
    text-decoration: none;
    transition: all .3s ease-in-out;
  }
  .formManager-header .header-searchBar .newFrom-btn:hover {
    background: #e47120;
  }
  .formManager-header .header-searchBar .newFrom-btn > svg {
    font-size: 14px !important;
  }
  .formManager-header .header-searchBar .newFrom-btn > svg:hover {
    box-shadow: none !important;
  }


  .formManager-header .header-actions {
    display: flex;
    align-items: center;
  }
  .formManager-header .header-actions .left-actions,
  .formManager-header .header-actions .right-actions {
    display: flex;
    align-items: stretch;
  }
  
  .formManager-header .header-actions .left-actions .select-field-wrapper {
    max-width: 300px;
    min-width: 300px;
    border: 1.65px solid #ccc;
  }
  .formManager-header .header-actions .left-actions .select-field-wrapper #multiselectContainerReact div:first-child {
    border: none;
  }
  .formManager-header .header-actions .left-actions .select-field-wrapper input {
    margin-top: 0 !important;
    font-size: 16px !important;
    line-height: 1.5;
  }
  .formManager-header .header-actions .left-actions .select-field-wrapper:after {
    top: 15px;
    right: 10px !important;
  }
  #multiselectContainerReact .chip,
  #multiselectContainerReact .optionContainer li:hover,
  #multiselectContainerReact .optionContainer li.highlight {
    background: #1e98f3;
  }




  .formManager-header .header-actions .right-actions {
    margin-left: auto;
  }
  .formManager-header .header-actions .right-actions .favorites-btn {
    display: flex;
    align-items: center;
    margin: 0;
    color: grey;
    width: 150px;
    padding: 12px;
    font-size: 16px;
    margin-right: 1rem;
    border-radius: 3px;
    background: transparent;
    border: 1.65px solid #ccc;
    transition: .15s ease-in-out;
  }
  .formManager-header .header-actions .right-actions .favorites-btn svg {
    padding: 0 10px !important;
    transition: none !important;
  }
  .formManager-header .header-actions .right-actions .favorites-btn:hover {
    color: #1e98f3;
  }
  .formManager-header .header-actions .right-actions .favorites-btn.active{
    color: #1e98f3;
    border-color: #1e98f3;
  }
  .formManager-header .header-actions .right-actions .dateFilter {
    display: flex;
    align-items: stretch;
  }
  .formManager-header .header-actions .right-actions .select-field-wrapper {
    padding: 0 2rem 0 1rem;
    border: 1.65px solid #ccc;
  }
  .formManager-header .header-actions .right-actions .select-field-wrapper > select {
    cursor: pointer !important;
    border-bottom: 0 !important;
    text-indent: unset !important;
    text-align-last: center !important;
  }
  .formManager-header .header-actions .right-actions .select-field-wrapper:after {
    right: 10px !important;
  }
  .formManager-header .header-actions .right-actions svg:hover {
    box-shadow: none !important;
  }
  .formManager-header .header-actions .right-actions .dateFilter > svg {
    border: 1.65px solid #ccc;
    border-left: 0;
    color: grey;
    height: auto;
    padding: 11px !important;
    border-radius: 0 !important;
    background: rgb(221 221 221 / 25%);
  }
  .formManager-header .header-actions .right-actions .dateFilter > svg:hover {
    color: #1e98f3;
    tranisition: .15s ease-in-out;
  }
  .formManager-header .header-actions .right-actions .viewType {
    margin-left: 1rem;
    display: flex;
    align-items: stretch;
  }
  .formManager-header .header-actions .right-actions .viewType > svg {
    height: auto;
    color: grey;
    padding: 11px !important;
    border-radius: 0 !important;
    border: 1.65px solid #ccc;
  }
  .formManager-header .header-actions .right-actions .viewType > svg:last-child {
    border-left: 0;
  }
  .formManager-header .header-actions .right-actions .viewType > svg.active {
    color: #fff;
    background: #f5812f;
    border-color: rgb(204 204 204 / 30%);
    transition: .15s ease-in-out;
  }
  .formManager-header .header-actions .right-actions .viewType > svg:not(.active):hover {
    color: #f5812f;
  }




  // Form List
  // =========================
  .form-list {
    display: grid;
    grid-gap: 1rem;
    grid-auto-rows: 250px;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  .form-list-item {
    display: flex;
    flex-direction: column;

    padding: 1rem;
    cursor: pointer;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 3px 5px #ddd;
    border: 1px solid rgb(221 221 221 / 50%);

    border-bottom: 3px solid #f5812f;
    transition: .15s ease-in-out;
  }
  .form-list-item:hover {
    transform: scale(1.03);
    box-shadow: 0 7px 30px 10px #ddd;
  }
  .form-list-item:hover .form-title label {
    color: #f5812f;
    transition: .15s ease-in-out;
  }

  .form-list-item .form-title {
    display: flex;
    align-items: center;
  }
  .form-list-item .form-title label {
    font-weight: 600;
    font-size: 20px;
    // color: #f5812f;
  }
  .form-list-item .form-title svg {
    position: relative;
    right: -12px;

    color: #2097f3;
    margin-left: auto;
  }

  .form-list-item .form-date span {
    color: gray;
    font-size: 14px;
  }

  .form-list-item .form-category {
    margin-top: auto;
    display: flex;
    align-items: center;
  }
  .form-list-item .form-category label {
    color: grey;
    font-size: 14px;
    font-weight: bold;
  }
  .form-list-item .form-category .category-actions {
    position: relative;
    right: -12px;
    margin-left: auto;
  }
  .form-list-item .form-category .category-actions svg {
    color: gray;
    padding: 10px;
    font-size: 18px;
    cursor: pointer;
    border-radius: 100px;
  }
  .form-list-item .form-category .category-actions svg:hover {
    background: rgb(239 239 239 / 55%);
    transition: all .25s ease-in-out
  }
  .form-list-item .form-category .category-actions svg.copy-icon:hover {
    color: #ffffff;
    background: #f5812f;
    box-shadow: 0 3px 6px #ddd;
    transition: all .15s ease-in-out
  }
  .form-list-item .form-category .category-actions svg.delete-icon:hover {
    color: #ffffff;
    background: #f44336;
    box-shadow: 0 3px 6px #ddd;
    transition: all .15s ease-in-out
  }





  // =================================
  // ********* MEDIA QUERIES *********
  // =================================

  @media (max-width: 840px) {
    padding: 0rem 1rem 2rem;
    
  }
  
`;