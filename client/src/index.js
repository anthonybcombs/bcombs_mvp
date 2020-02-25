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
    width: 100% !important;
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
  }  
  @media (min-width: 600px) {
    body{
      overflow-x: hidden;
      font-size: 16px;      
    }
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
