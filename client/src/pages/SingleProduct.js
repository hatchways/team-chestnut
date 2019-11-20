import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import { fetchGet } from "../utils/ApiFetching";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import { LoginContext } from "../contexts/LoginContext";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  fontweight: {
    fontWeight: 500
  },
  padding: {
    paddingTop: "60px",
    paddingBottom: "60px"
  },
  padding20: {
    paddingTop: "20px"
  },
  underline: {
    textDecoration: "underLine"
  },
  paddingBottom: {
    paddingTop: "20px",
    paddingBottom: "20px"
  }
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`
  };
}

export default function SingleProduct() {
  const classes = useStyles();
  let { productid } = useParams();
  const props = useContext(LoginContext);
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (productid !== null) {
      setLoading(true);
      fetchGet(`/shop/items/${productid}`).then((res, err) => {
        if (typeof res === "object") {
          setData([res.item]);
          setLoading(false);
        }
      });
    }
  }, []);

  const handleClick = event => {
    if (currentImage !== event) {
      setCurrentImage(event);
    }
  };
  const addtoCart = () => {
    const cart = localStorage.getItem("cart");
    let orders = {};

    if (cart === null) {
      orders[productid] = 1;
      orders["total"] = 1;
    } else {
      orders = JSON.parse(cart);
      if (orders[productid]) {
        orders[productid] = orders[productid] + 1;
      } else {
        orders[productid] = 1;
      }
      orders["total"] = orders["total"] + 1;
    }

    localStorage.setItem("cart", JSON.stringify(orders));
    props.setCart(orders);

    history.push("/checkout");

  };

  const MutilpleImages = photos => {
    return photos.photos.map((item, index) => (
      // <Grid container>
      <Grid item xs={2} md={12} key={index}>
        <div
          style={{
            height: "80px",
            maxWidth: " 100px",
            backgroundSize: "cover",
            backgroundImage: `url(${item})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            marginBottom: "10px"
          }}
          alt={item.title}
          onClick={() => handleClick(index)}
        ></div>
      </Grid>
    ));
  };

  const HeaderDetails = item => {
    return (
      <React.Fragment>
        <Typography
          component="h3"
          variant="h4"
          align="left"
          color="textPrimary"
          gutterBottom
          className={classes.fontweight}
        >
          {item.item.title}
        </Typography>
        <Typography>{`Catergory: ${item.item.category}`}</Typography>
      </React.Fragment>
    );
  };

  return (

    <Container maxWidth="xl">
      <Grid container className={classes.padding}>
        {(loading ? Array.from(new Array(1)) : data).map((item, index) => (
          <Box key={index} style={{ width: "100%" }}>
            {item ? (
              <React.Fragment>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={1}>

                    <Grid container>
                      <MutilpleImages photos={item.photos} />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={11} md={6}>
                    <div
                      style={{
                        height: "600px",
                        maxWidth: "100%",
                        backgroundSize: "cover",
                        backgroundImage: `url(${item.photos[currentImage]})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center center"
                      }}
                      alt={item.title}
                    ></div>
                  </Grid>
                  <Grid item sm={12} md={4}>
                    <HeaderDetails item={item} />
                    <Typography
                      display="block"
                      variant="caption"
                      color="textSecondary"
                      className={classes.padding20}
                      noWrap
                    >
                      {item.description}
                    </Typography>
                    <Typography
                      component="h5"
                      variant="h6"
                      color="textPrimary"
                      className={classes.padding20}
                    >
                      {`CAD ${item.price}.00`}
                    </Typography>

                    <Typography className={classes.paddingBottom}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={addtoCart}
                        disabled={false}
                      >
                        ADD TO CART
                      </Button>
                    </Typography>
                    <Typography variant="caption" className={classes.padding20}>
                      Have any questions about the item?{" "}
                    </Typography>
                    <Link
                      href="#"
                      variant="caption"
                      className={classes.underline}
                    >
                      Send a message
                    </Link>
                    <Typography variant="caption" display="block">
                      This seller usally responds within a few hours.
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item sm={12} className={classes.padding}>
                  <AppBar position="static" color="inherit">
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      indicatorColor="primary"
                      textColor="primary"
                      variant="fullWidth"
                    >
                      <Tab label="Description" {...a11yProps(0)} />
                      <Tab label="Shipping and Delivery" {...a11yProps(1)} />
                      <Tab label="Reviews" {...a11yProps(2)} />
                    </Tabs>
                  </AppBar>
                  <TabPanel value={value} index={0}>
                    <HeaderDetails item={item} />
                    <Typography
                      display="block"
                      variant="caption"
                      color="textSecondary"
                      className={classes.padding20}
                    >
                      {item.description}
                    </Typography>
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    No Shipping details yet
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    No Reviews yet
                  </TabPanel>
                </Grid>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Skeleton variant="rect" width={210} height={118} />
                <Skeleton />
                <Skeleton width="60%" />
              </React.Fragment>
            )}
          </Box>
        ))}
      </Grid>
    </Container>
  );
}
