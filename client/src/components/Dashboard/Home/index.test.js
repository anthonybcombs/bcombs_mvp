import React from "react";
import {
  render,
  cleanup,
  fireEvent,
  act,
  waitForElement
} from "@testing-library/react";
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
    test("renders sub header with contents of my calendar", () => {
      const { getByTestId } = render(component);
      expect(
        getByTestId("app-dashboard-home-sub-header-calendars")
      ).toBeInTheDocument();
    });
    test("renders sub header with contents of notifications", () => {
      const { getByTestId } = render(component);
      expect(
        getByTestId("app-dashboard-home-sub-header-notifications")
      ).toBeInTheDocument();
    });
    test("renders sub header with contents of upcoming events", () => {
      const { getByTestId } = render(component);
      expect(
        getByTestId("app-dashboard-home-sub-header-upcoming-events")
      ).toBeInTheDocument();
    });
    test("renders sub header with contents of Recommendations", () => {
      const { getByTestId } = render(component);
      expect(
        getByTestId("app-dashboard-home-sub-header-recommendations")
      ).toBeInTheDocument();
    });
    test("renders events list if there is an existing event", async () => {
      const { findAllByTestId } = render(component);
      const events = await waitForElement(() =>
        findAllByTestId("app-dashboard-home-event")
      );
      expect(events.length).toBeGreaterThan(0);
    });
    test("renders events list if there is an existing event", async () => {
      const { findAllByTestId } = render(component);
      const events = await waitForElement(() =>
        findAllByTestId("app-dashboard-home-event")
      );
      expect(events.length).toBeGreaterThan(0);
    });    
  });
});
