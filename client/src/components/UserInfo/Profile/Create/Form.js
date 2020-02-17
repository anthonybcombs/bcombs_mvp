import React from "react";

export default function Form() {
  return (
    <form>
      <h2>Create my profile</h2>
      <input
        data-testid="app-profile-create-input-firstname"
        name="firstname"
        placeholder="First name"
      />
      <input
        data-testid="app-profile-create-input-lastname"
        name="lastname"
        placeholder="Last name"
      />
      <select
        data-testid="app-profile-create-select-family-relationship"
        name="family-relationship"
        placeholder="Family relationship"
        defaultValue={""}
      >
        <option value="" disabled>
          Family relationship
        </option>
        <option value="father">Father</option>
        <option value="mother">Mother</option>
        <option value="sibling">Sibling</option>
      </select>
    </form>
  );
}
