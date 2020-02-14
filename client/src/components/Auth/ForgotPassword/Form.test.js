import React from "react";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import CreateTestComponent from "../../../helpers/CreateTestComponent";
import "@testing-library/jest-dom";
import Form from "./Form";
afterEach(cleanup);
describe("Forgot Password Form", () => {
  let userDetails = {
    email: "bon@yahoo.com"
  };
  const handleInputChange = jest.fn();
  const handleChangeUserType = jest.fn(value => {
    userDetails = { ...userDetails, userType: value };
  });
  const onSubmit = jest.fn();
  const component = (
    userDetails,
    onSubmit,
    handleInputChange,
    handleChangeUserType
  ) => (
    <CreateTestComponent>
      <Form
        method="POST"
        userDetails={userDetails}
        onSubmit={onSubmit}
        handleInputChange={handleInputChange}
        handleChangeUserType={handleChangeUserType}
      />
    </CreateTestComponent>
  );
  describe("test behaivor", () => {
    describe("change values tests", () => {
      test("call onSubmit function when submit", async () => {
        const { getByTestId } = render(
          component(
            userDetails,
            onSubmit,
            handleInputChange,
            handleChangeUserType
          )
        );
        const forgotPasswordForm = getByTestId("app-forgot-password-form");
        await act(async () => {
          fireEvent.submit(forgotPasswordForm);
        });
        expect(onSubmit).toHaveBeenCalled();
      });
      test("validation form with empty fields", async () => {
        userDetails = {
          email: ""
        };
        const { findByText, getByTestId } = render(
          component(
            userDetails,
            onSubmit,
            handleInputChange,
            handleChangeUserType
          )
        );
        const forgotPasswordForm = getByTestId("app-forgot-password-form");
        fireEvent.submit(forgotPasswordForm);
        const errorMessageEmail = await findByText(/Email is/);
        expect(errorMessageEmail).toBeInTheDocument();
      });
    });
  });
});
