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
  const auth = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();
  const handleProfileSubmit = (calendar) => {
    dispatch(
      requestUpdateUser({
        ...profileDetails,
        calendarInfo: {
          name: calendar.name,
          visibilityType: "Private",
          image: calendar.image,
        },
        email: auth.email,
      })
    );
    sessionStorage.setItem("calendarName", calendar.name);
  };
  return (
    <>
      {currentPage === 0 && (
        <PersonalInfo
          setCurrentPage={setCurrentPage}
          setProfileDetails={setProfileDetails}
        />
      )}
      {currentPage === 1 && (
        <FamilyMember
          setCurrentPage={setCurrentPage}
          setProfileDetails={setProfileDetails}
        />
      )}
      {currentPage === 2 && (
        <Member
          setCurrentPage={setCurrentPage}
          setProfileDetails={setProfileDetails}
        />
      )}
      {currentPage === 3 && (
        <Calendar
          navigate={navigate}
          handleProfileSubmit={handleProfileSubmit}
        />
      )}
    </>
  );
}
