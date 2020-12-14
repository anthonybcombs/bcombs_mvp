import React, { useContext, useState } from "react";
import styled, { ThemeContext } from "styled-components";
import {
  compareAsc,
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
  isBefore
} from "date-fns";
import Event from "../../event";

import { getWeekIndex } from "../../../../../helpers/datetime";

const CellsStyled = styled.div`
  padding: .5rem 2rem 4rem;

  .big-calendar-cells-wrapper {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    text-align: center;

    grid-gap: 1px;
    padding: 1px;
    // background: lightgrey;
    background: #EFEFEF;
  }

  .rows {
    background: #fff;
  }

  .cell {
    position: relative;
    font-size: 1em;
    height: 150px;

    width: 100%;
    overflow: hidden !important;
    cursor: pointer;
    // border: 1px solid lightgrey;

    color: grey;
  }
  .disabled {
    color: ${({ theme }) => theme.smallCalendar.cell.textColor.secondary};

    // background: #F4F4F4;
    // background: rgba(211, 211, 211, 0.25);
    background: rgba(239, 239, 239, 0.35);
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
    display: inline-block !important;
    top: 50px;
    left: 0;
    width: 100%;
    height: 100px;
    overflow: hidden;
  }
  .all-events {
    position: absolute;
    font-weight: 500;
    text-align: left;
    font-size: 14px;
    color: black;
    bottom: 15px;
    left: 4px;
  }
`;

export default function index({
  auth,
  calendars,
  currentMonth,
  isTimedDisplay,
  selectedDate,
  selectedCalendars,
  events,
  handleChangeDay,
  setIsEventModalVisible,
  publicView,
  handleViewEvent,
  vendors
}) {
  const theme = useContext(ThemeContext);
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd);
  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    formattedDate = format(day, dateFormat);
    const cloneDay = day;
    let currentDay = new Date(day).getDay();
    let eventsOnThisDay = events.filter(event => {
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
      if (isDateAfter && event.recurring === "Daily" && checkRecurringEndDate) {
        return true;
      } else if (
        isDateAfter &&
        event.recurring === "Weekly" &&
        checkRecurringEndDate
      ) {
        if (currentDay === startEventDay || currentDay === endEventDay) {
          return true;
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
          return true;
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
          return true;
        }
      }

      const dateRange = eachDayOfInterval({
        start: new Date(event.start_of_event),
        end: new Date(event.end_of_event)
      });

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

      if (eventsOnThisDay.length > 0) {
        eventsOnThisDay = eventsOnThisDay.sort(
          (event1, event2) => event1.start_of_event - event2.start_of_event
        );
        console.log("eventsOnThisDyyyay", eventsOnThisDay);
      }
    }

    // console.log("eventsOnThisDay 111", eventsOnThisDay);
    const eventsCount = eventsOnThisDay.length;
    console.log('eventsCount: ', eventsCount)
    const filteredEvents = eventsOnThisDay
      .filter(event => selectedCalendars.includes(event.calendar_id))
      .sort(
        (event1, event2) =>
          new Date(event1.start_of_event) - new Date(event2.start_of_event)
      );
    console.log("filteredEvents", filteredEvents);
    const hasEvents = eventsCount > 0;
    const showedEvents =
      eventsCount > 2
        ? filteredEvents.filter((item, index) => index < 2)
        : filteredEvents;

    console.log("formattedDateeeeeeeeeeeeee", formattedDate);
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
        style={{ cursor: `${!publicView ? "pointer" : "default"}` }}
        onClick={() => {
          if (!publicView) {
            handleChangeDay(toDate(cloneDay));
          }
        }}
        onDoubleClick={e => {
          let isAllCalendarOwned = false;

          if (selectedCalendars.length > 0) {
            isAllCalendarOwned = selectedCalendars
              .filter(id => calendars.find(cal => cal.id === id))
              .every(id => {
                return calendars.find(
                  cal => cal.id === id && auth.user_id === cal.user_id
                );
              });
          }

          if (!publicView && isAllCalendarOwned) {
            handleChangeDay(toDate(cloneDay));
            setIsEventModalVisible(true);
          }
        }}>
        <span
          className={`day ${
            hasEvents && !isSameDay(day, selectedDate) ? "has-events" : ""
          }`}>
          {formattedDate}
        </span>
        <div id="events-list">
          {showedEvents.map((event, key) => {
            return (
              <Event
                auth={auth}
                calendars={calendars || []}
                eventsCount={eventsCount}
                event={event}
                day={day}
                isTimedDisplay={isTimedDisplay}
                key={key}
                selectedCalendars={selectedCalendars}
                publicView={publicView}
                vendors={vendors}
              />
            );
          })}
        </div>
        {filteredEvents.length > 2 && (
          <div
            onClick={() => {
              handleViewEvent(filteredEvents);
            }}
            className="all-events">
            {filteredEvents.length - 2} more
          </div>
        )}
      </div>
    );
    day = addDays(day, 1);
    console.log("DAYYYYYYYYYYYYYYYYYYY", day);
    rows.push(
      <div className="rows" key={day}>
        {days}
      </div>
    );
    days = [];
  }
  return (
    <CellsStyled theme={theme} data-testid="app-big-calendar-cells">
      <div className="big-calendar-cells-wrapper">
        {rows}
      </div>
    </CellsStyled>
  );
}
