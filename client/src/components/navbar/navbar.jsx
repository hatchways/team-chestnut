import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useLocation, BrowserRouter } from "react-router-dom";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Logo from "../../Assets/images/birthday-cake-solid.svg";

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
    textTransform: "uppercase",
    "&:hover": {
      textDecoration: "none",
      color: "lightgrey"
    }
  },
  appBar: {
    borderBottom: `10px solid ${theme.palette.divider}`,
    borderTop: `10px solid ${theme.palette.divider}`
  },
  toolbar: {
    flexWrap: "wrap"
  },
  toolbarTitle: {
    flexGrow: 1
  },
  logolink: {
    color: "lightgrey",
    fontWeight: "100",
    paddingTop: "10px,",
    letterSpacing: "5px",
    fontSize: "15px",
    "&:hover": {
      textDecoration: "none",
      color: "white"
    }
  },
  logoImage: {
    position: "absolute",
    top: "5px",
    left: "90px"
  }
}));

function SigninPaths() {
  const classes = navStyles();
  const location = useLocation();
  const path = location.pathname;

  const urls = {
    "/signin": { label: "Sign In", oppPath: "/signup", oppLabel: "Sign Up" },
    "/signup": { label: "Sign Up", oppPath: "/signin", oppLabel: "Sign In" }
  };

  if (path === "/signin" || path === "/signup") {
    return (
      <Link href={urls[path].oppPath} className={classes.link}>
        {urls[path].oppLabel}
      </Link>
    );
  }
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
            <Link href="/" className={classes.logolink} style={{}}>
              <img
                src={Logo}
                width="25"
                height="25"
                alt="logo"
                className={classes.logoImage}
              />
              <br></br>BAKERY SHOP
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
