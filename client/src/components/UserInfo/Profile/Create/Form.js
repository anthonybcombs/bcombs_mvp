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
    </form>
  );
}
