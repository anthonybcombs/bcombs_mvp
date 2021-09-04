import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { uuid } from "uuidv4";
import { useDispatch } from "react-redux";
import RelativeForm from "../forms/RelativeForm";
import { addRelative } from "../../../../redux/actions/Relatives";
const CreateRelativeModalStyled = styled.div`
  .modal-content {
    max-width: 420px;
  }
`;
export default function index({
  isVisible = true,
  toggleCreateRelativeModal,
  auth
}) {
  const [relativeDetails, setRelativeDetails] = useState({
    id: uuid(),
    userIds: [auth.id],
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    relation: ""
  });
  const dispatch = useDispatch();
  const handleRelativeDetailsChange = (id, value) => {
    setRelativeDetails({
      ...relativeDetails,
      [id]: value
    });
  };
  const handleSubmit = value => {
    dispatch(addRelative(relativeDetails));
    toggleCreateRelativeModal(false);
  };
  if (!isVisible) {
    return <></>;
  }
  return ReactDOM.createPortal(
    <CreateRelativeModalStyled className="modal">
      <div className="modal-content">
        <diiv className="modal-header">
          <h2>Create a Relative</h2>
          <span
            className="close"
            onClick={() => {
              toggleCreateRelativeModal(false);
            }}
          >
            &times;
          </span>
        </diiv>
        
        <div className="modal-body">
          <RelativeForm
            relativeDetails={relativeDetails}
            onSubmit={handleSubmit}
            handleRelativeDetailsChange={handleRelativeDetailsChange}
          />
        </div>
      </div>
    </CreateRelativeModalStyled>,
    document.getElementById("modal")
  );
}
