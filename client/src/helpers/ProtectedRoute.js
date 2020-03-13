import React, { useEffect } from "react";
import { Redirect } from "@reach/router";
import { useSelector, useDispatch } from "react-redux";
import { requestUserInfo } from "../redux/actions/Auth";
import Loading from "../helpers/Loading";
export default function protectedRoutes({ children }) {
  const { auth } = useSelector(({ auth }) => {
    return {
      auth
    };
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(requestUserInfo());
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [children]);
  if (
    sessionStorage.getItem("access_token") === null ||
    auth.hasOwnProperty("error")
  ) {
    return <Redirect to="/" nothrow />;
  } else if (auth.email_verified) {
    return <>{children}</>;
  }
  return <Loading />;
}
