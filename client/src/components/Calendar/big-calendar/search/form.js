import React, { useEffect } from "react";
import styled from "styled-components";
import Select from "react-select";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../../../helpers/ErrorMessage";
const FormStyled = styled.form`
  input:not([id^="react-select-"]) {
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
  const { register, handleSubmit, errors, setValue } = useForm({
    mode: "onSubmit",
  });
  const options = [];
  calendars.map((calendarsGroup) => {
    return calendarsGroup.map((calendar) => {
      options.push({ value: calendar.id, label: calendar.name });
    });
  });
  useEffect(() => {
    register({ name: "calendars" }, { required: true });
  }, []);
  return (
    <FormStyled method="POST" onSubmit={handleSubmit(onSubmit)}>
      <Select
        className="select"
        options={options}
        placeholder="Select a calendar"
        isMulti
        theme={(theme) => ({
          ...theme,
          borderRadius: 0,
          colors: {
            ...theme.colors,
            primary25: "#f26e21",
            primary: "#f26e21",
          },
        })}
        onChange={(option) => {
          if (option !== null) {
            const calendarIds = option.map((calendar) => calendar.value);
            setValue("calendars", calendarIds);
          }
          setValue("calendars", "");
        }}
      />
      <input
        name="event"
        type="text"
        placeholder="Event"
        ref={register({ required: true })}
      />
      <ErrorMessage
        field={errors.event}
        errorType="required"
        message="Event is required."
      />
      {/* <input name="organizer" type="text" placeholder="Organizer" /> */}
      <input name="date" type="date" placeholder="Date" />
      <input name="location" type="text" placeholder="Location" />
      {/* <input name="school" type="text" placeholder="School" />
      <input name="city" type="text" placeholder="City" />
      <input name="activity" type="text" placeholder="Activity" />
      <input name="zip" type="text" placeholder="Zip" /> */}
      <button type="submit">Search</button>
    </FormStyled>
  );
}
