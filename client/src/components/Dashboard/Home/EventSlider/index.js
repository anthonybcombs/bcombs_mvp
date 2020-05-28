import React, { useEffect, useState, useRef } from "react";
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
  scrollValue
}) {

  const myRef = useRef(null)

  const [currentDate, setCurrentDate] = useState({
    currentMonth: new Date(),
    selectedDate
  });

  const [horizontal, setHorizontal] = useState(1);

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

  console.log("scrollValue ", scrollValue);

  const getEventsByDate = (date) => {

    const filterevents = [];

    for(const event of events) {
      const startDate = new Date(event.start_of_event);
      if(format(date, "MM dd yyyy") === format(startDate, "MM dd yyyy")) {
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
  const scrollToRef = (ref) => { 
    if(ref && ref.current) {
      console.log("REF REF" , ref); 
      if(scrollValue > 1) {
        let scrollWidth = ref.current.scrollWidth;
        ref.current.scrollLeft = (scrollWidth / 35) * scrollValue;
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