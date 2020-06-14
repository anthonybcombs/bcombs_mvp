import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { subMonths, addMonths, startOfMonth, format } from "date-fns";
import Header from "./header";
import Days from "./days";
import Cells from "./cells";
const SmallCalendarStyled = styled.div`
  padding: 1em 1em 1em 1em;
  border: 1px solid lightgrey;
  border-radius: 30px;
  background-color: white;
`;
export default function index({
  events = [],
  selectedDate,
  setSelectedDate,
  setSelectedEvent,
  setCurrentMonth,
  removeSubHeader = false
}) {
  const [currentDate, setCurrentDate] = useState({
    currentMonth: new Date(),
    selectedDate
  });

  useEffect(() => {
    if (currentDate.currentMonth && setCurrentMonth) {
      setCurrentMonth(currentDate.currentMonth);
    }
  }, [currentDate]);

  const handleChangeMonth = operation => {
    let currentMonth;
    if (operation === "next") {
      currentMonth = addMonths(currentDate.currentMonth, 1);
    } else {
      currentMonth = subMonths(currentDate.currentMonth, 1);
    }
    const firstDayOfTheMonth = startOfMonth(currentMonth);
    setSelectedEvent();
    setSelectedDate(startOfMonth(currentMonth));
    setCurrentDate({
      ...currentDate,
      currentMonth,
      selectedDate: firstDayOfTheMonth
    });
  };

  const handleChangeDay = day => {
    setSelectedEvent();
    setCurrentDate({ ...currentDate, selectedDate: day });
    setSelectedDate(day);
  };
  
  return (
    <SmallCalendarStyled data-testid="app-small-calendar" id="small-calendar">
      {!removeSubHeader && (
        <h2 data-testid="app-small-calendar-header-current-month-year">
          {format(currentDate.currentMonth, "MMMM yyyy")}
        </h2>
      )}
      <Header
        currentMonth={currentDate.currentMonth}
        handleChangeMonth={handleChangeMonth}
        removeSubHeader={removeSubHeader}
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
