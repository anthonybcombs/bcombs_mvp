import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import AppGroupForm from "../forms/AppGroupForm";
import { uuid } from "uuidv4";
import {
  requestAddVendorAppGroup,
  requestEditVendorAppGroup,
  requestDeleteVendorAppGroup
} from "../../../../redux/actions/VendorAppGroups";
const NewContactModal = styled.div`
  .modal-content {
    max-width: 1200px !important;
  }
  .group-btn {
    margin: 0;
  }
  .group-btn button {
    max-width: 150px;
    margin: 0 auto;
  }
`;
export default function index({
  currentAppGroup = {
    name: "",
    size: null,
    vendors: []
  },
  isEditMode = false,
  isVisible = true,
  toggleCreateAppGroupModal,
  vendors = [],
  auth,
  errorMessage="",
  status="",
  handleCloseModal,
  selectedForms=[],
  formattedVendors=[]
}) {


  const action = isEditMode ? "edit" : "create";

  const [groupDetails, setGroupDetails] = useState({
    ...currentAppGroup
  });
  const [vendorError, setVendorError] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    if (isVisible && isEditMode) {
      if(formattedVendors.length > 0 && selectedForms.length > 0) {
        currentAppGroup = {...currentAppGroup, ["vendors"]: selectedForms};
      }
      setGroupDetails(currentAppGroup);
    }
    else {
      setGroupDetails({});
    }
  }, [isVisible, formattedVendors, selectedForms]);


  useEffect(() => {
    if(status == "success") {
      setGroupDetails({
        name: "",
        size: "",
        vendors: []
      });
      toggleCreateAppGroupModal(false);
    }
  }, [status])

  // useEffect(() => {
  //   if(selectedForms.length > 0) {
  //     currentAppGroup = {...currentAppGroup, ["vendors"]: selectedForms};
  //     console.log("Im here 12345");
  //     console.log("currentAppGroup3", currentAppGroup);
  //   }
  //   console.log("selectedForms selectedForms", selectedForms);
  //   setGroupDetails({...currentAppGroup});
  // }, [formattedVendors, selectedForms])

  const handleGroupDetailsChange = (id, value) => {
    if (id == "vendors") {
      let ids = value.map((vendor) => { return vendor });

      setGroupDetails({
        ...groupDetails,
        [id]: ids
      });
    } else {
      setGroupDetails({
        ...groupDetails,
        [id]: value
      });
    }
  };
  const handleSubmit = () => {

    if (isEditMode) {
      let payload = {
        size: groupDetails.size,
        name: groupDetails.name,
        email: auth.email,
        user_id: auth.user_id,
        pool_id: groupDetails.pool_id
      };

      const editVendors = groupDetails.vendors && groupDetails.vendors.length > 0 ? groupDetails.vendors : [];
      //payload.vendors = editVendors;

 
      payload.vendors = editVendors.map((v) => {
        if(v.is_form) {
          v.app_grp_id = v.id == currentAppGroup.form ? currentAppGroup.app_grp_id : ""
        } else {
          v.app_grp_id = v.id == currentAppGroup.vendor ? currentAppGroup.app_grp_id : ""
        }

        const currentMembers = currentAppGroup?.members || [];
        const matchMember = currentMembers.filter((member) => {
          if(v.is_form) {
            return v.id == member.form;
          } else {
            return v.id == member.vendor;
          }
        });

        if(matchMember.length > 0) {
          v.app_grp_id = matchMember[0].app_grp_id;
        }

        // delete v.name;
        // delete v.label;
        return v;
      });


      payload.size = parseInt(payload.size);

      dispatch(requestEditVendorAppGroup(payload));
      // setGroupDetails({
      //   name: "",
      //   size: "",
      //   vendors: []
      // });
      toggleCreateAppGroupModal(false);
    } else {
      if (groupDetails.vendors.length > 0) {
        let payload = {
          ...groupDetails,
          user_id: auth.user_id,
          email: auth.email,
          pool_id: uuid()
        };
        /// const isLotForm = payload.vendors.find(item => item.is_lot);
        payload = {
          ...payload,
          vendors: payload.vendors.map(item => {
            return {
              ...item
            }
 
          })
        }

        payload.size = parseInt(payload.size);

        dispatch(requestAddVendorAppGroup(payload));
        toggleCreateAppGroupModal(false);
        // setVendorError("");
        // setGroupDetails({
        //   name: "",
        //   size: "",
        //   vendors: []
        // });
      } else {
        setVendorError("Vendor is required!");
      }
    }
  };

  const handleDelete = () => {
    let payload = {
      app_grp_id: groupDetails.app_grp_id,
      pool_id: groupDetails.pool_id,
      email: auth.email
    };
    dispatch(requestDeleteVendorAppGroup(payload));
    setGroupDetails({
      name: "",
      size: "",
      vendors: []
    });
    toggleCreateAppGroupModal(false);
  };

  if (!isVisible) {
    return <></>;
  }

  return ReactDOM.createPortal(
    <NewContactModal className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEditMode ? "Edit" : "Create"} a Group</h2>
          <span
            className="close"
            onClick={() => {
              setGroupDetails({
                name: "",
                size: "",
                vendors: []
              });
              handleCloseModal()
              toggleCreateAppGroupModal(false);
            }}>
            &times;
          </span>
        </div>

        <div className="modal-body">
          <div id="applicationForm">
            <div>
              {
                status == "failed" && errorMessage ? (
                  <p style={{"color": "red"}}>
                    {errorMessage}
                  </p>
                ) : ""
              }
              {
                status == "success" ? (
                  <p style={{"color": "#f26e21"}}>
                    Application Group successfully updated.
                  </p>
                ) : ""
              }
              <AppGroupForm
                formattedVendors={formattedVendors}
                groupDetails={groupDetails}
                onSubmit={handleSubmit}
                handleGroupDetailsChange={handleGroupDetailsChange}
                action={action}
                handleDelete={handleDelete}
                vendorError={vendorError}
                currentAppGroup={currentAppGroup}
                selectedForms={selectedForms}
                isEditMode={isEditMode}
              />
              {
                isEditMode && (
                  <p>
                    Single form edit is not supported with groups created for multiple forms. If you want to edit the existing group in single form, deselect/remove it from this group and create a new one.
                  </p>
                )
              }
            </div>
          </div>
        </div>
      </div>    
    </NewContactModal>,
    document.getElementById("modal")
  );
}
