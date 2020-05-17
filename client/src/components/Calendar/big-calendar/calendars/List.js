import React from "react";
import CalendarCard from "./Card";
export default CalendarList = ({
  calendars = [],
  handleCalendarSelection,
  toggleEditCalendarModal,
  setSelectedCalendar,
  selectedCalendars,
}) => {
  return (
    <>
      {calendars.length > 0 &&
        calendars[0].map((calendar) => {
          return (
            <CalendarCard
              key={calendar.id}
              calendar={calendar}
              handleCalendarSelection={handleCalendarSelection}
              setSelectedCalendar={setSelectedCalendar}
              selectedCalendars={selectedCalendars}
              toggleEditCalendarModal={toggleEditCalendarModal}
            />
          );
        })}
    </>
  );
};
