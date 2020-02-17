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
      expect(header.textContent).toContain("Let's get started!");
    });
    test("does contains header with text of Create my profile", () => {
      const { getByText } = render(component);
      const header = getByText(/Create my profile/);
      expect(header).toBeInTheDocument();
      expect(header.textContent).toContain("Create my profile");
    });
    test("does contains input(firsname)", () => {
      const { getByTestId } = render(component);
      const inputFirstname = getByTestId("app-profile-create-input-firstname");
      expect(inputFirstname).toBeInTheDocument();
      expect(inputFirstname.type).toBe("text");
      expect(inputFirstname.placeholder).toBe("First name");
    });
    test("does contains input(lastname)", () => {
      const { getByTestId } = render(component);
      const inputLastname = getByTestId("app-profile-create-input-lastname");
      expect(inputLastname).toBeInTheDocument();
      expect(inputLastname.type).toBe("text");
      expect(inputLastname.placeholder).toBe("Last name");
    });
    test("does contains select(family realtionship)", () => {
      const defaultOptions = ["sibling", "father", "mother", ""];
      const { getByTestId } = render(component);
      const selectFamilyRelationship = getByTestId(
        "app-profile-create-select-family-relationship"
      );
      const options = Array.from(selectFamilyRelationship.childNodes).map(
        option => option.value
      );
      expect(selectFamilyRelationship).toBeInTheDocument();
      expect(selectFamilyRelationship.type).toBe("select-one");
      expect(options).toEqual(expect.arrayContaining(defaultOptions));
      expect(selectFamilyRelationship.childNodes[0].textContent).toBe(
        "Family relationship"
      );
    });
    test("does contains select(gender)", () => {
      const defaultOptions = ["male", "female", ""];
      const { getByTestId } = render(component);
      const selectGender = getByTestId("app-profile-create-select-gender");
      const options = Array.from(selectGender.childNodes).map(
        option => option.value
      );
      expect(selectGender).toBeInTheDocument();
      expect(selectGender.type).toBe("select-one");
      expect(options).toEqual(expect.arrayContaining(defaultOptions));
      expect(selectGender.childNodes[0].textContent).toBe("Gender");
    });
    test("does contains input(zip code)", () => {
      const { getByTestId } = render(component);
      const inputZipCode = getByTestId("app-profile-create-input-zip-code");
      expect(inputZipCode).toBeInTheDocument();
      expect(inputZipCode.type).toBe("number");
      expect(inputZipCode.placeholder).toBe("Zip code");
    });
    test("does contains input(date of birth)", () => {
      const { getByTestId } = render(component);
      const inputDateOfBirth = getByTestId(
        "app-profile-create-input-date-of-birth"
      );
      expect(inputDateOfBirth).toBeInTheDocument();
      expect(inputDateOfBirth.type).toBe("date");
      expect(inputDateOfBirth.placeholder).toBe("Date of Birth");
    });
    test("does contains save to continue submit button", () => {
      const { getByTestId } = render(component);
      const signInButton = getByTestId("app-profile-create-submit-button");
      expect(signInButton).toBeInTheDocument();
      expect(signInButton.type).toBe("submit");
      expect(signInButton.innerHTML).toEqual("Save and Continue");
    });
  });
});
