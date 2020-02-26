import React from "react";
import {
  render,
  cleanup,
  fireEvent,
  act,
  waitForElement
} from "@testing-library/react";

import "@testing-library/jest-dom";
import { format } from "date-fns";
import CreateTestComponent from "../../../helpers/CreateTestComponent";
import MyEvents from "./";
afterEach(cleanup);

describe("My Events", () => {
  const component = (
    <CreateTestComponent>
      <MyEvents />
    </CreateTestComponent>
  );
  describe("test renders", () => {
    test("renders without issue", () => {
      const { getByTestId } = render(component);
      expect(getByTestId("app-dashboard-my-events")).toBeInTheDocument();
    });
    describe("test header", () => {
      test("renders header", () => {
        const { getByTestId } = render(component);
        expect(
          getByTestId("app-dashboard-my-events-header")
        ).toBeInTheDocument();
      });
      test("renders headers with content of Calendar Year", () => {
        const { getByText } = render(component);
        expect(getByText(/Calendar Year/)).toBeInTheDocument();
      });
      test("renders select contains of date", () => {
        const { getByTestId } = render(component);
        const select = getByTestId("app-dashboard-my-events-select-year");
        expect(select.type).toBe("select-one");
        expect(select.value).toBe(format(new Date(), "yyyy"));
      });
      test("renders sort", () => {
        const { getByText } = render(component);
        expect(getByText("SORT")).toBeInTheDocument();
      });
      test("renders filter", () => {
        const { getByText } = render(component);
        expect(getByText("FILTER")).toBeInTheDocument();
      });
      test("renders input(search)", () => {
        const { getByTestId } = render(component);
        const input = getByTestId("app-dashboard-my-events-input-search");
        expect(input).toBeInTheDocument();
        expect(input.type).toBe("text");
        expect(input.placeholder).toBe("Find events");
      });
      test("renders button(Create new event +)", () => {
        const { getByTestId } = render(component);
        const button = getByTestId(
          "app-dashboard-my-events-create-new-event-button"
        );
        expect(button).toBeInTheDocument();
        expect(button.type).toBe("button");
        expect(button.textContent).toBe("Create a new event +");
      });
    });
    describe("test body", () => {
      test("renders body", () => {
        const { getByTestId } = render(component);
        expect(getByTestId("app-dashboard-my-events-body")).toBeInTheDocument();
      });
      test("renders events month view", () => {
        const { getAllByTestId } = render(component);
        expect(
          getAllByTestId("app-dashboard-my-events-body-events-month").length
        ).toBeLessThan(13);
      });
      test("renders table header", () => {
        const { getAllByTestId } = render(component);
        const firstEventMonthView = getAllByTestId(
          "app-dashboard-my-events-body-events-month"
        )[0];
        expect(firstEventMonthView).toBeInTheDocument();
      });
      test("renders table", () => {
        const { getAllByTestId } = render(component);
        const table = getAllByTestId("app-dashboard-my-events-body-table")[0];
        const head = table.childNodes[0].childNodes[0].childNodes;
        const body = table.childNodes[1].childNodes[0].childNodes;
        expect(table).toBeInTheDocument();
        expect(head[0].textContent).toBe("Event name");
        expect(head[1].textContent).toBe("Date");
        expect(head[2].textContent).toBe("Time");
        expect(head[3].textContent).toBe("Location");
        expect(head[4].textContent).toBe("Shared with:");
        expect(head[5].textContent).toBe("Status");
        expect(head.length).toBe(6);
        expect(body.length).toBe(6);
      });
      test("renders no events if there is no event", () => {
        const { getAllByText } = render(component);
        expect(getAllByText(/No events scheduled/)).toBeDefined();
      });
    });
  });
  describe("test behavior", () => {
    describe("header", () => {
      test("change select date", () => {
        const { getByTestId } = render(component);
        const select = getByTestId("app-dashboard-my-events-select-year");
        fireEvent.change(select, { target: { value: "2019" } });
        expect(select.value).toBe("2019");
      });
      describe("input(search)", () => {
        test("initial value", () => {
          const { getByTestId } = render(component);
          const input = getByTestId("app-dashboard-my-events-input-search");
          expect(input.value).toBe("");
        });
        test("value changed", () => {
          const { getByTestId } = render(component);
          const input = getByTestId("app-dashboard-my-events-input-search");
          fireEvent.change(input, { target: { value: "testing" } });
          expect(input.value).toBe("testing");
        });
      });
    });
  });
});
