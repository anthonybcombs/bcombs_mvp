import React, { StrictMode } from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateTestComponent from "../../../helpers/CreateTestComponent";
import CreateUser from ".";
afterEach(cleanup);
describe("renders createUser User", () => {
  const component = (
    <CreateTestComponent>
      <CreateUser />
    </CreateTestComponent>
  );
  describe("test render", () => {
    test("renders without issue", () => {
      const { getByTestId } = render(component);
      expect(getByTestId("app-create-user")).toBeInTheDocument();
    });
    test("does contains header", () => {
      const { getByText } = render(component);
      const header = getByText(/Create my account/);
      expect(header).toBeInTheDocument();
      expect(header.textContent).toContain("Create my account");
    });
    test("does contains input(username)", () => {
      const { getByTestId } = render(component);
      const inputEmail = getByTestId("app-create-input-username");
      expect(inputEmail).toBeInTheDocument();
      expect(inputEmail.type).toBe("text");
      expect(inputEmail.placeholder).toBe("Username");
    });
    test("does contains userType user button", () => {
      const { getByTestId } = render(component);
      const buttonUser = getByTestId("app-create-button-user");
      expect(buttonUser).toBeInTheDocument();
      expect(buttonUser.textContent).toBe("User");
    });
    test("does contains userType vendor button", () => {
      const { getByTestId } = render(component);
      const buttonVendor = getByTestId("app-create-button-vendor");
      expect(buttonVendor).toBeInTheDocument();
      expect(buttonVendor.textContent).toBe("Vendor");
    });
    test("does contains input(email)", () => {
      const { getByTestId } = render(component);
      const inputEmail = getByTestId("app-create-input-email");
      expect(inputEmail).toBeInTheDocument();
      expect(inputEmail.type).toBe("email");
      expect(inputEmail.placeholder).toBe("Email");
    });
    test("does contains input(password)", () => {
      const { getByTestId } = render(component);
      const inputPassword = getByTestId("app-create-input-password");
      expect(inputPassword).toBeInTheDocument();
      expect(inputPassword.type).toBe("password");
      expect(inputPassword.placeholder).toBe("Password");
    });
    test("does contains input(confirm password)", () => {
      const { getByTestId } = render(component);
      const inputPassword = getByTestId("app-create-input-confirm-password");
      expect(inputPassword).toBeInTheDocument();
      expect(inputPassword.type).toBe("password");
      expect(inputPassword.placeholder).toBe("Confirm Password");
    });
    test("does contains signUp button", () => {
      const { getByTestId } = render(component);
      const signInButton = getByTestId("app-create-button-signup");
      expect(signInButton).toBeInTheDocument();
      expect(signInButton.type).toBe("submit");
      expect(signInButton.innerHTML).toEqual("SIGN UP");
    });
    test("does contains already member signin link", () => {
      const { getByText } = render(component);
      const button = getByText(/Sign In/);
      expect(button).toBeInTheDocument();
      expect(button.textContent).toContain("Sign In");
    });
  });
});
