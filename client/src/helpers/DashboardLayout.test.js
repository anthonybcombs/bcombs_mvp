import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateTestComponent from "./CreateTestComponent";
import DashboardLayout from "./dashboardLayout";
afterEach(cleanup);
describe("renders Dashboard Layout", () => {
  const component = (
    <CreateTestComponent>
      <DashboardLayout />
    </CreateTestComponent>
  );
  test("renders without issue", () => {
    const { getByTestId } = render(component);
    expect(getByTestId("app-dashboard-layout")).toBeInTheDocument();
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
