import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import SettingsIcon from "@material-ui/icons/Settings";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  image: {
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100vh",
    justifyContent: "space-around"
  },
  editCoverBtn: {
    margin: theme.spacing(2)
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    paddingTop: "56.25%" // 16:9
  },
  cardContent: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "black",
    color: "white"
  },
  cardSettingBtn: {
    position: "relative",
    left: "100%",
    transform: "translate(-100%,0)",
    "&:hover": {
      color: "grey"
    }
  },
  cardLikedBtn: {
    position: "relative",
    transform: "translate(-100%,0)",
    "&:hover": {
      color: "grey"
    }
  },
  cardHeader: {
    height: "0px",
    width: "100%"
  }
}));

export default function Shop() {
  // material ui styles init
  const classes = useStyles();

  const [shop, setShop] = useState({
    cover_photo: "",
    description: "",
    items: [{ title: "", photos: [""], price: "" }],
    title: "",
    user: ""
  });
  const [isMyShop, setIsMyShop] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [cardLiked, setCardLiked] = useState(
    new Array(shop.items.length).fill(false)
  );
  // fetch shop data
  const token = localStorage.getItem("token");
  const USER_API = "http://localhost:3001/users/";
  // user id will be from userContext in the future
  const userid = "5da4c98f912176179cb35e43";
  useEffect(() => {
    async function fetchShop() {
      try {
        const result = await axios.get(`${USER_API}${userid}`, {
          params: { userid },
          headers: { "auth-token": token }
        });
        setShop(result.data.shop);
        setIsLoading(false);
      } catch (err) {
        setError(err);
      }
    }
    setIsLoading(true);
    fetchShop();
    // both of these do not work for now
    // need them to run after setShop() has been updated with fetched data
    // adding shop to useEffect dependency made it rerender continually
    setCardLiked(new Array(shop.items.length).fill(false));
    setIsMyShop(userid === shop.user);
  }, []);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error !== null) {
    return <div>{error}</div>;
  }
  // because our seed data is repetitive I had to use map index in the key
  // to avoid error being thrown
  // Could also probably restructure this code with more functions
  return (
    <>
      <Grid container component="main">
        <CssBaseline />

        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              {shop.title}
            </Typography>
            <Typography className={classes.shopDescription}>
              {shop.description}
            </Typography>
            <Button
              fullWidth
              variant="contained"
              className={classes.contactOwner}
            >
              Contact Owner
            </Button>
          </div>
        </Grid>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          className={classes.image}
          style={{ backgroundImage: `url(${shop.cover_photo})` }}
        >
          <Button
            className={classes.editCoverBtn}
            style={isMyShop ? { display: "intial" } : { display: "none" }}
          >
            Edit Cover
          </Button>
        </Grid>
      </Grid>
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          {shop.items.map((product, index) => (
            <Grid
              item
              key={`${product.title}${product.price}${index}`}
              xs={12}
              sm={6}
              md={4}
            >
              <Card className={classes.card}>
                <div className={classes.cardHeader}>
                  <SettingsIcon className={classes.cardSettingBtn} />
                  <FavoriteIcon
                    className={classes.cardLikedBtn}
                    style={
                      cardLiked[index] === false
                        ? { display: "none" }
                        : { display: "initial" }
                    }
                    onClick={() =>
                      setCardLiked(
                        cardLiked.map((like, i) => {
                          return i === index ? !like : like;
                        })
                      )
                    }
                  />
                  <FavoriteBorderOutlinedIcon
                    className={classes.cardLikedBtn}
                    style={
                      cardLiked[index] === false
                        ? {
                            display: "initial"
                          }
                        : { display: "none" }
                    }
                    onClick={() =>
                      setCardLiked(
                        cardLiked.map((like, i) => {
                          return i === index ? !like : like;
                        })
                      )
                    }
                  />
                </div>
                <CardMedia
                  className={classes.cardMedia}
                  image={product.photos[0]}
                  title={product.title}
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {product.title}
                  </Typography>
                  <Typography>{product.price}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
