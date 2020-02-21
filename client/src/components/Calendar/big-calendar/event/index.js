import React, { useState, useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faCommentDots,
  faShare,
  faCheckCircle
} from "@fortawesome/free-solid-svg-icons";
import Popover, { ArrowContainer } from "react-tiny-popover";
const EventStyled = styled.div`
  z-index: 1;
  margin: 2px;
  #event-name {
    display: block;
    background-color: ${({ theme }) =>
      theme.smallCalendar.event.backgroundColor.primary};
    color: white;
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
  h4,
  h3 {
    line-height: 0.5em;
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
    line-height: 3px;
  }
  #event-details {
    padding: 0 0.5em 0 0.5em;
  }
  #event-controls {
    grid-template-columns: 24% 24% 24% 29%;
    margin-bottom: 0.5em;
  }
  #event-controls > div > svg {
    color: ${({ theme }) => theme.smallCalendar.event.backgroundColor.primary};
  }
`;
export default function index({ event }) {
  const [isVisible, setVisibility] = useState(false);
  const theme = useContext(ThemeContext);
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
          arrow="center"
        >
          <EventPopOverStyled
            theme={theme}
            onClick={() => {
              setVisibility(!isVisible);
            }}
          >
            <img src="https://i.picsum.photos/id/1043/200/300.jpg" />
            <div id="event-details">
              <h4>Entertainment</h4>
              <h3>{event.name}</h3>
              <p>7:00 PM-8:00 PM | Cost $15</p>
              <p>New York,NY,USA</p>
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
      )}
      onClickOutside={() => setVisibility(false)}
    >
      <EventStyled
        theme={theme}
        onClick={() => {
          setVisibility(!isVisible);
        }}
      >
        <div className={`${isVisible ? "selected" : ""}`} id="event-name">
          {event.name}
        </div>
      </EventStyled>
    </Popover>
  );
}
