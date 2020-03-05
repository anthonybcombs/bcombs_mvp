import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "@reach/router";
export default function protectedRoutes({ children }) {
  const authenticated = useSelector(state => {
    return state.auth.status === "SIGNED_IN";
  });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [children]);
  if (!authenticated) {
    return <Redirect to="/" />;
  }
  return <>{children}</>;
}
