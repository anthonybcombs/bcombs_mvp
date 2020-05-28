import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  addDays
} from "date-fns";

const EventSliderStyled = styled.div`

  white-space: nowrap;
  width: 100%;
  max-width: 500px;
  display: flex;

  .rows {
    display: inline-block;
    width: 500px;
    padding: 20px;
  }

  .rows:first-child {
    padding-left: 0;
  }

  .rows:last-child {
    padding-right: 0;
  }

  .events-container {
    box-shadow: 0px 3px 6px #908e8e;
    padding: 10px;
  }

  .single-event {
    padding: 5px 30px;
    min-width: 360px;
    color: #fff;
    margin: 5px 0;
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
  setCurrentMonth,
  events,
  selectedDate,
  selectedCalendar
}) {

  const [currentDate, setCurrentDate] = useState({
    currentMonth: new Date(),
    selectedDate
  });

  useEffect(() => {
    if (currentDate.currentMonth && setCurrentMonth) {
      setCurrentMonth(currentDate.currentMonth);
    }
  }, [currentDate]);

  const monthStart =  startOfMonth(currentDate.currentMonth);
  const monthEnd = endOfMonth(currentDate.currentMonth);

  const startDate = startOfDay(monthStart);
  const endDate = endOfDay(monthEnd);

  const rows = [];

  let days = [];
  let day = startDate;
  let formattedDate = "";

  let width;

  const getEventsByDate = (date) => {

    const filterevents = [];

    for(const event of events) {
      const startDate = new Date(event.start_of_event);
      if(format(date, "MM dd yyyy") === format(startDate, "MM dd yyyy")) {
        console.log("Time ", startDate);
        filterevents.push((
          <div className="single-event" style={{backgroundColor: event.color}}>
            <h3>{event.name}</h3>
            <div>{format(startDate, "hh:mm aa")}</div>
            <div>{event.location}</div>
          </div>
        ))
      }
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

  width = rows.length * 500;

  console.log("WIDTH ", width);

  console.log("EVENTS", events)

  return (
    <EventSliderStyled className="table-container">
      {rows}
    </EventSliderStyled>
  )
}