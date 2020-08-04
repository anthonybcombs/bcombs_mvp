import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import BigCalendar from "../../Calendar/big-calendar/";

import { requestCalendars } from "../../../redux/actions/Calendars";
import { getContact } from "../../../redux/actions/Contacts";
import { getEvents } from "../../../redux/actions/Events";
import { requestUserGroup } from "../../../redux/actions/Groups";

const MyCalendarStyled = styled.div`
  // margin: 1em;

  margin: 1.5rem 3em 2rem;
  h2 {
    font-weight: 400;
  }

  
`;
export default function index() {
  const {
    auth,
    calendars,
    contacts,
    events,
    familyMembers,
    groups
  } = useSelector(
    ({ auth, calendars, contacts, events, familyMembers, groups }) => ({
      auth,
      calendars,
      contacts,
      events,
      familyMembers,
      groups
    })
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (auth.email) {
      dispatch(getEvents(auth.email));
      dispatch(getContact(auth.email));
      dispatch(requestUserGroup(auth.email));
    }
  }, []);
  return (
    <MyCalendarStyled>
      <h2>My Calendars</h2>
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
