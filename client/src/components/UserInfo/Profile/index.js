import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PersonalInfo from "./Create/PersonalInfo";
import FamilyMember from "./Create/FamilyMember";
import Member from "./Create/Member";
import Calendar from "./Create/Calendar";
import { requestUpdateUser } from "../../../redux/actions/Users";
export default function index({ navigate }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [profileDetails, setProfileDetails] = useState({
    personalInfo: {},
    familyMembers: [],
    members: [],
    calendarInfo: {
      name: "",
      image: "",
      visibilityType: "Private",
    },
  });
  const dispatch = useDispatch();
  const { auth, userTypes } = useSelector(
    ({ auth, userTypes }) => {
        return { auth, userTypes };
    }
  );
  const handleProfileSubmit = (calendar) => {
    let calendarInfo = {
      name: calendar.name,
      visibilityType: calendar.visibilityType,
      image: calendar.image,
    }
    calendarInfo = Object.entries(calendarInfo).reduce((a, [k, v]) => (v ? (a[k] = v, a) : a), {}); // Empty object if it has null values
    dispatch(
      requestUpdateUser({
        ...profileDetails,
        calendarInfo: calendarInfo,
        email: auth.email,
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
          setProfileDetails={setProfileDetails}
          userType={userType.name}
        />
      )}
      {userType.name === "USER" && currentPage === 1 && (
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
      {userType.name === "VENDOR" && currentPage === 1 && (
        <Calendar
          navigate={navigate}
          handleProfileSubmit={handleProfileSubmit}
        />
      )}
      {userType.name === "USER" && currentPage === 2 && (
        <Calendar
          navigate={navigate}
          handleProfileSubmit={handleProfileSubmit}
        />
      )}
    </>
  );
}
