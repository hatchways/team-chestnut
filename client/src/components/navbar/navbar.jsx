import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useLocation } from "react-router";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { BrowserRouter } from "react-router-dom";

const navStyles = makeStyles(theme => ({
  "@global": {
    ".MuiButton-root": {
      borderRadius: "unset"
    },
    "MuiInputBase-root": {
      borderRadius: "unset"
    }
  },
  link: {
    margin: theme.spacing(1),
    color: "white",
    fontWeight: "600",
    textDecoration: "none",
    textTransform: "uppercase"
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

function SigninPaths() {
  const classes = navStyles();
  const location = useLocation();
  const path = location.pathname;

  const urls = {
    "/signin": { label: "Sign In", oppPath: '/signup', oppLabel: "Sign Up" },
    "/signup": { label: "Sign Up", oppPath: '/signin', oppLabel: "Sign In"  }
  };

  if (path === "/signin" || path === "/signup" ) {
    return (
      <Link href={urls[path].oppPath} className={classes.link}>
        {urls[path].oppLabel}
      </Link>
    );
  } else {
    let links = [];
    Object.keys(urls).forEach((entry, i) => {
      return links.push(
        <Link href={entry} className={classes.link} key={i}>
          {urls[entry].label}
        </Link>
      );
    });
    return links;
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
          <Typography variant="h6" noWrap className={classes.toolbarTitle}>
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
