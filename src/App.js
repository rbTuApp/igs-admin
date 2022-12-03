import React, { useContext, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import Login from "./Login";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { AuthContext, AuthProvider } from "./context";
import Dashboard from "./dashboard/Dashboard";
function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <MainRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}
function MainRouter() {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Login />;
  }
  return <Dashboard />;
}
export default App;
