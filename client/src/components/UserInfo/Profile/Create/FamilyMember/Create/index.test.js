import React from "react";
import { render, cleanup, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateTestComponent from "../../../../../../helpers/CreateTestComponent";
import AddFamilyMemberModal from './';
afterEach(cleanup);
describe("Add Family Member Modal", () => {
    const component = (
        <CreateTestComponent>
          <FamilyMember setCurrentPage={setCurrentPage} />
        </CreateTestComponent>
      );
    describe("test render",()=>{
        test("render without errors",()=>{

        });
    });
}