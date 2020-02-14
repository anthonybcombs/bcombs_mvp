import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { Link } from "@reach/router";
import Logo from "../images/logo1.png";
const HeaderStyled = styled.header`
  display: grid;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize};
  background-color: ${({ theme }) => theme.backgroundColor};
  margin: 0;
  padding: 10px;
  border-bottom: 1px solid grey;
  div {
    display: inline;
  }
  a {
    display: block;
    color: grey;
    text-decoration: none;
  }

  #app-header-left {
    display: grid;
  }
  @media (min-width: 600px) {
    grid-template-columns: 85% 15%;
    text-align: left;
    #app-header-left {
      text-align: center;
      grid-template-columns: 50% 50%;
      grid-gap: 1%;
    }
    #app-header-left a {
      position: relative;
      top: 10px;
    }
  }
`;
const LayoutStyled = styled.div`
  margin: 0;
  padding: 0;
`;
export default function Layout({ children }) {
  const theme = useContext(ThemeContext);
  return (
    <LayoutStyled data-testid="app-layout" theme={theme}>
      <HeaderStyled data-testid="app-title" theme={theme.header}>
        <div id="app-header-right">
          <Link to="/">
            <img data-testid="app-logo" src={Logo} alt="Bcombs Logo" />
          </Link>
        </div>

        <div id="app-header-left">
          <Link data-testid="app-header-login" to="/">
            Login
          </Link>
          <Link data-testid="app-header-register" to="/auth/create">
            Register
          </Link>
        </div>
      </HeaderStyled>
      {children}
      <footer data-testid="app-footer"></footer>
    </LayoutStyled>
  );
}
