import React, { useState } from "react";
import Form from "./Form";
export default function index() {
  const [userDetails, setUserDetails] = useState({
    email: ""
  });
  const handleInputChange = (id, value) => {
    setUserDetails({ ...userDetails, [id]: value });
  };
  const handleFormSubmit = values => {
    //future backend code
  };
  return (
    <div data-testid="app-forgot-password">
      <Form
        userDetails={userDetails}
        onSubmit={handleFormSubmit}
        handleInputChange={handleInputChange}
      />
    </div>
  );
}
