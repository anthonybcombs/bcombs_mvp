import React, { useState } from "react";
import styled from "styled-components";
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
export default function index({ handleProfileSubmit, onSkip }) {
  const [calendarDetails, setCalendarDetails] = useState({
    name: "",
    image: ""
  });
  const handleInputChange = (id, value) => {
    setCalendarDetails({ ...calendarDetails, [id]: value });
  };
  const handleFormSubmit = async () => {
    handleProfileSubmit(calendarDetails);
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
        onSkip={onSkip}
      />
    </CalendarProfile>
  );
}
