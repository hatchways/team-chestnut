import React, {useContext,useEffect } from "react";
import {  LoginContext } from "../contexts/LoginContext";
import { Route, Redirect, useHistory} from "react-router-dom";


export const ProtectedRoute = ({ component: Component, ...rest }) => {
    const history = useHistory();
    const props = useContext(LoginContext);
  
    useEffect(() => {
      if (props.login === "loggedOut") {
        history.push("/signin");
      }
    }, [props.login, history]);
  
    return (
      <Route
        {...rest}
        forceRefresh={true}
        render={props =>
          sessionStorage.getItem("token") ? (
            <Component {...props} />
          ) : (
            <Redirect to="/signin" />
          )
        }
      />
    );
  };