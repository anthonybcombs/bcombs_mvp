import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { requestEditCalendar } from "../../../../../redux/actions/Calendars";
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
export default function index({
  isVisible = true,
  toggleEditCalendarModal,
  calendar,
}) {
  const [calendarDetails, setCalendarDetails] = useState(calendar);
  useEffect(() => {
    calendar.familyMembers.forEach((familyMemberId) => {
      calendar.selectedFamilyMembers.set(familyMemberId, true);
    });
    setCalendarDetails(calendar);
  }, [calendar]);
  const { familyMembers, calendars, groups } = useSelector(
    ({ familyMembers, calendars, groups }) => {
      return { familyMembers, calendars, groups };
    }
  );
  const colors = calendars.map((calendar) => calendar.color);
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
  const handleCancel = () => {
    setCalendarDetails({
      name: "",
      selectedFamilyMembers: new Map(),
      visibilityType: "Private",
      image: "",
      groups: [],
    });
    toggleEditCalendarModal(false);
  };
  const handleFormSubmit = async () => {
    console.log(calendarDetails);
    dispatch(requestEditCalendar(calendarDetails));
    setCalendarDetails({
      name: "",
      selectedFamilyMembers: new Map(),
      visibilityType: "Private",
      groups: [],
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
            handleCancel();
          }}
        >
          &times;
        </span>
        <h2 data-testid="app-big-calendar-create-modal-header">
          Edit calendar
        </h2>
        <CalendarForm
          details={calendarDetails}
          colors={colors}
          groups={groups}
          familyMembers={familyMembers}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          handleInputChange={handleInputChange}
          handleCheckBoxChange={handleCheckBoxChange}
        />
      </div>
    </EditCalendarModalStyled>,
    document.getElementById("modal")
  );
}
