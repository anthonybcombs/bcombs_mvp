import React from "react";
import styled from "styled-components";
const FormStyled = styled.form`
  input {
    background: none;
    width: 100%;
    color: black;
    font-size: ${({ theme }) => theme.input.fontSize} !important;
    display: inline-block;
    border: none;
    border-radius: 1;
    outline: 0;
    border-bottom: 2px solid lightgrey;
    margin-top: 1em;
    margin-bottom: 1em;
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
`;
export default function form() {
  return (
    <FormStyled>
      <input name="event" type="text" placeholder="Event" />
      <input name="organizer" type="text" placeholder="Organizer" />
      <input name="date" type="text" placeholder="Date" />
      <input name="location" type="text" placeholder="Location" />
      <input name="school" type="text" placeholder="School" />
      <input name="city" type="text" placeholder="City" />
      <input name="activity" type="text" placeholder="Activity" />
      <input name="zip" type="text" placeholder="Zip" />
      <button type="submit">Search</button>
    </FormStyled>
  );
}
