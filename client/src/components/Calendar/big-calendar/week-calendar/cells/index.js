import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import {
  format,
  isSameWeek,
  isSameHour,
  startOfWeek,
  endOfWeek,
  isSameDay,
  startOfHour,
  endOfHour,
  toDate,
  getHours,
  addDays
} from "date-fns";
import Event from "../../event";
const CellsStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  text-align: center;
  .cell {
    position: relative;
    font-size: 1em;
    height: 200px;
    width: auto;
    cursor: pointer;
    border: 1px solid lightgrey;
  }
  .disabled {
    color: ${({ theme }) => theme.smallCalendar.cell.textColor.secondary};
  }
  .day {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    margin: 0.5em 0.5em 0 0;
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
  #events-list {
    position: relative;
    top: 50px;
    left: 0;
    width: 100%;
    height: 200px;
    overflow: auto;
  }
  .time-cells {
    display: block;
    margin: 6em auto;
  }
`;
var suffix = hours => (hours >= 12 ? "PM" : "AM");
export default function index({
  currentWeek,
  selectedDate,
  events,
  handleChangeDay
}) {
  const theme = useContext(ThemeContext);
  const startDate = startOfWeek(currentWeek);
  const endDate = endOfWeek(currentWeek);
  const hourList = [...Array(24).keys()];
  const rows = [];
  let columns = [];
  let day = startDate;
  hourList.forEach(hour => {
    const formattedHours = ((hour + 11) % 12) + 1;
    columns.push(
      <div key="time" className="time-cells">{`${formattedHours}:00 ${suffix(
        formattedHours
      )}`}</div>
    );
    while (day <= endDate) {
      columns.push(
        <div
          key={hour}
          className={`cell ${
            isSameHour(getHours(selectedDate), hour) ? "selected" : ""
          }`}
        >
          {hour}
        </div>
      );
      rows.push(columns);
      columns = [];
      day = addDays(day, 1);
    }
    day = startDate;
  });
  return (
    <CellsStyled theme={theme} data-testid="app-big-calendar-cells">
      {rows}
    </CellsStyled>
  );
}
