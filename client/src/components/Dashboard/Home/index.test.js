import React from "react";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateTestComponent from "../../../helpers/CreateTestComponent";
import DashboardHome from ".";
afterEach(cleanup);

describe("Dashboard Home", () => {
  const location = { state: { calendarName: "" } };
  const component = (
    <CreateTestComponent>
      <DashboardHome location={location} />
    </CreateTestComponent>
  );
  describe("test renders", () => {
    test("renders without issue", () => {
      const { getByTestId } = render(component);
      expect(getByTestId("app-dashboard-home")).toBeInTheDocument();
    });
    test("renders header", () => {
      const { getByTestId } = render(component);
      expect(getByTestId("app-dashboard-home-header")).toBeInTheDocument();
    });
    test("renders small calendar", () => {
      const { getByTestId } = render(component);
      expect(getByTestId("app-small-calendar")).toBeInTheDocument();
    });
  });
});
