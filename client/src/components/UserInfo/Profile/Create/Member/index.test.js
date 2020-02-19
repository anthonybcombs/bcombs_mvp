import React from "react";
import ReactDOM from "react-dom";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateTestComponent from "../../../../../helpers/CreateTestComponent";
import Member from ".";
afterEach(cleanup);

describe("Family Member", () => {
  beforeAll(() => {
    ReactDOM.createPortal = jest.fn((element, node) => {
      return element;
    });
  });
  afterEach(() => {
    ReactDOM.createPortal.mockClear();
  });
  const setCurrentPage = jest.fn();
  const component = (
    <CreateTestComponent>
      <Member setCurrentPage={setCurrentPage} />
    </CreateTestComponent>
  );
  describe("test renders", () => {
    test("renders without issue", () => {
      const { getByTestId } = render(component);
      expect(getByTestId("app-profile-member")).toBeInTheDocument();
    });
    test("contains header with text of Add Members", () => {
      const { getByTestId } = render(component);
      const header = getByTestId("app-profile-member-header");
      expect(header).toBeInTheDocument();
      expect(header.textContent).toBe("Add Members");
    });
    test("contains header with text of Add members so you can easily see calendars.", () => {
      const { getByTestId } = render(component);
      const subHeader = getByTestId("app-profile-member-sub-header");
      expect(subHeader).toBeInTheDocument();
      expect(subHeader.textContent).toBe(
        "Add members so you can easily see calendars."
      );
    });
    test("contains add member button", () => {
      const { getByText } = render(component);
      const subHeader = getByText("Add a member");
      expect(subHeader).toBeInTheDocument();
      expect(subHeader.textContent).toBe("Add a member");
    });
    test("contains skip button", () => {
      const { getByTestId } = render(component);
      const subHeader = getByTestId("app-profile-member-skip-button");
      expect(subHeader).toBeInTheDocument();
      expect(subHeader.textContent).toBe("Skip");
    });
  });
  describe("test behavior", () => {
    describe("add member button", () => {
      test("on load modal on click", () => {
        const { getByTestId } = render(component);
        const addFamilyButton = getByTestId("app-profile-member-add-button");
        fireEvent.click(addFamilyButton);
        expect(
          getByTestId("app-profile-member-create-modal")
        ).toBeInTheDocument();
      });
    });
  });
});
