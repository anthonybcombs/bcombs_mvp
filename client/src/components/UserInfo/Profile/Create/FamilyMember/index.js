import React from "react";

export default function index() {
  return (
    <div data-testid="app-profile-create-family-member">
      <h1 data-testid="app-profile-create-family-member-header">
        Add Family Member
      </h1>
      <p data-testid="app-profile-create-family-member-sub-header">
        Add family members so you can view their schedules in your calendar
      </p>
      <div>
        <button data-testid="app-profile-create-family-member-add-family-button">
          Add family member
        </button>
      </div>
      <button data-testid="app-profile-create-family-member-skip-button">
        Skip
      </button>
    </div>
  );
}
