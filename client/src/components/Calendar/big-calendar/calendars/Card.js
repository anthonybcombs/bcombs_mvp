import React from "react";
import { requestDeleteCalendar } from "../../../../redux/actions/Calendars";
export default CalendarCard = ({
  calendar,
  handleCalendarSelection,
  setSelectedCalendar,
  selectedCalendars,
  toggleEditCalendarModal,
}) => {
  const [isCalendarButtonsVisible, setCalendarButtonsVisible] = useState(false);
  const dispatch = useDispatch();
  return (
    <div
      className="calendar"
      key={index}
      onClick={() => {
        handleCalendarSelection(calendar.id);
      }}
      onMouseEnter={() => {
        setCalendarButtonsVisible(true);
      }}
      onMouseLeave={() => {
        setCalendarButtonsVisible(false);
      }}
    >
      <img src={calendar.image} />
      <p
        className={`${
          selectedCalendars.includes(calendar.id) ? "selected" : ""
        }`}
      >
        <span style={{ backgroundColor: `${calendar.color}` }}></span>
        {calendar.name}
      </p>
      {isCalendarButtonsVisible && (
        <div id="buttons">
          <FontAwesomeIcon
            icon={faEdit}
            onClick={() => {
              setSelectedCalendar(calendar);
              toggleEditCalendarModal(true);
            }}
          />
          <FontAwesomeIcon
            icon={faTrashAlt}
            onClick={() => {
              dispatch(requestDeleteCalendar(calendar));
            }}
          />
        </div>
      )}
    </div>
  );
};
