import React, { useRef, useState, useEffect, useReducer } from "react";
import '../BCCalendar/BCCalendar.css';
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { requestVendor } from "../../../redux/actions/Vendors";
import BC_CalendarActivities from "../BCCalendar/BC_CalendarActivities";
import BC_CalendarActivity from "../BCCalendar/activity/BC_CalendarActivity";
import ActivityDisplaylModal from "./ActivityDisplayModal/index.js";
import CalendarFeedModal from "./CalendarFeedModal/index.js";

import * as Icon from "react-icons/fi";
import Checkbox from "react-custom-checkbox";
//import Accordion from 'react-bootstrap/Accordion';
//import Card from 'react-bootstrap/Card';
//import "bootstrap/dist/css/bootstrap.min.css";
import Collapsible from 'react-collapsible';
import { Button } from "react-bootstrap";

const CalendarStyled = styled.div`

.Collapsible {
  background-color: white; }

.Collapsible__contentInner {
  padding: 10px;
  border: 1px solid #ebebeb;
  border-top: 0; }
  .Collapsible__contentInner p {
    margin-bottom: 10px;
    font-size: 14px;
    line-height: 20px; }
    .Collapsible__contentInner p:last-child {
      margin-bottom: 0; }

.Collapsible__trigger {
  display: block;
  font-weight: 400;
  text-decoration: none;
  color: #333333;
  position: relative;
  border: 1px solid white;
  padding: 10px;
  background:  #f26e21; /*#00ac9d;*/
  color: white; }
  .Collapsible__trigger:after {
    font-family: 'FontAwesome';
    content: '\f107';
    position: absolute;
    right: 10px;
    top: 10px;
    display: block;
    transition: transform 300ms; }
  .Collapsible__trigger.is-open:after {
    transform: rotateZ(180deg); }
  .Collapsible__trigger.is-disabled {
    opacity: 0.5;
    background-color: grey; }

.CustomTriggerCSS {
  background-color: lightcoral;
  transition: background-color 200ms ease; }

.CustomTriggerCSS--open {
  background-color: darkslateblue; }

.Collapsible__custom-sibling {
  padding: 5px;
  font-size: 12px;
  background-color: #CBB700;
  color: black; }

  .fc-icon.fc-icon-fa { font-family: "FontAwesome" !important; }   

  .w-100 {
    width:100%
  }
    `;

import Loading from "../../../helpers/Loading.js";


const BCDisplayCalendar = props => {
  const dispatch = useDispatch();


  const { admins, auth, user, vendors } = useSelector(
    ({
      admins,
      auth,
      user,
      vendors
    }) => {
      return {
        admins,
        auth,
        user,
        vendors
      };
    }
  );

  useEffect(() => {
    if (auth) {
      dispatch(requestVendor(auth.user_id, false));
    }
  }, [])

  const [myEvents, setMyEvents] = useState([]);

  const [classes, setClasses] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [vendorId, setVendorId] = useState();
  const [filters, setFilters] = useState([]);
  const [tagFilters, setTagFilters] = useState([]);

  const [calendarActivities, setCalendarActivies] = useState();

  const [isLoading, setIsLoading] = useState(true)
  const [isAddEventModalShown, setIsActivityDetailsModalShown] = useState(false);
  const [isFeedModalShown, setIsFeedModalShown] = useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  
  //const componentRef = useRef();
  console.log('vendorszxczxc',vendors)
  useEffect(() => {
    console.log('activityData: ', activityData)
  }, [activityData]);

  const showModal = () => setIsActivityDetailsModalShown(true);
  const hideModal = () => setIsActivityDetailsModalShown(false);

  const showFeedModal = () => setIsFeedModalShown(true);
  const hideFeedModal = () => setIsFeedModalShown(false);

  useEffect(() => {
    console.log('AUTHHHH MY APPLCIATION - vendors loaded', auth)
    if (auth.user_id) {
      //dispatch(requestGetApplicationByUserId(auth.user_id))
    }
    let localVendorId = 0;
    if (vendors && vendors.length) {
      localVendorId = vendors[0].id2;
    }
    console.log("vendorId", localVendorId);
    if (localVendorId) {
      setVendorId(localVendorId);
      BC_CalendarActivities.LoadActivities(localVendorId, auth, handleCalendarActiviesReturned);
    }
  }, [vendors]);

  const handleCalendarActiviesReturned = (calendarActivities) => {
    setCalendarActivies(calendarActivities);
    setIsLoading(false);
  }

  useEffect(() => {
    if (calendarActivities) {
      setClasses(calendarActivities.classList);
      setFilters(calendarActivities.filters);
    }
  }, [calendarActivities])

  useEffect(() => {
    if (calendarActivities) {
      let activityList = calendarActivities.getFilteredActivityList();
      setMyEvents(activityList);
    }
  }, [filters, tagFilters])

  useEffect(() => {
    if (calendarActivities) {
        calendarActivities.setSearchTerm(searchTerm);
        let activityList = calendarActivities.getFilteredActivityList();
        setMyEvents(activityList);
    }
  }, [searchTerm])

  const handleClickOnActivity = ({ event }) => {
    console.log('click info: ', event);
    let activityForEdit = new BC_CalendarActivity();
    activityForEdit.setToExistingActivity(event);
    setActivityData(activityForEdit);
    showModal();
  }

  const handleFilterChange = (value, key) => {
    console.log("handleFilterChange: ", value, key);
    calendarActivities.adjustFilters(value, key);
    setFilters(calendarActivities.filters);
  }

  const handleTagChange = (value, key) => {
    console.log("handleTagChange: ", value, key);
    calendarActivities.adjustTagFilters(value, key);
    setTagFilters(calendarActivities.tagList);
  }


  const handleSearchTermChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleAddFeedButtonClick = event => {
    setCalendarActivies(Object.assign(new BC_CalendarActivities(), calendarActivities));
    showFeedModal();
  };

  /*
  const myCustomButtons = {
    settings: {
      icon: 'fa fas fa-bars',
      click: function() {
        alert('clicked');
      }
    }
  }

  const calendarHeaderButtonsRight = 'timeGridDay,timeGridWeek,dayGridMonth, settings';
  */
  const myCustomButtons = null;
  const calendarHeaderButtonsRight = 'timeGridDay,timeGridWeek,dayGridMonth';

  return (
    <CalendarStyled className="bc-calendar-wrapper">
      <ActivityDisplaylModal show={isAddEventModalShown}
        visibleClasses={classes}
        activityData={activityData}
        handleClose={hideModal}
        >
      </ActivityDisplaylModal>
      <CalendarFeedModal show={isFeedModalShown}
        handleClose={hideFeedModal}
        calendarActivities={calendarActivities}
        >
      </CalendarFeedModal>

      <div id="calendarControls" className="control-block">
        <h3>My Calandar</h3>

        {isLoading ? (
            <div />
            ) : (
                <div>
                 <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                />
              </div>
          )
        }
          {isLoading ? (
            <Loading />
            ) : (

                filters.map((elem) => 
                <div className="btn-holder" key={elem.key}>
                    <Checkbox checked={elem.isChecked} label={elem.name} name={elem.key}
                    icon={<Icon.FiCheck color={elem.color} size={14} />}
                    borderColor={elem.color}
                    onChange={(value) => handleFilterChange(value, elem.key)}
                    />
                </div>
            )) }

{isLoading || calendarActivities.tagList.length < 1 ? (
            <div />
            ) : (
                <div>
                  <Collapsible trigger="Tags" open={true} id="accordion" >
                  {
                calendarActivities.tagList.map((elem) => 
                <div className="btn-holder" key={elem.key}>
                    <Checkbox checked={elem.isChecked} label={elem.name} name={elem.key}
                    borderColor={'grey'}
                    icon={<Icon.FiCheck size={14} />}
                    onChange={(value) => handleTagChange(value, elem.key)}
                    />
                </div>)
        }
                    </Collapsible>
                    <Collapsible trigger="Export Links" >
                      <p>Provides a URL that you can add to the calendar you use (e.g. Google Calendar) so that it displays these events</p>
                      <Button id="GetExportLink" onClick={handleAddFeedButtonClick}>Get Link URL</Button>
                      </Collapsible>
              </div>
          )
        }


      </div>
      <div id="calendarContainer" className="calendar-wrapper">
        {
          isLoading ? (
            <Loading />
          ) : (
            <FullCalendar
              customButtons={myCustomButtons}
              headerToolbar={{ left: 'prev,next,today', center: 'title', 
                right: calendarHeaderButtonsRight }}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              editable={false}
              eventClick={handleClickOnActivity}
              events={myEvents}
              allDaySlot={true}
              scrollTime={'08:00:00'}
            />
          )
        }
      </div>

    </CalendarStyled>
  );
};

export default BCDisplayCalendar;
