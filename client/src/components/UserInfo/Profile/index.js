import React, { useState } from "react";
import PersonalInfo from "./Create/PersonalInfo/Create";
import FamilyMember from "./Create/FamilyMember/";
export default function index() {
  const [currentPage, setCurrentPage] = useState(1);
  return (
    <>
      {currentPage === 0 && <PersonalInfo setCurrentPage={setCurrentPage} />}
      {currentPage === 1 && <FamilyMember setCurrentPage={setCurrentPage} />}
    </>
  );
}
