import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
// import AppBar from "@material-ui/core/AppBar";
// import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import AddressForm from "../components/AddressForm";
import PaymentForm from "../components/PaymentForm";
import Review from "../components/FromReview";
import { Grid } from "@material-ui/core";
import { fetchGet } from "../utils/ApiFetching";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Skeleton from '@material-ui/lab/Skeleton';
import { useHistory } from "react-router-dom";
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import { LoginContext } from "../contexts/LoginContext";
import {Elements} from 'react-stripe-elements';


const useStyles = makeStyles(theme => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto"
    },
    [theme.breakpoints.up(900 + theme.spacing(2) * 2)]: {
      width: 1000,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    [theme.breakpoints.up(800 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3)
    }
  },
  buttons: {
    display: "flex",
    justifyContent: "center"
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1)
  },
  card: {
    display: 'flex',
    marginBottom: 10,
    marginTop: 10,
  },
  cardMedia: {
    width: 100,
    paddingTop: "100%"
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  },
  cardDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  cButton: {
    display: 'flex',
    margin: 'auto'
  },
  cardContent: {
    flexGrow: 2,
    padding: '5px 0 0 5px'
  },
  cardDelete: {
    padding: '0 0 0 0'
  },


}));

const steps = ["Information", "Payment"];


export default function Checkout(props) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [deleteProduct, setDeleteProduct] = useState('');
  const [orderDetails, setOrderDetails] = useState({
    firstName: { value: '', error: false, errorText: 'Please enter Name' },
    lastName: { value: '', error: false, errorText: 'Please enter Last Name' },
    country: { value: 'canada', error: false },
    address: { value: '', error: false, errorText: 'Please enter address' },
    city: { value: '', error: false, errorText: 'Please enter city' },
    zip: { value: '', error: false, errorText: 'Please enter zip code' },
    phone: { value: '', error: false, errorText: 'Please enter a phone number' },
  });
  const [validationError, setValidationError] = useState('');
  const [cart,setCart] = useState(JSON.parse(localStorage.getItem("cart")));
  const history = useHistory();
  const lCon = useContext(LoginContext);


  useEffect(() => {
    ;
    const user = JSON.parse(sessionStorage.getItem('details'));
    if (user !== null) {
      console.log('i am running', user);
      user.firstName.reload = true;
      setOrderDetails(user);
      setValidationError(false);
    }

    if (cart !== null) {
      let products = Object.keys(cart);
      let index = products.indexOf('total');
      if (index !== -1) {
        products.splice(index, 1);
      }
      setLoading(true);
      products.forEach((product, i) => {
        fetchGet(`/shop/items/${product}`).then((res, err) => {
          if (typeof res === "object") {
            let subtotal = Number(cart[res.item._id]) * Number(res.item.price)
            res.item.qty = cart[res.item._id];
            res.item.subTotal = subtotal
            setOrders((prevState => {
              return [...prevState, res.item]
            }))
            setTotal((prevState => {
              return Number(prevState) + Number(subtotal)
            }))
            if (i === products.length - 1) {
              setLoading(false);
            }
          }
        });
      })
    }

  }, []);

  useEffect(()=>{
    if (deleteProduct !== ''){
      let deleteOrder = {}
      const newOrders = orders.filter((ele, i)=> {
        if(ele._id === deleteProduct){
          deleteOrder.subTotal = ele.subTotal
          deleteOrder.qty = ele.qty
          return false
        }
        return true
      });
      setOrders(newOrders);
      console.log(deleteOrder);
      setTotal(total-deleteOrder.subTotal);

      if (newOrders.length>0){  
        let cart = JSON.parse(localStorage.getItem("cart"));
        delete cart[deleteProduct];
        cart.total = cart.total - deleteOrder.qty
        localStorage.setItem("cart", JSON.stringify(cart));
        lCon.setCart(cart);

      } else {
        localStorage.removeItem('cart');
        lCon.setCart(null);
        setCart(null);
      }
    }

  },[deleteProduct])

  useEffect(() => {
    if (orderDetails.firstName.reload === true) {
      handleNext();
    }
  }, [orderDetails.firstName.reload])

  const handleNext = (e) => {
    if (activeStep === 0) {
      let allKeys = Object.keys(orderDetails);

      allKeys.forEach((ele, i) => {
        if (orderDetails[ele].value === '') {
          setValidationError(true);
          setOrderDetails((prev) => {
            let prevType = prev[ele];
            prevType.error = true
            return { ...prev }
          })
        } else if (allKeys.length - 1 === i) {
          if (orderDetails[ele].value !== '' && validationError === false && e) {
            setActiveStep(activeStep + 1);
          }
        }
      });
    }
    console.log('nect button')
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const formValidations = (type, value) => {
    setValidationError(false);
    setOrderDetails((prev) => {
      let prevType = prev[type];
      prevType['value'] = value;
      prevType.error = false;
      return { ...prev }
    });
    if (value === '') { setValidationError(true) }
  };


  const continueShopping = () => {
    console.log('this is order',orderDetails ) 
    // do i need to set a new state?
    if(orderDetails.firstName.value !== '' && orderDetails.lastName.value !== ''){
      sessionStorage.setItem('details', JSON.stringify(orderDetails));
    }
    history.push("/");
  }

  const orderValidation = () =>{
    console.log('order button');
  
  }

  function ContinueButton() {
    return (<Button
      type="submit"
      variant="contained"
      color="primary"
      onClick={continueShopping}
      disabled={false}
      className={classes.cButton}
    >
      Continue Shopping
    </Button>)
  }

 

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <AddressForm formData={formValidations} details={orderDetails} />;
      case 1:
        return (
        <React.Fragment >
        <Elements> 
          <PaymentForm details={orderDetails} formData={orderValidation} />
          </Elements>
        </React.Fragment>
        );
      case 2:
        return <Review details={orderDetails} />;
      default:
        throw new Error("Unknown step");
    }
  }
  const handleDelete = (id) =>{
    setDeleteProduct(id);
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        {cart === null ? (
          <React.Fragment >
            <Typography component="h3" variant="h4" align='center' className={classes.paper} >
              Your cart is empty!
            </Typography>
            < ContinueButton />
          </React.Fragment>
        ) : (
            <React.Fragment>
              {activeStep === steps.length ? (
                <React.Fragment >

                  <Typography variant="h3" className={classes.paper} align='center'>
                    Thank you for order!
              </Typography>
                  <Typography variant="subtitle1" className={classes.paper} align='center' >
                    Your order has been placed and is being processed. You will recevie an email with the order details.
              </Typography>
                  < ContinueButton />

                </React.Fragment>

              ) :
                (
                  <React.Fragment>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        <Paper className={classes.paper}>
                          <Grid container direction="row" justify="space-between"
                            alignItems="center">
                            <Grid item xs={12} md={4} >
                              <Typography component="h2" variant="h4" >
                                Checkout
                  </Typography>
                            </Grid>
                            <Grid item xs={12} md={8} >
                              <Stepper activeStep={activeStep} className={classes.stepper}>
                                {steps.map(label => (
                                  <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                  </Step>
                                ))}
                              </Stepper>
                            </Grid>
                          </Grid>

                          <React.Fragment>
                            {getStepContent(activeStep)}
                            <div className={classes.buttons}>
                              {activeStep !== 0 && (
                          <Button onClick={handleBack} className={classes.button}>
                                  Back
                        </Button>
                              )}
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={event => handleNext(event)} 
                                className={classes.button}
                              >
                                {activeStep === steps.length - 1 ? "Place order" : "Next"}
                              </Button>
                            </div>
                          </React.Fragment>

                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={4} >
                        <Paper className={classes.paper}>
                          <Typography component="h3" variant="h4" align='center' >
                            Your Order
            </Typography>
                          {(loading ? Array.from(new Array(1)) : orders).map((card, i) => (
                            <Grid item key={card ? card._id : i} xs={12}>
                              {card ? (
                                <Card className={classes.card} key={card._id}>
                                  <Link href={'/products/' + card._id} className={classes.link}>
                                    <CardMedia
                                      className={classes.cardMedia}
                                      image={card.photos[0]}
                                      title={card.title}
                                      key={card._id}
                                    />
                                  </Link>
                                  <CardContent className={classes.cardContent}>
                                    <Typography gutterBottom style={{ fontWeight: 500 }}>{card.title} </Typography>
                                    <Typography >
                                      ${card.price} - Quantity: {card.qty}
                                    </Typography>
                                   
                                  </CardContent>
                                  <CardContent className={classes.cardDelete}>
                                  <IconButton className={classes.button} aria-label="delete" style={{marginLeft:'0px', padding:5} } onClick={()=>handleDelete(card._id) }> <DeleteIcon /></IconButton>
                                  </CardContent>
                              
                                </Card>) : (
                                  <Skeleton variant="rect" width={250} height={300} />
                                )}
                            </Grid>
                          ))}

                          <Typography component="h3" variant="h4" align='center' >
                            Total: ${Number(total).toFixed(2)}
                          </Typography>

                        </Paper>
                        < ContinueButton />

                      </Grid>
                    </Grid>

                  </React.Fragment>
                )}
            </React.Fragment>)}

      </main>
    </React.Fragment>
  );
}

// Total:${card.subTotal}