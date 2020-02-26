import React from "react";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { format, addMonths, subMonths, addDays } from "date-fns";
import CreateTestComponent from "../../../helpers/CreateTestComponent";
import SmallCalendar from ".";
afterEach(cleanup);

describe("Calendar", () => {
  const events = [];
  const selectedDate = new Date();
  const setSelectedDate = jest.fn();
  const setSelectedEvent = jest.fn();
  const setCurrentPage = jest.fn();
  const component = (
    <CreateTestComponent>
      <SmallCalendar
        events={events}
        removeSubHeader={false}
        selectedDate={selectedDate}
        setSelectedEvent={setSelectedEvent}
        setSelectedDate={setSelectedDate}
        setCurrentPage={setCurrentPage}
      />
    </CreateTestComponent>
  );
  const currentDate = {
    currentMonth: new Date(),
    selectedDate: new Date()
  };
  describe("test renders", () => {
    test("renders without issue", () => {
      const { getByTestId } = render(component);
      expect(getByTestId("app-small-calendar")).toBeInTheDocument();
    });
    test("renders header", () => {
      const { getByTestId } = render(component);
      expect(getByTestId("app-small-calendar-header")).toBeInTheDocument();
    });
    test("renders current month and year sub header", () => {
      const { getByTestId } = render(component);
      expect(
        getByTestId("app-small-calendar-header-current-month-year")
      ).toBeInTheDocument();
    });
    test("renders current month sub header", () => {
      const { getByTestId } = render(component);
      const currentMonthHeader = getByTestId(
        "app-small-calendar-header-current-month"
      );
      expect(currentMonthHeader).toBeInTheDocument();
      expect(currentMonthHeader.textContent).toBe(
        format(currentDate.currentMonth, "MMMM")
      );
    });
    test("renders days", () => {
      const ExpectedDateNames = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun"
      ];
      const { getByTestId } = render(component);
      const days = getByTestId("app-small-calendar-days");
      const displayDateNames = Array.from(days.childNodes).map(
        day => day.textContent
      );
      expect(days).toBeInTheDocument();
      expect(displayDateNames).toEqual(ExpectedDateNames);
      expect(days.firstChild.textContent).toBe("Mon");
    });
    test("renders cells", () => {
      const { getByTestId } = render(component);
      const cells = getByTestId("app-small-calendar-cells");
      expect(cells).toBeInTheDocument();
      expect(cells.firstChild).toHaveClass("rows");
      expect(cells.firstChild.firstChild).toHaveClass("cell");
    });
    test("renders prev month button", () => {
      const { getByTestId } = render(component);
      expect(
        getByTestId("app-small-calendar-prev-month-button")
      ).toBeInTheDocument();
    });
    test("renders next month button", () => {
      const { getByTestId } = render(component);
      expect(
        getByTestId("app-small-calendar-next-month-button")
      ).toBeInTheDocument();
    });
  });
  describe("test behaivor", () => {
    describe("test changing month", () => {
      test("change to prev month", () => {
        const { getByTestId } = render(component);
        const prevMonthButton = getByTestId(
          "app-small-calendar-prev-month-button"
        );
        const header = getByTestId("app-small-calendar-header-current-month");
        const expectedMonth = format(
          subMonths(currentDate.currentMonth, 1),
          "MMMM"
        );
        fireEvent.click(prevMonthButton);
        expect(header.textContent).toBe(expectedMonth);
      });
      test("change to next month", () => {
        const { getByTestId } = render(component);
        const nextMonthButton = getByTestId(
          "app-small-calendar-next-month-button"
        );
        const header = getByTestId("app-small-calendar-header-current-month");
        const expectedMonth = format(
          addMonths(currentDate.currentMonth, 1),
          "MMMM"
        );
        fireEvent.click(nextMonthButton);
        expect(header.textContent).toBe(expectedMonth);
      });
      test("change day", () => {
        const { getByText } = render(component);
        const cell = getByText("15");
        fireEvent.click(cell);
        expect(cell.parentElement).toHaveClass("selected");
      });
    });
  });
});
