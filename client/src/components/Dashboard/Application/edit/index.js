import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import Loading from "../../../../helpers/Loading.js";
import ErrorMessage from "../../../../helpers/ErrorMessage";
import { Multiselect } from "multiselect-react-dropdown";

const EditApplicationStyled = styled.div`
  .edit-application-form {
    padding: 1.2em 1em;
  }
  
  .edit-application-header {
    font-size: 1.2em;
    padding: 1em;
  }

  .edit-application-content {
    // display: grid;
    // grid-template-columns: 48% 48%;
    // grid-gap: 4%;
    display: block;
    padding: 1em;
  }

  .edit-application-content > div {
    display: grid;
    grid-template-columns: 20% 60% 20%;
    margin-bottom: 20px;
    font-size: 16px !important;
  }

  .edit-application-content select {
    width: 100%;
    display: block;
    font-size: 16px;
  }

  .control-label {
    text-align: right;
    margin-bottom: 0;
    color: #555;
    font-weight: 600;
    // word-break: break-all;
    padding-right: 20px;
  }

  .form-control,
  #classTeacherMultiselect div:first-child {
    display: block;
    width: 100%;
    height: auto;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);
    box-shadow: inset 0 1px 1px rgba(0,0,0,0.075);
    -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
    -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box;  
  }

  #classTeacherMultiselect .chip {
    background: #f26e21;
  }

  #AppReminder #classTeacherMultiselect .chip {
    background: #0096fb;
  }

  .form-control[disabled], .form-control[readonly], fieldset[disabled] .form-control {
    background-color: #eee;
    opacity: 1;
  }

  .update-btn {
    background-color: #f26e21;
    padding: 10px;
    width: 100%;
    display: block;
    color: white;
    border-radius: 40px;
    max-width: 200px;
    margin: 0 10px;
    -webkit-text-decoration: none;
    text-decoration: none;
    text-align: center;
    font-size: 16px;
  }


`;

export default function index({
  vendor,
  application,
  updateApplication,
  onSubmit,
  handleUpdateOnchange,
  updateLoading = false,
  appGroups = [],
  updateError = ""
}) {

  // appGroups = appGroups.filter((group) => {
  //   return group.vendor == vendor.id;
  // });


  const [isAppReminder, setIsAppReminder] = useState(false);
  const [selectedClassTeacher, setSelectedClassTeacher] = useState([]);

  useEffect(() => {
    setIsAppReminder(!!application.received_update);

    if (!!application.received_update) {
      setSelectedClassTeacher([]);
    }
    else {
      setSelectedClassTeacher(updateApplication.class_teacher ?
        appGroups.filter(item => updateApplication.class_teacher.includes(item.app_grp_id))
        :
        appGroups.filter(item => application.class_teacher && application.class_teacher.includes(item.app_grp_id)))
    }

  }, [application])

  console.log("appgroups...", appGroups);


  const { register, handleSubmit, errors } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const dispatch = useDispatch();

  const VERIFICATION_OPTIONS = [
    { name: "Waiting for Verification", value: "waiting_for_verification" },
    { name: "Verified", value: "verified" },
    { name: "Rejected", value: "rejected" }
  ];

  const STUDENT_CLASS_OPTIONS = [
    { name: "New Application - In process", value: "new_applicant_in_process" },
    { name: "New Application - Accepted", value: "new_applicant_accepted" },
    { name: "New Application - Rejected", value: "new_applicant_rejected" },
    { name: "Current Student", value: "current_student" },
    { name: "Waiting List", value: "waiting_list" },
    { name: "No longer a Student", value: "no_longer_student" },
    { name: "Missed opportunity", value: "missed_opportunity" },
    { name: "Pending Resubmission", value: "pending_resubmission" },
    { name: "Resubmitted", value: "resubmitted" },
  ]

  const CLASS_TEACHER_OPTIONS = [
    { name: "Middle School", value: "Middle School" },
    { name: "Freshmen", value: "Freshmen" },
    { name: "Sophomores", value: "Sophomores" },
    { name: "Juniors", value: "Juniors" },
    { name: "Seniors", value: "Seniors" }
  ]

  const COLOR_DESIGNATION_OPTIONS = [
    { name: "Leaving in the room (Red)", value: "red" },
    { name: "Coming into the room (Blue)", value: "blue" },
    { name: "Potentials for leaving the room (Green)", value: "green" }
  ]


  // let classTeachers = application.class_teacher ? application.class_teacher.split(',') : [];

  // console.log('classTeachers', classTeachers);


  return (
    <EditApplicationStyled>

      <div className="edit-application-form">
        {
          updateLoading ? (
            <Loading />
          ) :
            (
              <div>
                <div className="edit-application-header">
                  <div>
                    <span>Application Status</span>
                  </div>
                </div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="edit-application-content">
                    <div>
                      <label className="control-label">Verification</label>
                      <div>
                        <select
                          className="form-control"
                          defaultValue={application.verification}
                          onChange={({ target }) => {
                            handleUpdateOnchange("verification", target.value)
                          }}>
                          <option value="">Select</option>
                          {VERIFICATION_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="control-label">Student Status</label>
                      <div>
                        <select
                          className="form-control"
                          defaultValue={application.student_status}
                          onChange={({ target }) => {
                            handleUpdateOnchange("student_status", target.value)
                          }}>
                          <option value="">Select</option>
                          {STUDENT_CLASS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="control-label">Age</label>
                      <div>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={application?.child?.age}
                          readOnly
                          onChange={({ target }) => {
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="control-label">Group(s)</label>
                      <div
                      // id={isAppReminder ? "AppReminder" : ""}
                      >
                        <Multiselect
                          id="classTeacherMultiselect"
                          selectedValues={isAppReminder ? selectedClassTeacher : selectedClassTeacher}
                          className="form-control"
                          options={appGroups}
                          hasSelectAll={true}
                          placeholder={"Choose Multiple"}
                          displayValue="name"
                          closeIcon="cancel"
                          closeOnSelect={false}
                          showCheckbox={true}
                          onSelect={selectedList => {
                            setIsAppReminder(false);
                            console.log('select list', selectedList)
                            console.log('s selectedList', selectedList.map(item => item.app_grp_id).join(','));
                            handleUpdateOnchange("class_teacher", selectedList.map(item => item.app_grp_id).join(','))
                          }}
                          onRemove={selectedList => {
                            setIsAppReminder(false);
                            console.log("remove list", selectedList)
                            console.log('r selectedList', selectedList.map(item => item.app_grp_id).join(','));
                            handleUpdateOnchange("class_teacher", selectedList.map(item => item.app_grp_id).join(','))
                          }}
                        />
                        {/* <select
                      className="form-control"
                      defaultValue={application.class_teacher ? application.class_teacher : null}
                      onChange={({ target }) => {
                        handleUpdateOnchange("class_teacher", target.value)
                      }}>
                      <option value="">Select</option>
                      {appGroups.map(opt => (
                        <option key={opt.app_grp_id} value={opt.app_grp_id}>{opt.name}</option>
                      ))}
                    </select> */}

                        <div>
                          <input
                            type="checkbox"
                            name="form_select_all"
                            onChange={e => {
                              if (e.target.checked) {
                                setIsAppReminder(false);
                                // handleGroupDetailsChange("vendors", formattedVendors);
                                console.log('appGroupssss', appGroups)
                                handleUpdateOnchange("class_teacher", appGroups.map(item => item.app_grp_id).join(','))
                              }
                              else {
                                // handleGroupDetailsChange("vendors", []);
                                handleUpdateOnchange("class_teacher", '')
                              }
                            }}

                          /> Select All
                        </div>
                      </div>

                    </div>
                    <div>
                      <label className="control-label">Color Designation</label>
                      <div>
                        <select
                          className="form-control"
                          defaultValue={application.color_designation}
                          onChange={({ target }) => {
                            handleUpdateOnchange("color_designation", target.value)
                          }}>
                          <option value="">Select</option>
                          {COLOR_DESIGNATION_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="control-label">Recommended Class</label>
                      <div>
                      </div>
                    </div>
                    <div>
                      <label className="control-label">Notes</label>
                      <div>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Notes"
                          defaultValue={application.notes}
                          onChange={({ target }) => {
                            handleUpdateOnchange("notes", target.value)
                          }}>
                        </textarea>
                      </div>
                    </div>
                    {
                      updateError ? (
                        <div>
                          <div></div>
                          <div style={{ color: "red", textAlign: "center" }}> {updateError} </div>
                          <div></div>
                        </div>
                      ) : ""
                    }
                    <div>
                      <button className="update-btn" type="submit">Update Status</button>
                    </div>
                  </div>
                </form>
              </div>
            )
        }
      </div>
    </EditApplicationStyled>
  )
}