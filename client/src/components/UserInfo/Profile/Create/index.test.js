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
      expect(inputDateOfBirth.type).toBe("text");
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
  describe("test behaivor", () => {
    describe("Input Firstname", () => {
      test("test initial value", () => {
        const { getByTestId } = render(component);
        const inputFirstname = getByTestId(
          "app-profile-create-input-firstname"
        );
        expect(inputFirstname.value.length).toBe(0);
      });
      test("test value when changed", () => {
        const { getByTestId } = render(component);
        const inputFirstname = getByTestId(
          "app-profile-create-input-firstname"
        );
        fireEvent.change(inputFirstname, { target: { value: "bon nicolai" } });
        expect(inputFirstname.value).toBe("bon nicolai");
      });
    });
    describe("Input Lastname", () => {
      test("test initial value", () => {
        const { getByTestId } = render(component);
        const inputlastName = getByTestId("app-profile-create-input-lastname");
        expect(inputlastName.value.length).toBe(0);
      });
      test("test value when changed", () => {
        const { getByTestId } = render(component);
        const inputLastname = getByTestId("app-profile-create-input-lastname");
        fireEvent.change(inputLastname, { target: { value: "mercado" } });
        expect(inputLastname.value).toBe("mercado");
      });
    });
    describe("Select Gender", () => {
      test("test initial value", () => {
        const { getByTestId } = render(component);
        const selectGender = getByTestId("app-profile-create-select-gender");
        expect(selectGender.value.length).toBe(0);
      });
      test("test value when changed", () => {
        const { getByTestId } = render(component);
        const selectGender = getByTestId("app-profile-create-select-gender");
        fireEvent.change(selectGender, { target: { value: "male" } });
        expect(selectGender.value).toBe("male");
      });
    });
    describe("Select Family relationship", () => {
      test("test initial value", () => {
        const { getByTestId } = render(component);
        const selectFamilyRelationship = getByTestId(
          "app-profile-create-select-family-relationship"
        );
        expect(selectFamilyRelationship.value.length).toBe(0);
      });
      test("test value when changed", () => {
        const { getByTestId } = render(component);
        const selectFamilyRelationship = getByTestId(
          "app-profile-create-select-family-relationship"
        );
        fireEvent.change(selectFamilyRelationship, {
          target: { value: "father" }
        });
        expect(selectFamilyRelationship.value).toBe("father");
      });
    });
    describe("input Zip code", () => {
      test("test initial value", () => {
        const { getByTestId } = render(component);
        const inputZipCode = getByTestId("app-profile-create-input-zip-code");
        expect(inputZipCode.value.length).toBe(0);
      });
      test("test value when changed", () => {
        const { getByTestId } = render(component);
        const inputZipCode = getByTestId("app-profile-create-input-zip-code");
        fireEvent.change(inputZipCode, { target: { value: "2020" } });
        expect(inputZipCode.value).toBe("2020");
      });
    });
    describe("date of birth", () => {
      test("test initial value", () => {
        const { getByTestId } = render(component);
        const inputdateofbirth = getByTestId(
          "app-profile-create-input-date-of-birth"
        );
        expect(inputdateofbirth.value.length).toBe(0);
      });
      test("test value when changed", () => {
        const { getByTestId } = render(component);
        const inputdateofbirth = getByTestId(
          "app-profile-create-input-date-of-birth"
        );
        fireEvent.change(inputdateofbirth, { target: { value: "01/29/2019" } });
        expect(inputdateofbirth.value).toBe("01/29/2019");
      });
      test("date type switching from text to date", () => {
        const { getByTestId } = render(component);
        const inputDateOfBirth = getByTestId(
          "app-profile-create-input-date-of-birth"
        );
        expect(inputDateOfBirth).toBeInTheDocument();
        fireEvent.focus(inputDateOfBirth);
        expect(inputDateOfBirth.type).toBe("date");
        fireEvent.blur(inputDateOfBirth);
        expect(inputDateOfBirth.type).toBe("text");
        expect(inputDateOfBirth.placeholder).toBe("Date of Birth");
      });
    });
  });
});
