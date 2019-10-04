import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useLocation } from "react-router";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

const navStyles = makeStyles(theme => ({
  link: {
    margin: theme.spacing(1),
    color: "white"
  },
  appBar: {
    borderBottom: `100px solid ${theme.palette.divider}`
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

class Navbar extends Component {
  signPaths() {
    const classes = navStyles();
    const location = useLocation();

    console.log(location.pathname);
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
        <>
          <Link href={urls.siginin} className={classes.link}>
            Sign In
          </Link>
          <Link href={urls.siginup} className={classes.link}>
            Sign Up
          </Link>
        </>
      );
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <AppBar
        position="static"
        color="primary"
        elevation={0}
        className={classes.appBar}
        style={{ background: "black" }}
      >
        <Toolbar className={classes.toolbar}>
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            className={classes.toolbarTitle}
            style={{ flexGrow: 1 }}
          >
           <Link href="/" style={{ color: "white" }}>
            Baking Company
            </Link>
          </Typography>

          <nav>
            
            <this.signPaths />
          </nav>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(navStyles)(Navbar);
