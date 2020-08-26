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
  h2 {
    text-align: center;
  }
  .modal-content {
    width: 30%;
  }
  @media (min-width: 600px) {
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
  auth
}) {
  const action = isEditMode ? "edit" : "create";
  const [groupDetails, setGroupDetails] = useState({
    ...currentAppGroup
  });
  const [vendorError, setVendorError] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    if (isVisible && isEditMode) {
      setGroupDetails(currentAppGroup);
    }
  }, [isVisible]);
  const handleGroupDetailsChange = (id, value) => {
    if (id == "vendors") {
      let ids = value.map(vendor => vendor.id);
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
  const handleSubmit = value => {
    if (isEditMode) {
      let payload = {
        app_grp_id: groupDetails.app_grp_id,
        size: groupDetails.size,
        name: groupDetails.name,
        email: auth.email,
        user_id: auth.user_id
      };
      payload.size = parseInt(payload.size);
      console.log("PAYLOADDD EDIT", groupDetails);
      dispatch(requestEditVendorAppGroup(payload));
      toggleCreateAppGroupModal(false);
    } else {
      if (groupDetails.vendors.length > 0) {
        let payload = {
          ...groupDetails,
          user_id: auth.user_id,
          email: auth.email
        };
        payload.size = parseInt(payload.size);
        console.log("PAYLOADDD CREATE", payload);
        dispatch(requestAddVendorAppGroup(payload));
        toggleCreateAppGroupModal(false);
        setVendorError("");
      } else {
        setVendorError("Vendor is required!");
      }
    }

    setGroupDetails({
      name: "",
      size: "",
      vendors: []
    });
  };

  const handleDelete = () => {
    let payload = {
      app_grp_id: groupDetails.app_grp_id,
      email: auth.email
    };
    console.log("payloadddd", payload);
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
      <div id="applicationForm" className="modal-content">
        <span
          className="close"
          onClick={() => {
            setGroupDetails({
              name: "",
              size: "",
              vendors: []
            });
            toggleCreateAppGroupModal(false);
          }}>
          &times;
        </span>
        <div>
          <h2>{isEditMode ? "Edit" : "Create"} a Group</h2>
          <AppGroupForm
            vendors={vendors}
            groupDetails={groupDetails}
            onSubmit={handleSubmit}
            handleGroupDetailsChange={handleGroupDetailsChange}
            action={action}
            handleDelete={handleDelete}
            vendorError={vendorError}
          />
        </div>
      </div>
    </NewContactModal>,
    document.getElementById("modal")
  );
}
