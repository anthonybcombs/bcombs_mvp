import React, {useRef, useState, useEffect }  from "react";
import '../modal.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Draggable from "react-draggable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import moment from 'moment';
import { DatePicker, TimePicker } from "@material-ui/pickers";
//import { alpha } from '@material-ui/core/styles';
import BC_CalendarActivity from "../BC_CalendarActivity";

const BCDateRangePicker = props => {
  const { startDate, setStartDate, endDate, setEndDate } = props;

  return (
    <div className="grid-2a">
      <div className="col">
        <FontAwesomeIcon icon={faClock} />
      </div>
      <div className="col date-time-row">
        <DatePicker
          disableToolbar
          variant="inline"
          value={startDate}
          onChange={setStartDate}
        />                                  
        <TimePicker
          variant="inline"
          value={startDate}
          onChange={setStartDate}
        />                                
        <div>to</div>
        <TimePicker
            variant="inline"
            value={endDate}
            onChange={setEndDate}
          />
      </div>
    </div>
  );
};

const NewEventModal = props => {
  const { handleClose, show, handleSave, activityData, handleDelete } = props;
  //const [startDate, setStartDate] = useState();
  //const [endDate, setEndDate] = useState();
  const [localActivity, setLocalAcivity] = useState(new BC_CalendarActivity());
 // const [dayDisplay, setDayDisplay] = useState();
  const [showHideClassName, setShowHideClassName] = useState("modal display-none");

  //let tempActivityData = null;

  const handleTitleChange = (e) => {
    localActivity.setTitle(e.target.value);
    setLocalAcivity(new BC_CalendarActivity(localActivity));
  }

  useEffect(() => {
    setShowHideClassName(show ? "modal display-block" : "modal display-none");
    console.log("show class: ", showHideClassName);
  }, [show]);

  useEffect(() => {
    let localActivityTemp = new BC_CalendarActivity(activityData);
    setLocalAcivity(localActivityTemp);
  }, [activityData]);

  const setStartDate = (start) => {
    localActivity.setStart(start);
    setLocalAcivity(new BC_CalendarActivity(localActivity));
  }
  const setEndDate = (end) => {
    localActivity.setEnd(end);
    setLocalAcivity(new BC_CalendarActivity(localActivity));
  }

  const handleSaveLocal = () => {
    handleSave(localActivity);
  }
  const handleDeleteLocal = () => {
    if(window.confirm("Are you sure you want to delete '"+localActivity.title+"'?")){
      console.log('delete confirmed: ', localActivity);
      handleDelete(localActivity);

    } else {
        console.log('delete aborted');
    }
  }

  return (
    <div className={showHideClassName} >
      <section className="modal-main">
      <div className="modal-dialog">
      <Draggable handle=".modal-header">
            <div className="modal-content" style={{transform: 'initial'}}>
                <div className="modal-header d-flex align-items-center">
                    <h4 className="modal-title"><strong>Add</strong> an activity</h4>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" 
                      onClick={handleClose}></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row">
                            <div className="col-md-6">
                                <label className="control-label">Title Name</label>
                                <input className="form-control form-white" placeholder="Enter title" 
                                  onChange={handleTitleChange} value={localActivity.title}
                                    type="text" name="title2"></input>
                            </div>
                            <Tabs defaultIndex={0} onSelect={index => console.log(index)}>
                              <TabList>
                                <Tab>Event</Tab>
                                <Tab>Class</Tab>
                              </TabList>

                              <TabPanel>
                              <BCDateRangePicker 
                                  startDate={localActivity.start}
                                  setStartDate={setStartDate}
                                  endDate={localActivity.end}
                                  setEndDate={setEndDate}
                                />
                              </TabPanel>
                              <TabPanel>
                                <h2>Class Details Form</h2>
                                <BCDateRangePicker 
                                  startDate={localActivity.start}
                                  setStartDate={setStartDate}
                                  endDate={localActivity.end}
                                  setEndDate={setEndDate}
                                />
                                <div className="col-md-6">
                                <label className="control-label">Choose Category Color</label>
                                <select className="form-select form-white" data-placeholder="Choose a color..." name="category-color">
                                    <option value="success">Success</option>
                                    <option value="danger">Danger</option>
                                    <option value="info">Info</option>
                                    <option value="primary">Primary</option>
                                    <option value="warning">Warning</option>
                                    <option value="inverse">Inverse</option>
                                </select>
                            </div>
                              </TabPanel>
                            </Tabs>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    { !localActivity.isNew && <button type="button" className="btn waves-effect waves-light btn-delete" onClick={handleDeleteLocal}>Delete</button> }
                    <button type="button" className="btn btn-primary waves-effect waves-light save-category" data-bs-dismiss="modal" onClick={handleSaveLocal}>Save</button>
                    <button type="button" className="btn btn-secondary waves-effect" data-bs-dismiss="modal" onClick={handleClose}>Close</button>
                </div>
            </div>
            </Draggable>
        </div>
      </section>
    </div>
  );
};

export default NewEventModal;