import React, { StrictMode } from "react";
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
    padding: 0px;
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
        <StrictMode>
          <App />
        </StrictMode>
      </ThemeContext.Provider>
    </LocationProvider>
  </Provider>,
  document.getElementById("root")
);
