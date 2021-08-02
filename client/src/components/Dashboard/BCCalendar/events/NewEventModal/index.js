import React, {useRef, useState, useEffect }  from "react";
import '../modal.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const NewEventModal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";
  const [title, setTitle] = useState();
  const [startDate, setStartDate] = useState();

  const handleTitleChange = (e) => {
      setTitle( e.target.value );
  }

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
      <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header d-flex align-items-center">
                    <h4 class="modal-title"><strong>Add</strong> an activity</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="row">
                            <div class="col-md-6">
                                <label class="control-label">Title Name</label>
                                <input class="form-control form-white" placeholder="Enter title" 
                                  onChange={handleTitleChange} value={title}
                                    type="text" name="title2"></input>
                            </div>
                            <Tabs defaultIndex={0} onSelect={index => console.log(index)}>
                              <TabList>
                                <Tab>Event</Tab>
                                <Tab>Class</Tab>
                              </TabList>

                              <TabPanel>
                                <h2>Event Details Form</h2>
                              </TabPanel>
                              <TabPanel>
                                <h2>Class Details Form</h2>
                                <div class="col-md-6">
                                <label class="control-label">Choose Category Color</label>
                                <select class="form-select form-white" data-placeholder="Choose a color..." name="category-color">
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
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary waves-effect waves-light save-category" data-bs-dismiss="modal">Save</button>
                    <button type="button" class="btn btn-secondary waves-effect" data-bs-dismiss="modal" onClick={handleClose}>Close</button>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default NewEventModal;