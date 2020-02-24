import React from "react";
import { useSelector } from "react-redux";
import BigCalendar from "../../Calendar/big-calendar/";
export default function index() {
  const { calendars, events } = useSelector(({ calendars, events }) => ({
    calendars,
    events
  }));
  return (
    <div>
      <h1>My Calendars</h1>
      <BigCalendar events={events} calendars={calendars} />
    </div>
  );
}
