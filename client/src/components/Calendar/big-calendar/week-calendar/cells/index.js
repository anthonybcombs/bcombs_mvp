import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import {
  format,
  isSameHour,
  startOfWeek,
  endOfWeek,
  parseISO,
  getHours,
  addDays,
  isWithinInterval,
  isAfter,
  getMonth,
  getYear,
  isBefore
} from "date-fns";
import Event from "../../event";

import { getWeekIndex } from "../../../../../helpers/datetime";

const CellsStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  text-align: center;
  .cell {
    position: relative;
    font-size: 1em;
    height: 200px;
    width: auto;
    max-width: 232px;
    cursor: pointer;
    border: 1px solid lightgrey;
    text-align: center;
  }
  .cell > p {
    display: block;
    position: absolute;
    top: 4em;
    left: 2.8em;
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
    top:0
    left: 0;
    width: 100%;
    height: 200px;
    overflow: auto;
  }
`;
var suffix = hours => (hours >= 12 ? "PM" : "AM");

const getUTCDate = (dateString = Date.now()) => {
  const date = new Date(dateString);

  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
};

export default function index({
  auth,
  currentWeek,
  selectedDate,
  events,
  handleChangeDay,
  selectedCalendars,
  setIsEventModalVisible,
  publicView
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
      <div key="time" className="cell">
        <p>{`${formattedHours}:00 ${suffix(hour)}`}</p>
      </div>
    );
    while (day <= endDate) {
      const currentDateTime = parseISO(
        `${format(day, "yyyy-MM-dd")}T${hour < 10 ? `0${hour}` : hour}:00:00`
      );
      let currentDay = new Date(day).getDay();
      let eventsOnThisDay = events.filter(event => {
        let isDateAfter = isAfter(
          new Date(day),
          new Date(event.start_of_event)
        );
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

        if (
          isDateAfter &&
          event.recurring === "Daily" &&
          checkRecurringEndDate
        ) {
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

        return isWithinInterval(currentDateTime, {
          // start: subHours(new Date(event.start_of_event), 1),
          start: new Date(event.start_of_event),
          end: new Date(event.end_of_event)
        });
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
      }
      const eventsCount = eventsOnThisDay.length;
      const hasEvents = eventsCount > 0;
      columns.push(
        <div
          key={hour}
          className={`cell ${
            isSameHour(getHours(selectedDate), hour) ? "selected" : ""
          }`}
          style={{ cursor: `${!publicView ? "pointer" : "default"}` }}
          onDoubleClick={e => {
            if (!publicView) {
              handleChangeDay(currentDateTime);
              setIsEventModalVisible(true);
            }
          }}>
          {hasEvents && (
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
          )}
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
