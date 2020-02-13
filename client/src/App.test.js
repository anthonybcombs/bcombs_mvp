import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateTestComponent from "./helpers/CreateTestComponent";
import App from "./App";
afterEach(cleanup);
describe("renders App", () => {
  const component = (
    <CreateTestComponent>
      <App />
    </CreateTestComponent>
  );
  test("renders without issue", () => {
    const { getByTestId } = render(component);
    expect(getByTestId("app")).toBeInTheDocument();
  });
});
