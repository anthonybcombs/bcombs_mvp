import React, { StrictMode } from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeContext } from "styled-components";
import { defaultTheme } from "../../../helpers/Theme";
import Login from ".";
afterEach(cleanup);
describe("Login component", () => {
  const component = (
    <ThemeContext.Provider value={defaultTheme}>
      <StrictMode>
        <Login />
      </StrictMode>
    </ThemeContext.Provider>
  );
  describe("test render", () => {
    test("renders without issue", () => {
      const { getByTestId } = render(component);
      expect(getByTestId("app-login")).toBeInTheDocument();
    });
    test("does contains bcombs logo", () => {
      const { getByTestId } = render(component);
      const logoImage = getByTestId("app-login-logo");
      expect(logoImage).toBeInTheDocument();
      expect(logoImage.alt).toBe("Bcombs Logo");
    });
    test("does contains header text of (Login To Your Account)", () => {
      const { getByTestId } = render(component);
      const header = getByTestId("app-login-header");
      expect(header).toBeInTheDocument();
      expect(header.textContent).toBe("Login To Your Account");
    });
    test("does contains Facebook button", () => {
      const { getByText } = render(component);
      const button = getByText(/Facebook/);
      expect(button).toBeInTheDocument();
      expect(button.textContent).toContain("Sign In with Facebook");
    });
    test("does contains Google plus button", () => {
      const { getByText } = render(component);
      const button = getByText(/Google/);
      expect(button).toBeInTheDocument();
      expect(button.textContent).toContain("Sign In with Google");
    });
    test("does contains forgot password link", () => {
      const { getByText } = render(component);
      const button = getByText(/Forgot Password/);
      expect(button).toBeInTheDocument();
      expect(button.textContent).toContain("Forgot Password");
    });
    test("does contains signUp link", () => {
      const { getByText } = render(component);
      const button = getByText(/New Member!/);
      expect(button).toBeInTheDocument();
      expect(button.textContent).toContain("New Member! Sign Up");
    });
    test("does contains input(email)", () => {
      const { getByTestId } = render(component);
      const inputEmail = getByTestId("app-login-input-email");
      expect(inputEmail).toBeInTheDocument();
      expect(inputEmail.type).toBe("email");
      expect(inputEmail.placeholder).toBe("Email");
    });
    test("does contains input(password)", () => {
      const { getByTestId } = render(component);
      const inputPassword = getByTestId("app-login-input-password");
      expect(inputPassword).toBeInTheDocument();
      expect(inputPassword.type).toBe("password");
      expect(inputPassword.placeholder).toBe("Password");
    });
    test("does contains signIn button", () => {
      const { getByTestId } = render(component);
      const signInButton = getByTestId("app-login-button-signin");
      expect(signInButton).toBeInTheDocument();
      expect(signInButton.type).toBe("submit");
      expect(signInButton.innerHTML).toEqual("SIGN IN");
    });
  });
  describe("test behavior", () => {
    describe("Input Email", () => {
      test("test initial value", () => {
        const { getByTestId } = render(component);
        const inputEmail = getByTestId("app-login-input-email");
        expect(inputEmail.value.length).toBe(0);
      });
      test("test value when changed", () => {
        const { getByTestId } = render(component);
        const inputEmail = getByTestId("app-login-input-email");
        fireEvent.change(inputEmail, { target: { value: "bon@yahoo.com" } });
        expect(inputEmail.value).toBe("bon@yahoo.com");
      });
    });
    describe("Input Password", () => {
      test("test initial value", () => {
        const { getByTestId } = render(component);
        const inputPassword = getByTestId("app-login-input-password");
        expect(inputPassword.value.length).toBe(0);
      });
      test("test value when changed", () => {
        const { getByTestId } = render(component);
        const inputPassword = getByTestId("app-login-input-password");
        fireEvent.change(inputPassword, { target: { value: "testpass" } });
        expect(inputPassword.value).toBe("testpass");
      });
    });
  });
});
