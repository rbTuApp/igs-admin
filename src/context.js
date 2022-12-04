import React, { useReducer, createContext } from "react";
import jwtDecode from "jwt-decode";
import { isArray } from "lodash";

const initialState = {
  user: null,
  reunion: false
};

if (localStorage.getItem("jwtToken")) {
  const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem("jwtToken");
  } else {
    initialState.user = decodedToken;
  }
}

const AuthContext = createContext({
  user: null,
  reunion: false,
  login: (userData) => { },
  logout: () => { },
  setReunion: () => { }
});

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    case "SETREUNION":
      return {
        ...state,
        reunion: action.payload
      }
    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(userData) {
    localStorage.setItem("jwtToken", userData.token);
    dispatch({
      type: "LOGIN",
      payload: userData,
    });

    window.location.href = "/";
  }
  function setReunion(userData) {
    dispatch({
      type: "SETREUNION",
      payload: userData,
    });
  }

  function logout() {
    localStorage.removeItem("jwtToken");
    dispatch({ type: "LOGOUT" });
    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        reunion: state.reunion,
        setReunion,
        login,
        logout,
      }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };
