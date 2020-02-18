import React from "react";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateTestComponent from "../../../../../helpers/CreateTestComponent";
import FamilyMember from ".";
afterEach(cleanup);

describe("Family Member", () => {
  const setCurrentPage = jest.fn();
  const component = (
    <CreateTestComponent>
      <FamilyMember setCurrentPage={setCurrentPage} />
    </CreateTestComponent>
  );
  describe("test renders", () => {
    test("renders without issue", () => {
      const { getByTestId } = render(component);
      expect(
        getByTestId("app-profile-create-family-member")
      ).toBeInTheDocument();
    });
    test("contains header with text of Add Family Member", () => {
      const { getByTestId } = render(component);
      const header = getByTestId("app-profile-create-family-member-header");
      expect(header).toBeInTheDocument();
      expect(header.textContent).toBe("Add Family Members");
    });
    test("contains header with text of Add family members so you can view their schedules in your calendar", () => {
      const { getByTestId } = render(component);
      const subHeader = getByTestId(
        "app-profile-create-family-member-sub-header"
      );
      expect(subHeader).toBeInTheDocument();
      expect(subHeader.textContent).toBe(
        "Add family members so you can view their schedules in your calendar"
      );
    });
    test("contains add family member button", () => {
      const { getByText } = render(component);
      const subHeader = getByText("Add family member");
      expect(subHeader).toBeInTheDocument();
      expect(subHeader.textContent).toBe("Add family member");
    });
    test("contains skip button", () => {
      const { getByTestId } = render(component);
      const subHeader = getByTestId(
        "app-profile-create-family-member-skip-button"
      );
      expect(subHeader).toBeInTheDocument();
      expect(subHeader.textContent).toBe("Skip");
    });
  });
  describe("test behavior", () => {
    describe("add family button", () => {
      test("on load modal on click", () => {
        const { getByTestId } = render(component);
        const addFamilyButton = getByTestId(
          "app-profile-create-family-member-add-family-button"
        );
        fireEvent.click(addFamilyButton);
        expect(
          getByTestId("app-profile-create-family-member-create-modal")
        ).toBeInTheDocument();
      });
    });
  });
});
