import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
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
  }
}));

export default function SignAll() {
  const classes = useStyles();
  const location = useLocation();

  // Declare multiple state variables!
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorText, setemailErrorText] = useState("");
  const [password, setPassowrd] = useState("");
  const [passwordError, setPassowrdError] = useState(false);
  const [passwordErrorText, setPassowrdErrorText] = useState("");
  const [fullName, setfullName] = useState("");
  const [fullNameError, setfullNameError] = useState(false);
  const [fullNameErrorText, setfullNameErrorText] = useState("");

  const paths = {
    "/signin": {
      label: "Sign in",
      textFields: ["email", "password"],
      links: { label: "Forgot password?", hrefs: "#" },
      fetch: "/siginin"
    },
    "/signup": {
      label: "Sign Up",
      textFields: ["email", "name", "password"],
      fetch: "/siginup"
    }
  };
  const textLabels = {
    'email': {
      label: "Email Address",
      error: emailError,
      focus: true,
      helperText: emailErrorText
    },
    'password': {
      label: "Password",
      error: passwordError,
      focus: false,
      helperText: passwordErrorText
    },
    'name': {
      label: "Full Name",
      error: fullNameError,
      focus: false,
      helperText: fullNameErrorText
    }
  };

  const page = paths[location.pathname];

  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const handleChange = type => event => {
    console.log("event is ", type, event);
    if (type === "email") {
      setEmailError(false);
      setEmail(event.target.value);
    }
    if (type === "password") {
      setPassowrdError(false);
      setPassowrd(event.target.value);
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
    }
    if (password.length < 6) {
      setPassowrdError(true);
      setPassowrdErrorText("Please enter a six digit or more password");
    }
    if (fullName.length < 3) {
      setfullNameError(true);
      setfullNameErrorText("Please enter Full Name");
    } else {
      // will need to add the post request here and then handle redirect....
    }
  }
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
        </form>
      </div>
    </Container>
  );
}
