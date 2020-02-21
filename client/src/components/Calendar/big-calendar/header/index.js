import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { format } from "date-fns";
const HeaderStyled = styled.div`
  display: grid;
  text-align: center;
  h1 {
    padding: 0;
    margin: 0;
  }
  svg {
    cursor: pointer;
    position: relative;
    margin: 0 1em 0 1em;
  }
  #calendars-control button {
    width: 100%;
  }
  @media (min-width: 800px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    #calendar-type {
      grid-template-columns: repeat(2, 50%);
    }
    #calendars-control {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      justify-content: end;
    }
  }
`;
export default function index({ currentMonth, handleChangeMonth }) {
  const dateFormat = "MMMM yyyy";
  return (
    <HeaderStyled data-testid="app-big-calendar-header">
      <div className="grid" id="calendar-type">
        <button>Week</button>
        <button>Month</button>
      </div>
      <div id="calendar-controls">
        <h2 data-testid="app-big-calendar-header-current-month">
          <FontAwesomeIcon
            data-testid="app-big-calendar-prev-month-button"
            icon={faArrowLeft}
            onClick={() => {
              handleChangeMonth();
            }}
          />
          {format(currentMonth, dateFormat)}
          <FontAwesomeIcon
            data-testid="app-big-calendar-next-month-button"
            icon={faArrowRight}
            onClick={() => {
              handleChangeMonth("next");
            }}
          />
        </h2>
      </div>
      <div className="grid" id="calendars-control">
        <button>
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <button>Calendar 1</button>
      </div>
    </HeaderStyled>
  );
}
