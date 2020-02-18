import React from "react";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateTestComponent from "../../../../../helpers/CreateTestComponent";
import CreateCalendar from ".";
afterEach(cleanup);

describe("Create Calendar", () => {
  const setCurrentPage = jest.fn();
  const component = (
    <CreateTestComponent>
      <CreateCalendar setCurrentPage={setCurrentPage} />
    </CreateTestComponent>
  );
  describe("test render", () => {
    test("renders without issue", () => {
      const { getByTestId } = render(component);
      expect(getByTestId("app-profile-calendar")).toBeInTheDocument();
    });
    test("does contains header with text of Almost Done!", () => {
      const { getByTestId } = render(component);
      const header = getByTestId("app-profile-calendar-header");
      expect(header).toBeInTheDocument();
      expect(header.textContent).toBe("Almost Done!");
    });
    test("does contains sub header with text of Create my first calendar", () => {
      const { getByTestId } = render(component);
      const subHeader = getByTestId("app-profile-calendar-sub-header");
      expect(subHeader).toBeInTheDocument();
      expect(subHeader.textContent).toBe("Create my first calendar");
    });
    test("does contains input(calenarname)", () => {
      const { getByTestId } = render(component);
      const inputCalendarName = getByTestId("app-profile-input-calendar-name");
      expect(inputCalendarName).toBeInTheDocument();
      expect(inputCalendarName.type).toBe("text");
      expect(inputCalendarName.placeholder).toBe("Calendar name");
    });
    test("does contains save to continue submit button", () => {
      const { getByTestId } = render(component);
      const saveAndDoneButton = getByTestId("app-profile-save-button");
      expect(saveAndDoneButton).toBeInTheDocument();
      expect(saveAndDoneButton.type).toBe("submit");
      expect(saveAndDoneButton.textContent).toEqual("Save and Done!");
    });
  });
  describe("test behaivor", () => {
    describe("Input Firstname", () => {
      test("test initial value", () => {
        const { getByTestId } = render(component);
        const inputCalendarName = getByTestId(
          "app-profile-input-calendar-name"
        );
        expect(inputCalendarName.value.length).toBe(0);
      });
      test("test value when changed", () => {
        const { getByTestId } = render(component);
        const inputCalendarName = getByTestId(
          "app-profile-input-calendar-name"
        );
        fireEvent.change(inputCalendarName, {
          target: { value: "test calendar" }
        });
        expect(inputCalendarName.value).toBe("test calendar");
      });
    });
    describe("submit form tests", () => {
      test("form submit without errors", async () => {
        const { getByTestId, queryByText } = render(component);
        const inputCalendarName = getByTestId(
          "app-profile-input-calendar-name"
        );
        const createCalendarForm = getByTestId(
          "app-profile-calendar-create-form"
        );
        fireEvent.change(inputCalendarName, {
          target: { value: "test calendar" }
        });
        await act(async () => {
          fireEvent.submit(createCalendarForm);
        });
        expect(
          queryByText("Calendar name is required.")
        ).not.toBeInTheDocument();
      });
      test("form submit with errors", async () => {
        const { getByTestId, queryByText } = render(component);
        const inputCalendarName = getByTestId(
          "app-profile-input-calendar-name"
        );
        const createCalendarForm = getByTestId(
          "app-profile-calendar-create-form"
        );
        fireEvent.change(inputCalendarName, {
          target: { value: "" }
        });
        await act(async () => {
          fireEvent.submit(createCalendarForm);
        });
        expect(queryByText("Calendar name is required.")).toBeInTheDocument();
      });
    });
  });
});
