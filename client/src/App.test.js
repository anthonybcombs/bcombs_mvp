import React from "react";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateTestComponent from "./helpers/CreateTestComponent";
import App from "./App";
import requestAuth from "./redux/actions/Auth";
afterEach(cleanup);
describe("renders App", () => {
  const component = (
    <CreateTestComponent>
      <App />
    </CreateTestComponent>
  );
  describe("not authenticated", () => {
    test("renders without issue", () => {
      const { getByTestId } = render(component);
      expect(getByTestId("app")).toBeInTheDocument();
    });
  });
  describe("authenticated", () => {
    // test("renders without issue", async () => {
    //   const { getByTestId, rerender } = render(component);
    //   const loginForm = getByTestId("app-login-form");
    //   // await act(async () => {
    //   //   fireEvent.submit(loginForm, {
    //   //     email: "bon@yahoo.com",
    //   //     password: "bonbon"
    //   //   });
    //   // });
    //   expect(getByTestId("app-dashboard")).toBeInTheDocument();
    // });
  });
});
