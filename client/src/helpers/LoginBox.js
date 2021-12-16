import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "@reach/router";
// import { webAuth } from ".././../../helpers/Auth0";
// import { parse } from "query-string";

import styled from "styled-components";
import Logo from "../images/logo1.png";
import Form from "../components/Auth/Login/Form";
import { requestAuth } from "../redux/actions/Auth";

const LoginStyled = styled.div`

  display: block;
  margin: 0 auto;
  background-color: white;
  padding: 20px;
  height: auto;
  overflow: auto;
  position: relative;
  top: 3vh;
  box-shadow: 0 0 25px #eae9e9;

  .modal-content {
    position: relative;
    top: 100px;
    width: auto;
    max-width: 500px;
    padding: 0;
  }

  .modal-container {
    background-color: #fff;
    padding: 20px 25px;
  }

  img {
    display: block;
    margin: 0 auto;
  }
  h2 {
    text-align: center;
    font-weight: normal;
  }
  p.info {
    text-align: center;
    font-size: 1.3em;
    color: #f26e21;
  }
  p.error {
    text-align: center;
    font-size: 1.3em;
    color: red;
  }

  .group-btn {
    display: flex;
  }

  button {
    color: ${({ theme }) => theme.button.textColor.primary};
    font-size: ${({ theme }) => theme.button.fontSize} !important;
    background-color: lightgrey;
    border: none;
    box-shadow: 0px 3px 6px #908e8e;
    border-radius: ${({ theme }) => theme.button.borderRadius} !important;
  }

  .group-btn button {
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    padding: 10px;
    display: block;
    width: 100%;
    border: none;
    margin: 20px;
    margin-top: 16px;
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

const LoginBox = ({
  handleClose
}) => {
  const [userDetails, setUserDetails] = useState({ email: "", password: "" });
  const [registrationSuccess, setRegistrationSuccess] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);

  const { auth, status } = useSelector(({ auth, status }) => {
    return { auth, status };
  });

  const dispatch = useDispatch();
  const location = useLocation();

  const handleInputChange = (id, value) => {
    setUserDetails({ ...userDetails, [id]: value });
  };

  const handleFormSubmit = values => {
    dispatch(requestAuth(userDetails));
  };

  return (
    <LoginStyled data-testid="app-login">
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <span onClick={handleClose} className="close">
              &times;
            </span>
          </div>
          <div className="modal-container">
            {
              showLoginForm ? (
                <div>
                  <img data-testid="app-login-logo" src={Logo} alt="Bcombs Logo" />
                  {status && status.message && (
                    <p className={`${status.messageType}`}>{status.message}</p>
                  )}
                  {registrationSuccess !== "" && (
                    <p className={`info`}>{registrationSuccess}</p>
                  )}
                  <h2 data-testid="app-login-header">Login To Your Account</h2>
                  <Form
                    onSubmit={handleFormSubmit}
                    handleInputChange={handleInputChange}
                    hideForgotPassword={true}
                  />
                </div>
              )
              : (
                <div>
                  <div>
                    Are you an existing bcombs user?
                  </div>
                  <div className='group-btn'>
                    <button
                      onClick={() => {setShowLoginForm(true)}}
                    >
                      Yes
                    </button>
                    <button
                      onClick={handleClose}
                    >
                      No
                    </button>
                  </div>
                </div>
              )
              
            }

          </div>
        </div>
      </div>
    </LoginStyled>
  );
}

export default LoginBox;
