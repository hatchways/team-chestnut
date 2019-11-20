import React, { useState, useContext } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Snackbar from "@material-ui/core/Snackbar";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import WarningIcon from "@material-ui/icons/Warning";
import CloseIcon from "@material-ui/icons/Close";
import { amber, green } from "@material-ui/core/colors";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import { LoginContext } from "../contexts/LoginContext";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router";

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px",
    boxShadow: "0 0 20px lightgrey "
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: "auto",
    display: "block",
    padding: "10px 40px",
    marginTop: "30px"
  },
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.main
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: "flex",
    alignItems: "center"
  }
}));

export default function SignAll() {
  const classes = useStyles();
  const location = useLocation();
  let history = useHistory();
  const props = useContext(LoginContext);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorText, setemailErrorText] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPassowrdError] = useState(false);
  const [passwordErrorText, setPassowrdErrorText] = useState("");
  const [fullName, setfullName] = useState("");
  const [fullNameError, setfullNameError] = useState(false);
  const [fullNameErrorText, setfullNameErrorText] = useState("");
  const [fetchStatus, setStatus] = useState("");
  const [StatusMessage, setStatusMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [Icon, setIcon] = useState(InfoIcon);

  if (props.login === "loggedin") {
    history.push("/");
  }

  const paths = {
    "/signin": {
      label: "Sign in",
      textFields: ["email", "password"],
      links: { label: "Forgot password?", hrefs: "#" },
      fetch: "/auth/Login",
      status: 200
    },
    "/signup": {
      label: "Sign Up",
      textFields: ["email", "name", "password"],
      fetch: "/auth/register",
      status: 201
    }
  };
  const textLabels = {
    email: {
      label: "Email Address",
      error: emailError,
      focus: true,
      helperText: emailErrorText
    },
    password: {
      label: "Password",
      error: passwordError,
      focus: false,
      helperText: passwordErrorText
    },
    name: {
      label: "Full Name",
      error: fullNameError,
      focus: false,
      helperText: fullNameErrorText
    }
  };
  const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon
  };

  const page = paths[location.pathname];

  function validateEmail(emailParam) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(emailParam).toLowerCase());
  }

  const handleChange = type => event => {
    if (type === "email") {
      setEmailError(false);
      setEmail(event.target.value);
    }
    if (type === "password") {
      setPassowrdError(false);
      setPassword(event.target.value);
    }
    if (type === "name") {
      setfullNameError(false);
      setfullName(event.target.value);
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError(true);
      setemailErrorText("Please enter a valid email");
    } else if (password.length < 6) {
      setPassowrdError(true);
      setPassowrdErrorText("Please enter a six digit or more password");
    } else if (fullName.length < 2 && page === "/signup") {
      setfullNameError(true);
      setfullNameErrorText("Please enter Full Name");
    } else {
      const postBody = {
        email,
        password
      };
      if (fullName.length > 2) {
        postBody.name = fullName;
      }

      let settingStatus;

      fetch(page.fetch, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(postBody)
      })
        .then(res => {
          if (res.status === page.status) {
            setStatus("success");
            setStatusMessage("Success");
            setIcon(variantIcon.success);
            settingStatus = "success";
          } else {
            setStatus("error");
            setIcon(variantIcon.error);
            settingStatus = "error";
          }
          return res.json();
        })
        .then(res => {
          if (settingStatus === "error") {
            setStatusMessage(res.message);
            setOpen(true);
          } else {
            sessionStorage.setItem("token", res.token);
            props.setLogin("loggedIn");
            history.push("/admin");
          }
        })
        .catch(err => {
          console.log("Fetch error is: ", err.message);
          setStatus("error");
          setIcon(variantIcon.error);
          setStatusMessage("There was an error connecting to server.");
          setOpen(true);
        });
    }
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  function ForgotPassword() {
    if (page.hasOwnProperty("links")) {
      return (
        <Typography>
          <Link href={page.links.hrefs} variant="body2">
            {page.links.label}
          </Link>
        </Typography>
      );
    } else {
      return null;
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h6">
          {page.label}
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          {page.textFields.map((entry, i) => {
            return (
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id={entry}
                label={textLabels[entry].label}
                name={entry}
                type ={entry === 'password' || entry === 'email'? entry : 'text' }
                autoComplete={entry}
                autoFocus={textLabels[entry].focus}
                onChange={handleChange(entry)}
                error={textLabels[entry].error}
                helperText={textLabels[entry].helperText}
                key={i}
              />
            );
          })}
          <ForgotPassword />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {page.label}
          </Button>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center"
            }}
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <SnackbarContent
              className={clsx(classes[fetchStatus])}
              aria-describedby="client-snackbar"
              message={
                <span id="client-icon" className={classes.message}>
                  <Icon className={clsx(classes.icon, classes.iconVariant)} />
                  {StatusMessage}
                </span>
              }
              action={[
                <IconButton
                  key="close"
                  aria-label="close"
                  color="inherit"
                  onClick={handleClose}
                >
                  <CloseIcon className={classes.icon} />
                </IconButton>
              ]}
            />
          </Snackbar>
        </form>
      </div>
    </Container>
  );
}
