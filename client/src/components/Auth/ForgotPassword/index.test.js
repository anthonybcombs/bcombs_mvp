import React, { StrictMode } from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateTestComponent from "../../../helpers/CreateTestComponent";
import ForgotPassword from ".";
afterEach(cleanup);
describe("Forgot Password component", () => {
  const component = (
    <CreateTestComponent>
      <ForgotPassword />
    </CreateTestComponent>
  );
  describe("test render", () => {
    test("renders without issue", () => {
      const { getByTestId } = render(component);
      expect(getByTestId("app-forgot-password")).toBeInTheDocument();
    });
    // test("does contains input(email)", () => {
    //   const { getByTestId } = render(component);
    //   const inputEmail = getByTestId("app-login-input-email");
    //   expect(inputEmail).toBeInTheDocument();
    //   expect(inputEmail.type).toBe("email");
    //   expect(inputEmail.placeholder).toBe("Email");
    // });
  });
});
