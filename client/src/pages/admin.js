import React, { useContext } from "react";
import { LoginContext } from "../contexts/LoginContext";
import { useHistory } from "react-router-dom";

export default function Admin() {
  let history = useHistory();
  const [Login] = useContext(LoginContext);
  if (Login === "loggedOut") {
    history.push("/signin");
  }

  return <p> I am on the admin page</p>;
}
