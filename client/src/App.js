import React from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { theme } from "./themes/Theme";
import Navbar from "./components/navbar/Navbar";
import SignAll from "./pages/SignAll";
import AllProducts from "./pages/AllProducts";
import Shop from "./pages/Shop";
import "./App.css";
import { LoginProvider } from "./contexts/LoginContext";
import Admin from "./pages/Admin";
import Messages from "./pages/Messages";
import { ProtectedRoute } from "./components/ProtectedRoute";
import NewProduct from "./pages/NewProduct";
import SingleProducts from "./pages/SingleProduct";

function App() {
  return (
    <LoginProvider>
      <MuiThemeProvider theme={theme}>
        <Navbar />
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={AllProducts} />
            <Route exact path="/signin" component={SignAll} />
            <Route exact path="/signup" component={SignAll} />
            <Route exact path="/products" component={AllProducts} />
            <Route
              exact
              path="/products/:productid"
              component={SingleProducts}
            />
            <ProtectedRoute exact path="/admin" component={Admin} />
            <ProtectedRoute exact path="/shop" component={Shop} />
            <ProtectedRoute exact path="/messages" component={Messages} />
            <ProtectedRoute
              exact
              path="/shop/new-product"
              component={NewProduct}
            />
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    </LoginProvider>
  );
}

export default App;
