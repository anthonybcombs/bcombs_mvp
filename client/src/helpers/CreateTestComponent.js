import React, { StrictMode } from "react";
import { ThemeContext } from "styled-components";
import { defaultTheme } from "./Theme";
export default function({ children }) {
  return (
    <ThemeContext.Provider value={defaultTheme}>
      <StrictMode>{children}</StrictMode>
    </ThemeContext.Provider>
  );
}
