import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { theme } from "./themes/theme";
import LandingPage from "./pages/Landing";
import Navbar from "./components/navbar/navbar";
import SignAll from "./pages/SignAll";
import MyShop from "./pages/MyShop";
import "./App.css";
import { LoginProvider } from "./contexts/LoginContext";
import Admin from "./pages/admin";

function App() {
  
  return (
    <LoginProvider>
      <MuiThemeProvider theme={theme}>
        <Navbar />
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/signin" component={SignAll} />
            <Route path="/signup" component={SignAll} />
            <Route path="/admin" component={Admin} />
            <Route path="/myshop" component={MyShop} />
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    </LoginProvider>

  );
}

export default App;
