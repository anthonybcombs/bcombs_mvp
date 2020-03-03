import React from "react";
import ReactDOM from "react-dom";
import {
  render,
  cleanup,
  fireEvent,
  act,
  waitForElement
} from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateTestComponent from "../../../../helpers/CreateTestComponent";
import CreateEvent from ".";
afterEach(cleanup);

describe("Create Event", () => {
  beforeAll(() => {
    ReactDOM.createPortal = jest.fn((element, node) => {
      return element;
    });
  });
  afterEach(() => {
    ReactDOM.createPortal.mockClear();
  });
  const isVisible = true;
  const toggleCreateEventModal = jest.fn();
  const component = (
    <CreateTestComponent>
      <CreateEvent
        isVisible={isVisible}
        toggleCreateEventModal={toggleCreateEventModal}
      />
    </CreateTestComponent>
  );
  describe("test renders", () => {
    test("renders without issue", () => {
      const { getByTestId } = render(component);
      expect(
        getByTestId("app-dashboard-my-events-new-event")
      ).toBeInTheDocument();
    });
    test("renders micro calendar", () => {
      const { getByTestId } = render(component);
      const smallCalendar = getByTestId("app-micro-calendar");
      expect(smallCalendar).toBeInTheDocument();
    });
    test("renders form", () => {
      const { getByTestId } = render(component);
      const form = getByTestId("app-dashboard-my-events-event-form");
      expect(form).toBeInTheDocument();
    });
    test("renders header with content of Create a new Event", () => {
      const { getByText } = render(component);
      expect(getByText(/Create a new Event/)).toBeInTheDocument();
    });
    test("renders input(event title)", () => {
      const { getByTestId } = render(component);
      const input = getByTestId(
        "app-dashboard-my-events-new-event-input-title"
      );
      expect(input).toBeInTheDocument();
      expect(input.type).toBe("text");
      expect(input.placeholder).toBe("Add title");
    });
    test("renders event list buttons", () => {
      const { container } = render(component);
      const buttons = container.querySelector("#event-type-list").childNodes;
      expect(buttons.length).toBe(3);
      expect(buttons[0].textContent).toBe("Event");
      expect(buttons[1].textContent).toBe("Forms Reminder");
      expect(buttons[2].textContent).toBe("Task");
    });
    test("renders selected datetime", () => {
      const { getByTestId } = render(component);
      expect(
        getByTestId("app-dashboard-my-events-new-event-selected-datetime")
      ).toBeInTheDocument();
    });
    test("renders add guests list", () => {
      const { getByText } = render(component);
      expect(getByText(/Add guests/)).toBeInTheDocument();
    });
    test("renders add location or conferencing", () => {
      const { getByText } = render(component);
      expect(getByText(/Add location or conferencing/)).toBeInTheDocument();
    });
    test("renders add description", () => {
      const { getByText } = render(component);
      expect(getByText(/Add description/)).toBeInTheDocument();
    });
    test("renders button(Save)", () => {
      const { getByTestId } = render(component);
      const button = getByTestId(
        "app-dashboard-my-events-new-event-button-save"
      );
      expect(button).toBeInTheDocument();
      expect(button.type).toBe("submit");
      expect(button.textContent).toBe("Save");
    });
  });
  describe("test behavior", () => {
    describe("input (add title)", () => {
      test("initial value", () => {
        const { getByTestId } = render(component);
        const input = getByTestId(
          "app-dashboard-my-events-new-event-input-title"
        );
        expect(input.value).toBe("");
      });
      test("change value", () => {
        const { getByTestId } = render(component);
        const input = getByTestId(
          "app-dashboard-my-events-new-event-input-title"
        );
        fireEvent.change(input, { target: { value: "testing" } });
        expect(input.value).toBe("testing");
      });
    });
    describe("event type buttons", () => {
      test("initial selected button", () => {
        const { container } = render(component);
        const buttons = container.querySelector("#event-type-list").childNodes;
        expect(buttons[0].classList).toContain("selected");
      });
      test("change event type", () => {
        const { container } = render(component);
        const buttons = container.querySelector("#event-type-list").childNodes;
        fireEvent.click(buttons[1]);
        expect(buttons[1].classList).toContain("selected");
      });
    });
    describe("test submit", () => {
      test("submit without errors", async () => {
        const { queryByText, getByTestId } = render(component);
        const form = getByTestId("app-dashboard-my-events-event-form");
        const inputTitle = getByTestId(
          "app-dashboard-my-events-new-event-input-title"
        );
        fireEvent.change(inputTitle, { target: { value: "testing" } });
        await act(async () => {
          fireEvent.submit(form);
        });
        expect(inputTitle.value).toBe("");
        expect(queryByText("Title is required.")).not.toBeInTheDocument();
      });
      test("submit with errors", async () => {
        const { queryByText, getByTestId } = render(component);
        const form = getByTestId("app-dashboard-my-events-event-form");
        await act(async () => {
          fireEvent.submit(form);
        });
        expect(queryByText("Title is required.")).toBeInTheDocument();
      });
    });
  });
});
