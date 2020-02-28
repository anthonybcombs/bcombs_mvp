import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { format } from "date-fns";
const HeaderStyled = styled.div`
  display: grid;
  grid-template-columns: 80% 10% 10%;
  h4 {
    padding: 0;
    margin: 0;
  }
  svg {
    cursor: pointer;
    position: relative;
  }
`;
export default function index({
  currentMonth,
  handleChangeMonth,
  removeSubHeader
}) {
  const dateFormat = "MMMM";
  return (
    <HeaderStyled data-testid="app-micro-calendar-header">
      <h4 data-testid="app-micro-calendar-header-current-month">
        {format(currentMonth, !removeSubHeader ? dateFormat : "MMMM yyyy")}
      </h4>
      <div>
        <FontAwesomeIcon
          data-testid="app-micro-calendar-prev-month-button"
          icon={faArrowLeft}
          onClick={() => {
            handleChangeMonth();
          }}
        />
      </div>
      <div>
        <FontAwesomeIcon
          data-testid="app-micro-calendar-next-month-button"
          icon={faArrowRight}
          onClick={() => {
            handleChangeMonth("next");
          }}
        />
      </div>
    </HeaderStyled>
  );
}
