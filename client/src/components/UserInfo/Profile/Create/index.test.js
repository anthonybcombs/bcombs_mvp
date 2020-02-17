import React, { StrictMode } from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateTestComponent from "../../../../helpers/CreateTestComponent";
import CreateProfile from ".";
afterEach(cleanup);

describe("Create Profile", () => {
  const component = (
    <CreateTestComponent>
      <CreateProfile />
    </CreateTestComponent>
  );
  describe("test renders", () => {
    test("renders without issue", () => {
      const { getByTestId } = render(component);
      expect(getByTestId("app-profile-create")).toBeInTheDocument();
    });
    test("does contains header with text of Let's get started", () => {
      const { getByText } = render(component);
      const header = getByText(/Let's get started/);
      expect(header).toBeInTheDocument();
      expect(header.textContent).toContain("Let's get started");
    });
    test("does contains header with text of Create my profile", () => {
      const { getByText } = render(component);
      const header = getByText(/Create my profile/);
      expect(header).toBeInTheDocument();
      expect(header.textContent).toContain("Create my profile");
    });
    test("does contains input(firsname)", () => {
      const { getByTestId } = render(component);
      const inputFirstname = getByTestId("app-profile-create-input-username");
      expect(inputFirstname).toBeInTheDocument();
      expect(inputFirstname.type).toBe("text");
      expect(inputFirstname.placeholder).toBe("First name");
    });
    test("does contains input(lastname)", () => {});
    test("does contains select(family realtionships)", () => {});
    test("does contains select(gender)", () => {});
    test("does contains input(zip code)", () => {});
    test("does contains input(date of birth)", () => {});
    test("does contains save to continue submit button", () => {});
  });
});
