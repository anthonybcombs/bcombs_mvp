import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EllipsisText from "react-ellipsis-text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowLeft,
  faPlus,
  faEdit,
  faTrashAlt,
  faLongArrowAltRight,
  faLongArrowAltLeft,
  faEyeSlash,
  faEye,
  faShareAltSquare,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { requestDeleteCalendar } from "../../../../../redux/actions/Calendars";
import CreateCalendarModal from "../../new-calendar/Create";
import EditCalendarModal from "../../new-calendar/Edit";
const HeaderStyled = styled.div`
  display: grid;
  margin-bottom: 2em;
  text-align: center;
  h1 {
    padding: 0;
    margin: 0;
  }
  button {
    border: none;
  }
  svg {
    cursor: pointer;
    position: relative;
    margin: 0 1em 0 1em;
    color: black;
  }
  #calendar-controls {
    margin-top: 1em;
  }
  #calendars-control {
    position: relative;
  }
  #calendars-control button {
    width: 100%;
    color: white;
  }
  .calendar > #buttons {
    position: absolute;
    top: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.9);
  }
  .calendar > #buttons > svg {
    margin: 3px 3px 0 3px;
    color: #f26e21;
  }
  .calendar {
    height: 100px;
    position: relative;
    display: inline-block;
    cursor: pointer;
  }
  .calendar img {
    display: inline-block;
    width: 100%; // to maintain aspect ratio. You can use 100% if you don't care about that
    height: 100%;
    padding: 0;
    margin: 0;
  }
  .calendar p {
    margin: 0;
    padding: 0.2em;
  }
  .calendar p.selected {
    background: #f26e21;
  }
  .calendar p span:nth-of-type(1) {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 5px;
    border-radius: 50%;
  }
  #calendar-type button.selected {
    background-color: white;
    border-bottom: 10px solid #f26e21;
  }
  @media (min-width: 600px) {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    #calendar-type {
      grid-template-columns: repeat(2, 50%);
    }
    #calendars-control {
      grid-template-columns: repeat(4, 1fr);
    }
  }
`;
export default function index({
  currentWeek,
  handleWeekChange,
  calendars,
  calendarType,
  handleChangeCalendarType,
  selectedCalendars,
  handleCalendarSelection,
  publicView,
}) {
  const [isVisibleCreateCalendarModal, toggleCreateCalendarModal] = useState(
    false
  );
  const [isVisibileEditCalendarModal, toggleEditCalendarModal] = useState(
    false
  );
  const [selectedCalendar, setSelectedCalendar] = useState({});
  const [isPaginationVisible, setPaginationVisibility] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [viewAllCalendar, setViewAllCalendar] = useState(false);
  return (
    <HeaderStyled data-testid="app-big-calendar-header">
      <CreateCalendarModal
        isVisible={isVisibleCreateCalendarModal}
        toggleCreateCalendarModal={toggleCreateCalendarModal}
      />
      {selectedCalendar.hasOwnProperty("name") && (
        <EditCalendarModal
          isVisible={isVisibileEditCalendarModal}
          toggleEditCalendarModal={toggleEditCalendarModal}
          calendar={{ ...selectedCalendar, selectedFamilyMembers: new Map() }}
        />
      )}
      <div className="grid" id="calendar-type">
        <button
          className={`${calendarType === "week" ? "selected" : ""}`}
          onClick={() => handleChangeCalendarType("week")}
        >
          Week
        </button>
        <button
          className={`${calendarType === "month" ? "selected" : ""}`}
          onClick={() => handleChangeCalendarType("month")}
        >
          Month
        </button>
      </div>
      <div id="calendar-controls">
        <h2 data-testid="app-big-calendar-header-current-month">
          <FontAwesomeIcon
            data-testid="app-big-calendar-prev-month-button"
            icon={faArrowLeft}
            onClick={() => {
              handleWeekChange();
            }}
          />
          {format(startOfWeek(currentWeek), "MMM dd")}-
          {format(endOfWeek(currentWeek), "MMM dd yyyy")}
          <FontAwesomeIcon
            data-testid="app-big-calendar-next-month-button"
            icon={faArrowRight}
            onClick={() => {
              handleWeekChange("next");
            }}
          />
        </h2>
      </div>
      <div
        className="grid"
        id="calendars-control"
        onMouseEnter={() => {
          setPaginationVisibility(true);
        }}
        onMouseLeave={() => {
          setPaginationVisibility(false);
        }}
      >
        {!publicView && (
          <button>
            <FontAwesomeIcon
              icon={faPlus}
              onClick={() => {
                toggleCreateCalendarModal(true);
              }}
            />
            <FontAwesomeIcon
              icon={viewAllCalendar ? faEyeSlash : faEye}
              onClick={() => {
                setViewAllCalendar(!viewAllCalendar);
              }}
            />
          </button>
        )}
        {!publicView && isPaginationVisible && !viewAllCalendar && (
          <>
            {currentPage > 0 && (
              <FontAwesomeIcon
                style={{
                  position: "absolute",
                  top: 30,
                  left: 100,
                  zIndex: 200,
                  color: "#f26e21",
                }}
                icon={faLongArrowAltLeft}
                onClick={() => {
                  setCurrentPage(currentPage - 1);
                }}
                size="2x"
              />
            )}
            {currentPage < calendars.length - 1 && (
              <FontAwesomeIcon
                style={{
                  position: "absolute",
                  top: 30,
                  right: 0,
                  zIndex: 200,
                  color: "#f26e21",
                }}
                icon={faLongArrowAltRight}
                onClick={() => {
                  setCurrentPage(currentPage + 1);
                }}
                size="2x"
              />
            )}
          </>
        )}
        <CalendarList
          calendars={calendars}
          handleCalendarSelection={handleCalendarSelection}
          setSelectedCalendar={setSelectedCalendar}
          selectedCalendars={selectedCalendars}
          toggleEditCalendarModal={toggleEditCalendarModal}
          currentPage={currentPage}
          viewAllCalendar={viewAllCalendar}
          publicView={publicView}
        />
      </div>
    </HeaderStyled>
  );
}

const CalendarList = ({
  calendars = [],
  handleCalendarSelection,
  toggleEditCalendarModal,
  setSelectedCalendar,
  selectedCalendars,
  currentPage,
  viewAllCalendar,
  publicView,
}) => {
  return (
    <>
      {viewAllCalendar &&
        calendars.map((calendarGroup) => {
          console.log("?");
          return calendarGroup.map((calendar) => {
            return (
              <CalendarCard
                key={calendar.id}
                calendar={calendar}
                handleCalendarSelection={handleCalendarSelection}
                setSelectedCalendar={setSelectedCalendar}
                selectedCalendars={selectedCalendars}
                toggleEditCalendarModal={toggleEditCalendarModal}
                publicView={publicView}
              />
            );
          });
        })}
      {!viewAllCalendar &&
        calendars.length > 0 &&
        calendars[currentPage].map((calendar) => {
          return (
            <CalendarCard
              key={calendar.id}
              calendar={calendar}
              handleCalendarSelection={handleCalendarSelection}
              setSelectedCalendar={setSelectedCalendar}
              selectedCalendars={selectedCalendars}
              toggleEditCalendarModal={toggleEditCalendarModal}
              publicView={publicView}
            />
          );
        })}
    </>
  );
};
const CalendarCard = ({
  calendar,
  handleCalendarSelection,
  setSelectedCalendar,
  selectedCalendars,
  toggleEditCalendarModal,
  publicView,
}) => {
  const [isCalendarButtonsVisible, setCalendarButtonsVisible] = useState(false);
  const auth = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();
  return (
    <div
      className="calendar"
      key={index}
      onClick={() => {
        if (!publicView) {
          handleCalendarSelection(calendar.id);
        }
      }}
      onMouseEnter={() => {
        if (!publicView) {
          setCalendarButtonsVisible(true);
        }
      }}
      onMouseLeave={() => {
        if (!publicView) {
          setCalendarButtonsVisible(false);
        }
      }}
    >
      <img src={calendar.image} />
      <p
        className={`${
          selectedCalendars.includes(calendar.id) ? "selected" : ""
        }`}
      >
        <span style={{ backgroundColor: `${calendar.color}` }}></span>
        <EllipsisText text={calendar.name} length={8} />
      </p>
      {isCalendarButtonsVisible &&
        !publicView &&
        auth.user_id === calendar.user_id && (
          <div id="buttons">
            {calendar.visibilityType === "Public" && (
              <FontAwesomeIcon
                icon={faShareAltSquare}
                onClick={(e) => {
                  e.stopPropagation();
                  const dummy = document.createElement("input");
                  document.body.appendChild(dummy);
                  dummy.setAttribute(
                    "value",
                    `${process.env.HOST}/mycalendars/public/${calendar.id}`
                  );
                  dummy.select();
                  document.execCommand("copy");
                  document.body.removeChild(dummy);
                  alert("copied to clipboard");
                }}
              />
            )}
            <FontAwesomeIcon
              icon={faEdit}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCalendar(calendar);
                toggleEditCalendarModal(true);
              }}
            />
            <FontAwesomeIcon
              icon={faTrashAlt}
              onClick={(e) => {
                e.stopPropagation();
                dispatch(requestDeleteCalendar(calendar));
              }}
            />
          </div>
        )}
    </div>
  );
};
