import React from "react";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import CreateTestComponent from "../../../helpers/CreateTestComponent";
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
      test("call onSubmit function when clicked", async () => {
        const { getByTestId } = render(
          component(
            userDetails,
            onSubmit,
            handleInputChange,
            handleChangeUserType
          )
        );
        const loginForm = getByTestId("app-create-form");
        await act(async () => {
          fireEvent.submit(loginForm);
        });
        expect(onSubmit).toHaveBeenCalled();
      });
      test("vendor button is selected when clicked", () => {
        const { getByTestId, rerender } = render(
          component(
            userDetails,
            onSubmit,
            handleInputChange,
            handleChangeUserType
          )
        );
        const buttonVendor = getByTestId("app-create-button-vendor");
        fireEvent.click(buttonVendor);
        expect(handleChangeUserType).toHaveBeenCalled();
        expect(userDetails.userType).toBe("vendor");
        rerender(
          component(
            userDetails,
            onSubmit,
            handleInputChange,
            handleChangeUserType
          )
        );
        expect(buttonVendor.className).toBe("selected");
      });
      test("user button is selected when clicked", () => {
        const { getByTestId, rerender } = render(
          component(
            userDetails,
            onSubmit,
            handleInputChange,
            handleChangeUserType
          )
        );
        const buttonUser = getByTestId("app-create-button-user");
        fireEvent.click(buttonUser);
        expect(handleChangeUserType).toHaveBeenCalled();
        expect(userDetails.userType).toBe("user");
        rerender(
          component(
            userDetails,
            onSubmit,
            handleInputChange,
            handleChangeUserType
          )
        );
        expect(buttonUser.className).toBe("selected");
      });
    });
  });
});
