import React, { createContext, useState } from "react";
import jwt from "jsonwebtoken";
export const LoginContext = createContext();

export const LoginProvider = props => {
  const token = sessionStorage.getItem("token");
  const [login, setLogin] = useState(token === null ? "loggedOut" : "loggedIn");
  const [user, setUser] = useState(token === null ? null : jwt.decode(token));
  const Logout = history => {
    sessionStorage.removeItem("token");
    setLogin("loggedOut");
  };
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')));
  return (
    <LoginContext.Provider value={{ login, setLogin, Logout, user, setUser, cart, setCart }}>
      {props.children}
    </LoginContext.Provider>
  );
};
