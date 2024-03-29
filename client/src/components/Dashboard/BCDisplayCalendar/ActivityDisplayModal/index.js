import React, { useState, useEffect }  from "react";

import '../../BCCalendar/activity/modal.css';
import 'react-tabs/style/react-tabs.css';
import Draggable from "react-draggable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import moment from 'moment';
import BC_CalendarActivity from "../../BCCalendar/activity/BC_CalendarActivity";

const DisplayEventModal = props => {
  const { handleClose, show, activityData, visibleClasses } = props;
  const [showHideClassName, setShowHideClassName] = useState("modal display-none");

  useEffect(() => {
    setShowHideClassName(show ? "modal display-block" : "modal display-none");
    console.log("show class: ", showHideClassName);
  }, [show]);

  return (
    <div className={showHideClassName} >
      <section className="modal-main">
      <div className="modal-dialog">
      <Draggable handle=".modal-header">
            <div className="modal-content calendar-event-schedule" style={{transform: 'initial'}}>
                <div className="modal-header d-flex align-items-center">
                  <h2 className="modal-title">{activityData.title}</h2>
                  <span className="close" onClick={handleClose}>
                    &times;
                  </span>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row">
                            { (activityData.event_type == BC_CalendarActivity.TYPE_CLASS) && 
                            <div>
                                Class: {visibleClasses[activityData.idClass].name}
                                </div>
                            }
                            <div>
                                <label>From:</label> {moment(activityData.start).format('dddd, MMMM Do hh:mm a')} <label>to</label> {moment(activityData.end).format('hh:mm a')}
                            </div>
                        </div>
                        { (activityData.description) &&  
                            <div  className="row">
                                <label>Details:</label> {activityData.description}
                                </div>
                        
                            }
                        { (activityData.tags) &&  
                            <div className="row">
                                <label>Tags:</label> {activityData.tags}
                                </div>
                        
                            }
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary waves-effect" data-bs-dismiss="modal" onClick={handleClose}>Close</button>
                </div>
            </div>
            </Draggable>
        </div>
      </section>
    </div>
  );
};

export default DisplayEventModal;