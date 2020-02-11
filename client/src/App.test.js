import React, { StrictMode } from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeContext } from "styled-components";
import { defaultTheme } from "./helpers/Theme.js";
import App from "./App";
afterEach(cleanup);
describe("renders App", () => {
  const component = (
    <ThemeContext.Provider value={defaultTheme}>
      <StrictMode>
        <App />
      </StrictMode>
    </ThemeContext.Provider>
  );
  test("renders without issue", () => {
    const { getByTestId } = render(component);
    expect(getByTestId("app")).toBeInTheDocument();
  });
});
