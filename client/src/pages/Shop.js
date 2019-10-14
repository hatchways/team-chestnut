import React, { useContext, useState } from "react";
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
import { LoginContext } from "../contexts/LoginContext";

const useStyles = makeStyles(theme => ({
  image: {
    backgroundImage:
      "url(https://glutenfreecuppatea.co.uk/wp-content/uploads/2019/05/gluten-free-victoria-sponge-recipe-dairy-free-featured-1.jpg)",
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

  // data to use until fetch is set up
  const shopDetailsCopy = {
    title: "MAPLE BAKERY",
    description: `Welcome to my bakery! I've been baking for 8 years and have 
      recently decided to expand online. I specialize in wedding cakes and party favours. 
      Please contact me for more information!`
  };
  const products = [
    {
      name: "Rose Wedding Cake",
      image:
        "https://asset1.cxnmarksandspencer.com/is/image/mands/SD_FD_F09A_00161435_NC_X_EC_0?$PDP_MAIN_CAR_LG$",
      price: "$120"
    },
    {
      name: "4-Tier Pink Roses Wedding Cake",
      image:
        "https://secureservercdn.net/160.153.137.20/bd4.bc0.myftpupload.com/wp-content/uploads/2018/11/RachelFrancis-238.jpg",
      price: "$120"
    }
  ];
  const [cardLiked, setCardLiked] = useState(
    new Array(products.length).fill(false)
  );
  // add logic in future for determining whether edit button is shown
  const [isMyShop, setIsMyShop] = useState(true);
  return (
    <>
      <Grid container component="main">
        <CssBaseline />

        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              {shopDetailsCopy.title}
            </Typography>
            <Typography className={classes.shopDescription}>
              {shopDetailsCopy.description}
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
        <Grid item xs={false} sm={4} md={7} className={classes.image}>
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
          {products.map((card, index) => (
            <Grid item key={`${card.name}${card.price}`} xs={12} sm={6} md={4}>
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
                  image={card.image}
                  title={card.title}
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {card.name}
                  </Typography>
                  <Typography>{card.price}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
