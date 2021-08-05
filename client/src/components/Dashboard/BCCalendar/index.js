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

  //const [defaultApplication,setDefaultApplication] = useState([])
  const [filteredData, setFilteredData] = useState([]);

  const [isLoading, setIsLoading] = useState(false)
  const [isAddEventModalShown, setIsActivityDetailsModalShown] = useState(false)

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
      triggerApiCallGetActivities(localVendorId, auth);
    }
  }, [vendors]);

  const triggerApiCallGetActivities = async (vendorId, auth) => {
    try {
      console.log('apiCall get calendar activities: vendor ', vendorId)
      if (!vendorId) {
        return;
      }
      const res = await BC_CalendarActivity.GetCalendarActivitiesFromDB(vendorId, auth.user_id);
      console.log('apiCall get calendar activities ', res)
      let classList = []
      if (res && res.app_groups && res.app_groups.length > 0) {
        for (let i = 0; i < res.app_groups.length; i++) {
          const classData = res.app_groups[i];
          classList[classData.id] = classData;
        }
        setClasses(classList);
      }
      if (res && res.activities && res.activities.length > 0) {
        let activityList = []
        for (let i = 0; i < res.activities.length; i++) {
          const row = res.activities[i];
          let activityFromDB = new BC_CalendarActivity();
          activityFromDB.loadFromDBRow(row, classList);
          activityList.push(activityFromDB);
        }
        setMyEvents(activityList);
      }
    } catch (err) {
      console.log('Error', err)
    }
  };


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
    console.log("extended props:", extendedProps);
    console.log("id:", info.event.id);
    console.log("start:", info.event.start);
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
    publishActivity(activity, vendorId, auth, myEvents);

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

  const publishActivity = (activityIn, vendorIdIn, authIn, currentEventList) => {
    console.log("current event list: ", currentEventList);
    if (activityIn.isNew) {
      const newList = currentEventList.concat(activityIn);
      setMyEvents(newList);
      console.log("newList: ", newList);
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
        <h3>Schedule Activities</h3>

        <div className="btn-holder">
          <a href="#" data-bs-toggle="modal" data-bs-target="#add-new-event"
            className="btn mt-3 btn-info d-block w-100 waves-effect waves-light">
            <FontAwesomeIcon icon={faPlus} />
            Add New Event
          </a>
        </div>
        <div className="btn-holder">
          <a href="#" data-bs-toggle="modal" data-bs-target="#add-new-event"
            className="btn mt-3 btn-info d-block w-100 waves-effect waves-light">
            <FontAwesomeIcon icon={faPlus} />
            Add New Class
          </a>
        </div>
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
