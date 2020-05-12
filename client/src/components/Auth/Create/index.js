import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "@reach/router";
import styled from "styled-components";
import Form from "./Form";
import { requestCheckuserAndAdd } from "../../../redux/actions/Users";
const CreateUserStyled = styled.div`
  display: block;
  margin: 0 auto;
  background-color: white;
  width: 60%;
  overflow: auto;
  height: auto;
  padding: 5px 30px 5px 30px;
  position: relative;
  top: 3vh;
  box-shadow: 0 0 25px #eae9e9;
  img {
    display: block;
    margin: 0 auto;
  }
  h2 {
    text-align: center;
    font-weight: normal;
  }
  p.error {
    text-align: center;
    font-size: 1.3em;
  }
  p.info {
    text-align: center;
    font-size: 1.3em;
    color: #f26e21;
  }
  @media (min-width: 600px) {
    h2 {
      font-weight: bold;
    }
  }
`;
export default function index() {
  const [userDetails, setUserDetails] = useState({
    type: { id: "", name: "" },
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const urlParams = new URLSearchParams(window.location.search);
  const vendorCode = urlParams.get("vendor_code");
  const currentTypeIndex = vendorCode ? 1 : 0;

  const { userTypes, status } = useSelector(({ userTypes, status }) => {
    return { userTypes, status };
  });
  const dispatch = useDispatch();
  useEffect(() => {
    setUserDetails({
      ...userDetails,
      type: { ...(userTypes[currentTypeIndex] || {}) },
    });
  }, [userTypes]);
  const handleInputChange = (id, value) => {
    setUserDetails({ ...userDetails, [id]: value });
  };
  const handleChangeUserType = (value) => {
    setUserDetails({ ...userDetails, type: { ...value } });
  };
  const handleFormSubmit = (values) => {
    dispatch(requestCheckuserAndAdd(userDetails));
  };

  return (
    <CreateUserStyled data-testid="app-create-user">
      {status && status.message && (
        <p className={`${status.messageType}`}>{status.message}</p>
      )}
      <h2>Create my account ({userDetails.type.name.toUpperCase()})</h2>
      <Form
        onSubmit={handleFormSubmit}
        handleInputChange={handleInputChange}
        userDetails={userDetails}
        handleChangeUserType={handleChangeUserType}
        userTypes={userTypes}
      />
    </CreateUserStyled>
  );
}
