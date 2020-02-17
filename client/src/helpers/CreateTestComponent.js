import React, { StrictMode } from "react";
import { ThemeContext } from "styled-components";
import { Provider } from "react-redux";
import {
  LocationProvider,
  createHistory,
  createMemorySource
} from "@reach/router";
import { store } from "../redux/saga";
import { defaultTheme } from "./Theme";
export default function({ children, history = "/" }) {
  return (
    <Provider store={store}>
      <LocationProvider history={createHistory(createMemorySource(history))}>
        <ThemeContext.Provider value={defaultTheme}>
          <StrictMode>{children}</StrictMode>
        </ThemeContext.Provider>
      </LocationProvider>
    </Provider>
  );
}
