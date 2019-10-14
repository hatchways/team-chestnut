import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { LoginContext } from "../contexts/LoginContext";

export default function Admin() {
  const history = useHistory();
  const [Login] = useContext(LoginContext);

  useEffect(() => {
    if (Login === "loggedOut") {
      history.push("/signin");
    }
  }, [Login, history]);

  return <p> I am on the admin page</p>;
}
