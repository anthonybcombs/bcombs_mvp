import React from "react";

export default function Form() {
  return (
    <form>
      <input
        data-testid="app-forgot-password-input-email"
        type="email"
        name="email"
        placeholder="Email"
      />
    </form>
  );
}
