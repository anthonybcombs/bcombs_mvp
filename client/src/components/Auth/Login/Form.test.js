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
        const errorMessageEmailElement = await findByText(/Email is/);
        const errorMessagePasswordElement = await findByText(/Password is/);
        expect(errorMessageEmailElement).toBeInTheDocument();
        expect(errorMessagePasswordElement).toBeInTheDocument();
      });
      test("check email validation with other fields has value", async () => {
        userDetails = { email: "", password: "testing" };
        const { getByTestId, findByText } = render(
          component(userDetails, onSubmit, handleInputChange)
        );
        const loginForm = getByTestId("app-login-form");
        fireEvent.submit(loginForm);
        const errorMessageEmailElement = await findByText(/Email is/);
        expect(errorMessageEmailElement).toBeInTheDocument();
      });
      test("check password validation with other fields has value", async () => {
        userDetails = { email: "bon@yahoo.com", password: "" };
        const { getByTestId, findByText } = render(
          component(userDetails, onSubmit, handleInputChange)
        );
        const loginForm = getByTestId("app-login-form");
        fireEvent.submit(loginForm);
        const errorMessagePasswordElement = await findByText(/Password is/);
        expect(errorMessagePasswordElement).toBeInTheDocument();
      });
    });
  });
});
