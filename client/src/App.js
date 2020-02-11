import React from "react";
import { Router } from "@reach/router";
import Layout from "./helpers/Layout";
import Auth from "./components/Auth";
import Login from "./components/Auth/Login";
import CreateUser from "./components/Auth/Create";
export default function App() {
  return (
    <Layout>
      <div data-testid="app">
        <Router>
          <Auth path="/">
            <Login path="/" />
            <CreateUser path="auth/create" />
          </Auth>
        </Router>
      </div>
    </Layout>
  );
}
