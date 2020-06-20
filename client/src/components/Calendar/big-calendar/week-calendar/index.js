import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { subWeeks, addWeeks, startOfWeek } from "date-fns";
import NewEventModal from "../../../Dashboard/MyEvents/create/withOutCalendar";
import Header from "./header";
import Days from "./days";
import Cells from "./cells";
const WeekViewStyled = styled.div`
  background-color: white;
  width: 100%;
`;
export default function index({
  auth,
  events,
  calendars,
  calendarType,
  handleChangeCalendarType,
  selectedCalendars,
  handleCalendarSelection,
  familyMembers,
  publicView,
}) {
  const [currentDate, setCurrentDate] = useState({
    currentWeek: new Date(),
    selectedDate: new Date(),
  });
  const [isTimedDisplay, setTimeDisplay] = useState(
    sessionStorage.getItem("isTimeDisplayed") === "true" ? true : false
  );
  const [isNewEventModalVisible, setIsEventModalVisible] = useState(false);
  const handleWeekChange = (operation) => {
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
      selectedDate: firstWeekOfTheMonth,
    });
  };
  const handleChangeDay = (day) => {
    setCurrentDate({
      ...currentDate,
      selectedDate: day,
    });
  };
  const setTimeDisplayed = () => {
    setTimeDisplay(!isTimedDisplay);
  };

  useEffect(() => {
    console.log(
      ' isTimedDisplay === true ? "true" : "false"',
      isTimedDisplay === true ? "true" : "false"
    );
    sessionStorage.setItem(
      "isTimeDisplayed",
      isTimedDisplay === true ? "true" : "false"
    );
  }, [isTimedDisplay]);

  const handleChangeMonthYear = (month, year) => {
    let currentMonth;
    currentMonth = addMonths(
      currentDate.currentMonth,
      differenceInMonths(new Date(year, month, 0), currentDate.currentMonth)
    );
  };

  return (
    <WeekViewStyled data-testid="app-big-calendar">
      {!publicView && (
        <NewEventModal
          auth={auth}
          isVisible={isNewEventModalVisible}
          toggleCreateEventModal={setIsEventModalVisible}
          defaultSelectedDate={currentDate.selectedDate}
          selectedCalendars={selectedCalendars}
        />
      )}
      <Header
        currentWeek={currentDate.currentWeek}
        handleWeekChange={handleWeekChange}
        calendars={calendars}
        calendarType={calendarType}
        handleChangeCalendarType={handleChangeCalendarType}
        selectedCalendars={selectedCalendars}
        handleCalendarSelection={handleCalendarSelection}
        publicView={publicView}
        setTimeDisplayed={setTimeDisplayed}
        isTimedDisplay={isTimedDisplay}
      />
      <Days currentWeek={currentDate.currentWeek} />
      <Cells
        auth={auth}
        selectedCalendars={selectedCalendars}
        currentWeek={currentDate.currentWeek}
        events={events}
        familyMembers={familyMembers}
        handleChangeDay={handleChangeDay}
        setIsEventModalVisible={setIsEventModalVisible}
        publicView={publicView}
        isTimedDisplay={isTimedDisplay}
      />
    </WeekViewStyled>
  );
}

// <NewEventModal
// auth={auth}
// contacts={contacts}
// isVisible={isNewEventModalVisible}
// toggleCreateEventModal={setIsEventModalVisible}
// defaultSelectedDate={currentDate.selectedDate}
// selectedCalendars={selectedCalendars}
// />
