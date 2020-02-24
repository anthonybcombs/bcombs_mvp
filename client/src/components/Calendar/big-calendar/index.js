import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { subMonths, addMonths, startOfMonth, format } from "date-fns";
import Header from "./header";
import Days from "./days";
import Cells from "./cells";
const BigCalendarStyled = styled.div`
  background-color: white;
  width: 100%;
`;
export default function index({ events, calendars }) {
  const [calendarType, setCalendarType] = useState("month");
  const [selectedCalendars, setSelectedCalendars] = useState([]);
  const [currentDate, setCurrentDate] = useState({
    currentMonth: new Date(),
    selectedDate: new Date()
  });
  const handleChangeMonth = operation => {
    let currentMonth;
    if (operation === "next") {
      currentMonth = addMonths(currentDate.currentMonth, 1);
    } else {
      currentMonth = subMonths(currentDate.currentMonth, 1);
    }
    const firstDayOfTheMonth = startOfMonth(currentMonth);
    setCurrentDate({
      ...currentDate,
      currentMonth,
      selectedDate: firstDayOfTheMonth
    });
  };
  const handleChangeDay = day => {
    setCurrentDate({
      ...currentDate,
      selectedDate: day
    });
  };
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
    <BigCalendarStyled data-testid="app-big-calendar">
      <Header
        currentMonth={currentDate.currentMonth}
        handleChangeMonth={handleChangeMonth}
        calendars={calendars}
        calendarType={calendarType}
        handleChangeCalendarType={handleChangeCalendarType}
        selectedCalendars={selectedCalendars}
        handleCalendarSelection={handleCalendarSelection}
      />
      <Days currentMonth={currentDate.currentMonth} />
      <Cells
        events={events}
        currentMonth={currentDate.currentMonth}
        selectedDate={currentDate.selectedDate}
        handleChangeDay={handleChangeDay}
      />
    </BigCalendarStyled>
  );
}
