import React, { useState, useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { useForm } from "react-hook-form";
import { format } from "date-fns";

const ProfileFormStyled = styled.form`
  #profile-form {
    background: none !important;
  }
  #profile-form > #details {
    padding: 1em;
  }
  #profile-form > #details > div {
    position: relative;
    margin: 1em 1em 1em 0;
  }
  #profile-form > #details > div > .profile-value {
    position: absolute;
    right: 0;
  }

  button {
    color: ${({ theme }) => theme.button.textColor.primary};
    font-size: ${({ theme }) => theme.button.fontSize} !important;
    background-color: lightgrey;
    border: none;
    box-shadow: 0px 3px 6px #908e8e;
    border-radius: ${({ theme }) => theme.button.borderRadius} !important;
  }
  button[type="submit"] {
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    padding: 10px;
    display: block;
    margin: 10px auto;
    backgroundborder: none;
    margin-top: 0.5em;
  }

  h3 {
    text-align: center;
  }

  [hidden] {
    display: none;
  }
  @media (min-width: 600px) {
    .grid {
      grid-template-columns: 50% 50%;
      grid-gap: 1%;
    }
    button[type="submit"] {
      width: ${({ theme }) => theme.button.width.primary};
    }
  }

  .span-value {
    margin-left: 12px;
  }
  .profile-content {
    background: none !important;
    width: 50% !important;
    float: left !important;
    text-transform: capitalize;
  }
  .main-profile-content {
    margin-top: 5px !important;
  }
  .bold {
    font-weight: bolder;
  }
`;
export default function ProfileForm({ data, onSubmit, handleInputChange }) {
  const theme = useContext(ThemeContext);
  const { handleSubmit, errors } = useForm();
  console.log("dataaaaaaaaaaaaaa", data);
  return (
    <ProfileFormStyled
      id="personal-info-details"
      data-testid="app-create-profile-form"
      method="POST"
      theme={theme}
      onSubmit={handleSubmit(onSubmit)}>
      <div id="profile-form">
        {/* <div className="main-profile-content">
          <div className="profile-content bold">Lastname</div>
          <div className="profile-content">{data.lastname}</div>
        </div>

        <br />
        <div className="main-profile-content">
          <div className="profile-content bold">Firstname</div>
          <div className="profile-content">{data.firstname}</div>
        </div>
        <br /> */}

        <div className="main-profile-content">
          <div className="profile-content bold">Ethnicity</div>
          <div className="profile-content">{data.ethnicity}</div>
        </div>
        <br />
        <div className="main-profile-content">
          <div className="profile-content bold">Gender</div>
          <div className="profile-content">{data.gender}</div>
        </div>
        <br />
        <div className="main-profile-content">
          <div className="profile-content bold">Birthdate</div>
          <div className="profile-content">
            {data.dateofbirth
              ? format(new Date(data.dateofbirth), "MMMM dd yyyy")
              : null}
          </div>
        </div>
        <br />

        <div className="main-profile-content">
          <div className="profile-content bold">Address</div>
          <div className="profile-content">{data.address}</div>
        </div>
        <br />
        <div className="main-profile-content">
          <div className="profile-content bold">Zipcode</div>
          <div className="profile-content">{data.zipcode}</div>
        </div>

        <br />
        <div className="main-profile-content">
          <div className="profile-content bold">School</div>
          <div className="profile-content">{data.school}</div>
        </div>
        <br />
        <div className="main-profile-content">
          <div className="profile-content bold">Grade</div>
          <div className="profile-content">{data.grade}</div>
        </div>
      </div>
    </ProfileFormStyled>
  );
}
