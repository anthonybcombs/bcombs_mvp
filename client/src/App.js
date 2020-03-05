import React from "react";
import { Router } from "@reach/router";
import Layout from "./helpers/Layout";
import Auth from "./components/Auth";
import Login from "./components/Auth/Login";
import Profile from "./components/UserInfo/Profile";

import Loadable from "react-loadable";
import Loading from "./helpers/Loading.js";

const AsycDashboard = Loadable({
  loader: () => import("./components/Dashboard/"),
  loading: Loading
});
const AsyncDashBoardHome = Loadable({
  loader: () => import("./components/Dashboard/Home"),
  loading: Loading
});
const AsyncDashboardMyCalendars = Loadable({
  loader: () => import("./components/Dashboard/MyCalendars"),
  loading: Loading
});
const AsyncDashboardMyEvents = Loadable({
  loader: () => import("./components/Dashboard/MyEvents"),
  loading: Loading
});
const AsyncDashboardMyProfle = Loadable({
  loader: () => import("./components/Dashboard/MyProfile"),
  loading: Loading
});
const AyncDashboardMyContacts = Loadable({
  loader: () => import("./components/Dashboard/MyContact"),
  loading: Loading
});
const AsyncCreateUser = Loadable({
  loader: () => import("./components/Auth/Create"),
  loading: Loading
});
const AsyncForgotPassword = Loadable({
  loader: () => import("./components/Auth/ForgotPassword"),
  loading: Loading
});
export default function App() {
  return (
    <>
      <Layout>
        <div data-testid="app">
          <Router>
            <Auth path="/">
              <Login default />
              <AsyncCreateUser path="auth/create" />
              <AsyncForgotPassword path="auth/forgot-password" />
            </Auth>
            <AsycDashboard path="/dashboard">
              <AsyncDashBoardHome default />
              <AsyncDashboardMyCalendars path="mycalendars" />
              <AsyncDashboardMyEvents path="myevents" />
              <AsyncDashboardMyProfle path="myprofile" />
              <AyncDashboardMyContacts path="mycontacts" />
            </AsycDashboard>
            <Profile path="profile" />
          </Router>
        </div>
      </Layout>
    </>
  );
}
