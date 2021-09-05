import React, { useState, useEffect }  from "react";
import { uuid } from "uuidv4";

import '../../BCCalendar/activity/modal.css';
import 'react-tabs/style/react-tabs.css';
import Draggable from "react-draggable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";


async function GetFromDB(id, vendorId, userId, calendarActivities) {
    const calendarActivitiesLocal = {
        filters: calendarActivities.filters,
        tagList: calendarActivities.tagList,
        searchTerm: calendarActivities.searchTerm
    }

    const bodyString = JSON.stringify({
        'uuid' : id,
        'userId' : userId,
        'vendorId' : vendorId,
        calendarActivities: calendarActivitiesLocal
    });
    console.log("body string: " + bodyString);
    
    const response = await fetch(`${process.env.API_HOST}/api/bccalendar/add_feed`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: bodyString // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}


const CalendarFeedModal = props => {
  const { handleClose, show, calendarActivities } = props;
  const [showHideClassName, setShowHideClassName] = useState("modal display-none");
  const [isLoading, setIsLoading] = useState(true);
  const [feedURL, setFeedURL] = useState('');

  useEffect(() => {
    setShowHideClassName(show ? "modal display-block" : "modal display-none");
    console.log("show class: ", showHideClassName);
  }, [show]);

  useEffect(() => {
      if (calendarActivities) {
        setIsLoading(true); 
        let id = uuid();
        GetFromDB(id, calendarActivities.vendor, calendarActivities.user_id, calendarActivities);
        let URL = `${process.env.API_HOST}/api/bccalendar/feed?key=${id}`;
        setFeedURL(URL);
        setIsLoading(false); 
    }
  }, [calendarActivities]);

  const handleCopy = () => {
      console.log("start copy to clipboard");
    navigator.clipboard.writeText(feedURL);
    console.log("end copy to clipboard");
}

  return (
    <div className={showHideClassName} >
      <section className="modal-main">
      <div className="modal-dialog">
      <Draggable handle=".modal-header">
            <div className="modal-content calendar-url" style={{transform: 'initial'}}>
                <div className="modal-header d-flex align-items-center">
                  <h2 className="modal-title">Calandar Feed URL</h2>
                  <span className="close" onClick={handleClose}>
                    &times;
                  </span>
                </div>
                <div className="modal-body">
                        <div className="row" style={{display: 'inline-flex'}}>
                        <form>
                            <input value={feedURL} style={
                                {   width: '450px', 
                                    'margin-right': '10px',
                                    'margin-top': '4px',
                                    height: '25px'}}></input>
                        </form>
                            <button id="copyButton" 
                            onClick={ (event) => { event.stopPropagation(); handleCopy(); }} >
                                <FontAwesomeIcon icon={faCopy} />
                            </button>
                            </div>
                </div>
                {/* <div className="modal-footer">
                    <button type="button" className="btn btn-secondary waves-effect" data-bs-dismiss="modal" onClick={handleClose}>Close</button>
                </div> */}
            </div>
            </Draggable>
        </div>
      </section>
    </div>
  );
};

export default CalendarFeedModal;