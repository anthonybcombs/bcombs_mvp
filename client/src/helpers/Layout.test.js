import React, { StrictMode } from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeContext } from "styled-components";
import { defaultTheme } from "./Theme";
import Layout from "./Layout";
afterEach(cleanup);
describe("renders Layout", () => {
  const component = (
    <ThemeContext.Provider value={defaultTheme}>
      <StrictMode>
        <Layout />
      </StrictMode>
    </ThemeContext.Provider>
  );
  test("renders without issue", () => {
    const { getByTestId } = render(component);
    expect(getByTestId("app-layout")).toBeInTheDocument();
  });
  test("does contains bcombs logo", () => {
    const { getByTestId } = render(component);
    expect(getByTestId("app-logo")).toBeInTheDocument();
    expect(getByTestId("app-logo").alt).toBe("Bcombs Logo");
  });
  test("contains footer", () => {
    const { getByTestId } = render(component);
    expect(getByTestId("app-footer")).toBeInTheDocument();
  });
});
