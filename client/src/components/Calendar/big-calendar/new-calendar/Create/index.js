import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { requestAddCalendar } from "../../../../../redux/actions/Calendars";
import CreateCalendarForm from "../../forms/CreateCalendarForm";
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
    selectedFamilyMembers: new Map().set("0", true)
  });
  const familyMembers = useSelector(({ familyMembers }) => familyMembers);
  const dispatch = useDispatch();
  const handleInputChange = (id, value) => {
    setCalendarDetails({ ...calendarDetails, [id]: value });
  };
  const handleCheckBoxChange = element => {
    const value = element.target.value;
    const isChecked = element.target.checked;
    if (value == 0) {
      setCalendarDetails({
        ...calendarDetails,
        selectedFamilyMembers: new Map().set(value, isChecked)
      });
      return;
    }
    if (calendarDetails.selectedFamilyMembers.get("0") === true) {
      setCalendarDetails({
        ...calendarDetails,
        selectedFamilyMembers: new Map().set(value, isChecked)
      });
      return;
    }
    setCalendarDetails({
      ...calendarDetails,
      selectedfamilyMembers: calendarDetails.selectedFamilyMembers.set(
        value,
        isChecked
      )
    });
  };
  const handleFormSubmit = async () => {
    if (calendarDetails.selectedFamilyMembers.length === 0) {
      if (calendarDetails.selectedFamilyMembers.length === 0) {
        setCalendarDetails({
          ...calendarDetails,
          selectedFamilyMembers: new Map().set("0", true)
        });
      }
    }
    dispatch(requestAddCalendar(calendarDetails));
    setCalendarDetails({
      name: "",
      selectedFamilyMembers: new Map().set("0", true)
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
        <CreateCalendarForm
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
