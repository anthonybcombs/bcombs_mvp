import React, { useState } from "react";
import styled from "styled-components";
import { subWeeks, addWeeks, startOfWeek } from "date-fns";
import Header from "./header";
import Days from "./days";
import Cells from "./cells";
const WeekViewStyled = styled.div`
  background-color: white;
  width: 100%;
`;
export default function index({
  events,
  calendars,
  calendarType,
  handleChangeCalendarType,
  selectedCalendars,
  handleCalendarSelection
}) {
  const [currentDate, setCurrentDate] = useState({
    currentWeek: new Date(),
    selectedDate: new Date()
  });
  const handleWeekChange = operation => {
    let currentWeek;
    if (operation === "next") {
      currentWeek = addWeeks(currentDate.currentWeek, 1);
    } else {
      currentWeek = subWeeks(currentDate.currentWeek, 1);
    }
    const firstWeekOfTheMonth = startOfWeek(currentWeek);
    setCurrentDate({
      ...currentDate,
      currentWeek,
      selectedDate: firstWeekOfTheMonth
    });
  };
  const handleChangeDay = day => {
    setCurrentDate({
      ...currentDate,
      selectedDate: day
    });
  };
  return (
    <WeekViewStyled data-testid="app-big-calendar">
      <Header
        currentWeek={currentDate.currentWeek}
        handleWeekChange={handleWeekChange}
        calendars={calendars}
        calendarType={calendarType}
        handleChangeCalendarType={handleChangeCalendarType}
        selectedCalendars={selectedCalendars}
        handleCalendarSelection={handleCalendarSelection}
      />
      <Days currentWeek={currentDate.currentWeek} />
      <Cells currentWeek={currentDate.currentWeek} events={events} />
    </WeekViewStyled>
  );
}
