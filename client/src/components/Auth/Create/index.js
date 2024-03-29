import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { redirectTo } from "@reach/router";
import styled from "styled-components";
import Form from "./Form";
import { requestCheckuserAndAdd } from "../../../redux/actions/Users";
const CreateUserStyled = styled.div`
  display: block;
  margin: 0 auto;
  background-color: white;

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
  @media (max-width: 768px) {
    width: 80%;
    margin-bottom: 2rem;
  }
  @media (min-width: 769px) {
    width: 100%;
    max-width: 600px;
  }
`;

const SUCCESS_STATUS = `User created! We sent confirmation email`;
export default function index() {
  const [userDetails, setUserDetails] = useState({
    type: { id: "", name: "" },
    username: "",
    email: "",
    password: "",
    confirm_password: ""
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
      type: { ...(userTypes[currentTypeIndex] || {}) }
    });
  }, [userTypes]);

  useEffect(() => {
    if (status && status.message && status.message.includes(SUCCESS_STATUS)) {
      //console.log('statuzzzzs',status)
      redirectTo(`/login?success=${encodeURIComponent(status.message)}`);
    }
  }, [status]);
  const handleInputChange = (id, value) => {
    setUserDetails({ ...userDetails, [id]: value });
  };
  const handleChangeUserType = value => {
    setUserDetails({ ...userDetails, type: { ...value } });
  };
  const handleFormSubmit = values => {
    dispatch(requestCheckuserAndAdd(userDetails));
  };

  return (
    <CreateUserStyled data-testid="app-create-user">
      <h2>Create my account ({userDetails.type.name.toUpperCase()})</h2>
      <Form
        onSubmit={handleFormSubmit}
        handleInputChange={handleInputChange}
        userDetails={userDetails}
        handleChangeUserType={handleChangeUserType}
        status={status}
        userTypes={userTypes}
      />
    </CreateUserStyled>
  );
}
