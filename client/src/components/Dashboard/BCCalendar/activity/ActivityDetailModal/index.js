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
    <div className="grid-2a field-calendar">
      <div className="col icon-clock">
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
  const { handleClose, show, handleSave, activityData, handleDelete, visibleClasses } = props;
  //const [startDate, setStartDate] = useState();
  //const [endDate, setEndDate] = useState();
  const [localActivity, setLocalAcivity] = useState(new BC_CalendarActivity());
 // const [dayDisplay, setDayDisplay] = useState();
  const [showHideClassName, setShowHideClassName] = useState("modal display-none");
  const [tabIndex, setTabIndex] = useState(0);
  const [localClassId, setLocalClassId] = useState('');
  const [localDescription, setLocalDescription] = useState(activityData.description ? activityData.description : '');

  //let tempActivityData = null;

  const handleTitleChange = (e) => {
    localActivity.setTitle(e.target.value);
    setLocalAcivity(new BC_CalendarActivity(localActivity));
  }

  const handleTagsChange = (e) => {
    localActivity.setTags(e.target.value);
    setLocalAcivity(new BC_CalendarActivity(localActivity));
  }

  const handleDescriptionChange = (e) => {
    console.log("description changed to: "+e.target.value);
    localActivity.setDescription(e.target.value);
    setLocalAcivity(new BC_CalendarActivity(localActivity));
  }

  useEffect(() => {
    setShowHideClassName(show ? "modal display-block" : "modal display-none");
    console.log("show class: ", showHideClassName);
  }, [show]);

  useEffect(() => {
    console.log("show visibleClasses: ", visibleClasses);
  }, [visibleClasses]);

  useEffect(() => {
    let localActivityTemp = new BC_CalendarActivity(activityData);
    setLocalAcivity(localActivityTemp);
  }, [activityData]);

  useEffect(() => {
    if (localActivity.event_type == BC_CalendarActivity.TYPE_EVENT) {
      setTabIndex(0);
    }
    else if (localActivity.event_type == BC_CalendarActivity.TYPE_CLASS) {
      setTabIndex(1);
    }
    setLocalClassId(localActivity.idClass ? localActivity.idClass: '');
    console.log('setting local description to: ' + localActivity.description);
    setLocalDescription(localActivity.description ? localActivity.description: '');
  }, [localActivity]);

  const setStartDate = (start) => {
    localActivity.setStart(start);
    setLocalAcivity(new BC_CalendarActivity(localActivity));
  }
  const setEndDate = (end) => {
    localActivity.setEnd(end);
    setLocalAcivity(new BC_CalendarActivity(localActivity));
  }

  const handleClassSelectChange = (event) => {
    const classId = event.target.value;
    localActivity.setClassId(classId);
    //console.log("=======> ", classId);
    if (!localActivity.title && visibleClasses && visibleClasses[classId]) {
      localActivity.setTitle(visibleClasses[classId].name + " Session");
    }
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

  const handleTabSelect = (index) => {
    let localActivityTemp = new BC_CalendarActivity(localActivity);
    if (index == 0) {
      localActivityTemp.setEventType(BC_CalendarActivity.TYPE_EVENT);
    }
    else if (index == 1) {
      localActivityTemp.setEventType(BC_CalendarActivity.TYPE_CLASS);
    }
    setLocalAcivity(localActivityTemp);
  }

  return (
    <div className={showHideClassName} >
      <section className="modal-main">
      <div className="modal-dialog">
      <Draggable handle=".modal-header">
            <div className="modal-content calendar-edit-activity" style={{transform: 'initial'}}>
                <div className="modal-header d-flex align-items-center">
                  <h2 className="modal-title">Add an activity</h2>
                  <span className="close" onClick={handleClose}>
                    &times;
                  </span>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="row">
                            <div className="col-md-12 field">
                                <label className="control-label">Title Name</label>
                                <input className="form-control form-white" placeholder="Enter title" 
                                  onChange={handleTitleChange} value={localActivity.title}
                                    type="text" name="title2"></input>
                            </div>
                            <Tabs selectedIndex={tabIndex} 
                              onSelect={handleTabSelect}>
                              <TabList>
                                <Tab>Event</Tab>
                                <Tab>Group</Tab>
                              </TabList>

                              <TabPanel>
                                <BCDateRangePicker 
                                  startDate={localActivity.start}
                                  setStartDate={setStartDate}
                                  endDate={localActivity.end}
                                  setEndDate={setEndDate}
                                />
                                  <div className="col-md-6 control-wrapper field">
                                    <label className="control-label">Details</label>
                                    <textarea className="form-control form-white details-input" 
                                      onChange={handleDescriptionChange} value={localDescription}
                                        name="description"></textarea>
                                  </div>
                                  <div className="col-md-6 control-wrapper field">
                                    <label className="control-label">Tags</label>
                                    <input className="form-control form-white tags-input" placeholder="Enter tags (comma separate)" 
                                      onChange={handleTagsChange} value={localActivity.tags}
                                        type="text" name="tags"></input>
                                  </div>

                              </TabPanel>
                              <TabPanel>
                                <div className="col-md-6 control-wrapper field select-wrapper">
                                  <label className="control-label">Group: </label>
                                  <select className="form-select form-white"
                                    value={localClassId}
                                    onChange={handleClassSelectChange}
                                    data-placeholder="Select Class Name..." name="category-color">
                                      <option value=""> -- Select a Group -- </option>
                                        {visibleClasses.map((elem) => 
                                          <option key={elem.name} value={elem.id}>{elem.name}</option>)
                                        }                              
                                  </select>
                                </div>
                                <BCDateRangePicker 
                                  startDate={localActivity.start}
                                  setStartDate={setStartDate}
                                  endDate={localActivity.end}
                                  setEndDate={setEndDate}
                                />
                                <div className="col-md-6 control-wrapper field">
                                  <label className="control-label">Details</label>
                                  <textarea rows="2" className="form-control form-white details-input" 
                                    onChange={handleDescriptionChange} value={localDescription}
                                      name="description"></textarea>
                                </div>
                                <div className="col-md-6 control-wrapper field">
                                  <label className="control-label">Tags</label>
                                  <input className="form-control form-white tags-input" placeholder="Enter tags (comma separate)" 
                                    onChange={handleTagsChange} value={localActivity.tags}
                                      type="text" name="tags2"></input>
                                </div>
                              </TabPanel>
                            </Tabs>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    { !localActivity.isNew && <button type="button" className="btn waves-effect waves-light btn-delete" onClick={handleDeleteLocal}>Delete</button> }
                    <button type="button" className="btn btn-primary waves-effect waves-light save-category" data-bs-dismiss="modal" onClick={handleSaveLocal}>Save</button>
                    {/* <button type="button" className="btn btn-secondary waves-effect" data-bs-dismiss="modal" onClick={handleClose}>Close</button> */}
                </div>
            </div>
            </Draggable>
        </div>
      </section>
    </div>
  );
};

export default NewEventModal;