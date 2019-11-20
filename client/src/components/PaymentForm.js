import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {injectStripe} from 'react-stripe-elements';
import {CardElement} from 'react-stripe-elements';


 function PaymentForm(props) {

  const handlePaymentSubmit = (e) =>{
    e.preventDefault();

     props.stripe.createToken({
       type: 'card', 
       name: props.details.firstName.value + ' ' + props.details.lastName.value,
       address_line1: props.details.address.value,
       address_city: props.details.city.value,
       address_zip: props.details.zip.value,
       address_country: props.details.country.value,
       currency: 'CAD',
    }).then((token)=>{
        console.log('the token is', token)
      });

    // then pass the token and with customer details and orderDetails to 

  
  }


  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <form onSubmit={handlePaymentSubmit}>
      <label>
        Card details
        <CardElement style={{base: {fontSize: '18px'}}} />
      </label>
        <button>Confirm order</button>
      </form>
    </React.Fragment>
  );
}


export default injectStripe(PaymentForm);