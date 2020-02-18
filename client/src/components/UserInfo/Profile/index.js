import React, { useState } from "react";
import PersonalInfo from "./Create/PersonalInfo/Create";
import FamilyMember from "./Create/FamilyMember/";
import Member from "./Create/Member";
export default function index() {
  const [currentPage, setCurrentPage] = useState(0);
  return (
    <>
      {currentPage === 0 && <PersonalInfo setCurrentPage={setCurrentPage} />}
      {currentPage === 1 && <FamilyMember setCurrentPage={setCurrentPage} />}
      {currentPage === 2 && <Member setCurrentPage={setCurrentPage} />}
    </>
  );
}
