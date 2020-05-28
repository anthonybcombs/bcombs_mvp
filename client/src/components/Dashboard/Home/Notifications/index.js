import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
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

const NotificationStyled = styled.div`
  overflow-x: hidden;
  .table-container {
    white-space: nowrap;
    width: 100%;
    max-width: 500px;
    display: flex;
  }

  .rows {
    display: inline-block;
    width: 500px;
    padding: 20px;
    padding-top: 0;
  }
  
  .events-container {
    box-shadow: 0px 3px 6px #908e8e;
    padding: 5px;
  }

  .single-event {
    padding: 5px 30px;
    min-width: 360px;
    color: #fff;
    margin-bottom: 5px;
  }

  .single-event:last-child {
    margin-bottom: 0;
  }

  .single-event h3 {
    margin: 0;
    margin: 10px 0;
    font-weight: normal;
  }

  .single-event > div {
    margin: 10px 0;
  }
`;

export default function index({
  events,
}) {

  const currentDate = new Date();


  const monthStart =  startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const startDate = startOfDay(monthStart);
  const endDate = endOfDay(monthEnd);

  const rows = [];

  let days = [];
  let day = startDate;
  let formattedDate = "";

  const getEventsByDate = (day) => {

    const filterevents = [];
    let currentDay = new Date(day).getDay();
    for(const event of events) {
      let pushEvent = false;

      const startDate = new Date(event.start_of_event);

      let isDateAfter = isAfter(new Date(day), new Date(event.start_of_event));
      let isBeforeRecurringEndDate = null;

      let checkRecurringEndDate =
        (event.recurring_end_date && isBeforeRecurringEndDate) ||
        (!event.recurring_end_date && !isBeforeRecurringEndDate);

      let startEventDay = new Date(event.start_of_event).getDay();
      let endEventDay = new Date(event.end_of_event).getDay();

      if (event.recurring_end_date) {
        isBeforeRecurringEndDate = isBefore(
          new Date(day),
          new Date(event.recurring_end_date)
        );
      }

      if(format(day, "MM dd yyyy") === format(startDate, "MM dd yyyy")) { 
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
      }

      if(pushEvent) {
        filterevents.push((
          <div className="panel-body">{event.name}</div>
        ))
      }

    }

    return (
      <div className={filterevents.length > 0 ? "events-container": ""}>
        {filterevents}
      </div>
    )
  }

  return (
    <NotificationStyled>
      {getEventsByDate(currentDate)}
    </NotificationStyled>
  )
}