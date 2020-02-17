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
        defaultValue={""}
      >
        <option value="" disabled>
          Family relationship
        </option>
        <option value="father">Father</option>
        <option value="mother">Mother</option>
        <option value="sibling">Sibling</option>
      </select>
      <select
        data-testid="app-profile-create-select-gender"
        name="gender"
        defaultValue={""}
      >
        <option value="" disabled>
          Gender
        </option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <input
        data-testid="app-profile-create-input-zip-code"
        name="zipcode"
        type="number"
        placeholder="Zip code"
      />
      <input
        data-testid="app-profile-create-input-date-of-birth"
        name="zipcode"
        type="date"
        placeholder="Date of Birth"
      />
      <button data-testid="app-profile-create-submit-button" type="submit">
        Save and Continue
      </button>
    </form>
  );
}
