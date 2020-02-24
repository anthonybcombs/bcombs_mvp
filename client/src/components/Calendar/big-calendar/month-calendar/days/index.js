import React from "react";
import styled from "styled-components";
import { format, addDays, startOfWeek } from "date-fns";
const DaysStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font-size: 1.2em;
  text-align: center;
  margin-top: 1em;
`;
export default function index({ currentMonth }) {
  const dateFormat = "EEE";
  const days = [];
  let startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
  for (let i = 0; i < 7; i++) {
    days.push(<div key={i}>{format(addDays(startDate, i), dateFormat)}</div>);
  }
  return <DaysStyled data-testid="app-big-calendar-days">{days}</DaysStyled>;
}
