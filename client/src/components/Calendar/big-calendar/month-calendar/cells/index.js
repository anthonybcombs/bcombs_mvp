import React, { useContext, useState } from "react";
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
  eachDayOfInterval
} from "date-fns";
import Event from "../../event";
const CellsStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
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
`;
export default function index({
  auth,
  currentMonth,
  selectedDate,
  selectedCalendars,
  events,
  handleChangeDay,
  setIsEventModalVisible
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
  console.log("selectedCalendars", selectedCalendars);
  while (day <= endDate) {
    formattedDate = format(day, dateFormat);
    const cloneDay = day;
    let eventsOnThisDay = events.filter(event => {
      const dateRange = eachDayOfInterval({
        start: new Date(event.start_of_event),
        end: new Date(event.end_of_event)
      });
      console.log("dateRange", dateRange);
      if (dateRange != undefined) {
        return (
          dateRange.filter(intervalDate => isSameDay(intervalDate, cloneDay))
            .length > 0
        );
      }
    });

    if (selectedCalendars.length > 1) {
      eventsOnThisDay = eventsOnThisDay.reduce((accumulator, item, index) => {
        if (index === 0) return [...accumulator, item];
        console.log("accumulator[index - 1]", accumulator[index - 1]);
        if (accumulator[index - 1] && item.id === accumulator[index - 1].id) {
          accumulator[index - 1] = {
            ...accumulator[index - 1],
            multi_color: [
              ...(accumulator[index - 1].multi_color || []),
              accumulator[index - 1].color,
              item.color
            ]
          };
          return [...accumulator];
        }

        return [...accumulator, item];
      }, []);
    }

    // console.log("eventsOnThisDay 111", eventsOnThisDay);
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
        onDoubleClick={e => {
          handleChangeDay(toDate(cloneDay));
          setIsEventModalVisible(true);
        }}>
        <span
          className={`day ${
            hasEvents && !isSameDay(day, selectedDate) ? "has-events" : ""
          }`}>
          {formattedDate}
        </span>
        <div id="events-list">
          {eventsOnThisDay.map((event, key) => {
            if (selectedCalendars.includes(event.calendar_id)) {
              return (
                <Event
                  auth={auth}
                  event={event}
                  day={day}
                  key={key}
                  selectedCalendars={selectedCalendars}
                />
              );
            }
          })}
        </div>
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
    <CellsStyled theme={theme} data-testid="app-big-calendar-cells">
      {rows}
    </CellsStyled>
  );
}
