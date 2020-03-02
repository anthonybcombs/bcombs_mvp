import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
const ProfileSyled = styled.div`
  #profile {
    display: grid;
  }
  #profile > div {
    background-color: white;
    box-shadow: 0 0 25px #eae9e9;
    margin: 1em;
  }
  #personal-info div:nth-of-type(1) {
    position: relative;
    width: 100%;
    height: 250px;
    background-color: #f26e21;
    opacity: 1;
  }
  #personal-info div:nth-of-type(1) div:nth-of-type(1) {
    position: absolute;
    display: block;
    width: 100px;
    height: auto;
    top: 25%;
    left: 38%;
  }
  #personal-info div:nth-of-type(1) div:nth-of-type(1) h3 {
    color: white;
    text-shadow: 0 0 25px #eae9e9;
    padding: 0em;
    margin: 0em;
    text-align: center;
  }
  #personal-info div:nth-of-type(1) div:nth-of-type(1) img {
    border-radius: 50%;
    height: 100px;
    width: 100px;
    box-shadow: 0 0 25px #eae9e9;
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
  @media (min-width: 600px) {
    #profile {
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 1%;
    }
  }
`;
export default function index() {
  return (
    <ProfileSyled>
      <h2>Profile</h2>
      <div id="profile">
        <div>
          <div id="personal-info">
            <div>
              <div>
                <img src="https://i.picsum.photos/id/1043/200/300.jpg" />
                <h3>Chris Paul</h3>
              </div>
            </div>
            <div>
              <h3>Personal</h3>
              <FontAwesomeIcon icon={faEdit} />
            </div>
          </div>
        </div>
        <div></div>
        <div>
          <h3>Settings</h3>
        </div>
      </div>
    </ProfileSyled>
  );
}
