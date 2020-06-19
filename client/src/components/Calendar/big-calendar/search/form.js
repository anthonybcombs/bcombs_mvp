import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Select from "react-select";
import { differenceInDays, parseISO, isPast } from "date-fns";
import { useForm } from "react-hook-form";
import CustomMultiSelectOptions from "../../../../helpers/CustomMultiSelectOptions";
import ErrorMessage from "../../../../helpers/ErrorMessage";
const FormStyled = styled.form`
  input:not([class^="custom-select"]) {
    background: none;
    width: 100%;
    color: black;
    font-size: ${({ theme }) => theme.input.fontSize} !important;
    display: inline-block;
    border: none;
    border-radius: 1;
    outline: 0;
    border-bottom: 2px solid lightgrey;
    margin-top: 1.5em;
    margin-bottom: 1.5em;
  }
  input:focus {
    border-color: ${({ theme }) => theme.input.focus.border.color};
    transition: 3s;
  }
  button {
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    font-size: ${({ theme }) => theme.button.fontSize} !important;
    border: none;
    color: white;
    box-shadow: 0px 3px 6px #908e8e;
    padding-top: 1em;
    padding-bottom: 1em;
  }
  button[type="submit"] {
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    padding: 10px;
    width: 100%;
    display: block;
    margin: 20px auto;
    border: none;
  }
  div[class$="multiValue"] div {
    background-color: #f26e21;
    color: white;
  }
`;
export default function form({ calendars, onSubmit }) {
  const { register, handleSubmit, errors, setValue, getValues } = useForm({
    mode: "onSubmit"
  });
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [startDateType, setStartDateType] = useState("text");
  const [endDateType, setEndDateType] = useState("text");
  const [selectedCalendar, setSelectedCalendar] = useState([]);
  const options = [];
  calendars.map(calendarsGroup => {
    return calendarsGroup.map(calendar => {
      options.push({ value: calendar.id, label: calendar.name });
    });
  });
  useEffect(() => {
    register({ name: "calendars" }, { required: true });
    register(
      { name: "startDate" },
      {
        validate: {
          noPastDate: value => {
            if (isPast(parseISO(value))) {
              return false;
            }
            return true;
          }
        }
      }
    );
    register(
      { name: "endDate" },
      {
        validate: {
          noPrevDate: value => {
            if (
              differenceInDays(
                parseISO(getValues()["startDate"]),
                parseISO(value)
              ) > 0
            ) {
              return false;
            }
            return true;
          }
        }
      }
    );
  }, []);

  return (
    <FormStyled method="POST" onSubmit={handleSubmit(onSubmit)}>
      {/* <Select
        className="select"
        options={options}
        placeholder="Select a calendar"
        isMulti
        closeMenuOnSelect={false}
        theme={theme => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            primary25: "#f26e21",
            primary: "#f26e21"
          }
        })}
        onChange={option => {
          if (option !== null) {
            const calendarIds = option.map(calendar => calendar.value);
            setValue("calendars", calendarIds);
            return;
          }
          setValue("calendars", "");
        }}
      /> */}

      <CustomMultiSelectOptions
        className="custom-select"
        options={options}
        value={options.filter(group => {
          return selectedCalendar.includes(group.value);
        })}
        onChange={option => {
          if (option !== null) {
            const calendarIds = option.map(calendar => calendar.value);
            setSelectedCalendar(calendarIds);
            setValue("calendars", calendarIds);
            return;
          }
          setSelectedCalendar([]);
          setValue("calendars", "");
        }}
        labelledBy={"Select a calendar"}
      />

      <ErrorMessage
        field={errors.calendars}
        errorType="required"
        message="Calendars is required."
      />
      <input name="name" type="text" placeholder="Event" ref={register} />
      {/* <input name="organizer" type="text" placeholder="Organizer" /> */}
      <input
        name="startDate"
        type={startDateType}
        placeholder="Date"
        ref={register}
        onFocus={() => {
          setStartDateType("date");
        }}
        onBlur={() => {
          setStartDateType("text");
        }}
        placeholder="Start date"
      />
      <ErrorMessage
        field={errors.startDate}
        errorType="noPastDate"
        message="Start date must be atleast the current date."
      />
      <input
        name="endDate"
        type={endDateType}
        placeholder="Date"
        ref={register}
        onFocus={() => {
          setEndDateType("date");
        }}
        onBlur={() => {
          setEndDateType("text");
        }}
        placeholder="End date"
      />
      <ErrorMessage
        field={errors.endDate}
        errorType="noPrevDate"
        message="End date must be greater than start date."
      />
      <input
        name="location"
        type="text"
        placeholder="Location"
        ref={register}
      />
      {/* <input name="school" type="text" placeholder="School" />
      <input name="city" type="text" placeholder="City" />
      <input name="activity" type="text" placeholder="Activity" />
      <input name="zip" type="text" placeholder="Zip" /> */}
      <button type="submit">Search</button>
    </FormStyled>
  );
}
