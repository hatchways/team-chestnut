import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useLocation } from "react-router";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { BrowserRouter } from "react-router-dom";

const navStyles = makeStyles(theme => ({
  '@global': {
    
    '.MuiButton-root': {
      borderRadius: 'unset',
    },
    'MuiInputBase-root': {
      borderRadius: 'unset',
    }
  },
  link: {
    margin: theme.spacing(1),
    color: "white",
    fontWeight: '600',
    textDecoration: 'none',
    textTransform: 'uppercase',
  },
  appBar: {
    borderBottom: `10px solid ${theme.palette.divider}`
  },
  toolbar: {
    flexWrap: "wrap"
  },
  toolbarTitle: {
    flexGrow: 1
  }

}));

const urls = {
  siginin: "/signin",
  signup: "/signup",
  register: "/register"
};

function SigninPaths() {
  const classes = navStyles();
  const location = useLocation();

  if (location.pathname === urls.siginin) {
    return (
      <Link href={urls.signup} className={classes.link}>
        Sign Up
      </Link>
    );
  } else if (location.pathname === urls.signup) {
    return (
      <Link href={urls.siginin} className={classes.link}>
        Sign In
      </Link>
    );
  } else {
    return (
      <React.Fragment>
        <Link href={urls.siginin} className={classes.link}>
          Sign In
        </Link>
        <Link href={urls.siginup} className={classes.link}>
          Sign Up
        </Link>
      </React.Fragment>
    );
  }
}


export default function Navbar() {
  const classes = navStyles();

  return (
    <BrowserRouter>
      <AppBar
        position="static"
        color="primary"
        elevation={0}
        className={classes.appBar}
      >
        <Toolbar className={classes.toolbar}>
          <Typography
            variant="h6"
            noWrap
            className={classes.toolbarTitle}
          >
            <Link href="/" className={classes.link}>
              Baking Company
            </Link>
          </Typography>

          <nav>
            <SigninPaths />
          </nav>
        </Toolbar>
      </AppBar>
    </BrowserRouter>
  );
}
