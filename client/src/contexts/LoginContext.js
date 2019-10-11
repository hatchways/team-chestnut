import React, { createContext, useState } from "react";
export const LoginContext = createContext();

export const LoginProvider = props => {
  let logged = localStorage.getItem("token") === null ? "loggedOut" : "loggedIn";
  const [Login, setLogin] = useState(logged);

  const Logout = history => {
    localStorage.removeItem("token");
    setLogin("loggedOut");
    history.push("/");
  };

  return (
    <LoginContext.Provider value={[Login, setLogin, Logout]}>
      {props.children}
    </LoginContext.Provider>
  );
};
