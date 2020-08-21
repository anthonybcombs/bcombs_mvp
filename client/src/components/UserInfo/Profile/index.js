import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PersonalInfo from "./Create/PersonalInfo";
import FamilyMember from "./Create/FamilyMember";
import SecurityQuestions from "./Create/SecurityQuestions";
// import Member from "./Create/Member";
import Calendar from "./Create/Calendar";
import { requestCalendars } from "../../../redux/actions/Calendars";
import {
  requestUpdateUser,
  requestUserProfile
} from "../../../redux/actions/Users";
export default function index({ navigate }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isCalendarSkip, setCalendarSkip] = useState(false);
  const [profileDetails, setProfileDetails] = useState({
    personalInfo: {},
    familyMembers: [],
    members: [],
    calendarInfo: {
      name: "",
      image: "",
      visibilityType: "Private"
    }
  });
  const dispatch = useDispatch();
  const { auth, user, userTypes } = useSelector(({ auth, user, userTypes }) => {
    return { auth, user, userTypes };
  });

  console.log("Profil Auth", auth);
  console.log("Profil User", user);

  useEffect(() => {
    dispatch(requestUserProfile(auth.email));
  }, []);

  useEffect(() => {
    if (user.profile) {
      setProfileDetails({
        ...profileDetails,
        personalInfo: {
          ...profileDetails.personalInfo,
          firstname: user.profile.first_name,
          lastname: user.profile.last_name,
          dateofbirth: user.profile.birth_date,
          zipcode: user.profile.zip_code
        }
      });
    }
  }, [user]);

  const handleProfileSubmit = calendar => {
    let calendarInfo = {
      name: calendar.name,
      visibilityType: calendar.visibilityType,
      image: calendar.image
    };
    calendarInfo = Object.entries(calendarInfo).reduce(
      (a, [k, v]) => (v ? ((a[k] = v), a) : a),
      {}
    ); // Empty object if it has null values

    let profile = {
      ...profileDetails,
      familyMembers: profileDetails.familyMembers.map(item => {
        return {
          ...item,
          unrequiredFields: undefined
        };
      })
    };

    delete profile.unrequiredFields;
    dispatch(
      requestUpdateUser({
        ...profile,
        calendarInfo: calendarInfo,
        email: auth.email
      })
    );
    if (calendar) {
      setTimeout(() => {
        dispatch(requestCalendars());
      }, 1500);
    }
    sessionStorage.setItem("calendarName", calendar.name);
  };

  const handleSkip = calendar => {
    console.log("SKIPPP", {
      ...profileDetails,
      calendarInfo: {},
      email: auth.email
    });
    dispatch(
      requestUpdateUser({
        ...profileDetails,
        calendarInfo: {},
        email: auth.email
      })
    );
    sessionStorage.setItem("calendarName", calendar.name);
  };
  let userType = userTypes.find(type => type.id === auth.type);

  return (
    <>
      {currentPage === 0 && (
        <PersonalInfo
          setCurrentPage={setCurrentPage}
          profileDetails={profileDetails.personalInfo}
          setProfileDetails={setProfileDetails}
          userType={userType.name}
        />
      )}
      {currentPage === 1 && (
        <SecurityQuestions
          setCurrentPage={setCurrentPage}
          profileDetails={profileDetails.personalInfo}
          setProfileDetails={setProfileDetails}
        />
      )}
      {userType.name === "USER" && currentPage === 2 && (
        <FamilyMember
          setCurrentPage={setCurrentPage}
          setProfileDetails={setProfileDetails}
        />
      )}
      {/*{currentPage === 2 && (*/}
      {/*<Member*/}
      {/*setCurrentPage={setCurrentPage}*/}
      {/*setProfileDetails={setProfileDetails}*/}
      {/*/>*/}
      {/*)}*/}
      {userType.name === "VENDOR" && currentPage === 2 && (
        <Calendar
          navigate={navigate}
          handleProfileSubmit={handleProfileSubmit}
          onSkip={handleSkip}
        />
      )}
      {userType.name === "USER" && currentPage === 3 && (
        <Calendar
          navigate={navigate}
          handleProfileSubmit={handleProfileSubmit}
          onSkip={handleSkip}
        />
      )}
    </>
  );
}
