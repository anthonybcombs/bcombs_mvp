import React from "react";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import { ThemeContext } from "styled-components";
import { defaultTheme } from "../../../helpers/Theme";
import "@testing-library/jest-dom";
import Form from "./Form";
afterEach(cleanup);
describe("Create User Form", () => {
  let userDetails = {
    userType: "user",
    username: "bonhokage06",
    email: "bon@yahoo.com",
    password: "bontest",
    confirm_password: "bontest"
  };
  const handleInputChange = jest.fn();
  const handleChangeUserType = jest.fn(value => {
    userDetails = { ...userDetails, userType: value };
  });
  const onSubmit = jest.fn();
  describe("test behaivor", () => {
    describe("initial value tests", () => {
      test("user button is intially selected", () => {
        const { getByTestId } = render(
          <ThemeContext.Provider value={defaultTheme}>
            <Form
              method="POST"
              userDetails={userDetails}
              onSubmit={onSubmit}
              handleInputChange={handleInputChange}
              handleChangeUserType={handleChangeUserType}
            />
          </ThemeContext.Provider>
        );
        const buttonUser = getByTestId("app-create-button-user");
        expect(buttonUser.className).toEqual("selected");
      });
      describe("Input Username", () => {
        test("test initial value", () => {
          const { getByTestId } = render(
            <ThemeContext.Provider value={defaultTheme}>
              <Form
                method="POST"
                userDetails={userDetails}
                onSubmit={onSubmit}
                handleInputChange={handleInputChange}
                handleChangeUserType={handleChangeUserType}
              />
            </ThemeContext.Provider>
          );
          const inputEmail = getByTestId("app-create-input-username");
          expect(inputEmail.value).toBe("bonhokage06");
        });
      });
      describe("Input Password", () => {
        test("test initial value", () => {
          const { getByTestId } = render(
            <ThemeContext.Provider value={defaultTheme}>
              <Form
                method="POST"
                userDetails={userDetails}
                onSubmit={onSubmit}
                handleInputChange={handleInputChange}
                handleChangeUserType={handleChangeUserType}
              />
            </ThemeContext.Provider>
          );
          const inputPassword = getByTestId("app-create-input-password");
          expect(inputPassword.value).toBe("bontest");
        });
      });
      describe("Input Email", () => {
        test("test initial value", () => {
          const { getByTestId } = render(
            <ThemeContext.Provider value={defaultTheme}>
              <Form
                method="POST"
                userDetails={userDetails}
                onSubmit={onSubmit}
                handleInputChange={handleInputChange}
                handleChangeUserType={handleChangeUserType}
              />
            </ThemeContext.Provider>
          );
          const inputEmail = getByTestId("app-create-input-email");
          expect(inputEmail.value).toBe("bon@yahoo.com");
        });
      });
      describe("Input Confirm password", () => {
        test("test initial value", () => {
          const { getByTestId } = render(
            <ThemeContext.Provider value={defaultTheme}>
              <Form
                method="POST"
                userDetails={userDetails}
                onSubmit={onSubmit}
                handleInputChange={handleInputChange}
                handleChangeUserType={handleChangeUserType}
              />
            </ThemeContext.Provider>
          );
          const inputConfirmPassword = getByTestId(
            "app-create-input-confirm-password"
          );
          expect(inputConfirmPassword.value).toBe("bontest");
        });
      });
    });
    describe("change values tests", () => {
      test("call onSubmit function when clicked", async () => {
        const { getByTestId } = render(
          <ThemeContext.Provider value={defaultTheme}>
            <Form
              method="POST"
              userDetails={userDetails}
              onSubmit={onSubmit}
              handleInputChange={handleInputChange}
              handleChangeUserType={handleChangeUserType}
            />
          </ThemeContext.Provider>
        );

        const loginForm = getByTestId("app-create-form");
        await act(async () => {
          fireEvent.submit(loginForm);
        });
        expect(onSubmit).toHaveBeenCalled();
      });
      test("vendor button is selected when clicked", () => {
        const { getByTestId, rerender } = render(
          <ThemeContext.Provider value={defaultTheme}>
            <Form
              method="POST"
              userDetails={userDetails}
              onSubmit={onSubmit}
              handleInputChange={handleInputChange}
              handleChangeUserType={handleChangeUserType}
            />
          </ThemeContext.Provider>
        );
        const buttonVendor = getByTestId("app-create-button-vendor");
        fireEvent.click(buttonVendor);
        expect(handleChangeUserType).toHaveBeenCalled();
        expect(userDetails.userType).toBe("vendor");
        rerender(
          <ThemeContext.Provider value={defaultTheme}>
            <Form userDetails={userDetails} />
          </ThemeContext.Provider>
        );
        expect(buttonVendor.className).toBe("selected");
      });
      test("user button is selected when clicked", () => {
        const { getByTestId, rerender } = render(
          <ThemeContext.Provider value={defaultTheme}>
            <Form
              method="POST"
              userDetails={userDetails}
              onSubmit={onSubmit}
              handleInputChange={handleInputChange}
              handleChangeUserType={handleChangeUserType}
            />
          </ThemeContext.Provider>
        );
        const buttonUser = getByTestId("app-create-button-user");
        fireEvent.click(buttonUser);
        expect(handleChangeUserType).toHaveBeenCalled();
        expect(userDetails.userType).toBe("user");
        rerender(
          <ThemeContext.Provider value={defaultTheme}>
            <Form userDetails={userDetails} />
          </ThemeContext.Provider>
        );
        expect(buttonUser.className).toBe("selected");
      });
    });
  });
});
