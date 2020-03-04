import React, { useState } from "react";
import MonthViewCalendar from "./month-calendar";
import WeekViewCalendar from "./week-calendar";
export default function index({ events, calendars, familyMembers }) {
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
          familyMembers={familyMembers}
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
          familyMembers={familyMembers}
        />
      )}
    </>
  );
}