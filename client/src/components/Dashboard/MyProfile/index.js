import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import backgroundImg from "../../../images/loginbg.png";
import CreateRelative from "./create/";
const ProfileSyled = styled.div`
  padding: 1em;
  #profile,
  #dashboard-select {
    display: grid;
  }
  #profile > div {
    background-color: white;
    box-shadow: 0 0 25px #eae9e9;
  }
  #personal-info div:nth-of-type(1) {
    position: relative;
    width: 100%;
    height: 250px;
    background: url(${backgroundImg}), rgba(242, 110, 33, 0.8);
    background-blend-mode: multiply;
  }
  #personal-info div:nth-of-type(1) div:nth-of-type(1) {
    position: absolute;
    display: block;
    width: 100px;
    height: auto;
    top: 25%;
    left: 38%;
  }
  #personal-info div:nth-of-type(1) div:nth-of-type(1) h3,
  #personal-info div:nth-of-type(1) div:nth-of-type(1) h4 {
    color: white;
    text-shadow: 0 0 25px #eae9e9;
    padding: 0em;
    margin: 3px;
    text-align: center;
  }
  #personal-info div:nth-of-type(1) div:nth-of-type(1) h4 span {
    background-color: white;
    color: #f26e21;
    border-radius: 10px;
    margin-left: 0.3em;
    padding: 0.2em 1em 0.2em 1em;
    font-weight: normal;
  }
  #personal-info div:nth-of-type(1) div:nth-of-type(1) img {
    border-radius: 50%;
    height: 100px;
    width: 100px;
    box-shadow: 0 0 5px black;
  }
  #personal-info div:nth-of-type(2) {
    position: relative;
    margin: 1em;
  }
  #personal-info div:nth-of-type(2) > svg {
    position: absolute;
    display: inline-block;
    top: 0;
    right: 0;
  }
  #settings {
    padding: 1em;
  }
  #settings > div {
    position: relative;
    margin: 1em 1em 1em 0;
  }
  #settings > div > .react-toggle {
    position: absolute;
    right: 0;
  }
  #family {
    background-color: white;
    box-shadow: 0 0 25px #eae9e9;
  }
  #family > div {
    display: block;
    margin: 1em;
    padding: 1em;
  }
  #family > div > div > button {
    background-color: #f26e21;
    border-radius: 50%;
    box-shadow: 0 0 25px #eae9e9;
    border: none;
    color: white;
    margin-right: 10px;
    line-height: 1em;
  }
  #dashboard-select > div {
    cursor: pointer;
  }
  #dashboard-select > div.selected {
    border-bottom: 8px solid #f26e21;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    margin: 1em 0 0 0;
  }
  table thead th {
    border-bottom: 1px solid black;
    margin: none;
  }
  table tbody td {
    border-bottom: 1px solid lightgrey;
    margin: none;
  }
  @media (min-width: 600px) {
    #profile,
    #dashboard-select {
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 1%;
    }
    #dashboard-select > div {
      display: block;
      margin: 1em;
    }
    #dashboard-select > div > p {
      text-align: center;
      line-height: 0;
      font-weight: bold;
    }
    #dashboard-select > div > p:nth-of-type(1) {
      font-size: 2em;
    }
  }
`;
export default function index() {
  const [
    isCreateRelativeModaVisibile,
    setIsCreateRelativeModaVisibile
  ] = useState(false);
  const [dashboard, setDashboard] = useState("Events");
  const { auth, settings, relatives } = useSelector(
    ({ auth, settings, relatives }) => {
      return { auth, settings, relatives };
    }
  );
  return (
    <ProfileSyled>
      <CreateRelative
        isVisible={isCreateRelativeModaVisibile}
        toggleCreateRelativeModal={setIsCreateRelativeModaVisibile}
        auth={auth}
      />
      <h2>Profile</h2>
      <div id="profile">
        <div>
          <div id="personal-info">
            <div>
              <div>
                <img src="https://i.picsum.photos/id/1043/200/300.jpg" />
                <h3>Chris Paul</h3>
                <h4>
                  <FontAwesomeIcon icon={faUsers} />
                  <span>22</span>
                </h4>
              </div>
            </div>
            <div>
              <h3>Personal</h3>
              <FontAwesomeIcon icon={faEdit} />
            </div>
          </div>
        </div>
        <div>
          <div id="dashboard-select">
            <div
              className={`${dashboard === "Events" ? "selected" : ""}`}
              onClick={() => {
                setDashboard("Events");
              }}
            >
              <p>0</p>
              <p>Events</p>
            </div>
            <div
              className={`${dashboard === "Calendars" ? "selected" : ""}`}
              onClick={() => {
                setDashboard("Calendars");
              }}
            >
              <p>0</p>
              <p>Calendars</p>
            </div>
            <div
              className={`${dashboard === "Comments" ? "selected" : ""}`}
              onClick={() => {
                setDashboard("Comments");
              }}
            >
              <p>0</p>
              <p>Comments</p>
            </div>
          </div>
        </div>
        <div id="settings">
          <h3>Settings</h3>
          <h4>Life Events</h4>
          <hr></hr>
          {settings.lifeEvents.map((lifeEvent, index) => (
            <div key={index}>
              <span>{lifeEvent}</span>
              <Toggle defaultChecked={false} icons={false} />
            </div>
          ))}
          <h4>Recommended Services</h4>
          <hr></hr>
          {settings.lifeEvents.map((lifeEvent, index) => (
            <div key={index}>
              <span>{lifeEvent}</span>
              <Toggle defaultChecked={false} icons={false} />
            </div>
          ))}
        </div>
      </div>
      <div id="family">
        <div>
          <h2>Family</h2>
          <div>
            <button
              onClick={() => {
                setIsCreateRelativeModaVisibile(true);
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <span>Add A relative</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Relation</th>
              </tr>
            </thead>
            <tbody>
              {relatives.map(relative => {
                return (
                  <tr>
                    <td>{`${relative.firstName} ${relative.lastName}`}</td>
                    <td>{relative.email}</td>
                    <td>{relative.phoneNumber}</td>
                    <td>{relative.relation}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </ProfileSyled>
  );
}
