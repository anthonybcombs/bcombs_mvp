import React, { StrictMode } from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { ThemeContext } from "styled-components";
import { defaultTheme } from "../../../helpers/Theme";
import "@testing-library/jest-dom";
import Form from "./Form";
afterEach(cleanup);
describe("Login Form", () => {
  const userDetails = { email: "bon@yahoo.com", password: "bontest" };
  const handleInputChange = jest.fn();
  const onSubmit = jest.fn();
  const component = (
    <ThemeContext.Provider value={defaultTheme}>
      <Form
        method="POST"
        userDetails={userDetails}
        onSubmit={onSubmit}
        handleInputChange={handleInputChange}
      />
    </ThemeContext.Provider>
  );
  describe("form behaivor", () => {
    describe("Input Email", () => {
      test("test initial value", () => {
        const { getByTestId } = render(component);
        const inputEmail = getByTestId("app-login-input-email");
        expect(inputEmail.value).toBe("bon@yahoo.com");
      });
    });
    describe("Input Password", () => {
      test("test initial value", () => {
        const { getByTestId } = render(component);
        const inputPassword = getByTestId("app-login-input-password");
        expect(inputPassword.value).toBe("bontest");
      });
    });
    test("call onSubmit function when clicked", () => {
      const { getByTestId } = render(component);
      const loginForm = getByTestId("app-login-form");
      fireEvent.submit(loginForm);
      expect(onSubmit).toHaveBeenCalled();
    });
    test("disable signIn button when there is no data provided", () => {
      const { getByTestId } = render(component);
    });
  });
});
