import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import { injectStripe } from "react-stripe-elements";
import { CardElement } from "react-stripe-elements";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import ErrorIcon from "@material-ui/icons/Error";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles(theme => ({
  buttons: {
    display: "flex",
    justifyContent: "center"
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1)
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  message: {
    display: "flex",
    alignItems: "center"
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  header: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(5),
    bottomBorder: "underline"
  },
  margin: {
    marginTop: theme.spacing(2)
  }
}));
function PaymentForm(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [StatusMessage, setStatusMessage] = useState("");

  const handlePaymentSubmit = e => {
    e.preventDefault();
    props.stripe
      .createToken({
        type: "card",
        name:
          props.details.firstName.value + " " + props.details.lastName.value,
        address_line1: props.details.address.value,
        address_city: props.details.city.value,
        address_zip: props.details.zip.value,
        address_country: props.details.country.value,
        currency: "CAD"
      })
      .then(token => {
        if (token["error"]) {
          setOpen(true);
          setStatusMessage(token["error"].message);
        } else {
          setOpen(false);
          props.post(token.token);
        }
      });
  };

  const handleBack = e => {
    e.preventDefault();
    props.setActiveStep(props.activeStep - 1);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Typography variant="h6" className={classes.header}>
        Summary
      </Typography>

      <Typography variant="body1">
        Name:{" "}
        {props.details.firstName.value + " " + props.details.lastName.value}
      </Typography>
      <Typography variant="body1">
        Email: {props.shipping.email.value}
      </Typography>
      <Typography variant="body1">
        Phone: {props.details.phone.value}
      </Typography>
      <Typography variant="body1" className={classes.margin}>
        Billing Address:{" "}
        {props.details.address.value +
          " " +
          props.details.city.value +
          " " +
          props.details.zip.value +
          " " +
          props.details.country.value}
      </Typography>
      <Typography variant="body1" className={classes.margin}>
        Shipping Address: {props.shipping.shipping.value}
      </Typography>

      <Typography variant="h6" className={classes.header}>
        Payment
      </Typography>
      <form onSubmit={handlePaymentSubmit}>
        <label>
          Card details
          <CardElement style={{ base: { fontSize: "18px" } }} />
        </label>
        <div className={classes.buttons}>
          <Button
            variant="outlined"
            onClick={handleBack}
            className={classes.button}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePaymentSubmit}
            className={classes.button}
          >
            Place Order
          </Button>
        </div>
      </form>
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
          className={clsx(classes.error)}
          aria-describedby="client-snackbar"
          message={
            <span id="client-icon" className={classes.message}>
              <ErrorIcon className={clsx(classes.icon, classes.iconVariant)} />
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
    </React.Fragment>
  );
}

export default injectStripe(PaymentForm);
