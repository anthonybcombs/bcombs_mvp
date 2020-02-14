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
    test("does contains input(email)", () => {
      const { getByTestId } = render(component);
      const inputEmail = getByTestId("app-forgot-password-input-email");
      expect(inputEmail).toBeInTheDocument();
      expect(inputEmail.type).toBe("email");
      expect(inputEmail.placeholder).toBe("Email");
    });
    test("does contains form", () => {
      const { getByTestId } = render(component);
      const forgotPasswordForm = getByTestId("app-forgot-password-form");
      expect(forgotPasswordForm).toBeInTheDocument();
    });
    test("does contains send button", () => {
      const { getByTestId } = render(component);
      const sendButton = getByTestId("app-forgot-password-send-button");
      expect(sendButton).toBeInTheDocument();
      expect(sendButton.type).toBe("button");
      expect(sendButton.textContent).toContain("Send");
    });
  });
  describe("test behavior", () => {
    describe("Input Email", () => {
      test("test initial value", () => {
        const { getByTestId } = render(component);
        const inputEmail = getByTestId("app-forgot-password-input-email");
        expect(inputEmail.value.length).toBe(0);
      });
      test("test value when changed", () => {
        const { getByTestId } = render(component);
        const inputEmail = getByTestId("app-forgot-password-input-email");
        fireEvent.change(inputEmail, { target: { value: "bon@yahoo.com" } });
        expect(inputEmail.value).toBe("bon@yahoo.com");
      });
    });
  });
});
