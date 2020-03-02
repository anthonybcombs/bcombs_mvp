import React from "react";
import { Router } from "@reach/router";
import Layout from "./helpers/Layout";
import Auth from "./components/Auth";
import DashBoard from "./components/Dashboard/";
import DashboardHome from "./components/Dashboard/Home";
import DashboardMyCalendars from "./components/Dashboard/MyCalendars";
import MyProfile from "./components/Dashboard/MyProfile";
import Login from "./components/Auth/Login";
import CreateUser from "./components/Auth/Create";
import ForgotPassword from "./components/Auth//ForgotPassword";
import Profile from "./components/UserInfo/Profile";
import MyEvents from "./components/Dashboard/MyEvents/";
export default function App() {
  return (
    <>
      <Layout>
        <div data-testid="app">
          <Router>
            <Auth path="/">
              <Login default />
              <CreateUser path="auth/create" />
              <ForgotPassword path="auth/forgot-password" />
            </Auth>
            <DashBoard path="dashboard">
              <DashboardHome path="/" />
              <DashboardMyCalendars path="mycalendars" />
              <MyEvents path="myevents" />
              <MyProfile path="myprofile" />
            </DashBoard>
            <Profile path="profile" />
            <MyProfile path="myprofile" />
          </Router>
        </div>
      </Layout>
    </>
  );
}
