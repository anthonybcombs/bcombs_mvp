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
      expect(header.textContent).toBe("Add Family Member");
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
      const { getByTestId } = render(component);
      const subHeader = getByTestId(
        "app-profile-create-family-member-add-family-button"
      );
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
});
