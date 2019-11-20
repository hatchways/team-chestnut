import React from 'react';
import Grid from '@material-ui/core/Grid';
// import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';


export default function AddressForm(props) {
  const [country, setCountry] = React.useState('Canada');
  const handleChange = (event, type) => {
    setCountry(event.target.value);
    props.formData(type,event.target.value)
  }

  function handleData (event, type) {
    props.formData(type,event.target.value);
  };

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
          variant="outlined"
            required
            id="firstName"
            name="firstName"
            label="First name"
            fullWidth
            autoComplete="billing first-name"
            onChange={event => handleData(event, 'firstName')}
            autoFocus
            error = {props.details.firstName.error}
            helperText= {props.details.firstName.error? props.details.firstName.errorText : '' }
            value = {props.details.firstName.value}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
           variant="outlined"
            required
            id="lastName"
            name="lastName"
            label="Last name"
            fullWidth
            autoComplete="billing family-name"
            onChange={event => handleData(event, 'lastName')}
            error = {props.details.lastName.error}
            helperText= {props.details.lastName.error? props.details.lastName.errorText : '' }
            value = {props.details.lastName.value}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} >
        <InputLabel id="country-label">Country / Region</InputLabel>
            <Select
            native
            fullWidth
            onChange={event => handleChange(event, 'country')}
            variant="outlined"
            value = {props.details.country.value}
          >
          <option value={'Canada'}>Canada</option>
          <option value={'USA'}>USA</option>
          </Select>
        </Grid>
        <Grid item xs={12} sm={6}>
        <InputLabel id="city-label">City</InputLabel>
          <TextField id="city" name="city" label="City" fullWidth   variant="outlined"
          onChange={event => handleData(event, 'city')}
                  error = {props.details.city.error}
                  helperText= {props.details.city.error? props.details.city.errorText : '' }
                  value = {props.details.city.value}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
           variant="outlined"
            required
            id="address"
            name="address"
            label="Address"
            fullWidth
            autoComplete="billing address-line1"
            onChange={event => handleData(event, 'address')}
            error = {props.details.address.error}
            helperText= {props.details.address.error? props.details.address.errorText : '' }
            value = {props.details.address.value}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
           variant="outlined"
            required
            id="zip"
            name="zip"
            label="Postal or Zip code"
            fullWidth
            autoComplete="billing postal-code"
            onChange={event => handleData(event, 'zip')}
            error = {props.details.zip.error}
            helperText= {props.details.zip.error? props.details.zip.errorText : '' }
            value = {props.details.zip.value}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
           variant="outlined"
            required
            id="phone"
            name="phone"
            label="Phone"
            fullWidth
            autoComplete="billing phone"
            type="tel"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            onChange={ event => handleData(event, 'phone')}
            error = {props.details.phone.error}
            helperText= {props.details.phone.error? props.details.phone.errorText : '' }
            value = {props.details.phone.value}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}