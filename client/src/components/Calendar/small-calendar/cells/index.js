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
  toDate,
  eachDayOfInterval,
  isAfter,
  getMonth,
  getYear,
  isBefore,
  startOfDay,
  endOfDay
} from "date-fns";

import { getWeekIndex } from "../../../../helpers/datetime";

const CellsStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  .cell {
    font-size: 1em;
    height: 1em;
    margin: 1em 0 1em 0;
    cursor: pointer;
    display: inline-block;
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
    width: 1.1em;
    height: 1.1em;
    line-height: 1.1em;
    margin: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .has-events {
    border: 1px solid
      ${({ theme }) => theme.smallCalendar.cell.border.color.primary};
    color: ${({ theme }) => theme.smallCalendar.cell.textColor.tertiary};
    border-radius: 50%;
    width: 1em;
    height: 1em;
    padding: 0.6em;
    margin: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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
  console.log("event startDate", startDate);
  console.log("event data", events);
  while (day <= endDate) {
    formattedDate = format(day, dateFormat);
    const cloneDay = day;
    // const eventsOnThisDay = events.filter(
    //   event =>
    //     format(new Date(event.start_of_event), "MM dd yyyy") ===
    //     format(day, "MM dd yyyy")
    // );

    const filterevents = [];
    let currentDay = new Date(day).getDay();
    for(const event of events) {
      let pushEvent = false;
      const startDate = new Date(event.start_of_event);

      let isDateAfter = isAfter(new Date(day), new Date(event.start_of_event));
      let isBeforeRecurringEndDate = null;

      let startEventDay = new Date(event.start_of_event).getDay();
      let endEventDay = new Date(event.end_of_event).getDay();

      if (event.recurring_end_date) {
        isBeforeRecurringEndDate = isBefore(
          new Date(day),
          new Date(event.recurring_end_date)
        );
      }

      let checkRecurringEndDate =
      (event.recurring_end_date && isBeforeRecurringEndDate) ||
      (!event.recurring_end_date && !isBeforeRecurringEndDate);

      if(format(day, "MM dd yyyy") === format(startDate, "MM dd yyyy")) { 
        pushEvent = true;
      } else if (isDateAfter && event.recurring === "Daily" && checkRecurringEndDate) {
        pushEvent = true;
      } else if(
        isDateAfter &&
        event.recurring === "Weekly" && 
        checkRecurringEndDate) {

        if (currentDay === startEventDay || currentDay === endEventDay) {
          pushEvent = true;
        }

      } else if (
        isDateAfter &&
        event.recurring === "Monthly" &&
        checkRecurringEndDate
      ) {
        let currentWeekIndex = getWeekIndex(new Date(day).getDate());
        let eventWeekIndex = getWeekIndex(
          new Date(event.start_of_event).getDate()
        );

        if (
          currentWeekIndex === eventWeekIndex &&
          (currentDay === startEventDay || currentDay === endEventDay) &&
          getMonth(new Date(day)) !== getMonth(new Date(event.start_of_event))
        ) {
          pushEvent = true;
        }
      } else if (
        isDateAfter &&
        event.recurring === "Annually" &&
        checkRecurringEndDate
      ) {
        let currentWeekIndex = getWeekIndex(new Date(day).getDate());
        let eventWeekIndex = getWeekIndex(
          new Date(event.start_of_event).getDate()
        );
        if (
          (currentDay === startEventDay || currentDay === endEventDay) &&
          currentWeekIndex === eventWeekIndex &&
          getMonth(new Date(day)) ===
            getMonth(new Date(event.start_of_event)) &&
          getYear(new Date(day)) !== getYear(new Date(event.start_of_event))
        ) {
          pushEvent = true;
        }
      }

      if(pushEvent) {
        filterevents.push(event);
      }
    }

    // const eventsCount = eventsOnThisDay.length;
    const eventsCount = filterevents.length;
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
        }}>
        <span
          className={`day ${
            hasEvents && !isSameDay(day, selectedDate) ? "has-events" : ""
          }`}>
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
    <CellsStyled theme={theme} data-testid="app-small-calendar-cells">
      {rows}
    </CellsStyled>
  );
}
