import React from "react";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { initialState } from "../../../../redux/initialState";
import { format, addMonths, subMonths, addDays } from "date-fns";
import CreateTestComponent from "../../../../helpers/CreateTestComponent";
import BigCalendar from ".";
afterEach(cleanup);

describe("Big Calendar", () => {
  const { events, calendars } = initialState;
  const selectedDate = new Date();
  const calendarType = "month";
  const handleChangeCalendarType = jest.fn();
  const selectedCalendars = [];
  const handleCalendarSelection = jest.fn();
  const component = (
    <CreateTestComponent>
      <BigCalendar
        events={events}
        calendars={calendars}
        selectedDate={selectedDate}
        calendarType={calendarType}
        handleChangeCalendarType={handleChangeCalendarType}
        selectedCalendars={selectedCalendars}
        handleCalendarSelection={handleCalendarSelection}
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
      expect(getByTestId("app-big-calendar")).toBeInTheDocument();
    });
    test("renders header", () => {
      const { getByTestId } = render(component);
      expect(getByTestId("app-big-calendar-header")).toBeInTheDocument();
    });

    test("renders current month sub header", () => {
      const { getByTestId } = render(component);
      const currentMonthHeader = getByTestId(
        "app-big-calendar-header-current-month"
      );
      expect(currentMonthHeader).toBeInTheDocument();
      expect(currentMonthHeader.textContent).toBe(
        format(currentDate.currentMonth, "MMMM yyyy")
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
      const days = getByTestId("app-big-calendar-days");
      const displayDateNames = Array.from(days.childNodes).map(
        day => day.textContent
      );
      expect(days).toBeInTheDocument();
      expect(displayDateNames).toEqual(ExpectedDateNames);
      expect(days.firstChild.textContent).toBe("Mon");
    });
    test("renders cells", () => {
      const { getByTestId } = render(component);
      const cells = getByTestId("app-big-calendar-cells");
      expect(cells).toBeInTheDocument();
      expect(cells.firstChild).toHaveClass("rows");
      expect(cells.firstChild.firstChild).toHaveClass("cell");
    });
    test("renders prev month button", () => {
      const { getByTestId } = render(component);
      expect(
        getByTestId("app-big-calendar-prev-month-button")
      ).toBeInTheDocument();
    });
    test("renders next month button", () => {
      const { getByTestId } = render(component);
      expect(
        getByTestId("app-big-calendar-next-month-button")
      ).toBeInTheDocument();
    });
  });
  describe("test behaivor", () => {
    describe("test changing month", () => {
      test("change to prev month", () => {
        const { getByTestId } = render(component);
        const prevMonthButton = getByTestId(
          "app-big-calendar-prev-month-button"
        );
        const header = getByTestId("app-big-calendar-header-current-month");
        const expectedMonth = format(
          subMonths(currentDate.currentMonth, 1),
          "MMMM yyyy"
        );
        fireEvent.click(prevMonthButton);
        expect(header.textContent).toBe(expectedMonth);
      });
      test("change to next month", () => {
        const { getByTestId } = render(component);
        const nextMonthButton = getByTestId(
          "app-big-calendar-next-month-button"
        );
        const header = getByTestId("app-big-calendar-header-current-month");
        const expectedMonth = format(
          addMonths(currentDate.currentMonth, 1),
          "MMMM yyyy"
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
