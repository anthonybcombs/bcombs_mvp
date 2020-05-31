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

const EventSliderStyled = styled.div`
  scroll-behavior: smooth;
  overflow-x: hidden;
  max-height: 400px;

  .table-container {
    white-space: nowrap;
    width: 100%;
    max-width: 800px;
    display: flex;
    min-height: 400px;
  }

  .rows {
    display: inline-block;
    width: 800px;
    padding: 20px;
    padding-top: 0;
  }
  
  .events-container {
    box-shadow: 0px 3px 6px #908e8e;
    padding: 5px;
  }

  .single-event {
    padding: 5px 30px;
    min-width: 295px;
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
    white-space: normal !important;
    word-break: break-all !important;
  }

  .single-event > div {
    margin: 10px 0;
    white-space: normal !important;
    word-break: break-all !important;
  }

  .single-event.no-event {
    color: #444;
  }

  // @media screen and (min-width: 992px) {
  //   .single-event {
  //     min-width: 295px;
  //   }
  // }

  // @media screen and (min-width: 1281px) {
  //   .single-event {
  //     min-width: 480px;
  //   }
  // }


`;

export default function index({
  setCurrentMonth,
  events,
  selectedDate,
  scrollValue,
  selectedMonth,
  selectedCalendar
}) {

  console.log("SELECTED Date date ", selectedDate);
  const myRef = useRef(null)

  const [horizontal, setHorizontal] = useState(1);

  const monthStart =  startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);

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

      let isSelected = false;

      if(selectedCalendar.length > 0) {
        isSelected = selectedCalendar.filter(c => c == event.calendar_id).length > 0;
      }

      if(!isSelected) {
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
          filterevents.push((
            <div className="single-event" style={{backgroundColor: event.color}}>
              <h3>{event.name}</h3>
              <div>{format(startDate, "hh:mm aa")}</div>
              <div>{event.location}</div>
            </div>
          ))
        }
      }
    }

    if(filterevents.length <= 0) {
      filterevents.push((
        <div className="single-event no-event">
          <h3>No events available.</h3>
        </div>
      ))
    }

    return (
      <div className={filterevents.length > 0 ? "events-container": ""}>
        {filterevents}
      </div>
    )
  }

  while(day <= endDate) {
    formattedDate = format(day, "eee, MMM dd").toUpperCase();
    days.push(
      <div className="events-day">
        <h3>{formattedDate}</h3>
        {getEventsByDate(day)}
      </div>
    )
    day = addDays(day, 1);
    rows.push(
      <div className="rows">
        {days}
      </div>
    )
    days = []
  }

  rows.push((
    <div className="rows">
      <div className="single-event filler"></div>
    </div>
  ))
  const scrollToRef = (ref) => { 
    if(ref && ref.current != null && ref.current.childNodes[0].childNodes[0]) {
      if(scrollValue > 1) {
        let scrollWidth = ref.current.scrollWidth;
        let childWidth = ref.current.childNodes[0].childNodes[0].offsetWidth ;
        
        ref.current.scrollLeft = (childWidth) * (scrollValue - 1);
      } else {
        ref.current.scrollLeft = 0;
      }
    }
  }

  if(scrollValue > 0) {
    scrollToRef(myRef);
  }
  return (
    <EventSliderStyled ref={myRef}>
      <div className="table-container">
        {rows}
      </div>
    </EventSliderStyled>
  )
}