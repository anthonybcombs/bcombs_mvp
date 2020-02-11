import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createGlobalStyle, ThemeContext } from "styled-components";
import backgroundImg from "./images/loginbg.png";
import { defaultTheme } from "./helpers/Theme.js";
import { store } from "./redux/saga";
import App from "./App";
const GlobalStyle = createGlobalStyle`
  *:focus {
    outline: none;
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
      font-size: 18px;      
    }
  }  
`;

ReactDOM.render(
  <Provider store={store}>
    <GlobalStyle />
    <ThemeContext.Provider value={defaultTheme}>
      <StrictMode>
        <App />
      </StrictMode>
    </ThemeContext.Provider>
  </Provider>,
  document.getElementById("root")
);
