import React, { useState, useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faCommentDots,
  faShare,
  faTrashAlt,
  faCheckCircle,
  faShareAltSquare,
  faPenSquare,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { format, compareAsc } from "date-fns";
import { deleteEvent } from "../../../../redux/actions/Events";
import DuplicateEvent from "../../../Dashboard/MyEvents/duplicate";
import EditEvent from "../../../Dashboard/MyEvents/edit/withOutCalendar";
import Popover, { ArrowContainer } from "react-tiny-popover";

const EventColors = styled.div`
  float: right;
  margin-top: -5px;
  margin-right: -5px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 22px 26px 0;
  border-color: transparent ${props => props.color} transparent transparent;
`;

const EventStyled = styled.div`
  z-index: 1;
  margin: 2px;
  #event-name {
    display: block;
    color: black;
    padding: 5px;
  }
  #event-name.selected {
    color: black !important;
  }
`;
const EventPopOverStyled = styled.div`
  background-color: white;
  border: 2px solid lightgrey;
  color: black;
  padding: 5px;
  width: 300px;
  overflow: auto;
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
  const guestStatus = guests.filter(guest => guest.status === type);
  return guestStatus.length;
};
const isGuest = (guests, currentEmail) => {
  let isUserGuest = guests.find(guest => guest.email === currentEmail);
  return isUserGuest ? true : false;
};
export default function index({ auth, day, event, selectedCalendars }) {
  const [isVisible, setVisibility] = useState(false);
  const [isEditEventVisible, setEditEventVisible] = useState(false);
  const [isDuplicateEventVisible, setDuplicateEventVisible] = useState(false);
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();
  const toggleEditEventModal = () => {
    setEditEventVisible(!isEditEventVisible);
  };

  const toggleDuplicateEventModal = () => {
    setDuplicateEventVisible(!isDuplicateEventVisible);
  };
  const isCurrentUserGuest = isGuest(event.guests, auth.email);
  const schedule = [
    format(new Date(event.start_of_event), "MMM dd,yyyy hh:mm a"),
    format(new Date(event.end_of_event), "MMM dd,yyyy hh:mm a")
  ];
  const isEventOver = compareAsc(day, new Date());
  console.log("event!!!", event);
  return (
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
          arrow="center">
          <EventPopOverStyled
            theme={theme}
            onMouseLeave={() => {
              setVisibility(!isVisible);
            }}
            onDoubleClick={e => {
              e.stopPropagation();
            }}>
            <div id="top-event-controls">
              <button>
                <FontAwesomeIcon
                  icon={faShareAltSquare}
                  onClick={toggleDuplicateEventModal}
                />
              </button>
              {!isCurrentUserGuest && (
                <button>
                  <FontAwesomeIcon
                    icon={faPenSquare}
                    onClick={toggleEditEventModal}
                  />
                </button>
              )}

              <button
                onClick={e => {
                  setVisibility(false);
                  dispatch(
                    deleteEvent({
                      id: event.id,
                      email: auth.email
                    })
                  );
                }}>
                {!isCurrentUserGuest && <FontAwesomeIcon icon={faTrashAlt} />}
              </button>
            </div>
            <img src="https://i.picsum.photos/id/1043/200/300.jpg" />
            <div id="event-details">
              <h4>{event.eventCategory}</h4>
              <h3>{event.name}</h3>
              <p>{`${schedule[0]} - ${schedule[1]}`}</p>
              <p>{event.location}</p>
              <div className="event-guest">
                <div>Guests ({event.guests.length || 0})</div>
                <div className="guest-status">
                  Yes {getStatusCount(event.guests, "Yes")} {`  `}
                  Maybe {getStatusCount(event.guests, "Maybe")}
                  {`  `}
                  Awaiting {getStatusCount(event.guests, "Pending")}
                </div>
                {event.guests.map(guest => {
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

              {/* <div id="event-controls" className="grid">
                <div>
                  <FontAwesomeIcon
                    icon={faStar}
                    color={theme.smallCalendar.event.backgroundColor.primary}
                  />
                  (5)
                </div>
                <div>
                  <FontAwesomeIcon icon={faCommentDots} />
                  (12)
                </div>
                <div>
                  <FontAwesomeIcon icon={faShare} />
                  (5)
                </div>
                <div>
                  <FontAwesomeIcon icon={faCheckCircle} />
                  I'm going
                </div>
              </div> */}
            </div>
          </EventPopOverStyled>
        </ArrowContainer>
      )}>
      <EventStyled
        theme={theme}
        style={{
          backgroundColor: event.color,
          opacity: isEventOver < 0 ? 0.5 : 1
        }}
        onClick={() => {
          setVisibility(!isVisible);
        }}>
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
          <span> {event.name}</span>
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
