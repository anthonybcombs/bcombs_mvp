import React, { useState, useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faCopy,
  faCommentDots,
  faShare,
  faTrashAlt,
  faCheckCircle,
  faShareAltSquare,
  faPenSquare,
  faUser,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import Linkify from "react-linkify";

import { format, compareAsc, isToday } from "date-fns";
import { deleteEvent } from "../../../../redux/actions/Events";
import DuplicateEvent from "../../../Dashboard/MyEvents/duplicate";
import EditEvent from "../../../Dashboard/MyEvents/edit/withOutCalendar";
import Popover, { ArrowContainer } from "react-tiny-popover";
import Confirmation from "../../../../helpers/Confirmation";

const EventColors = styled.div`
  float: right;
  margin-top: -23px;
  margin-right: -5px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 22px 26px 0;
  border-color: transparent ${(props) => props.color} transparent transparent;
`;

const EventStyled = styled.div`
  z-index: 1;
  margin: 2px;

  max-width: inherit;
  width: inherit;

  #event-name {
    display: block;
    color: black;
    padding: 5px;
    max-width: inherit;
    width: inherit;
  }
  #event-name.selected {
    color: black !important;
  }
`;
//  overflow: auto;
const EventPopOverStyled = styled.div`
  background-color: white;
  border: 2px solid lightgrey;
  color: black;
  padding: 5px;
  max-width: 300px;

  input:required {
    box-shadow: none;
  }
  input:invalid {
    box-shadow: none;
  }
  input {
    background: none;
    width: 100%;
    color: black;
    font-size: ${({ theme }) => theme.input.fontSize};
    display: block;
    border: none;
    border-radius: 1;
    border: none;
    outline: 0;
    border-bottom: 2px solid lightgrey;
    margin-top: 30px;
    margin-bottom: 30px;
    outline: 0;
  }
  input:focus {
    border-color: ${({ theme }) => theme.input.focus.border.color};
    transition: 3s;
  }
  h4,
  h3 {
  }
  h4 {
    color: ${({ theme }) => theme.smallCalendar.event.textColor.primary};
  }
  img {
    width: 100%;
    height: 150px;
  }
  p {
    display: block;
    font-size: 0.9em;
  }
  #event-details {
    padding: 0 0.5em 0 0.5em;
    word-break: break-word;
  }
  #event-controls {
    grid-template-columns: 24% 24% 24% 29%;
    margin-bottom: 0.5em;
  }
  #top-event-controls {
    text-align: right;
    display: block;
  }
  #top-event-controls button {
    display: inline-block;
    padding: 0;
    margin: 0 0.3em 0.3em 0.3em;
    box-shadow: none;
    border: none;
    background-color: transparent;
  }
  #event-controls > div > svg {
    color: ${({ theme }) => theme.smallCalendar.event.backgroundColor.primary};
  }
  .event-guest {
    margin-top: 12px;
    margin-bottom: 12px;
  }
  .guest-status {
    font-size: 13px;
    color: gray;
    padding-bottom: 5px;
  }
`;

const getStatusCount = (guests, type) => {
  const guestStatus = guests.filter((guest) => guest.status === type);
  return guestStatus.length;
};
const isGuest = (guests, currentEmail) => {
  let isUserGuest = guests.find((guest) => guest.email === currentEmail);
  return isUserGuest ? true : false;
};
export default function index({
  auth,
  calendars,
  day,
  event,
  isTimedDisplay,
  selectedCalendars,
  publicView,
}) {
  const [isVisible, setVisibility] = useState(false);
  const [isEditEventVisible, setEditEventVisible] = useState(false);
  const [isDuplicateEventVisible, setDuplicateEventVisible] = useState(false);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [currentConfirmationMessage, setCurrentConfirmationMessage] = useState(
    ""
  );
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();

  const toggleEditEventModal = () => {
    setEditEventVisible(!isEditEventVisible);
  };

  const toggleDuplicateEventModal = () => {
    setDuplicateEventVisible(!isDuplicateEventVisible);
  };
  const isCurrentUserGuest = isGuest(event.guests, auth.email);

  let schedule = [
    format(new Date(event.start_of_event), "MMM dd,yyyy hh:mm a"),
    format(new Date(event.end_of_event), "MMM dd,yyyy hh:mm a"),
  ];
  const isEventOver = compareAsc(day, new Date());
  let eventStartTime = "";
  let eventEndTime = "";
  if (event.recurring !== "" && event.recurring !== "no-repeat") {
    eventStartTime = format(new Date(event.start_of_event), "hh:mm a");
    eventEndTime = format(new Date(event.end_of_event), "hh:mm a");
    schedule = [format(day, "MMM dd,yyyy "), format(day, "MMM dd,yyyy ")];
  }

  return (
    <div>
      <Confirmation
        isVisible={isConfirmationVisible}
        message={currentConfirmationMessage}
        toggleConfirmationVisible={setConfirmationVisible}
        onSubmit={currentAction}
        submitButtonLabel="Submit"
      />
      <Popover
        isOpen={isVisible}
        position={"right"}
        content={({ position, targetRect, popoverRect }) => (
          <ArrowContainer
            position={position}
            targetRect={targetRect}
            popoverRect={popoverRect}
            arrowColor="lightgrey"
            arrowSize={10}
            arrowStyle={{ opacity: 1 }}
            arrow="center"
          >
            <EventPopOverStyled
              theme={theme}
              onMouseLeave={() => {
                setVisibility(!isVisible);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
              }}
            >
              {!publicView && event.allowed_edit && (
                <div id="top-event-controls">
                  <button>
                    <FontAwesomeIcon
                      icon={faCopy}
                      onClick={toggleDuplicateEventModal}
                    />
                  </button>

                  <button>
                    <FontAwesomeIcon
                      icon={faPenSquare}
                      onClick={toggleEditEventModal}
                    />
                  </button>

                  <button
                    onClick={(e) => {
                      setVisibility(false);
                      setCurrentConfirmationMessage(
                        `Are you sure you want to delete this event?`
                      );
                      const triggerAction = () => {
                        setCurrentAction(
                          dispatch(
                            deleteEvent({
                              id: event.id,
                              email: auth.email,
                            })
                          )
                        );
                      };
                      setCurrentAction(triggerAction);
                      setConfirmationVisible(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              )}

              <img src="https://bcombs.s3.amazonaws.com/event_default.jpg" />
              <div id="event-details">
                <h4>{event.eventCategory}</h4>
                <h3>{event.name}</h3>
                <p>Status: {event.status}</p>
                <p>{`${schedule[0]} ${eventStartTime} - ${schedule[1]} ${eventEndTime}`}</p>
                <Linkify
                  componentDecorator={(decoratedHref, decoratedText, key) => (
                    <a target="blank" href={decoratedHref} key={key}>
                      {decoratedText}
                    </a>
                  )}
                >
                  <p style={{ display: "flex" }}>
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      size="s"
                      style={{ marginRight: 10 }}
                    />
                    {event.location}
                  </p>
                </Linkify>
                <div className="event-guest">
                  <div>Guests ({event.guests.length || 0})</div>
                  <div className="guest-status">
                    Yes {getStatusCount(event.guests, "Yes")} {`  `}
                    Maybe {getStatusCount(event.guests, "Maybe")}
                    {`  `}
                    Awaiting {getStatusCount(event.guests, "Pending")}
                  </div>
                  {event.guests.map((guest) => {
                    return (
                      <div>
                        {" "}
                        <span>
                          {" "}
                          <FontAwesomeIcon icon={faUser} />
                        </span>
                        {` `}
                        {guest.email}
                      </div>
                    );
                  })}
                </div>
              </div>
            </EventPopOverStyled>
          </ArrowContainer>
        )}
      >
        <EventStyled
          theme={theme}
          style={{
            backgroundColor: event.color,
            opacity: isEventOver < 0 && !isToday(day) ? 0.5 : 1,
          }}
          onClick={() => {
            setVisibility(!isVisible);
          }}
        >
          <EditEvent
            auth={auth}
            isVisible={isEditEventVisible}
            toggleEditEventModal={toggleEditEventModal}
            defaultEventDetails={event}
            selectedCalendars={selectedCalendars}
          />

          <DuplicateEvent
            auth={auth}
            isVisible={isDuplicateEventVisible}
            defaultEventDetails={event}
            toggleDuplicateEventModal={toggleDuplicateEventModal}
          />
          <div className={`${isVisible ? "selected" : ""}`} id="event-name">
            <div
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                //maxWidth: 232,
                fontSize: 15,
              }}
            >
              {isTimedDisplay && (
                <span>
                  {" "}
                  {format(new Date(event.start_of_event), "hh:mma")}
                  {`-`}
                  {format(new Date(event.end_of_event), "hh:mma")}{" "}
                </span>
              )}
              {event.name}
            </div>
            {event.multi_color &&
              event.multi_color.map(
                (color, index) =>
                  color !== event.color && (
                    <EventColors color={color}></EventColors>
                  )
              )}
          </div>
        </EventStyled>
      </Popover>
    </div>
  );
}

/*
style={{
                  width: 12,
                  height: 17,
                  backgroundColor: color,
                  float: "right",
                  border: "0.7px solid white"
                }}
                */
