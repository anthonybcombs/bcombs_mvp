import React from "react";
import { useSelector } from "react-redux";
import BigCalendar from "../../Calendar/big-calendar/";
export default function index() {
  const events = useSelector(({ events }) => events);
  return (
    <div>
      <h1>My Calendars</h1>
      <BigCalendar events={events} />
    </div>
  );
}
