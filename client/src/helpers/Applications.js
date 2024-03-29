import React from 'react';


export const isUUID = str => {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(str);
}

export const getApplicationStatusVal = (student_status, verification) => {
    let studentStatusVal = "";


    if (student_status == "new_applicant_in_process") {
      studentStatusVal = "In process";
    } else if (student_status == "new_applicant_accepted") {
      studentStatusVal = "Accepted";
    } else if (student_status == "new_applicant_rejected") {
      studentStatusVal = "Rejected";
    } else if (student_status == "current_student") {
      studentStatusVal = "Current Student";
    } else if (student_status == "waiting_list") {
      studentStatusVal = "Waiting List";
    } else if (student_status == "no_longer_student") {
      studentStatusVal = "No longer a Student";
    } else if (student_status == "missed_opportunity") {
      studentStatusVal = "Missed oppurtunity";
    } else if (student_status == "pending_resubmission") {
      studentStatusVal = "Pending Resubmission";
    }
    else if (student_status == "resubmitted") {
      studentStatusVal = "Resubmitted";
    }
    else {
      studentStatusVal = "In process";
    }
    

    return  <span>{studentStatusVal}</span>;
  };