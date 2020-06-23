import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import BigCalendar from "../../Calendar/big-calendar";
import { useParams } from "@reach/router";
import { requestCalendar } from "../../../redux/actions/Calendars";
import Loading from "../../../helpers/Loading";
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
  const { id } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    localStorage.setItem("selectedCalendars", JSON.stringify([id]));
    dispatch(requestCalendar(id));
  }, []);
  if (calendars.length === 0) {
    return <Loading />;
  }
  return (
    <MyCalendarStyled>
      <h1>My Calendars</h1>
      <BigCalendar
        auth={auth}
        contacts={contacts}
        events={events}
        calendars={calendars}
        familyMembers={familyMembers}
        publicView={true}
      />
    </MyCalendarStyled>
  );
}
