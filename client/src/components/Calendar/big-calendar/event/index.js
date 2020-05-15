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
import { format } from "date-fns";
import { deleteEvent } from "../../../../redux/actions/Events";
import EditEvent from "../../../Dashboard/MyEvents/edit/withOutCalendar";
import Popover, { ArrowContainer } from "react-tiny-popover";
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

const getStatusCount = (guest, type) => {
  const guestStatus = guest.filter(item => item.status === type);
  return guestStatus.length;
};
export default function index({ auth, event, selectedCalendars }) {
  const [isVisible, setVisibility] = useState(false);
  const [isEditEventVisible, setEditEventVisible] = useState(false);
  const theme = useContext(ThemeContext);
  const dispatch = useDispatch();
  const toggleEditEventModal = () => {
    setEditEventVisible(!isEditEventVisible);
  };

  const schedule = [
    format(new Date(event.start_of_event), "MMM dd,yyyy hh:mm a"),
    format(new Date(event.end_of_event), "MMM dd,yyyy hh:mm a")
  ];
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
                <FontAwesomeIcon icon={faShareAltSquare} />
              </button>
              <button>
                <FontAwesomeIcon
                  icon={faPenSquare}
                  onClick={toggleEditEventModal}
                />
              </button>
              <button
                onClick={e => {
                  setVisibility(false);
                  dispatch(deleteEvent(event));
                }}>
                <FontAwesomeIcon icon={faTrashAlt} />
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

              <div id="event-controls" className="grid">
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
              </div>
            </div>
          </EventPopOverStyled>
        </ArrowContainer>
      )}>
      <EventStyled
        theme={theme}
        style={{ backgroundColor: event.color }}
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
        <div className={`${isVisible ? "selected" : ""}`} id="event-name">
          {event.name}
        </div>
      </EventStyled>
    </Popover>
  );
}
