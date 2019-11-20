import React from 'react';
import Typography from '@material-ui/core/Typography';
import { injectStripe } from 'react-stripe-elements';
import { CardElement } from 'react-stripe-elements';
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles(theme => ({
  buttons: {
    display: "flex",
    justifyContent: "center"
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1)
  },
}));
function PaymentForm(props) {
  const classes = useStyles();

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    console.log('i am clicked too...', e)
    props.stripe.createToken({
      type: 'card',
      name: props.details.firstName.value + ' ' + props.details.lastName.value,
      address_line1: props.details.address.value,
      address_city: props.details.city.value,
      address_zip: props.details.zip.value,
      address_country: props.details.country.value,
      currency: 'CAD',
    }).then((token) => {

      if (token['error']) {
        console.log('there is an error....')
      } else {
        // set the token and run 
      }
    });

    // then pass the token and with customer details and orderDetails to 

  }

  const handleBack = (e) => {
    e.preventDefault();
    props.setActiveStep(props.activeStep - 1);
  }


  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <form onSubmit={handlePaymentSubmit}>
        <label>
          Card details
        <CardElement style={{ base: { fontSize: '18px' } }} />
        </label>
        <div className={classes.buttons}>
          <Button variant="outlined" onClick={handleBack} className={classes.button} >
            Back
      </Button>
          <Button variant="contained" color="primary" onClick={handlePaymentSubmit} className={classes.button}>
            Place Order
      </Button>
        </div>

      </form>
    </React.Fragment>
  );
}


export default injectStripe(PaymentForm);