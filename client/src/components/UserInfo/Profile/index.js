import React, { useState } from "react";
import PersonalInfo from "./Create/PersonalInfo";
import FamilyMember from "./Create/FamilyMember";
import Member from "./Create/Member";
import Calendar from "./Create/Calendar";
export default function index({ navigate }) {
  const [currentPage, setCurrentPage] = useState(0);
  return (
    <>
      {currentPage === 0 && <PersonalInfo setCurrentPage={setCurrentPage} />}
      {currentPage === 1 && <FamilyMember setCurrentPage={setCurrentPage} />}
      {currentPage === 2 && <Member setCurrentPage={setCurrentPage} />}
      {currentPage === 3 && <Calendar navigate={navigate} />}
    </>
  );
}
