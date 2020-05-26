import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import BigCalendar from "../../Calendar/big-calendar";
import { initialState } from "../../../redux/initialState";
import { useParams } from "@reach/router";
import { getContact } from "../../../redux/actions/Contacts";
import { getEvents } from "../../../redux/actions/Events";
import { requestUserGroup } from "../../../redux/actions/Groups";

const MyCalendarStyled = styled.div`
  margin: 1em;
`;
export default function index() {
  const { auth, contacts, events, familyMembers } = useSelector(
    ({ auth, contacts, events, familyMembers }) => ({
      auth,
      contacts,
      events,
      familyMembers,
    })
  );
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(getEvents(auth.email));
  //   dispatch(getContact(auth.email));
  //   dispatch(requestUserGroup(auth.email));
  // }, []);
  return (
    <MyCalendarStyled>
      <h1>My Calendars</h1>
      <BigCalendar
        auth={auth}
        contacts={contacts}
        events={events}
        calendars={initialState.calendars}
        familyMembers={familyMembers}
        publicView={true}
      />
    </MyCalendarStyled>
  );
}
