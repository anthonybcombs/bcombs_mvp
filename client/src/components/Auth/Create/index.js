import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Form from "./Form";
import { requestAddUser } from "../../../redux/actions/Users";
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
  @media (min-width: 600px) {
    h2 {
      font-weight: bold;
    }
  }
`;
export default function index({ navigate }) {
  const [userDetails, setUserDetails] = useState({
    type: { id: "", name: "" },
    username: "",
    email: "",
    password: "",
    confirm_password: ""
  });
  const { userTypes } = useSelector(({ userTypes }) => {
    return { userTypes };
  });
  const dispatch = useDispatch();
  useEffect(() => {
    setUserDetails({ ...userDetails, type: { ...userTypes[0] } });
  }, [userTypes]);
  const handleInputChange = (id, value) => {
    setUserDetails({ ...userDetails, [id]: value });
  };
  const handleChangeUserType = value => {
    setUserDetails({ ...userDetails, type: { ...value } });
  };
  const handleFormSubmit = values => {
    dispatch(requestAddUser(userDetails));
    navigate("/");
  };
  return (
    <CreateUserStyled data-testid="app-create-user">
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
