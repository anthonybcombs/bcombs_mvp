import React, { useState } from "react";
import { useSelector } from "react-redux";
import MonthViewCalendar from "./month-calendar";
import WeekViewCalendar from "./week-calendar";
export default function index({ events, calendars }) {
  const [calendarType, setCalendarType] = useState("month");
  const [selectedCalendars, setSelectedCalendars] = useState([]);
  const handleChangeCalendarType = type => {
    setCalendarType(type);
  };
  const handleCalendarSelection = id => {
    if (selectedCalendars.includes(id)) {
      setSelectedCalendars([
        ...selectedCalendars.filter(calendarId => {
          calendarId === id;
        })
      ]);
      return;
    }
    setSelectedCalendars([...selectedCalendars, id]);
  };
  return (
    <>
      {calendarType === "month" && (
        <MonthViewCalendar
          events={events}
          calendars={calendars}
          calendarType={calendarType}
          selectedCalendars={selectedCalendars}
          handleChangeCalendarType={handleChangeCalendarType}
          handleCalendarSelection={handleCalendarSelection}
        />
      )}
      {calendarType === "week" && (
        <WeekViewCalendar
          events={events}
          calendars={calendars}
          calendarType={calendarType}
          selectedCalendars={selectedCalendars}
          handleChangeCalendarType={handleChangeCalendarType}
          handleCalendarSelection={handleCalendarSelection}
        />
      )}
    </>
  );
}
