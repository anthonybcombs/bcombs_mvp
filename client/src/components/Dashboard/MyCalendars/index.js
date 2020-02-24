import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import BigCalendar from "../../Calendar/big-calendar/";
const MyCalendarStyled = styled.div`
  margin: 1em;
`;
export default function index() {
  const { calendars, events } = useSelector(({ calendars, events }) => ({
    calendars,
    events
  }));
  return (
    <MyCalendarStyled>
      <h1>My Calendars</h1>
      <BigCalendar events={events} calendars={calendars} />
    </MyCalendarStyled>
  );
}
