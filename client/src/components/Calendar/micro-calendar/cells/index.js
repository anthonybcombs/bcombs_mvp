import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import {
  format,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
  addDays,
  toDate
} from "date-fns";
const CellsStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  .cell {
    font-size: 0.8em;
    height: 1em;
    margin: 0.6em 0 0.8em 0;
    cursor: pointer;
  }
  .disabled {
    color: ${({ theme }) => theme.smallCalendar.cell.textColor.secondary};
  }
  .day {
    display: inline-block;
    position: relative;
  }
  .selected > .day {
    background-color: ${({ theme }) =>
      theme.smallCalendar.cell.backgroundColor.primary};
    color: ${({ theme }) => theme.smallCalendar.cell.textColor.primary};
    border-radius: 50%;
    padding: 0.6em;
    width: 1em;
    height: 1em;
    line-height: 1em;
  }
  .has-events {
    border: 1px solid
      ${({ theme }) => theme.smallCalendar.cell.border.color.primary};
    color: ${({ theme }) => theme.smallCalendar.cell.textColor.tertiary};
    border-radius: 50%;
    width: 1em;
    height: 1em;
    padding: 0.6em;
  }
  .events-count {
    display: inline-block;
    position: absolute;
    top: -8px;
    left: 23px;
    background-color: white !important;
    border-radius: 50%;
    padding: 0.6em;
    font-size: 0.6em;
    line-height: 0.6em;
    color: black;
    box-shadow: 0px 3px 6px #908e8e;
  }
  .selected .events-count {
    font-weight: bold;
  }
`;
export default function index({
  currentMonth,
  selectedDate,
  events,
  handleChangeDay
}) {
  const theme = useContext(ThemeContext);
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd);
  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";
  while (day <= endDate) {
    formattedDate = format(day, dateFormat);
    const cloneDay = day;
    const eventsOnThisDay = events.filter(
      event => format(event.date, "MM dd yyyy") === format(day, "MM dd yyyy")
    );
    const eventsCount = eventsOnThisDay.length;
    const hasEvents = eventsCount > 0;
    days.push(
      <div
        key={day}
        className={`cell ${
          !isSameMonth(day, monthStart)
            ? "disabled"
            : isSameDay(day, selectedDate)
            ? "selected"
            : ""
        }`}
        onClick={() => {
          handleChangeDay(toDate(cloneDay));
        }}
      >
        <span
          className={`day ${
            hasEvents && !isSameDay(day, selectedDate) ? "has-events" : ""
          }`}
        >
          {formattedDate}
          {eventsCount > 0 && (
            <span className="events-count">{eventsCount}</span>
          )}
        </span>
      </div>
    );
    day = addDays(day, 1);
    rows.push(
      <div className="rows" key={day}>
        {days}
      </div>
    );
    days = [];
  }
  return (
    <CellsStyled theme={theme} data-testid="app-micro-calendar-cells">
      {rows}
    </CellsStyled>
  );
}
