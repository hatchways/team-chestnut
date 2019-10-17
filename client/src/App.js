import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { theme } from "./themes/theme";
import LandingPage from "./pages/Landing";
import Navbar from "./components/navbar/navbar";
import SignAll from "./pages/SignAll";
import Shop from "./pages/Shop";
import "./App.css";
import { LoginProvider } from "./contexts/LoginContext";
import Admin from "./pages/admin";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      forceRefresh={true}
      render={props =>
        localStorage.getItem("token") ? (
          <Component {...props} />
        ) : (
          <Redirect to="/signin" />
        )
      }
    />
  );
};

function App() {
  return (
    <LoginProvider>
      <MuiThemeProvider theme={theme}>
        <Navbar />
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/signin" component={SignAll} />
            <Route exact path="/signup" component={SignAll} />
            <ProtectedRoute exact path="/admin" component={Admin} />
            <ProtectedRoute exact path="/shop" component={Shop} />
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    </LoginProvider>
  );
}

export default App;
