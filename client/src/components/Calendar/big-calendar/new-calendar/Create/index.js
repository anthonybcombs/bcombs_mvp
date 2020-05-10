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
    name: "",
    selectedFamilyMembers: new Map(),
    image: "",
    visibilityType: "Private",
  });
  console.log(calendarDetails);
  const familyMembers = useSelector(({ familyMembers }) => familyMembers);
  const dispatch = useDispatch();
  const handleInputChange = (id, value) => {
    setCalendarDetails({ ...calendarDetails, [id]: value });
  };
  const handleCheckBoxChange = (element) => {
    const value = element.target.value;
    const isChecked = element.target.checked;
    if (value == "Private" || value === "Public") {
      setCalendarDetails({
        ...calendarDetails,
        visibilityType: value,
        selectedFamilyMembers: new Map(),
      });
      return;
    }
    setCalendarDetails({
      ...calendarDetails,
      visibilityType: "Custom",
      selectedfamilyMembers: calendarDetails.selectedFamilyMembers.set(
        value,
        isChecked
      ),
    });
  };
  const handleFormSubmit = async () => {
    dispatch(requestAddCalendar(calendarDetails));
    setCalendarDetails({
      name: "",
      selectedFamilyMembers: new Map(),
      visibilityType: "Private",
      image: "",
    });
    toggleCreateCalendarModal(false);
  };
  if (!isVisible) {
    return <></>;
  }
  return ReactDOM.createPortal(
    <CreateCalendarModalStyled
      data-testid="app-big-calendar-create-modal"
      className="modal"
    >
      <div className="modal-content">
        <span
          className="close"
          onClick={() => {
            toggleCreateCalendarModal(false);
          }}
        >
          &times;
        </span>
        <h2 data-testid="app-big-calendar-create-modal-header">
          Create new calendar
        </h2>
        <CalendarForm
          details={calendarDetails}
          familyMembers={familyMembers}
          onSubmit={handleFormSubmit}
          handleInputChange={handleInputChange}
          handleCheckBoxChange={handleCheckBoxChange}
          toggleCreateCalendarModal={toggleCreateCalendarModal}
        />
      </div>
    </CreateCalendarModalStyled>,
    document.getElementById("modal")
  );
}
