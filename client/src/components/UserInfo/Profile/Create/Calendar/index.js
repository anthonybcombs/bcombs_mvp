import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { requestAuth } from "../../../../../redux/actions/Auth";
import CreateCalendarForm from "../Forms/CreateCalendarForm";
const CalendarProfile = styled.div`
  display: block;
  margin: 0 auto;
  background-color: white;
  width: 40%;
  overflow: auto;
  height: auto;
  padding: 5px 30px 5px 30px;
  position: relative;
  top: 3vh;
  box-shadow: 0 0 25px #eae9e9;
  text-align: center;
  h2 {
    margin-top: 3em;
  }
`;
export default function index({ navigate }) {
  const [calendarDetails, setCalendarDetails] = useState({ name: "" });
  const dispatch = useDispatch();
  const handleInputChange = (id, value) => {
    setCalendarDetails({ ...calendarDetails, [id]: value });
  };
  const handleFormSubmit = async ({ name }) => {
    dispatch(requestAuth());
    await navigate(
      `../dashboard`,
      { state: { calendarName: name } },
      { replace: true }
    );
    //setCurrentPage(prevCurrentPage => prevCurrentPage + 1);
  };
  return (
    <CalendarProfile data-testid="app-profile-calendar">
      <h2 data-testid="app-profile-calendar-header">Almost Done!</h2>
      <p data-testid="app-profile-calendar-sub-header">
        Create my first calendar
      </p>
      <CreateCalendarForm
        details={calendarDetails}
        onSubmit={handleFormSubmit}
        handleInputChange={handleInputChange}
      />
    </CalendarProfile>
  );
}
