import React from "react";
import { Redirect } from "@reach/router";
import { useSelector } from "react-redux";
import Loading from "../../helpers/Loading";
export default function index({ children }) {
  const { auth } = useSelector(({ auth }) => {
    return { auth };
  });
  if (auth.status === "AWAITING_AUTH_RESPONSE") {
    return <Loading />;
  } else if (
    sessionStorage.getItem("access_token") !== null &&
    auth.email_verified
  ) {
    return <Redirect to="/dashboard" />;
  }
  return <>{children}</>;
}
