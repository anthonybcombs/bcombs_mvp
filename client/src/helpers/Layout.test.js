import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateTestComponent from "./CreateTestComponent";
import Layout from "./Layout";
afterEach(cleanup);
describe("renders Layout", () => {
  const component = (
    <CreateTestComponent>
      <Layout />
    </CreateTestComponent>
  );
  test("renders without issue", () => {
    const { getByTestId } = render(component);
    expect(getByTestId("app-layout")).toBeInTheDocument();
  });
  test("does contains bcombs logo in header", () => {
    const { getByTestId } = render(component);
    expect(getByTestId("app-logo")).toBeInTheDocument();
    expect(getByTestId("app-logo").alt).toBe("Bcombs Logo");
  });
  test("contains login button in header", () => {
    const { getByTestId } = render(component);
    const button = getByTestId("app-header-login");
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe("Login");
  });
  test("contains register link in header", () => {
    const { getByTestId } = render(component);
    const button = getByTestId("app-header-register");
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe("Register");
  });
  test("contains footer", () => {
    const { getByTestId } = render(component);
    expect(getByTestId("app-footer")).toBeInTheDocument();
  });
});
