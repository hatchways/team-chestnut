import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles(theme => ({
  buttons: {
    display: "flex",
    justifyContent: "center"
  },
  button: {
    marginLeft: theme.spacing(1)
  },
  margin: {
    marginTop: theme.spacing(2)
  },
  header: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(5),
    bottomBorder: "underline"
  }
}));

export default function ShippingForm(props) {
  const classes = useStyles();
  const [disabled, serDisabled] = useState({
    email: true,
    shipping: true
  });

  const [checked, setChecked] = useState({
    free: true,
    fast: false
  });
  const handleChange = type => {
    if (props.shipping[type].change === "Change") {
      props.setShipping(prev => {
        prev[type].change = "Save";
        return { ...prev };
      });
      serDisabled(prev => {
        return { ...prev, [type]: false };
      });
    } else {
      props.setShipping(prev => {
        prev[type].change = "Change";
        return { ...prev };
      });
      serDisabled(prev => {
        return { ...prev, [type]: true };
      });
    }
  };

  function handleData(event, type) {
    props.setShipping(prev => {
      let prevType = prev[type];
      prevType.value = event;
      prevType.error = false;
      return { ...prev };
    });
  }
  useEffect(() => {
    const email = sessionStorage.getItem("email");
    if (email) {
      props.setShipping(prev => {
        prev.email.value = email;
        prev.email.error = false;
        return { ...prev };
      });
    }
    // issue if the shipping is saved, need to have check to have shipping is same as billing address...
    const address =
      props.details.address.value +
      " " +
      props.details.city.value +
      " " +
      props.details.zip.value +
      " " +
      props.details.country.value;

    if (props.shipping.shipping.value === "") {
      props.setShipping(prev => {
        prev.shipping.value = address;
        return { ...prev };
      });
    }
    if (props.details.shippingCost) {
      setChecked({ fast: true, free: false });
    }
  }, []);

  const handleBack = () => {
    props.setActiveStep(props.activeStep - 1);
  };

  const handleNext = e => {
    if (
      props.shipping.email.value !== "" &&
      props.shipping.shipping.value !== ""
    ) {
      props.setActiveStep(props.activeStep + 1);
      sessionStorage.setItem("email", props.shipping.email.value);
    } else {
      if (props.shipping.email.value === "") {
        props.setShipping(prev => {
          prev.email.error = true;
          return { ...prev };
        });
      }
      if (props.shipping.shipping.value === "") {
        props.setShipping(prev => {
          prev.shipping.error = true;
          return { ...prev };
        });
      }
    }
  };

  const handleChecked = name => event => {
    let cost = 0;
    if (name === "free") {
      setChecked({ [name]: event.target.checked, fast: false });
      cost = 0;
    } else {
      setChecked({ [name]: event.target.checked, free: false });
      cost = 25;
    }

    props.updateTotal(cost);
  };

  return (
    <React.Fragment>
      <Typography component="h6" className={classes.header}>
        Shipping Information
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={2} sm={2}>
          <Typography component="h6" className={classes.margin}>
            Email:
          </Typography>
        </Grid>
        <Grid item xs={7} sm={7}>
          <TextField
            required
            id="email"
            name="email"
            fullWidth
            autoComplete="billing email"
            onChange={event => handleData(event.target.value, "email")}
            disabled={disabled.email}
            error={props.shipping.email.error}
            helperText={
              props.shipping.email.error ? props.shipping.email.errorText : ""
            }
            value={props.shipping.email.value}
            color="primary"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={2} sm={2}>
          <Button
            variant="outlined"
            onClick={() => handleChange("email")}
            className={classes.margin}
          >
            {props.shipping.email.change}
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={2} sm={2}>
          <Typography component="h6" className={classes.margin}>
            Shipping:
          </Typography>
        </Grid>
        <Grid item xs={7} sm={7}>
          <TextField
            required
            id="shipping"
            name="shipping"
            variant="outlined"
            fullWidth
            autoComplete="billing email"
            onChange={event => handleData(event.target.value, "shipping")}
            disabled={disabled.shipping}
            error={props.shipping.shipping.error}
            helperText={
              props.shipping.shipping.error
                ? props.shipping.shipping.errorText
                : ""
            }
            value={props.shipping.shipping.value}
          />
        </Grid>
        <Grid item xs={2} sm={2}>
          <Button
            variant="outlined"
            onClick={() => handleChange("shipping")}
            className={classes.margin}
          >
            {props.shipping.shipping.change}
          </Button>
        </Grid>
      </Grid>

      <Typography component="h6" className={classes.header}>
        Shipping Method
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={2} sm={2}>
          <Checkbox
            checked={checked.fast}
            onChange={handleChecked("fast")}
            value="Fast"
            color="primary"
          />
        </Grid>
        <Grid item xs={7} sm={7}>
          <Typography component="h6">Fast Shipping</Typography>
        </Grid>
        <Grid item xs={2} sm={2}>
          <Typography component="h6">$25.00</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={2} sm={2}>
          <Checkbox
            checked={checked.free}
            onChange={handleChecked("free")}
            value="Free"
            color="primary"
          />
        </Grid>
        <Grid item xs={7} sm={7}>
          <Typography component="h6">Standard Shipping</Typography>
        </Grid>
        <Grid item xs={2} sm={2}>
          <Typography component="h6">Free</Typography>
        </Grid>
      </Grid>

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
          onClick={handleNext}
          className={classes.button}
        >
          Next
        </Button>
      </div>
    </React.Fragment>
  );
}
