import React from "react";
import styled from "styled-components";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
const DaysStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  font-size: .85rem;
  text-align: center;
  margin-top: 1em;

  color: #A9ACAE;
  padding: 0 2rem 1rem;
  text-transform: uppercase;
`;
export default function index({ currentWeek }) {
  const dateFormat = "EE MM/dd";
  const days = [<div key="time">Time</div>];
  const daysOfWeek = eachDayOfInterval({
    start: startOfWeek(currentWeek),
    end: endOfWeek(currentWeek)
  });
  daysOfWeek.forEach((day, i) => {
    days.push(<div key={i}>{format(day, dateFormat)}</div>);
  });
  return <DaysStyled data-testid="app-big-calendar-days">{days}</DaysStyled>;
}
