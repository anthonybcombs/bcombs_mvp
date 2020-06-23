import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Collapsible from "react-collapsible";
import {
  faCalendar,
  faBell,
  faPlusCircle,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import styled, { ThemeContext } from "styled-components";
import WelcomeMessage from "./WelcomeMessage";
import SmallCalendar from "../../Calendar/small-calendar/";
import NewEventModal from "../MyEvents/create/withCalendar";
import EventSliderStyled from "./EventSlider";
import Slider from "react-rangeslider";
import "react-rangeslider/lib/index.css";
import "./override-slider.css";
import "font-awesome/css/font-awesome.min.css";
import NotificationStyled from "./Notifications";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  getDate,
} from "date-fns";
import RecommendationSliderStyled from "./RecommendationSlider";

// REDUX ACTIONS
import { getEvents } from "../../../redux/actions/Events";

const HomeStyled = styled.div`
  padding: 1px 1em 1px 1em;
  box-shadow: 0px 3px 6px #908e8e;
  .pane {
    display: block;
    position: relative;
    background-color: white;
    padding: 1em;
    width: auto;
    height: auto;
    margin: 0.5em 0 0.5em 0;
    box-shadow: 0px 3px 6px #908e8e;
  }
  h3 {
    cursor: pointer;
  }
  h3 > svg {
    margin-right: 0.5em;
  }
  .panel {
    max-height: 20vh;
    overflow: auto;
  }
  .panel-body {
    width: auto;
    color: white;
    background-color: ${({ theme }) => theme.header.backgroundColor.primary};
    padding: 10px;
    margin: 0.5em;
    cursor: pointer;
    position: relative;
  }
  button {
    color: ${({ theme }) => theme.button.textColor.primary};
    font-size: ${({ theme }) => theme.button.fontSize};
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    border: none;
    box-shadow: 0px 3px 6px #908e8e;
    border-radius: ${({ theme }) => theme.button.borderRadius};
  }
  .selected {
    color: black;
    font-weight: bold;
    background-color: white;
  }
  .is-closed h3:after {
    font-family: "fontawesome";
    content: "\f078";
    color: black;
    margin-left: 0.5em;
  }
  .is-open h3:after {
    font-family: "fontawesome";
    content: "\f077";
    color: black;
    margin-left: 0.5em;
  }
  .calendar-chbx {
    position: absolute;
    right: 15px;
    width: 20px;
    height: 30px;
    margin: 0;
    top: 5px;
  }
  .slider {
    padding: 0 60px;
    padding-top: 30px;
  }
  .panel-recommendation {
    position: relative;
  }
  .controller {
    z-index: 100;
    position: absolute;
    top: 0;
    height: 100%;
    align-items: center;
    display: flex;
  }
  .controller span {
    visibility: hidden;
    cursor: pointer;
    background: #1b1b1b;
    opacity: 0.8;
    color: #fff;
    width: 50px;
    height: 50px;
    display: flex;
    text-align: center;
    align-items: center;
    border-radius: 50%;
    justify-content: center;
  }
  .controller:hover span {
    visibility: visible;
  }
  .left-arrow {
    left: 10px;
  }
  .right-arrow {
    right: 10px;
  }
  @media (min-width: 600px) {
    .grid {
      grid-template-columns: 3fr 6fr;
      grid-gap: 2%;
    }
    #add-event-button {
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      margin-top: 0.5em;
      margin-right: 0.5em;
      line-height: 1em;
    }
  }
  .Collapsible .is-open h3:after {
    font-family: "fontawesome";
    content: "\f077";
    color: black;
    margin-left: 0.5em;
    font-size: 10px;
    top: -2px;
    position: relative;
  }
  .Collapsible .is-closed h3:after {
    font-family: "fontawesome";
    content: "\f078";
    color: black;
    margin-left: 0.5em;
    font-size: 10px;
    top: -2px;
    position: relative;
  }
`;
export default function index({ location }) {
  const [isNewEventModalVisible, setIsEventModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState();
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedCalendar, setSelectedCalendar] = useState([]);
  const [calendarOptions, setCalendarOptions] = useState([]);
  const { events, auth, calendars } = useSelector(
    ({ events, auth, calendars }) => {
      return { events, calendars, auth };
    }
  );
  const dispatch = useDispatch();
  console.log("TRIGGERED GET EVENTS!", auth);
  console.log("TRIGGERED GET EVENTS!", events);
  useEffect(() => {
    console.log("TRIGGERED GET EVENTS!");
    if (auth) {
      dispatch(getEvents(auth.email));
    }
  }, [auth]);

  useEffect(() => {
    if (calendars) {
      let calendar = [];
      calendar[0] = calendars[0]
        ? calendars[0].filter((cal) => cal.user_id === auth.user_id)
        : [];
      setCalendarOptions(calendar);
    }
  }, [calendars]);

  const theme = useContext(ThemeContext);
  let calendarName = "";
  if (sessionStorage.getItem("calendarName") !== null) {
    calendarName = sessionStorage.getItem("calendarName");
  }
  const eventsOnThisDay = events.filter(
    (event) =>
      format(new Date(event.start_of_event), "MM dd yyyy") ===
      format(selectedDate, "MM dd yyyy")
  );

  const handleSetSelectedDate = (date) => {
    setSelectedEvent();
    setSelectedDate(date);

    const sDate = getDate(new Date(date));
    const maxDate = parseInt(format(endOfDay(endOfMonth(selectedMonth)), "d"));

    if (sDate < maxDate) {
      setHorizontal(sDate);
      setSliderLabel(`${sDate} - ${sDate + 1}`);
    }
  };
  const handleEventSelection = (id) => {
    setSelectedEvent(eventsOnThisDay.filter((event) => event.id === id)[0]);
  };

  const setCurrentMonth = (month) => {
    //setSelectedMonth(format(month, "MMMM yyyy"));
    setSelectedMonth(month);
  };

  const handleChangeHorizontal = (value) => {
    setHorizontal(value);
    setSliderLabel(`${value} - ${value + 1}`);
    //setSliderLabel(`${value}`);
  };

  const [recommendationScroll, setRecommendationScroll] = useState(0);

  const currDate = getDate(new Date());

  const maxDate = parseInt(format(endOfDay(endOfMonth(new Date())), "d"));

  const [horizontal, setHorizontal] = useState(currDate);

  const [sliderLabel, setSliderLabel] = useState(
    currDate < maxDate
      ? `${currDate} - ${currDate + 1}`
      : `${currDate - 1} - ${currDate}`
  );

  console.log("MY CALENDARS", calendars);

  console.log("current month", selectedMonth);

  return (
    <HomeStyled data-testid="app-dashboard-home" theme={theme}>
      {calendarName.length > 0 && (
        <WelcomeMessage calendarName={calendarName} />
      )}
      <NewEventModal
        auth={auth}
        calendars={calendarOptions}
        isVisible={isNewEventModalVisible}
        toggleCreateEventModal={setIsEventModalVisible}
        defaultSelectedDate={selectedDate}
        isEventSection={true}
      />
      <h2 data-testid="app-dashboard-home-header">My Calendar</h2>
      <div className="grid">
        <div>
          <div className="pane">
            <SmallCalendar
              events={events}
              setCurrentMonth={setCurrentMonth}
              selectedDate={selectedDate}
              setSelectedDate={handleSetSelectedDate}
              setSelectedEvent={setSelectedEvent}
            />
            <Collapsible
              trigger={
                <h3 data-testid="app-dashboard-home-sub-header-calendars">
                  <FontAwesomeIcon icon={faCalendar} />
                  <span>Calendars</span>
                </h3>
              }
              open
              lazyRender
            >
              <div className="panel">
                {calendars &&
                  calendars.map((calendarGroup) => {
                    return calendarGroup.map((calendar) => {
                      return (
                        <div
                          className={`panel-body`}
                          key={calendar.id}
                          // onClick={() => {
                          //   handleEventSelection(calendar.id);
                          // }}
                        >
                          {calendar.name}
                          <input
                            className="calendar-chbx"
                            type="checkbox"
                            onChange={({ target }) => {
                              let newFilter = selectedCalendar.filter(
                                (c) => c == calendar.id
                              );

                              if (newFilter.length > 0) {
                                let newFilter = selectedCalendar.filter(
                                  (c) => c != calendar.id
                                );
                                setSelectedCalendar([...newFilter]);
                              } else {
                                setSelectedCalendar([
                                  ...selectedCalendar,
                                  calendar.id,
                                ]);
                              }
                            }}
                            checked={
                              selectedCalendar.filter((c) => c == calendar.id)
                                .length <= 0
                            }
                          />
                        </div>
                      );
                    });
                  })}
              </div>
            </Collapsible>
            <Collapsible
              trigger={
                <h3 data-testid="app-dashboard-home-sub-header-notifications">
                  <FontAwesomeIcon icon={faBell} />
                  <span>Notifications</span>
                </h3>
              }
              open
              lazyRender
            >
              <div className="panel">
                <NotificationStyled events={events} />
              </div>
            </Collapsible>
          </div>
        </div>
        <div>
          <div className="pane">
            {selectedMonth && <h3>{format(selectedMonth, "MMMM yyyy")}</h3>}
            <button
              id="add-event-button"
              onClick={() => {
                setIsEventModalVisible(true);
              }}
            >
              <FontAwesomeIcon icon={faPlusCircle} size="3x" />
            </button>

            <div className="panel"></div>
            <div className="panel-eventslider">
              <EventSliderStyled
                setCurrentMonth={setCurrentMonth}
                events={events}
                selectedDate={selectedDate}
                scrollValue={horizontal}
                selectedMonth={selectedMonth}
                selectedCalendar={selectedCalendar}
              />
              {selectedMonth && (
                <div className="slider custom-labels">
                  <Slider
                    min={parseInt(
                      format(startOfDay(startOfMonth(selectedMonth)), "d")
                    )}
                    max={
                      parseInt(
                        format(endOfDay(endOfMonth(selectedMonth)), "d")
                      ) - 1
                    }
                    value={horizontal}
                    handleLabel={sliderLabel}
                    onChange={handleChangeHorizontal}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="pane">
            <h3 data-testid="app-dashboard-home-sub-header-recommendations">
              Recommendations
            </h3>
            <div className="panel-recommendation">
              <RecommendationSliderStyled scrollValue={recommendationScroll} />
              <div className="controller left-arrow">
                <span
                  onClick={(e) => {
                    if (recommendationScroll > 0) {
                      setRecommendationScroll(recommendationScroll - 1);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </span>
              </div>
              <div className="controller right-arrow">
                <span
                  onClick={(e) => {
                    if (recommendationScroll < 10) {
                      setRecommendationScroll(recommendationScroll + 1);
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeStyled>
  );
}
