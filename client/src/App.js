import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { theme } from "./themes/theme";
import LandingPage from "./pages/Landing";
import Navbar from "./components/navbar/navbar";
import SignAll from "./pages/SignAll";
import MyShop from "./pages/MyShop";
import "./App.css";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Navbar />
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/signin" component={SignAll} />
          <Route path="/signup" component={SignAll} />
          <Route path="/myshop" component={MyShop} />
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
