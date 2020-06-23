import React, { useEffect, useState } from "react";
import styled from "styled-components";
import NewEventModal from "../../../Dashboard/MyEvents/create/withOutCalendar";
import EditEvent from "../../../Dashboard/MyEvents/edit/withOutCalendar";
import ViewEventModal from "../../../Dashboard/MyEvents/view";
import {
  subMonths,
  addMonths,
  startOfMonth,
  differenceInMonths,
  parseISO
} from "date-fns";
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
  familyMembers,
  publicView
}) {
  const [isNewEventModalVisible, setIsEventModalVisible] = useState(false);
  const [isViewEventModalVisible, setViewEventModalVisible] = useState(false);
  const [isEditEventVisible, setEditEventModalVisible] = useState(false);
  const [selectedEventList, setSelectedEventList] = useState([]);
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);
  const [isTimedDisplay, setTimeDisplay] = useState(
    localStorage.getItem("isTimeDisplayed") === "true" ? true : false
  );
  const [formattedCalendars, setFormattedCalendars] = useState([]);
  const [currentDate, setCurrentDate] = useState({
    currentMonth: new Date(),
    selectedDate: new Date()
  });

  useEffect(() => {
    if (calendars) {
      setFormattedCalendars(calendars.flat());
    }
  }, [calendars]);

  useEffect(() => {
    console.log(
      ' isTimedDisplay === true ? "true" : "false"',
      isTimedDisplay === true ? "true" : "false"
    );
    localStorage.setItem(
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

    const firstDayOfTheMonth = startOfMonth(currentMonth);
    setCurrentDate({
      ...currentDate,
      currentMonth,
      selectedDate: firstDayOfTheMonth
    });
  };
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

  const setTimeDisplayed = () => {
    setTimeDisplay(!isTimedDisplay);
  };

  const handleViewEvent = event => {
    setSelectedEventList(event);
    setViewEventModalVisible(!isViewEventModalVisible);
  };

  const handleCloseViewEvent = () => {
    setSelectedEventList([]);
    setViewEventModalVisible(false);
  };

  const handleToggleEditEvent = (event = null) => {
    setSelectedEventDetails(!isEditEventVisible === true ? event : null);
    setEditEventModalVisible(!isEditEventVisible);
  };

  return (
    <BigCalendarStyled data-testid="app-big-calendar">
      {!publicView && (
        <NewEventModal
          auth={auth}
          contacts={contacts}
          isVisible={isNewEventModalVisible}
          toggleCreateEventModal={setIsEventModalVisible}
          defaultSelectedDate={currentDate.selectedDate}
          selectedCalendars={selectedCalendars}
        />
      )}
      <ViewEventModal
        auth={auth}
        events={selectedEventList}
        isVisible={isViewEventModalVisible}
        toggleViewEvent={handleCloseViewEvent}
        toggleEditEvent={handleToggleEditEvent}
      />

      <Header
        currentMonth={currentDate.currentMonth}
        handleChangeMonth={handleChangeMonth}
        handleChangeMonthYear={handleChangeMonthYear}
        calendars={calendars}
        calendarType={calendarType}
        handleChangeCalendarType={handleChangeCalendarType}
        isTimedDisplay={isTimedDisplay}
        selectedCalendars={selectedCalendars}
        handleCalendarSelection={handleCalendarSelection}
        publicView={publicView}
        setTimeDisplayed={setTimeDisplayed}
      />
      <Days currentMonth={currentDate.currentMonth} />
      <Cells
        auth={auth}
        calendars={formattedCalendars}
        selectedCalendars={selectedCalendars}
        events={events}
        currentMonth={currentDate.currentMonth}
        isTimedDisplay={isTimedDisplay}
        selectedDate={currentDate.selectedDate}
        handleChangeDay={handleChangeDay}
        familyMembers={familyMembers}
        setIsEventModalVisible={setIsEventModalVisible}
        publicView={publicView}
        handleViewEvent={handleViewEvent}
      />

      <EditEvent
        auth={auth}
        isVisible={isEditEventVisible}
        toggleEditEventModal={handleToggleEditEvent}
        defaultEventDetails={selectedEventDetails}
        selectedCalendars={selectedCalendars}
      />
    </BigCalendarStyled>
  );
}
