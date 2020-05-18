import React, { useState, useEffect } from "react";
import MonthViewCalendar from "./month-calendar";
import WeekViewCalendar from "./week-calendar";
export default function index({
  auth,
  contacts,
  events,
  calendars,
  familyMembers,
}) {
  const [calendarType, setCalendarType] = useState(
    sessionStorage.getItem("bigCalendarViewMonth") === null
      ? "month"
      : sessionStorage.getItem("bigCalendarViewMonth")
  );
  const [selectedCalendars, setSelectedCalendars] = useState([]);
  useEffect(() => {
    if (sessionStorage.getItem("bigCalendarViewType") === null) {
      sessionStorage.setItem("bigCalendarViewType", "month");
      return;
    }
    if (calendarType !== sessionStorage.getItem("bigCalendarViewType")) {
      setCalendarType(sessionStorage.getItem("bigCalendarViewType"));
    }
  });
  const handleChangeCalendarType = (type) => {
    sessionStorage.setItem("bigCalendarViewType", type);
    setCalendarType(type);
  };
  const handleCalendarSelection = (id) => {
    if (selectedCalendars.includes(id)) {
      setSelectedCalendars(
        selectedCalendars.filter((calendarId) => {
          return calendarId !== id;
        })
      );
      return;
    }
    setSelectedCalendars([...selectedCalendars, id]);
  };

  return (
    <>
      {calendarType === "month" && (
        <MonthViewCalendar
          auth={auth}
          contacts={contacts}
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
          auth={auth}
          contacts={contacts}
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
