import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "@reach/router";
import { webAuth } from "./Auth0";
import Loading from "./Loading";
import { requestAddUser } from "../redux/actions/Users";
export default function SocialLogin({ location }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  webAuth.parseHash({ hash: location.hash }, function(err, authResult) {
    if (err) {
      return;
    }
    webAuth.client.userInfo(authResult.accessToken, function(err, user) {
      if (err) return;
      user.isSocial = true;
      sessionStorage.setItem("access_token", authResult.accessToken);
      sessionStorage.setItem("token_type", authResult.tokenType);
      dispatch(requestAddUser(user));
      navigate(
        "/dashboard",
        { state: { calendarName: "" } },
        { replace: true }
      );
    });
  });
  return <Loading />;
}
