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
  faClone,
  faChevronDown,
  faChevronUp,
  faClock,
  faShareAltSquare,
  faAngleLeft,
  faAngleRight
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { requestDeleteCalendar, requestCloneCelander } from "../../../../../redux/actions/Calendars";
import CreateCalendarModal from "../../new-calendar/Create";
import EditCalendarModal from "../../new-calendar/Edit";
import Confirmation from "../../../../../helpers/Confirmation";
const HeaderStyled = styled.div`
  display: grid;
  margin-bottom: 2em;
  text-align: center;
  padding: 1.5rem 2rem 2rem;
  h1 {
    padding: 0;
    margin: 0;
  }
  button {
    border: none;
    height: 52px;
  }
  svg {
    cursor: pointer;
    position: relative;
    margin: 0 1em 0 1em;
    color: black;
  }
  #calendar-controls {
    // margin-top: 1em;
  }
  h2 {
    margin: 0;
    font-size: 1rem;
    // padding: 1.02rem 0;
    padding: .89rem 0;
    background: #F4F4F5;

    display: flex;
    align-items: center;
    justify-content: center;
  }
  h2 svg {
    color: #A9ACAE;
    padding: 0px 5px;
    font-size: 1.5rem;
  }
  h2 svg:hover {
    color: #f26e21;
    transition: .15s ease-in-out;
  }
  #calendars-control {
    position: relative;
  }
  #calendars-control button {
    width: 100%;
    color: white;
    background: lightgray;
  }
  #calendars-control button > svg:hover {
    color: #f26e21 !important;
    transition: .15s ease-in-out;
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
    height: 52px;
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

    max-height: 52px;
    object-fit: cover;
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
  #calendar-type button {
    color: #A9ACAE;
    background: #F4F4F5;
  }
  #calendar-type button:hover {
    color: #f26e21;
    transition: .15s ease-in-out;
  }
  #calendar-type button.selected {
    background-color: white;
    // border-bottom: 10px solid #f26e21;

    position: relative;
    color: #000;
    font-weight: 600;
    box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.25);
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
  isTimedDisplay,
  setTimeDisplayed,
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
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [currentConfirmationMessage, setCurrentConfirmationMessage] = useState(
    ""
  );
  return (
    <HeaderStyled data-testid="app-big-calendar-header">
      <CreateCalendarModal
        isVisible={isVisibleCreateCalendarModal}
        toggleCreateCalendarModal={toggleCreateCalendarModal}
      />
      <Confirmation
        isVisible={isConfirmationVisible}
        message={currentConfirmationMessage}
        toggleConfirmationVisible={setConfirmationVisible}
        onSubmit={currentAction}
        submitButtonLabel="Submit"
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
            icon={faAngleLeft}
            onClick={() => {
              handleWeekChange();
            }}
          />
          {format(startOfWeek(currentWeek), "MMM dd")}-
          {format(endOfWeek(currentWeek), "MMM dd yyyy")}
          <FontAwesomeIcon
            data-testid="app-big-calendar-next-month-button"
            icon={faAngleRight}
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
              style={{
                margin: "0 5px",
              }}
            />
            <FontAwesomeIcon
              icon={viewAllCalendar ? faChevronUp : faChevronDown}
              onClick={() => {
                setViewAllCalendar(!viewAllCalendar);
              }}
              style={{
                margin: "0 5px",
              }}
            />

            <FontAwesomeIcon
              icon={faClock}
              onClick={() => {
                setTimeDisplayed(!isTimedDisplay);
              }}
              style={{
                color: isTimedDisplay ? "black" : "gray",
                margin: "0 5px",
              }}
            />
          </button>
        )}
        {!publicView && isPaginationVisible && !viewAllCalendar && (
          <>
            {currentPage > 0 && (
              <FontAwesomeIcon
                style={{
                  position: 'absolute',
                  top: '0',
                  color: '#fff',
                  width: '30px',
                  height: '100%',
                  zIndex: '10',
                  padding: '0 5px',
                  left: 'calc(20% - 10px)',
                  background: 'rgba(242, 110, 33, 0.75)',
                }}
                icon={faAngleLeft}
                onClick={() => {
                  setCurrentPage(currentPage - 1);
                }}
                size="2x"
              />
            )}
            {currentPage < calendars.length - 1 && (
              <FontAwesomeIcon
                style={{
                  position: 'absolute',
                  top: '0',
                  right: '-32px',
                  color: '#fff',
                  width: '30px',
                  height: '100%',
                  zIndex: '10',
                  padding: '0 5px',
                  background: 'rgba(242, 110, 33, 0.75)',
                }}
                icon={faAngleRight}
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
          toggleConfirmationVisible={setConfirmationVisible}
          setCurrentAction={setCurrentAction}
          setCurrentConfirmationMessage={setCurrentConfirmationMessage}
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
  toggleConfirmationVisible,
  setCurrentAction,
  setCurrentConfirmationMessage,
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
              toggleConfirmationVisible={toggleConfirmationVisible}
              setCurrentAction={setCurrentAction}
              setCurrentConfirmationMessage={setCurrentConfirmationMessage}
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
  toggleConfirmationVisible,
  setCurrentAction,
  setCurrentConfirmationMessage
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
            <FontAwesomeIcon
              icon={faClone}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentConfirmationMessage(
                  `Are you sure you want to clone this calendar?`
                );
                const triggerAction = () => () => {
                  setCurrentAction(dispatch(requestCloneCelander(calendar)));
                };
                setCurrentAction(triggerAction);
                toggleConfirmationVisible(true);
              }}
            />
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
