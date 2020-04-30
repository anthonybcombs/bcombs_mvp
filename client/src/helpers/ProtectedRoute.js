import React, { useEffect } from "react";
import { Redirect, useLocation } from "@reach/router";

import { useSelector, useDispatch } from "react-redux";
import { requestUserInfo } from "../redux/actions/Auth";
import Loading from "../helpers/Loading";
export default function protectedRoutes({ children }) {
  const { auth, status } = useSelector(({ auth, status }) => {
    return {
      auth,
      status
    };
  });
  const dispatch = useDispatch();
  const location = useLocation();
  useEffect(() => {
    dispatch(requestUserInfo());
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [children]);

  console.log("AUTHHHHHHHHHHHHH", auth);
  if (
    sessionStorage.getItem("access_token") === null ||
    status.messageType == "error"
  ) {
    return <Redirect to="/" />;
  } else if (auth.email_verified) {
    if (
      !location.pathname.includes("createprofile") &&
      !auth.is_profile_filled
    ) {
      return <Redirect to="/dashboard/createprofile" />;
    } else if (
      location.pathname.includes("createprofile") &&
      auth.is_profile_filled &&
      auth.status === "SIGNED_IN"
    ) {
      return <Redirect to="/dashboard" />;
    }
    return <>{children}</>;
  }
  return <Loading />;
}
