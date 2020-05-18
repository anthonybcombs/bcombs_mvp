import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import BigCalendar from "../../Calendar/big-calendar/";

import { getContact } from "../../../redux/actions/Contacts";
import { getEvents } from "../../../redux/actions/Events";

const MyCalendarStyled = styled.div`
  margin: 1em;
`;
export default function index() {
  const { auth, calendars, contacts, events, familyMembers } = useSelector(
    ({ auth, calendars, contacts, events, familyMembers }) => ({
      auth,
      calendars,
      contacts,
      events,
      familyMembers
    })
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (auth.email) {
      dispatch(getEvents(auth.email));
      dispatch(getContact(auth.email));
    }
  }, []);
  return (
    <MyCalendarStyled>
      <h1>My Calendars</h1>
      <BigCalendar
        auth={auth}
        contacts={contacts}
        events={events}
        calendars={calendars}
        familyMembers={familyMembers}
      />
    </MyCalendarStyled>
  );
}
