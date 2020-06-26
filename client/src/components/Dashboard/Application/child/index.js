import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "@reach/router";
import { format } from "date-fns";
import { requestGetApplicationById } from "../../../../redux/actions/Application";

import ProfileImg from "../../../../images/defaultprofile.png"

const ChildInformationViewStyled = styled.div`

  padding: 1em;

  .mentee-header {
    margin-bottom: 20px;
    box-shadow: 0px 0px 10px #ccc;
  }

  .mentee-title {
    background: #f26e21;
    color: white;
    border-top-left-radius: 11px;
    border-top-right-radius: 11px;
    padding: 15px;
    font-size: 1.2em;
  }

  .mentee-info {
    display: flex;
  }
  
  .mentee-info > div {
    background-color: #fff;
    display: block
  }

  .mentee-info .extra-space {
    width: 25%;
  }

  .mentee-info .profile-image {
    padding: 20px;
    width: 15%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mentee-info .profile-image img {
    width: 100px;
    height: 100px;
  }

  .mentee-info .profile-info {
    width: 60%;
    padding: 20px;
  }

  .mentee-info .profile-image,
  .mentee-info .profile-info,
  .mentee-info .extra-space {
    border-bottom: solid 1px #ccc;
  }

  .mentee-info .extra-space {
    border-left: solid 1px #ccc;
  }

  .mentee-info .profile-info h1 {
    font-weight: normal;
    margin: 0;
    margin-bottom: 16px;
  }

  .mentee-info .profile-info .content {
    display: flex;
    font-size: 16px;
  }

  .mentee-info .profile-info .left,
  .mentee-info .profile-info .right {
    width: 50%;
    display: block;
  }

  .mentee-info .profile-info .label {
    color: #f26e21;
    width: 30%;
    display: inline-block;
    margin-bottom: 10px;
  }

  .mentee-info .profile-info .value {
    display: inline-block;
    width: 70%;
    margin-bottom: 10px;
  }

  .mentee-family {
    padding: 20px;
    background-color: #fff;
    border-bottom-left-radius: 11px;
    border-bottom-right-radius: 11px;
  }

  .mentee-family h1 {
    font-weight: normal;
    margin: 0;
    margin-bottom: 16px;
  }

  .mentee-family table {
    width: 50%;
  }

  .mentee-family table td {
    padding: 5px 0;
  }

  .mentee-family table td.label {
    color: #f26e21;
  }

  .mentee-body {
    margin-top: 10px;
    display: flex;
    flex-flow: row wrap;
  }

  .mentee-body .block {
    padding-left: 3px;
    padding-right: 3px;
    width: 32.9%;
  }

  .mentee-body .extra_activitybox {
    background: white;
    border: 1px solid #ccc;
    box-shadow: 0px 0px 10px #ccc;
    padding: 10px 15px;
    margin-bottom: 10px;
  }

  .mentee-body h4 {
    border-bottom: 3px solid #f26e21;
    width: fit-content;
    margin: 0 auto;
    display: table;
    padding-bottom: 5px;
    font-size: 20px;
  }

  .mentee-body .extra_activitylist {
    margin-top: 20px;
    height: 230px;
    overflow-x: hidden;
    padding: 10px;
  }

  @media screen and (max-width: 1366px) {
    .mentee-body .block {
      width: 32.8%;
    }
  }

  @media screen and (max-width: 1080px) {
    .mentee-body .block {
      width: 49.3%;
    }
  }

`;

export default function index() {

  const { id } = useParams();
  const dispatch = useDispatch();

  const {applications } = useSelector(
    ({ applications}) => {
      return { applications };
    }
  );

  useEffect(() => {
    dispatch(requestGetApplicationById(id));
  }, []);

  const application = applications.selectedapplication;

  const DATE_FORMAT = "LLL dd, yyyy";

  const getAgeBdate = (child) => {
    if(!child.age && child <= -1) return "";

    let birthdate = format(new Date(child.birthdate), DATE_FORMAT);
    return <span>{child.age}&nbsp; ({birthdate})</span>
  }

  const getParents = (parents, child) => {

    let rows = [];

    parents.forEach((parent, index) => {
      rows.push((
        <tr key={index + (index * 1)}>
          <td className="label">Father</td>
          <td className="label">Address</td>
          <td className="label">Phone</td>
        </tr>
      ));
        
      rows.push((
        <tr key={index + (index * 1) + 1}>
          <td>{parent.firstname + " " + parent.lastname}</td>
          <td>{parent.address ? parent.address : child.address}</td>
          <td>{parent.phone_number ? parent.phone_number : "-"}</td>
        </tr>
      ));
    });

    return rows;
  }

  console.log("selected application", application)

  return (
    <ChildInformationViewStyled>
      <div>
        <div className="mentee-header">
          <div className="mentee-title">
            Mentee Profile
          </div>
          <div className="mentee-info">
            <div className="profile-image">
              <img src={ProfileImg} />
            </div>
            <div className="profile-info">
              {
                application?.child?.firstname && application?.child?.lastname &&
                <h1>{application.child.firstname + " " + application.child.lastname}</h1>
              }
              
              <div className="content">
                <div className="left">
                  <div className="label">Email:</div><div className="value">{application.child && application.child.email_address ? application.child.email_address : ""}</div>
                  <div className="label">Phone:</div><div className="value">{application.child && application.child.phone_number ? application.child.phone_number : ""}</div>
                  <div className="label">Gender:</div><div className="value">{application.child && application.child.gender ? application.child.gender : ""}</div>
                  <div className="label">Address:</div><div className="value">{application.child && application.child.address ? application.child.address : ""}</div>
                </div>
                <div className="right">
                  <div className="label">Age:</div><div className="value">{application.child && application.child.birthdate ? getAgeBdate(application.child) : ""}</div>
                  <div className="label">School:</div><div className="value">{application.child && application.child.school_name ? application.child.school_name : ""}</div>
                  <div className="label">Grade:</div><div className="value">{application.child && application.child.grade_number ? application.child.grade_number : ""}</div>
                  <div className="label">Year Started as a Mentee:</div><div className="value">{application.child && application.child.year_taken ? application.child.year_taken : ""}</div>
                </div>
              </div>
            </div>
            <div className="extra-space"></div>
          </div>
          <div className="mentee-family">
            <h1>Family</h1>
            <table>
              <tbody>
                {
                  application.parents && application.parents.length > 0 && getParents(application.parents, application.child)
                }
              </tbody>
            </table>
          </div>
        </div>
        <div className="mentee-body">
          <div className="block">
            <div className="extra_activitybox">
              <h4>Volunteer Hours</h4>
              <div className="extra_activitylist"></div>
            </div>
          </div>
          <div className="block">
            <div className="extra_activitybox">
              <h4>Mentoring Hours</h4>
              <div className="extra_activitylist"></div>
            </div>
          </div>
          <div className="block">
            <div className="extra_activitybox">
              <h4>Interest / Hobbies</h4>
              <div className="extra_activitylist"></div>
            </div>
          </div>
          <div className="block">
            <div className="extra_activitybox">
              <h4>Grade</h4>
              <div className="extra_activitylist"></div>
            </div>
          </div>
          <div className="block">
            <div className="extra_activitybox">
              <h4>Career Goal</h4>
              <div className="extra_activitylist"></div>
            </div>
          </div>
          <div className="block">
            <div className="extra_activitybox">
              <h4>ACT / SAT Scores</h4>
              <div className="extra_activitylist"></div>
            </div>
          </div>
          <div className="block">
            <div className="extra_activitybox">
              <h4>PSAT Scores</h4>
              <div className="extra_activitylist"></div>
            </div>
          </div>
          <div className="block">
            <div className="extra_activitybox">
              <h4>Awards / Accomplishments</h4>
              <div className="extra_activitylist"></div>
            </div>
          </div>
          <div className="block">
            <div className="extra_activitybox">
              <h4>Groups & Teams / List of Colleges</h4>
              <div className="extra_activitylist"></div>
            </div>
          </div>
          <div className="block">
            <div className="extra_activitybox">
              <h4>Life Events</h4>
              <div className="extra_activitylist"></div>
            </div>
          </div>
        </div>
      </div>
    </ChildInformationViewStyled>
  )
}