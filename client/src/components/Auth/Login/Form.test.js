import React from "react";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import CreateTestComponent from "../../../helpers/CreateTestComponent";
import "@testing-library/jest-dom";
import Form from "./Form";
afterEach(cleanup);
describe("Login Form", () => {
  let userDetails = { email: "bon@yahoo.com", password: "bontest" };
  const handleInputChange = jest.fn();
  const onSubmit = jest.fn();
  const component = (userDetails, onSubmit, handleInputChange) => (
    <CreateTestComponent>
      <Form
        method="POST"
        userDetails={userDetails}
        onSubmit={onSubmit}
        handleInputChange={handleInputChange}
      />
    </CreateTestComponent>
  );
  describe("test behaivor", () => {
    describe("change values tests", () => {
      test("call onSubmit function when clicked", async () => {
        const { getByTestId } = render(
          component(userDetails, onSubmit, handleInputChange)
        );

        const loginForm = getByTestId("app-login-form");
        await act(async () => {
          fireEvent.submit(loginForm);
        });
        expect(onSubmit).toHaveBeenCalled();
      });
      test("validation for with empty fields", async () => {
        userDetails = { email: "", password: "" };
        const { getByTestId, findByText } = render(
          component(userDetails, onSubmit, handleInputChange)
        );
        const loginForm = getByTestId("app-login-form");
        fireEvent.submit(loginForm);
        const errorMessageEmail = await findByText(/Email is/);
        const errorMessagePassword = await findByText(/Password is/);
        expect(errorMessageEmail).toBeInTheDocument();
        expect(errorMessagePassword).toBeInTheDocument();
      });
      test("check email validation with other fields has value", async () => {
        userDetails = { email: "", password: "testing" };
        const { getByTestId, findByText } = render(
          component(userDetails, onSubmit, handleInputChange)
        );
        const loginForm = getByTestId("app-login-form");
        fireEvent.submit(loginForm);
        const errorMessageEmail = await findByText(/Email is/);
        expect(errorMessageEmail).toBeInTheDocument();
      });
      test("check password validation with other fields has value", async () => {
        userDetails = { email: "bon@yahoo.com", password: "" };
        const { getByTestId, findByText } = render(
          component(userDetails, onSubmit, handleInputChange)
        );
        const loginForm = getByTestId("app-login-form");
        fireEvent.submit(loginForm);
        const errorMessagePassword = await findByText(/Password is/);
        expect(errorMessagePassword).toBeInTheDocument();
      });
    });
  });
});
