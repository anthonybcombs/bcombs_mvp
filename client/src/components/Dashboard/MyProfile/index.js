import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import backgroundImg from "../../../images/loginbg.png";
import CreateRelative from "./create/";
import ProfileForm from "./forms/ProfileForm";
import EditProfileForm from "./forms/EditProfileForm";
import UploadPhotoForm from "./forms/UploadPhotoForm";
import ProfileConfirmation from "./forms/ProfileConfirmation";

import Loading from "../../../helpers/Loading.js";
import { isValidDate } from "../../../helpers/Date";

// REDUX
import {
  requestUpdateUserProfile,
  requestUpdateUserPhoto,
  requestUserProfile
} from "../../../redux/actions/Users";
import { requestUserApplication } from "../../../redux/actions/Application";

const getAge = birthDate => {
  console.log("BirthDateee", birthDate);
  return Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10);
};

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
  #personal-info-header div:first-child {
    position: relative;
    width: 100%;
    height: 300px;
    background: url(${backgroundImg}), rgba(242, 110, 33, 0.8);
    background-blend-mode: multiply;
  }
  #personal-info-header div:nth-of-type(1) div:nth-of-type(1) {
    position: absolute;
    display: block;

    height: auto;
    top: 25%;

    text-align: center;
  }
  #personal-info-header div:nth-of-type(1) div:nth-of-type(1) h3,
  #personal-info-header div:nth-of-type(1) div:nth-of-type(1) h4 {
    color: white;
    text-shadow: 0 0 25px #eae9e9;
    padding: 0em;
    margin: 3px;
    text-align: center;
  }
  #personal-info-header div:nth-of-type(1) div:nth-of-type(1) h4 span {
    background-color: white;
    color: #f26e21;
    border-radius: 10px;
    margin-left: 0.3em;
    padding: 0.2em 1em 0.2em 1em;
    font-weight: normal;
  }
  #personal-info-header div:nth-of-type(1) div:nth-of-type(1) img {
    border-radius: 50%;
    height: 100px;
    width: 100px;
    box-shadow: 0 0 5px black;
  }
  #personal-info-header div:nth-of-type(2) {
    position: relative;
    margin: 1em;
  }
  #personal-info-details > svg {
    position: relative;
    display: inline-block;
    top: 0;
    right: 0;
  }

  #personal-info-details {
    background-color: white !important;
    padding: 1em;
  }

  #personal-info-details > .personal-info-details-header {
    display: inline-block;
  }
  #personal-info-details > .personal-info-details-edit {
    float: right;
    margin-top: 14px;
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
  #id-container {
    word-wrap: break-word;
  }
  #profile-name {
    text-transform: capitalize;
  }
`;
export default function index() {
  const [personalInfo, setPersonalInfo] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    customgender: "",
    familyrelationship: "",
    zipcode: "",
    dateofbirth: null,
    address: "",
    school: "",
    ethnicity: "",
    grade: "",
    securityquestion1: "",
    securityquestion1answer: "",
    securityquestion2: "",
    securityquestion2answer: "",
    securityquestion3: "",
    securityquestion3answer: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditProfileVisible, setEditProfileVisible] = useState(false);
  const [isUploadPhotoVisible, setUploadPhotoVisible] = useState(false);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [
    isCreateRelativeModaVisibile,
    setIsCreateRelativeModaVisibile
  ] = useState(false);
  const [updatedPayload, setUpdatedPayload] = useState({});

  const [dashboard, setDashboard] = useState("Events");
  const {
    applications,
    auth,
    settings,
    relatives,
    user,
    familyMembers,
    loading
  } = useSelector(
    ({
      applications,
      auth,
      settings,
      relatives,
      user,
      familyMembers,
      loading
    }) => {
      return {
        applications,
        auth,
        settings,
        relatives,
        user,
        familyMembers,
        loading
      };
    }
  );

  const dispatch = useDispatch();
  useEffect(() => {
    if (auth.email) {
      dispatch(requestUserProfile(auth.email));
      dispatch(requestUserApplication(auth.email));
    }
  }, []);

  useEffect(() => {
    if (user.profile || (!isEditProfileVisible && user.profile)) {
      setPersonalInfo({
        firstname: user.profile.first_name,
        lastname: user.profile.last_name,
        gender: user.profile.gender,
        customgender: user.profile.custom_gender,
        familyrelationship: user.profile.family_relationship,
        zipcode: user.profile.zip_code,
        dateofbirth: isValidDate(user.profile.birth_date)
          ? format(new Date(user.profile.birth_date), "MM/dd/yyyy")
          : null,
        address: user.profile.address,
        school: user.profile.school,
        ethnicity: user.profile.ethnicity,
        grade: user.profile.grade,
        securityquestion1: user.profile.security_question1,
        securityquestion1answer: user.profile.security_question1_answer,
        securityquestion2: user.profile.security_question2,
        securityquestion2answer: user.profile.security_question2_answer,
        securityquestion3: user.profile.security_question3,
        securityquestion3answer: user.profile.security_question3_answer,
      });
    }
  }, [user, isEditProfileVisible]);

  const handleFormSubmit = e => {
    if (personalInfo.gender !== "custom") {
      personalInfo.customgender = "";
    }
    setUpdatedPayload({
      personalInfo: {
        ...personalInfo,
        id: user.profile.id
      },
      email: auth.email
    });

    // // if (selectedFile) {
    //   let data = new FormData();
    //   data.append("file", selectedFile);
    //   data.append("email", auth.email);
    //   dispatch(requestUpdateUserPhoto(data));
    // }

    setEditProfileVisible(false);
    setConfirmationVisible(true);
  };

  const handleUpdateSelectedVendor = payload => {

   dispatch(
      requestUpdateUserProfile({
        ...updatedPayload,
        personalInfo:{
          ...updatedPayload.personalInfo,
          dateofbirth: format(new Date(updatedPayload.personalInfo.dateofbirth), "yyyy-MM-dd")
        },
        otherInfo: payload
      })
    );

    setConfirmationVisible(false);
    setTimeout(() => {
      dispatch(requestUserApplication(auth.email));
    }, 1500)
    // if (sel
  };

  const handleImageUpload = file => {
    const payload = {
      email: auth.email,
      image: file
    };

    dispatch(requestUpdateUserPhoto(payload));
    setUploadPhotoVisible(false);
  };

  const handleInputChange = (id, value) => {
    setPersonalInfo({ ...personalInfo, [id]: value });
  };

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
          {loading.profile ? (
            <Loading />
          ) : (
            <>
              <div id="personal-info-header">
                <div>
                  <div id="id-container">
                    <img
                      src={`${
                        auth.profile_img ? auth.profile_img : auth.picture
                      }?t=${new Date().getTime()}`}
                      onClick={() => {
                        setUploadPhotoVisible(true);
                      }}
                    />
                    <h3 id="profile-name">
                      {user.profile && user.profile.first_name}{" "}
                      {user.profile && user.profile.last_name}
                    </h3>
                    <h4>
                      <FontAwesomeIcon icon={faUsers} />

                      <span>
                        {user &&
                          user.profile &&
                          isValidDate(user.profile.birth_date) &&
                          getAge(user.profile.birth_date)}
                      </span>
                    </h4>
                  </div>
                </div>
              </div>

              <div id="personal-info-details">
                <div className="personal-info-details-header">
                  <h3>Personal</h3>
                </div>

                <div className="personal-info-details-edit">
                  <FontAwesomeIcon
                    onClick={() => {
                      setEditProfileVisible(true);
                    }}
                    icon={faEdit}
                  />
                </div>

                {user && user.profile && (
                  <ProfileForm
                    data={user && user.profile}
                    handleInputChange={handleInputChange}
                    onSubmit={handleFormSubmit}
                  />
                )}
              </div>
            </>
          )}
        </div>
        <div>
          <div id="dashboard-select">
            <div
              className={`${dashboard === "Events" ? "selected" : ""}`}
              onClick={() => {
                setDashboard("Events");
              }}>
              <p>0</p>
              <p>Events</p>
            </div>
            <div
              className={`${dashboard === "Calendars" ? "selected" : ""}`}
              onClick={() => {
                setDashboard("Calendars");
              }}>
              <p>0</p>
              <p>Calendars</p>
            </div>
            <div
              className={`${dashboard === "Comments" ? "selected" : ""}`}
              onClick={() => {
                setDashboard("Comments");
              }}>
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
              }}>
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
              {familyMembers &&
                familyMembers.map(familyMember => {
                  console.log(familyMember);
                  return (
                    <tr key={familyMember.id}>
                      <td>{`${familyMember.firstname} ${familyMember.lastname}`}</td>
                      <td></td>
                      <td></td>
                      <td>{familyMember.familyrelationship.toUpperCase()}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      <EditProfileForm
        isVisible={isEditProfileVisible}
        toggleProfileVisible={setEditProfileVisible}
        data={personalInfo}
        handleInputChange={handleInputChange}
        onSubmit={handleFormSubmit}
      />
      <UploadPhotoForm
        auth={auth}
        isVisible={isUploadPhotoVisible}
        toggleProfilePhotoVisible={setUploadPhotoVisible}
        data={personalInfo}
        onSubmit={handleImageUpload}
      />
      <ProfileConfirmation
        applications={applications.userApplications}
        isVisible={isConfirmationVisible}
        toggleConfirmationVisible={setConfirmationVisible}
        onSubmit={handleUpdateSelectedVendor}
      />
    </ProfileSyled>
  );
}
