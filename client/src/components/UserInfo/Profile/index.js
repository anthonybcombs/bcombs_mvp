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
      name: ""
    }
  });
  const auth = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();
  const handleProfileSubmit = calendarName => {
    dispatch(
      requestUpdateUser({
        ...profileDetails,
        calendarInfo: { name: calendarName },
        email: auth.email
      })
    );
    navigate(`../dashboard`);
    sessionStorage.setItem("calendarName", calendarName);
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
