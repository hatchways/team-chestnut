import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

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

export default function SignIn() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [emailError, setEmailEroor] = useState(false);
  const [emailErrorText, setemailErrorText] = useState("");
  const [password, setPassowrd] = useState("");
  const [passwordError, setPassowrdError] = useState(false);
  const [passwordErrorText, setPassowrdErrorText] = useState("");

  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const handleChange = type => event => {
    if (type === "email") {
      setEmailEroor(false);
      setEmail(event.target.value);
    }
    if (type === "password") {
      setPassowrdError(false);
      setPassowrd(event.target.value);
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailEroor(true);
      setemailErrorText("Please enter a valid email");
    }
    if (password.length < 6) {
      setPassowrdError(true);
      setPassowrdErrorText("Please enter a six digit or more password");
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h6">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={handleChange("email")}
            error={emailError}
            helperText={emailErrorText}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange("password")}
            error={passwordError}
            helperText={passwordErrorText}
          />
          <Typography>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Typography>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
        </form>
      </div>
    </Container>
  );
}
