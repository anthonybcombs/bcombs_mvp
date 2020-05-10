import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { requestAddCalendar } from "../../../../../redux/actions/Calendars";
import CalendarForm from "../../forms/CalendarForm";
const EditCalendarModalStyled = styled.div`
  h2 {
    text-align: center;
  }
  .modal-content {
    margin: 1em auto;
    width: 50%;
  }
`;
export default function index({ isVisible = true, toggleEditCalendarModal }) {
  const [calendarDetails, setCalendarDetails] = useState({
    name: "",
    selectedFamilyMembers: new Map(),
    image: "",
    visibilityType: "Private",
  });
  useEffect(() => {}, []);
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
    });
    toggleEditCalendarModal(false);
  };
  if (!isVisible) {
    return <></>;
  }
  return ReactDOM.createPortal(
    <EditCalendarModalStyled
      data-testid="app-big-calendar-create-modal"
      className="modal"
    >
      <div className="modal-content">
        <span
          className="close"
          onClick={() => {
            toggleEditCalendarModal(false);
          }}
        >
          &times;
        </span>
        <h2 data-testid="app-big-calendar-create-modal-header">
          Edit calendar
        </h2>
        <CalendarForm
          details={calendarDetails}
          familyMembers={familyMembers}
          onSubmit={handleFormSubmit}
          handleInputChange={handleInputChange}
          handleCheckBoxChange={handleCheckBoxChange}
          toggleEditCalendarModal={toggleEditCalendarModal}
        />
      </div>
    </EditCalendarModalStyled>,
    document.getElementById("modal")
  );
}
