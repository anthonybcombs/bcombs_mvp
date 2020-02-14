import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { Link } from "@reach/router";
import Logo from "../images/logo1.png";
const HeaderStyled = styled.h1`
  font-size: ${({ theme }) => theme.fontSize};
  width: 100vw;
  background-color: ${({ theme }) => theme.backgroundColor};
  margin: 0;
  padding: 10px;
  border-bottom: 1px solid grey;
`;
const LayoutStyled = styled.div`
  margin: 0;
  padding: 0;
`;
export default function Layout({ children }) {
  const theme = useContext(ThemeContext);
  return (
    <LayoutStyled data-testid="app-layout">
      <HeaderStyled data-testid="app-title" theme={theme.header}>
        <Link to="/">
          <img data-testid="app-logo" src={Logo} alt="Bcombs Logo" />
        </Link>
      </HeaderStyled>
      {children}
      <footer data-testid="app-footer"></footer>
    </LayoutStyled>
  );
}
