import React from "react";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateTestComponent from "../../../../../helpers/CreateTestComponent";
import CreateProfile from ".";
afterEach(cleanup);

describe("Create Profile", () => {
  const setCurrentPage = jest.fn();
  const component = (
    <CreateTestComponent>
      <CreateProfile setCurrentPage={setCurrentPage} />
    </CreateTestComponent>
  );
  describe("test renders", () => {
    test("renders without issue", () => {
      const { getByTestId } = render(component);
      expect(getByTestId("app-profile")).toBeInTheDocument();
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
      const inputFirstname = getByTestId("app-profile-input-firstname");
      expect(inputFirstname).toBeInTheDocument();
      expect(inputFirstname.type).toBe("text");
      expect(inputFirstname.placeholder).toBe("First name");
    });
    test("does contains input(lastname)", () => {
      const { getByTestId } = render(component);
      const inputLastname = getByTestId("app-profile-input-lastname");
      expect(inputLastname).toBeInTheDocument();
      expect(inputLastname.type).toBe("text");
      expect(inputLastname.placeholder).toBe("Last name");
    });
    test("does contains select(family realtionship)", () => {
      const defaultOptions = ["sibling", "father", "mother", ""];
      const { getByTestId } = render(component);
      const selectFamilyRelationship = getByTestId(
        "app-profile-select-family-relationship"
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
      const selectGender = getByTestId("app-profile-select-gender");
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
      const inputZipCode = getByTestId("app-profile-input-zip-code");
      expect(inputZipCode).toBeInTheDocument();
      expect(inputZipCode.type).toBe("number");
      expect(inputZipCode.placeholder).toBe("Zip code");
    });
    test("does contains input(date of birth)", () => {
      const { getByTestId } = render(component);
      const inputDateOfBirth = getByTestId("app-profile-input-date-of-birth");
      expect(inputDateOfBirth).toBeInTheDocument();
      expect(inputDateOfBirth.type).toBe("text");
      expect(inputDateOfBirth.placeholder).toBe("Date of Birth");
    });
    test("does contains save to continue submit button", () => {
      const { getByTestId } = render(component);
      const signInButton = getByTestId("app-profile-submit-button");
      expect(signInButton).toBeInTheDocument();
      expect(signInButton.type).toBe("submit");
      expect(signInButton.innerHTML).toEqual("Save and Continue");
    });
  });
  describe("test behaivor", () => {
    describe("Input Firstname", () => {
      test("test initial value", () => {
        const { getByTestId } = render(component);
        const inputFirstname = getByTestId("app-profile-input-firstname");
        expect(inputFirstname.value.length).toBe(0);
      });
      test("test value when changed", () => {
        const { getByTestId } = render(component);
        const inputFirstname = getByTestId("app-profile-input-firstname");
        fireEvent.change(inputFirstname, { target: { value: "bon nicolai" } });
        expect(inputFirstname.value).toBe("bon nicolai");
      });
    });
    describe("Input Lastname", () => {
      test("test initial value", () => {
        const { getByTestId } = render(component);
        const inputlastName = getByTestId("app-profile-input-lastname");
        expect(inputlastName.value.length).toBe(0);
      });
      test("test value when changed", () => {
        const { getByTestId } = render(component);
        const inputLastname = getByTestId("app-profile-input-lastname");
        fireEvent.change(inputLastname, { target: { value: "mercado" } });
        expect(inputLastname.value).toBe("mercado");
      });
    });
    describe("Select Gender", () => {
      test("test initial value", () => {
        const { getByTestId } = render(component);
        const selectGender = getByTestId("app-profile-select-gender");
        expect(selectGender.value.length).toBe(0);
      });
      test("test value when changed", () => {
        const { getByTestId } = render(component);
        const selectGender = getByTestId("app-profile-select-gender");
        fireEvent.change(selectGender, { target: { value: "male" } });
        expect(selectGender.value).toBe("male");
      });
    });
    describe("Select Family relationship", () => {
      test("test initial value", () => {
        const { getByTestId } = render(component);
        const selectFamilyRelationship = getByTestId(
          "app-profile-select-family-relationship"
        );
        expect(selectFamilyRelationship.value.length).toBe(0);
      });
      test("test value when changed", () => {
        const { getByTestId } = render(component);
        const selectFamilyRelationship = getByTestId(
          "app-profile-select-family-relationship"
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
        const inputZipCode = getByTestId("app-profile-input-zip-code");
        expect(inputZipCode.value.length).toBe(0);
      });
      test("test value when changed", () => {
        const { getByTestId } = render(component);
        const inputZipCode = getByTestId("app-profile-input-zip-code");
        fireEvent.change(inputZipCode, { target: { value: "2020" } });
        expect(inputZipCode.value).toBe("2020");
      });
    });
    describe("date of birth", () => {
      test("test initial value", () => {
        const { getByTestId } = render(component);
        const inputdateofbirth = getByTestId("app-profile-input-date-of-birth");
        expect(inputdateofbirth.value.length).toBe(0);
      });
      test("test value when changed", () => {
        const { getByTestId } = render(component);
        const inputdateofbirth = getByTestId("app-profile-input-date-of-birth");
        fireEvent.change(inputdateofbirth, { target: { value: "01/29/2019" } });
        expect(inputdateofbirth.value).toBe("01/29/2019");
      });
      test("date type switching from text to date", () => {
        const { getByTestId } = render(component);
        const inputDateOfBirth = getByTestId("app-profile-input-date-of-birth");
        expect(inputDateOfBirth).toBeInTheDocument();
        fireEvent.focus(inputDateOfBirth);
        expect(inputDateOfBirth.type).toBe("date");
        fireEvent.blur(inputDateOfBirth);
        expect(inputDateOfBirth.type).toBe("text");
        expect(inputDateOfBirth.placeholder).toBe("Date of Birth");
      });
    });
    describe("submit form tests", () => {
      test("form submit without errors", async () => {
        const { getByTestId, queryByText } = render(component);
        const inputFirstname = getByTestId("app-profile-input-firstname");
        const inputLastname = getByTestId("app-profile-input-lastname");
        const selectGender = getByTestId("app-profile-select-gender");
        const selectFamilyRelationship = getByTestId(
          "app-profile-select-family-relationship"
        );
        const inputZipCode = getByTestId("app-profile-input-zip-code");
        const inputDateOfBirth = getByTestId("app-profile-input-date-of-birth");
        const createProfileForm = getByTestId("app-create-profile-form");
        fireEvent.change(inputFirstname, {
          target: { value: "bon nicolai" }
        });
        fireEvent.change(inputLastname, { target: { value: "mercado" } });
        fireEvent.change(selectGender, { target: { value: "female" } });
        fireEvent.change(selectFamilyRelationship, {
          target: { value: "father" }
        });
        fireEvent.change(inputDateOfBirth, {
          target: { value: "01/29/2020" }
        });
        fireEvent.change(inputZipCode, { target: { value: "2020" } });
        await act(async () => {
          fireEvent.submit(createProfileForm);
        });
        expect(queryByText("Firstname is required.")).not.toBeInTheDocument();
        expect(queryByText("Lastname is required.")).not.toBeInTheDocument();
        expect(queryByText("Gender is required.")).not.toBeInTheDocument();
        expect(
          queryByText("Family relationship is required.")
        ).not.toBeInTheDocument();
        expect(queryByText("Zip code is required.")).not.toBeInTheDocument();
        expect(
          queryByText("Date of Birth is required.")
        ).not.toBeInTheDocument();
        expect(setCurrentPage).toHaveBeenCalled();
      });
      test("submit with errors", async () => {
        const { getByTestId, queryByText } = render(component);
        const inputFirstname = getByTestId("app-profile-input-firstname");
        const inputLastname = getByTestId("app-profile-input-lastname");
        const selectGender = getByTestId("app-profile-select-gender");
        const selectFamilyRelationship = getByTestId(
          "app-profile-select-family-relationship"
        );
        const inputZipCode = getByTestId("app-profile-input-zip-code");
        const inputDateOfBirth = getByTestId("app-profile-input-date-of-birth");
        const createProfileForm = getByTestId("app-create-profile-form");
        fireEvent.change(inputFirstname, { target: { value: "" } });
        fireEvent.change(inputLastname, { target: { value: "" } });
        fireEvent.change(selectGender, { target: { value: "" } });
        fireEvent.change(selectFamilyRelationship, {
          target: { value: "" }
        });
        fireEvent.change(inputDateOfBirth, { target: { value: "" } });
        fireEvent.change(inputZipCode, { target: { value: "" } });
        await act(async () => {
          fireEvent.submit(createProfileForm);
        });
        expect(queryByText("Firstname is required.")).toBeInTheDocument();
        expect(queryByText("Lastname is required.")).toBeInTheDocument();
        expect(queryByText("Gender is required.")).toBeInTheDocument();
        expect(
          queryByText("Family relationship is required.")
        ).toBeInTheDocument();
        expect(queryByText("Zip code is required.")).toBeInTheDocument();
        expect(queryByText("Date of Birth is required.")).toBeInTheDocument();
      });
    });
  });
});
