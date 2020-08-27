import React, { useEffect } from "react";
import { Redirect, useLocation } from "@reach/router";

import { useSelector, useDispatch } from "react-redux";
import { requestUserInfo } from "../redux/actions/Auth";
import { requestCalendars } from "../redux/actions/Calendars";
import { requestFamilyMembers } from "../redux/actions/FamilyMembers";
import { requestVendor } from "../redux/actions/Vendors";

import { requestUserGroupForProtectedRoute } from "../redux/actions/Groups";
import Loading from "../helpers/Loading";
export default function protectedRoutes({ children }) {
  const { auth, status, calendars, loading, userTypes } = useSelector(
    ({ auth, status, calendars, loading, userTypes }) => {
      return {
        auth,
        status,
        calendars,
        loading,
        userTypes
      };
    }
  );
  const dispatch = useDispatch();
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!auth.hasOwnProperty("user_id")) {
      dispatch(requestUserInfo());
      dispatch(requestCalendars());
      dispatch(requestFamilyMembers());
    }
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    if (auth.email) {
      dispatch(requestUserGroupForProtectedRoute(auth.email));
    }
    window.scrollTo(0, 0);
  }, [auth.email]);

  if (
    sessionStorage.getItem("access_token") === null ||
    (status.messageType == "error" && auth.status === "SIGNED_IN")
  ) {
    return <Redirect to="/" />;
  } else if (
    auth.email_verified &&
    auth.status === "SIGNED_IN" &&
    status.requestStatus === "COMPLETED"
  ) {
    // === START Temporary implementation
    // Trello card https://trello.com/c/BXEQaXbB/252-for-users-only-can-we-only-show-the-application-page-and-menu-hide-dashboard-calendar-events-and-contacts-pages-and-menu-items
    const currentUserType = userTypes.filter(type => {
      return type.id === auth.type;
    })[0];
    if (currentUserType.name === "USER" && location.pathname === "/dashboard") {
      return <Redirect to="/dashboard/myapplication" />;
    }
    // === END Temporary implementation

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
    } else if (
      location.pathname.includes("/dashboard/application") ||
      location.pathname.includes("/dashboard/archived")
    ) {
      if (userTypes.length > 0) {
        if (currentUserType.name != "VENDOR") {
          return <Redirect to="/dashboard" />;
        }
      }
    }
    return <>{children}</>;
  }
  return <Loading />;
}
