import React, { useState } from "react";
import styled from "styled-components";
import { subMonths, addMonths, startOfMonth, format } from "date-fns";
import { events } from "../../../helpers/dummyData";
import Header from "./header";
import Days from "./days";
import Cells from "./cells";
const SmallCalendarStyled = styled.div`
  background-color: white;
  width: 100%;
`;
export default function index() {
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
  return (
    <SmallCalendarStyled data-testid="app-big-calendar">
      <Header
        currentMonth={currentDate.currentMonth}
        handleChangeMonth={handleChangeMonth}
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
