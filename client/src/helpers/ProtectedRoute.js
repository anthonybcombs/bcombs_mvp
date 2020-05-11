import React, { useEffect } from "react";
import { Redirect, useLocation } from "@reach/router";

import { useSelector, useDispatch } from "react-redux";
import { requestUserInfo } from "../redux/actions/Auth";
import { requestCalendars } from "../redux/actions/Calendars";
import Loading from "../helpers/Loading";
export default function protectedRoutes({ children }) {
  const { auth, status, calendars } = useSelector(
    ({ auth, status, calendars }) => {
      return {
        auth,
        status,
        calendars,
      };
    }
  );
  const dispatch = useDispatch();
  const location = useLocation();
  useEffect(() => {
    dispatch(requestUserInfo());
    dispatch(requestCalendars());
  }, [location]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [auth, status]);
  if (
    sessionStorage.getItem("access_token") === null ||
    status.messageType == "error"
  ) {
    return <Redirect to="/" />;
  } else if (
    auth.email_verified &&
    auth.status === "SIGNED_IN" &&
    status.messageType === "GET_CALENDAR_COMPLETED"
  ) {
    if (
      !location.pathname.includes("createprofile") &&
      !auth.is_profile_filled &&
      calendars.length === 0
    ) {
      return <Redirect to="/dashboard/createprofile" />;
    } else if (
      location.pathname.includes("createprofile") &&
      auth.is_profile_filled
    ) {
      return <Redirect to="/dashboard" />;
    }
    return <>{children}</>;
  }
  return <Loading />;
}
