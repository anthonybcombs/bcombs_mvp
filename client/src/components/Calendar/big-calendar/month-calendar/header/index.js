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
  faShareAltSquare,
  faChevronDown,
  faChevronUp,
  faClock
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { format } from "date-fns";
import {
  requestDeleteCalendar,
  requestCloneCelander
} from "../../../../../redux/actions/Calendars";
import Confirmation from "../../../../../helpers/Confirmation";
import { yearList } from "../../../../../helpers/Date";
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
  select {
    display: inline-block;
    border: none;
    font-size: 1em;
    text-align: center;
    font-weight: bold;
    appearance: none;
    text-align-last:center; 
    right center no-repeat;
    cursor:pointer;
  }
  @media (min-width: 600px) {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    #calendar-type {
      grid-template-columns: repeat(2, 50%);
    }
    #calendars-control {
      grid-template-columns: repeat(4, minmax(100px, 1fr));
    }
  }
`;

export default function index({
  currentMonth,
  handleChangeMonth,
  handleChangeMonthYear,
  calendars,
  calendarType,
  handleChangeCalendarType,
  isTimedDisplay,
  selectedCalendars,
  setTimeDisplayed,
  handleCalendarSelection,
  publicView
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
  const [isTimeDisplayed, setIsTimedDisplayed] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [currentConfirmationMessage, setCurrentConfirmationMessage] = useState(
    ""
  );
  const yearsList = yearList(2031);
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
          onClick={() => handleChangeCalendarType("week")}>
          Week
        </button>
        <button
          className={`${calendarType === "month" ? "selected" : ""}`}
          onClick={() => handleChangeCalendarType("month")}>
          Month
        </button>
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
          <select
            value={format(currentMonth, "M") - 1}
            onChange={({ target }) => {
              handleChangeMonthYear(target.value, format(currentMonth, "yyyy"));
            }}>
            <option value={0}>January</option>
            <option value={1}>February</option>
            <option value={2}>March</option>
            <option value={3}>April</option>
            <option value={4}>May</option>
            <option value={5}>June</option>
            <option value={6}>July</option>
            <option value={7}>August</option>
            <option value={8}>September</option>
            <option value={9}>October</option>
            <option value={10}>November</option>
            <option value={11}>December</option>
          </select>
          <select
            value={format(currentMonth, "yyyy")}
            onChange={({ target }) => {
              handleChangeMonthYear(format(currentMonth, "M"), target.value);
            }}>
            {yearsList.map(year => {
              return <option value={year}>{year}</option>;
            })}
          </select>
          <FontAwesomeIcon
            data-testid="app-big-calendar-next-month-button"
            icon={faArrowRight}
            onClick={() => {
              handleChangeMonth("next");
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
        }}>
        {!publicView && (
          <button>
            <FontAwesomeIcon
              icon={faPlus}
              onClick={() => {
                toggleCreateCalendarModal(true);
              }}
              style={{
                margin: "0 5px"
              }}
            />
            <FontAwesomeIcon
              icon={viewAllCalendar ? faChevronUp : faChevronDown}
              onClick={() => {
                setViewAllCalendar(!viewAllCalendar);
              }}
              style={{
                margin: "0 5px"
              }}
            />

            <FontAwesomeIcon
              icon={faClock}
              onClick={() => {
                setTimeDisplayed(!isTimedDisplay);
              }}
              style={{
                color: isTimedDisplay ? "black" : "gray",
                margin: "0 5px"
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
                  zIndex: 100,
                  color: "#f26e21"
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
                  zIndex: 100,
                  color: "#f26e21"
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
  setCurrentConfirmationMessage
}) => {
  return (
    <>
      {viewAllCalendar &&
        calendars.map(calendarGroup => {
          return calendarGroup.map(calendar => {
            return (
              <CalendarCard
                key={calendar.id}
                calendar={calendar}
                handleCalendarSelection={handleCalendarSelection}
                setSelectedCalendar={setSelectedCalendar}
                selectedCalendars={selectedCalendars}
                toggleEditCalendarModal={toggleEditCalendarModal}
                toggleConfirmationVisible={toggleConfirmationVisible}
                publicView={publicView}
                setCurrentAction={setCurrentAction}
              />
            );
          });
        })}
      {!viewAllCalendar &&
        calendars.length > 0 &&
        calendars[currentPage].map(calendar => {
          return (
            <CalendarCard
              key={calendar.id}
              calendar={calendar}
              handleCalendarSelection={handleCalendarSelection}
              setSelectedCalendar={setSelectedCalendar}
              selectedCalendars={selectedCalendars}
              toggleEditCalendarModal={toggleEditCalendarModal}
              toggleConfirmationVisible={toggleConfirmationVisible}
              publicView={publicView}
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
  toggleConfirmationVisible,
  publicView,
  setCurrentAction,
  setCurrentConfirmationMessage
}) => {
  const [isCalendarButtonsVisible, setCalendarButtonsVisible] = useState(false);
  const auth = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();
  return (
    <div
      className="calendar"
      style={{ cursor: `${!publicView ? "pointer" : "default"}` }}
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
      }}>
      <img src={calendar.image} />
      <p
        className={`${
          selectedCalendars.includes(calendar.id) ? "selected" : ""
        }`}>
        <span style={{ backgroundColor: `${calendar.color}` }}></span>
        <EllipsisText text={calendar.name} length={8} />
      </p>
      {isCalendarButtonsVisible &&
        !publicView &&
        auth.user_id === calendar.user_id && (
          <div id="buttons">
            <FontAwesomeIcon
              icon={faClone}
              onClick={e => {
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
                onClick={e => {
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
              onClick={e => {
                e.stopPropagation();
                setSelectedCalendar(calendar);
                toggleEditCalendarModal(true);
              }}
            />
            <FontAwesomeIcon
              icon={faTrashAlt}
              onClick={e => {
                e.stopPropagation();
                setCurrentConfirmationMessage(
                  `Are you sure you want to delete this calendar?`
                );
                const triggerAction = () => () => {
                  setCurrentAction(dispatch(requestDeleteCalendar(calendar)));
                };
                setCurrentAction(triggerAction);
                toggleConfirmationVisible(true);
              }}
            />
          </div>
        )}
    </div>
  );
};
