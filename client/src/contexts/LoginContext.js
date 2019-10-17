import React, { createContext, useState } from "react";
import jwt from "jsonwebtoken";
export const LoginContext = createContext();

export const LoginProvider = props => {
  const token = localStorage.getItem("token");
  const [login, setLogin] = useState(token === null ? "loggedOut" : "loggedIn");
  const [user, setUser] = useState(token === null ? null : jwt.decode(token));
  const Logout = history => {
    localStorage.removeItem("token");
    setLogin("loggedOut");
    history.push({ pathname: "/" });
    window.location.href = window.location.href;
  };

  return (
    <LoginContext.Provider value={{ login, setLogin, Logout, user, setUser }}>
      {props.children}
    </LoginContext.Provider>
  );
};
