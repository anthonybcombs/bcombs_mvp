import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createHistory, LocationProvider } from "@reach/router";
import { createGlobalStyle, ThemeContext } from "styled-components";
import backgroundImg from "./images/loginbg.png";
import { defaultTheme } from "./helpers/Theme.js";
import { store } from "./redux/saga";
import App from "./App";
const GlobalStyle = createGlobalStyle`
  *:focus {
    outline: none;
  }
  .error{
    color:red;
  }
  .modal {
    position: fixed; 
    z-index:1000;
    left: 0;
    top: 0;
    width: 100%; 
    height: 100%; 
    overflow: auto; 
    background-color: rgb(0,0,0); 
    background-color: rgba(0,0,0,0.4); 
  }
  
  .modal-content {
    background-color: white;
    margin: 1em auto; 
    padding: 20px;
    border: 1px solid #888;
    width: 30%; 
  }
  
  /* The Close Button */
  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }
  
  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }  
  button{
    padding: 10px;    
    cursor: pointer;    
  }
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  /* Firefox */
  input[type=number] {
    -moz-appearance:textfield;
  }
  .grid {
    display: grid;
  }
  .grid > * {
    display: block;
    width: 100%;
  }  
  .input-icons svg { 
      position: absolute; 
  } 
  .input-icons { 
      width: 100%; 
      padding:0;
  } 
    
  .icon { 
      padding: 10px; 
      min-width: 40px; 
  } 
    
  .input-field { 
      width: 90%; 
      padding: 10px; 
      text-align: center; 
      border:none;
      border:1px solid #f26e21;
  }   
  body{
    margin:0;
    padding:0;
    background-image: url(${backgroundImg});    
    min-width:400px;
    line-height:initial;
    //font-family: "Trebuchet MS",Arial,Helvetica,sans-serif;
    font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif
  }

  #applicationForm label {
    display: inline-block;
    max-width: 100%;
    margin-bottom: 5px
  }

  #applicationForm .form-group {
    margin: 0;
    margin-bottom: 20px;
  }

  #applicationForm textarea {
    background: #f1f1f1;
    border: none !important;
    width: 100%;
  }

  #applicationForm textarea.readonly {
    background: white !important;
    border-bottom: 2px solid rgb(204, 204, 204) !important;
    resize: none !important;
  }

  #applicationForm .ta-justice {
    background: #f1f1f1;
    border: none;
  }

  #applicationForm .form-group .form-control {
    font-size: 18px;
    border: 0;
    border-bottom: 2px solid #ccc;
    -webkit-appearance: none;
    -moz-appearance: none;
    border-radius: 0;
    padding: 10px;
  }

  #applicationForm .field {
    display: flex;
    flex-flow: column-reverse;
    margin-bottom: 1em;
    position: relative;
  }

  #applicationForm .field-label,
  #applicationForm .field-input {
    transition: all 0.2s;
    touch-action: manipulation;
  }

  #applicationForm .field-label-simple {
    font-size: 18px;
    color: #4b525a;
    font-weight: 600;
    text-align: left;
    margin-bottom: 20px;
  }

  #applicationForm .required {
    color: red;
  }

  #applicationForm .field-input {
    font-size: 18px;
    border: 0;
    border-bottom: 2px solid #ccc;
    font-family: inherit;
    -webkit-appearance: none;
    -moz-appearance: none;
    border-radius: 0;
    padding: 5px;
    cursor: text;
    line-height: 1.8;
    color: #555 !important;
    padding: 5px 0;
    width: 100%;
    display: block;
    text-indent: 5px;
  }

  #applicationForm .field-label {
    font-size: 14px;
    color: #4b525a
  }

  #applicationForm .field-label .add {
    color: #f26e21;
    cursor: pointer;
  }

  #applicationForm .field-label .remove {
    color: red;
    cursor: pointer;
  }

  #applicationForm .field-input:placeholder-shown + .field-label {
    overflow: hidden;
    transform-origin: left bottom;
    transform: translate(0, 2.125rem) scale(1.4)
  }

  #applicationForm .field-input::placeholder {
    opacity: 0;
    transition: inherit;
    font-size:12px;
  }

  #applicationForm .field-input:focus::placeholder {
    opacity: 1;
  }

  #applicationForm .field-input:focus + .field-label{
    transform: translate(0, 0) scale(1);
    cursor: pointer;
    margin-bottom:5px;
    font-weight:bold;
  }

  #applicationForm .highlights {
    border: 1px solid #f26e21 !important;
    //border-color: #f26e21 !important;
  }

  #applicationForm .highlights-textarea {
    border: 2px solid #f26e21 !important;
  }

  #applicationForm select {
    background-color: white;
  }
  /* Hide scrollbar for Chrome, Safari and Opera */
  .modal::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for IE and Edge */
  .modal {
    -ms-overflow-style: none;
  }
  @media (min-width: 600px) {
    body{
      overflow-x: hidden;
      font-size: 16px;      
    }
  }  

  #multiselectContainerReact .optionContainer li:hover,
  #multiselectContainerReact .optionContainer li.highlight {
    background: #f26e21;
  }

  #multiselectContainerReact div:first-child {
    border: 0;
    border-bottom: 2px solid #ccc;
    border-radius: 0;
  }

  #multiselectContainerReact .searchBox {
    font-size: 18px;
    padding: 5px 0;
    margin: 0;
    margin-top: 2px;
  }

  #multiselectContainerReact .searchBox::placeholder {
    font-size: 12px;
  }

  #multiselectContainerReact .chip {
    background: #f26e21;
  }
`;
let history = createHistory(window);
ReactDOM.render(
  <Provider store={store}>
    <LocationProvider history={history}>
      <GlobalStyle />
      <ThemeContext.Provider value={defaultTheme}>
        <App />
      </ThemeContext.Provider>
    </LocationProvider>
  </Provider>,
  document.getElementById("root")
);
