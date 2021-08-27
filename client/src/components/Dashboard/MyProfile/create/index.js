import React, { useState, useContext } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { uuid } from "uuidv4";
import { useDispatch } from "react-redux";
import RelativeForm from "../forms/RelativeForm";
import { addRelative } from "../../../../redux/actions/Relatives";
const CreateRelativeModalStyled = styled.div`
  h2 {
    text-align: center;
  }
  .modal-content {
    width: 40%;
    top:40%;
  }
  @media (min-width: 600px) {
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
        <span
          className="close"
          onClick={() => {
            toggleCreateRelativeModal(false);
          }}
        >
          &times;
        </span>
        <div>
          <h2>Create a Relative</h2>
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
