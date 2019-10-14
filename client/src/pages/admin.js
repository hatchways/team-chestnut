import React, { useContext, useEffect } from "react";
import { LoginContext } from "../contexts/LoginContext";
import { useHistory } from "react-router-dom";

export default function Admin() {
  let history = useHistory();
  const [Login] = useContext(LoginContext);

  useEffect(() => {
    if (Login === "loggedOut") {
      history.push("/signin");
    }
  }, [Login, history]);

  return <p> I am on the admin page</p>;
}
