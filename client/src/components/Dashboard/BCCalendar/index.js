import React, { useRef, useState, useEffect, useReducer } from "react";
import './BCCalendar.css';
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { requestVendor } from "../../../redux/actions/Vendors";
import BC_CalendarActivity from "./activity/BC_CalendarActivity";
import BC_CalendarActivities from "./BC_CalendarActivities";

import * as Icon from "react-icons/fi";
import Checkbox from "react-custom-checkbox";

//import { 
//  requestGetApplicationByUserId, 
//} from "../../../redux/actions/Application";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import ActivityDetailModal from "./activity/ActivityDetailModal/index.js";

const CalendarStyled = styled.div`
    `;

import Loading from "../../../helpers/Loading.js";


const BCCalendar = props => {
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

  const [calendarActivities, setCalendarActivies] = useState();

  const [isLoading, setIsLoading] = useState(true)
  const [isAddEventModalShown, setIsActivityDetailsModalShown] = useState(false)
  const [searchTerm, setSearchTerm] = React.useState("");

  //const componentRef = useRef();
  console.log('vendorszxczxc',vendors)
  useEffect(() => {
    console.log('activityData: ', activityData)
  }, [activityData]);

  const showModal = () => setIsActivityDetailsModalShown(true);
  const hideModal = () => setIsActivityDetailsModalShown(false);

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
  }, [filters])

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

  const handleEventDrop = (info) => {
    if (window.confirm("Are you sure you want to change the event date?")) {
      console.log('change confirmed: ', info);
      updateActivityWithNewInfo(info);

    } else {
      console.log('change aborted');
      info.revert();
    }
  }

  const handleResize = (info) => {
    updateActivityWithNewInfo(info);
  }


  const updateActivityWithNewInfo = (info) => {
    const extendedProps = info.event.extendedProps;
    //console.log("extended props:", extendedProps);
    //console.log("id:", info.event.id);
    //console.log("start:", info.event.start);
    let activityForEdit = new BC_CalendarActivity();
    activityForEdit.setToExistingActivity(info.event);
    activityForEdit.updateCalendarActivityInDB(vendorId, auth);
  }

  const handleDateClick = (info) => {
    console.log("date click: ", info);
    let newActivity = new BC_CalendarActivity();
    newActivity.setWithNewClickInfo(info);
    setActivityData(newActivity);
    showModal();
  }

  const handleSaveActivity = (activity) => {
    console.log("Save with activityData: ", activity);
    if (!activity.title) {
      activity.setTitle("(No Title)");
    }
    if (!activity.end) {
      activity.setEnd(activity.start);
    }
    setActivityData(activity);
    publishActivity(activity, vendorId, auth, myEvents, calendarActivities);

    console.log("activityData: ", activityData);
    console.log("events after publish in handler: ", myEvents);
    hideModal();
  }

  const handleDeleteActivity = (activity) => {
    console.log("Delete activity: ", activity);
    let updatedEvents = [];
    for (let i = 0; i < myEvents.length; i++) {
      if (myEvents[i].id == activity.id) {
        continue;
      }
      updatedEvents.push(myEvents[i]);
    }
    setMyEvents(updatedEvents);
    //need to remove from DB
    activity.deleteCalendarActivityFromDB();
    hideModal();
  }

  const publishActivity = (activityIn, vendorIdIn, authIn, currentEventList, calendarActivities) => {
    console.log("current event list: ", currentEventList);
    if (activityIn.isNew) {
      const newList = currentEventList.concat(activityIn);
      setMyEvents(newList);
      console.log("newList: ", newList);
      const newUnfilteredList = calendarActivities.unfilteredEvents.concat(activityIn);
      calendarActivities.setUnfilteredEvents(newUnfilteredList);
      activityIn.addCalendarActivityToDB(vendorIdIn, authIn);
    }
    else {
      let updatedEvents = [];
      for (let i = 0; i < currentEventList.length; i++) {
        if (currentEventList[i].id != activityIn.id) {
          updatedEvents.push(currentEventList[i]);
          continue;
        }
        updatedEvents.push(activityIn);
      }
      setMyEvents(updatedEvents);
      console.log("updatedEvents: ", updatedEvents);
      activityIn.updateCalendarActivityInDB(vendorIdIn, authIn);
    }
  }

  const handleFilterChange = (value, key) => {
    console.log("handleFilterChange: ", value, key);
    calendarActivities.adjustFilters(value, key);
    setFilters(calendarActivities.filters);
  }

  const handleSearchTermChange = event => {
    setSearchTerm(event.target.value);
  };

  return (
    <CalendarStyled className="bc-calendar-wrapper">
      <ActivityDetailModal show={isAddEventModalShown}
        visibleClasses={classes}
        activityData={activityData}
        handleClose={hideModal}
        handleDelete={handleDeleteActivity}
        handleSave={handleSaveActivity}>
      </ActivityDetailModal>

      <div id="calendarControls" className="control-block">
        <h3>My Calandars</h3>

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

      </div>
      <div id="calendarContainer" className="calendar-wrapper">
        {
          isLoading ? (
            <Loading />
          ) : (
            <FullCalendar
              headerToolbar={{ left: 'prev,next,today', center: 'title', right: 'timeGridDay,timeGridWeek,dayGridMonth' }}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              editable={true}
              eventDrop={handleEventDrop}
              eventResize={handleResize}
              eventClick={handleClickOnActivity}
              events={myEvents}
              dateClick={handleDateClick}
              allDaySlot={true}
              scrollTime={'08:00:00'}
            />
          )
        }
      </div>



    </CalendarStyled>
  );
};

export default BCCalendar;
