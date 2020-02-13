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
      test("call onSubmit function when submit", async () => {
        const { getByTestId } = render(
          component(
            userDetails,
            onSubmit,
            handleInputChange,
            handleChangeUserType
          )
        );
        const createUserForm = getByTestId("app-create-form");
        await act(async () => {
          fireEvent.submit(createUserForm);
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
    test("validation form with empty fields", async () => {
      userDetails = {
        userType: "",
        username: "",
        email: "",
        password: "",
        confirm_password: ""
      };
      const { findByText, getByTestId } = render(
        component(
          userDetails,
          onSubmit,
          handleInputChange,
          handleChangeUserType
        )
      );
      const createUserForm = getByTestId("app-create-form");
      fireEvent.submit(createUserForm);
      const errorMessageUser = await findByText(/Username is/);
      const errorMessageEmail = await findByText(/Email is/);
      const errorMessagePassword = await findByText(/Password is/);
      const errorMessageConfirmPassword = await findByText(
        /Confirm password is/
      );
      expect(errorMessageUser).toBeInTheDocument();
      expect(errorMessageEmail).toBeInTheDocument();
      expect(errorMessagePassword).toBeInTheDocument();
      expect(errorMessageConfirmPassword).toBeInTheDocument();
    });
    test("check username validation with other fields has value", async () => {
      userDetails = {
        userType: "user",
        username: "",
        email: "bon@yahoo.com",
        password: "bontest",
        confirm_password: "bontest"
      };
      const { getByTestId, findByText } = render(
        component(
          userDetails,
          onSubmit,
          handleInputChange,
          handleChangeUserType
        )
      );
      const createUserForm = getByTestId("app-create-form");
      fireEvent.submit(createUserForm);
      const errorMessageUsername = await findByText(/Username is/);
      expect(errorMessageUsername).toBeInTheDocument();
    });
    test("check email validation with other fields has value", async () => {
      userDetails = {
        userType: "user",
        username: "bon",
        email: "",
        password: "bontest",
        confirm_password: "bontest"
      };
      const { getByTestId, findByText } = render(
        component(
          userDetails,
          onSubmit,
          handleInputChange,
          handleChangeUserType
        )
      );
      const createUserForm = getByTestId("app-create-form");
      fireEvent.submit(createUserForm);
      const errorMessageEmail = await findByText(/Email is/);
      expect(errorMessageEmail).toBeInTheDocument();
    });
    test("check password validation with other fields has value", async () => {
      userDetails = {
        userType: "user",
        username: "bon",
        email: "bon@yahoo.com",
        password: "",
        confirm_password: "bontest"
      };
      const { getByTestId, findByText } = render(
        component(
          userDetails,
          onSubmit,
          handleInputChange,
          handleChangeUserType
        )
      );
      const createUserForm = getByTestId("app-create-form");
      fireEvent.submit(createUserForm);
      const errorMessagePassword = await findByText(/Password is/);
      expect(errorMessagePassword).toBeInTheDocument();
    });
    test("check confirm password validation with other fields has value", async () => {
      userDetails = {
        userType: "user",
        username: "bon",
        email: "bon@yahoo.com",
        password: "bontest",
        confirm_password: ""
      };
      const { getByTestId, findByText } = render(
        component(
          userDetails,
          onSubmit,
          handleInputChange,
          handleChangeUserType
        )
      );
      const createUserForm = getByTestId("app-create-form");
      fireEvent.submit(createUserForm);
      const errorMessageConfirmPassword = await findByText(
        /Confirm password is/
      );
      expect(errorMessageConfirmPassword).toBeInTheDocument();
    });
  });
  test("display error when password and confirm password is not the same", async () => {
    userDetails = {
      userType: "user",
      username: "bon",
      email: "bon@yahoo.com",
      password: "bontest",
      confirm_password: "bontestsso"
    };
    const { getByTestId, findByText } = render(
      component(userDetails, onSubmit, handleInputChange, handleChangeUserType)
    );
    const createUserForm = getByTestId("app-create-form");
    fireEvent.submit(createUserForm);
    const errorMessageConfirmPassword = await findByText(
      /The passwords do not match/
    );
    expect(errorMessageConfirmPassword).toBeInTheDocument();
  });
});
