import React, { useState } from "react";
import styled from "styled-components";
import NewEventModal from "../../../Dashboard/MyEvents/create/withOutCalendar";
import { subMonths, addMonths, startOfMonth, format } from "date-fns";
import Header from "./header";
import Days from "./days";
import Cells from "./cells";
const BigCalendarStyled = styled.div`
  background-color: white;
  width: 100%;
`;
export default function index({
  auth,
  contacts,
  events,
  calendars,
  calendarType,
  handleChangeCalendarType,
  selectedCalendars,
  handleCalendarSelection,
  familyMembers
}) {
  const [isNewEventModalVisible, setIsEventModalVisible] = useState(false);
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
    <BigCalendarStyled data-testid="app-big-calendar">
      <NewEventModal
        auth={auth}
        contacts={contacts}
        isVisible={isNewEventModalVisible}
        toggleCreateEventModal={setIsEventModalVisible}
        defaultSelectedDate={currentDate.selectedDate}
        selectedCalendars={selectedCalendars}
      />
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
        auth={auth}
        selectedCalendars={selectedCalendars}
        events={events}
        currentMonth={currentDate.currentMonth}
        selectedDate={currentDate.selectedDate}
        handleChangeDay={handleChangeDay}
        familyMembers={familyMembers}
        setIsEventModalVisible={setIsEventModalVisible}
      />
    </BigCalendarStyled>
  );
}
