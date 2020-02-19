import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { format } from "date-fns";
const HeaderStyled = styled.div`
  display: grid;
  grid-template-columns: 10% 80% 10%;
  text-align: center;
  h1 {
    padding: 0;
    margin: 0;
  }
  svg {
    cursor: pointer;
    position: relative;
    margin: 20px auto;
  }
`;
export default function index({ currentMonth, handleChangeMonth }) {
  const dateFormat = "MMMM";
  return (
    <HeaderStyled data-testid="app-small-calendar-header">
      <div>
        <FontAwesomeIcon
          data-testid="app-small-calendar-prev-month-button"
          icon={faArrowLeft}
          onClick={() => {
            handleChangeMonth();
          }}
        />
      </div>

      <h2 data-testid="app-small-calendar-header-current-month">
        {format(currentMonth, dateFormat)}
      </h2>
      <div>
        <FontAwesomeIcon
          data-testid="app-small-calendar-next-month-button"
          icon={faArrowRight}
          onClick={() => {
            handleChangeMonth("next");
          }}
        />
      </div>
    </HeaderStyled>
  );
}
