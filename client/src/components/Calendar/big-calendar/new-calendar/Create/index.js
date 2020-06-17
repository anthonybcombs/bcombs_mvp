import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { requestAddCalendar } from "../../../../../redux/actions/Calendars";
import CalendarForm from "../../forms/CalendarForm";
const CreateCalendarModalStyled = styled.div`
  h2 {
    text-align: center;
  }
  .modal-content {
    margin: 1em auto;
    width: 50%;
  }
`;
export default function index({ isVisible = true, toggleCreateCalendarModal }) {
  const [calendarDetails, setCalendarDetails] = useState({
    color: [],
    name: "",
    selectedFamilyMembers: new Map(),
    image: "",
    visibilityType: "Private",
    color: "",
    groups: []
  });
  const { familyMembers, groups } = useSelector(({ familyMembers, groups }) => {
    return { familyMembers, groups };
  });
  const dispatch = useDispatch();
  const handleInputChange = (id, value) => {
    setCalendarDetails({ ...calendarDetails, [id]: value });
  };
  const handleCheckBoxChange = element => {
    const value = element.target.value;
    const isChecked = element.target.checked;
    if (value == "Private" || value === "Public") {
      setCalendarDetails({
        ...calendarDetails,
        visibilityType: value,
        selectedFamilyMembers: new Map()
      });
      return;
    }
    setCalendarDetails({
      ...calendarDetails,
      visibilityType: "Custom",
      selectedfamilyMembers: calendarDetails.selectedFamilyMembers.set(
        value,
        isChecked
      )
    });
  };
  const handleCancel = () => {
    setCalendarDetails({
      name: "",
      selectedFamilyMembers: new Map(),
      visibilityType: "Private",
      image: "",
      groups: []
    });
    toggleCreateCalendarModal(false);
  };
  const handleFormSubmit = async () => {
    console.log("CALENDARSSSSSSSSSSSSSSSS", calendarDetails);
    dispatch(requestAddCalendar(calendarDetails));
    setCalendarDetails({
      name: "",
      selectedFamilyMembers: new Map(),
      visibilityType: "Private",
      image: "",
      groups: []
    });
    toggleCreateCalendarModal(false);
  };
  if (!isVisible) {
    return <></>;
  }
  return ReactDOM.createPortal(
    <CreateCalendarModalStyled
      data-testid="app-big-calendar-create-modal"
      className="modal">
      <div className="modal-content">
        <span
          className="close"
          onClick={() => {
            handleCancel();
          }}>
          &times;
        </span>
        <h2 data-testid="app-big-calendar-create-modal-header">
          Create new calendar
        </h2>
        <CalendarForm
          details={calendarDetails}
          familyMembers={familyMembers}
          groups={groups}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          handleInputChange={handleInputChange}
          handleCheckBoxChange={handleCheckBoxChange}
        />
      </div>
    </CreateCalendarModalStyled>,
    document.getElementById("modal")
  );
}
