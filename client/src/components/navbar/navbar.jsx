import React, { useContext, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useLocation, BrowserRouter, useHistory } from "react-router-dom";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Icon from "@material-ui/core/Icon";

import Logo from "../../Assets/images/birthday-cake-solid.svg";
import { LoginContext } from "../../contexts/LoginContext";

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

function SigninPaths(props) {
  const classes = navStyles();
  const location = useLocation();
  const currentPage = location.pathname;

  const mainUrls = {
    loggedIn: [
      { label: "Shop", path: "/shop" },
      { label: "Messages", path: "/messages" },
      { label: "My Favourites", path: "/my_shop" },
      { label: "My Shop", path: "/my_account" },
      {
        label: "My Account",
        path: "/my_shop",
        sublinks: [
          { label: "Edit Account", path: "/edit_account" },
          { label: "Logout", path: "/logout" }
        ]
      }
    ],
    loggedOut: [
      { label: "Sign In", path: "/signin" },
      { label: "Sign Up", path: "/signup" }
    ]
  };
  const [ModifyLinks, setModifyLinks] = useState(mainUrls[props.login]);

  useEffect(() => {
    if (currentPage === "/signin" && props.login === "loggedOut") {
      setModifyLinks([{ label: "Sign Up", path: "/signup" }]);
    } else if (currentPage === "/signup" && props.login === "loggedOut") {
      setModifyLinks([{ label: "Sign In", path: "/signin" }]);
    } else {
      setModifyLinks(mainUrls[props.login]);
    }

    return () => {};
  }, [props.login, currentPage]);

  return (
    <div>
      {ModifyLinks.map((linked) => {
        if (linked.sublinks) {
          return (
            <MyAccount
              items={linked.sublinks}
              label={linked.label}
              Logout={props.Logout}
              key={linked.label}
            />
          );
        }
        return (
          <Link href={linked.path} className={classes.link} key={linked.label}>
            {linked.label}
          </Link>
        );
      })}
    </div>
  );
}

function MyAccount({ items, label, Logout }) {
  const classes = navStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const history = useHistory();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const MenuItemChildren = (
    <Menu
      id="simple-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      {items.map((item) => {
        if (item.label === "Logout") {
          return (
            <MenuItem onClick={() => Logout(history)} key={item.label}>
              <Icon>power_settings_new</Icon>
              {item.label}
            </MenuItem>
          );
        }
        return (
          <MenuItem
            key={item.label}
            onClick={() => {
              history.push(item.path);
            }}
          >
            {item.label}
          </MenuItem>
        );
      })}
    </Menu>
  );

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <React.Fragment>
      <Link className={classes.link} onMouseOverCapture={handleClick}>
        {label}
      </Link>
      {MenuItemChildren}
    </React.Fragment>
  );
}

export default function Navbar() {
  const classes = navStyles();
  const props = useContext(LoginContext);

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
              <br />
              BAKERY SHOP
            </Link>
          </Typography>

          <nav>
            <SigninPaths {...props} />
          </nav>
        </Toolbar>
      </AppBar>
    </BrowserRouter>
  );
}
