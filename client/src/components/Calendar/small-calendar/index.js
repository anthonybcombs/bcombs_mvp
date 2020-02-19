import React, { useState } from "react";
import styled from "styled-components";
import { subMonths, addMonths, addDays, format } from "date-fns";
import Header from "./header";
import Days from "./days";
import Cells from "./cells";
const SmallCalendarStyled = styled.div`
  padding: 2em;
  border: 1px solid lightgrey;
  position: relative;
  top: 10px;
  border-radius: 30px;
  background-color: white;
`;
export default function index({
  events = [
    { name: "testing event 2", date: addDays(new Date(), 1) },
    { name: "testing event 2", date: new Date() },
    { name: "testing event 2", date: new Date() }
  ]
}) {
  const [currentDate, setCurrentDate] = useState({
    currentMonth: new Date(),
    selectedDate: new Date()
  });
  const handlePrevMonth = () => {
    setCurrentDate({
      ...currentDate,
      currentMonth: subMonths(currentDate.currentMonth, 1)
    });
  };
  const handleNextMonth = () => {
    setCurrentDate({
      ...currentDate,
      currentMonth: addMonths(currentDate.currentMonth, 1)
    });
  };
  const handleChangeDay = day => {
    setCurrentDate({ ...currentDate, selectedDate: day });
  };
  return (
    <SmallCalendarStyled data-testid="app-small-calendar">
      <h2 data-testid="app-small-calendar-header-current-month-year">
        {format(currentDate.currentMonth, "MMM yyyy")}
      </h2>
      <Header
        currentMonth={currentDate.currentMonth}
        handleNextMonth={handleNextMonth}
        handlePrevMonth={handlePrevMonth}
      />
      <Days currentMonth={currentDate.currentMonth} />
      <Cells
        events={events}
        currentMonth={currentDate.currentMonth}
        selectedDate={currentDate.selectedDate}
        handleChangeDay={handleChangeDay}
      />
    </SmallCalendarStyled>
  );
}
