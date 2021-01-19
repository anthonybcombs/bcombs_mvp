import React, { useState, useEffect } from "react";
import MonthViewCalendar from "./month-calendar";
import WeekViewCalendar from "./week-calendar";
import Search from "./search";
export default function index({
  auth,
  contacts,
  events,
  calendars,
  familyMembers,
  publicView = false
}) {
  const [calendarType, setCalendarType] = useState(
    sessionStorage.getItem("bigCalendarViewMonth") === null
      ? "month"
      : sessionStorage.getItem("bigCalendarViewMonth")
  );
  const [selectedCalendars, setSelectedCalendars] = useState(
    localStorage.getItem("selectedCalendars") !== null
      ? JSON.parse(localStorage.getItem("selectedCalendars"))
      : []
  );
  useEffect(() => {
    if (sessionStorage.getItem("bigCalendarViewType") === null) {
      sessionStorage.setItem("bigCalendarViewType", "month");
      return;
    }
    if (calendarType !== sessionStorage.getItem("bigCalendarViewType")) {
      setCalendarType(sessionStorage.getItem("bigCalendarViewType"));
    }
  }, []);
  const handleChangeCalendarType = type => {
    sessionStorage.setItem("bigCalendarViewType", type);
    setCalendarType(type);
  };
  const handleCalendarSelection = id => {
    if (Array.isArray(id)) {
      localStorage.setItem("selectedCalendars", JSON.stringify(id));
      setSelectedCalendars(id);
      return;
    }
    if (selectedCalendars.includes(id)) {
      localStorage.setItem(
        "selectedCalendars",
        JSON.stringify(
          selectedCalendars.filter(calendarId => {
            return calendarId !== id;
          })
        )
      );
      setSelectedCalendars(
        selectedCalendars.filter(calendarId => {
          return calendarId !== id;
        })
      );
      return;
    }
    localStorage.setItem(
      "selectedCalendars",
      JSON.stringify([...selectedCalendars, id])
    );
    setSelectedCalendars([...selectedCalendars, id]);
  };
  console.log("calendarsssssssss", calendars);
  return (
    <>
      {!publicView && (
        <Search handleCalendarSelection={handleCalendarSelection} />
      )}
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
          publicView={publicView}
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
          publicView={publicView}
        />
      )}
    </>
  );
}
