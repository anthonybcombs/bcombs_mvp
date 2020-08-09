import React, { useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import AppGroupForm from "../forms/AppGroupForm";
import { uuid } from "uuidv4";
import { requestAddVendorAppGroup } from "../../../../redux/actions/VendorAppGroups";
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
  isVisible = true,
  toggleCreateAppGroupModal,
  vendors = [],
  auth
}) {
  const action = "create";
  const [groupDetails, setGroupDetails] = useState({
    name: "",
    size: null,
    vendors: []
  });

  const dispatch = useDispatch();
  const handleGroupDetailsChange = (id, value) => {

    if(id == "vendors") {
      let ids = value.map((vendor) => vendor.id);
      setGroupDetails({
        ...groupDetails,
        [id]: ids,
      });
    } else {
      setGroupDetails({
        ...groupDetails,
        [id]: value,
      });
    }
  };
  const handleSubmit = (value) => {
    toggleCreateAppGroupModal(false);
    const payload = {
      ...groupDetails,
      user_id: auth.user_id,
      email: auth.email
    };

    payload.size = parseInt(payload.size);

    console.log("HANDLE SUBMIT PAYLOADDDDDDDDDDDDDDD", payload);

    dispatch(requestAddVendorAppGroup(payload));

    setGroupDetails({
      name: "",
      size: "",
      vendors: []
    });
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
          }}
        >
          &times;
        </span>
        <div>
          <h2>Create a Group</h2>
          <AppGroupForm
            vendors={vendors}
            groupDetails={groupDetails}
            onSubmit={handleSubmit}
            handleGroupDetailsChange={handleGroupDetailsChange}
            action={action}
          />
        </div>
      </div>
    </NewContactModal>,
    document.getElementById("modal")
  );
}
