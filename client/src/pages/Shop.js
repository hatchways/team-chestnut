import React, { useEffect, useReducer, useState } from "react";
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
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import jwt from "jsonwebtoken";

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

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        error: null,
        isMyShop: action.payload.user._id === action.user,
        shopData: {
          ...action.payload.shop,
          items: action.payload.shop.items.map(product => {
            return { ...product, isLiked: false };
          })
        }
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    case "PRODUCT_LIKED":
      return {
        ...state,
        shopData: {
          ...state.shopData,
          items: state.shopData.items.map((product, index) => {
            return index === action.likeIndex
              ? {
                  ...product,
                  isLiked: !product.isLiked
                }
              : product;
          })
        }
      };
    default:
      return null;
  }
};

export default function Shop() {
  // material ui styles init
  const classes = useStyles();

  const [shop, dispatch] = useReducer(dataFetchReducer, {
    shopData: {
      cover_photo: "",
      description: "",
      items: [{ title: "", photos: [""], price: "", isLiked: false }],
      title: "",
      user: ""
    },
    isMyShop: false,
    error: null,
    isLoading: false
  });
  const [editDetailsOpen, setEditDetailsOpen] = useState(false);
  const [shopDescription, setShopDescription] = useState("");
  const [shopTitle, setShopTitle] = useState("");

  // fetch shop data
  const token = localStorage.getItem("token");
  const USER_API = "http://localhost:3001/users/";
  // user id will be from userContext in the future
  const decoded = jwt.decode(token, { complete: true });
  const userid = decoded.payload._id;
  useEffect(() => {
    async function fetchShop() {
      try {
        const result = await axios.get(`${USER_API}${userid}`, {
          headers: { "auth-token": token }
        });
        dispatch({
          type: "FETCH_SUCCESS",
          payload: result.data,
          user: userid
        });
      } catch (err) {
        dispatch({ type: "FETCH_FAILURE", error: err.message });
      }
    }
    dispatch({ type: "FETCH_INIT" });

    fetchShop();
  }, []);
  const UPDATE_DETAILS_API = "http://localhost:3001/shop/details-update/";
  async function updateDetails() {
    try {
      const updateStatus = await axios.put(`${UPDATE_DETAILS_API}${userid}`, {
        headers: { "auth-token": token },
        body: { title: shopTitle, description: shopDescription }
      });
      console.log(updateStatus);
      return updateStatus;
    } catch (err) {
      return err;
    }
  }
  if (shop.isLoading) {
    return <div>Loading...</div>;
  }
  if (shop.error !== null) {
    return <div>{shop.error}</div>;
  }
  const handleChange = type => event => {
    if (type === "title") {
      // setTitleError(false);
      setShopTitle(event.target.value);
    }
    if (type === "description") {
      // setDescriptionError(false);
      setShopDescription(event.target.value);
    }
  };
  const saveDetails = () => {
    updateDetails();
    setEditDetailsOpen(false);
  };
  // because our seed data is repetitive I had to use map index in the key
  return (
    <>
      <Grid container component="main">
        <CssBaseline />

        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              {shop.shopData.title}
            </Typography>
            <Typography className={classes.shopDescription}>
              {shop.shopData.description}
            </Typography>
            <Button
              fullWidth
              variant="contained"
              className={classes.contactOwner}
              onClick={
                shop.isMyShop
                  ? () => setEditDetailsOpen(true)
                  : () => {
                      return null;
                    }
              }
            >
              {shop.isMyShop ? "Edit Shop Details" : "Contact Owner"}
            </Button>
          </div>
        </Grid>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          className={classes.image}
          style={{ backgroundImage: `url(${shop.shopData.cover_photo})` }}
        >
          <Button
            className={classes.editCoverBtn}
            style={shop.isMyShop ? { display: "intial" } : { display: "none" }}
          >
            Edit Cover
          </Button>
        </Grid>
      </Grid>
      <Dialog
        open={editDetailsOpen}
        onClose={() => setEditDetailsOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit Shop Details</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Shop Name"
            type="title"
            onChange={handleChange("title")}
            fullWidth
            defaultValue={shop.shopData.title}
          />
          <TextField
            autoFocus
            margin="dense"
            id="standard-multiline-flexible"
            label="Shop Description"
            type="description"
            onChange={handleChange("description")}
            fullWidth
            defaultValue={shop.shopData.description}
            multiline
            rowsMax="4"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDetailsOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => saveDetails()} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          {shop.shopData.items.map((product, index) => (
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
                      product.isLiked === false
                        ? { display: "none" }
                        : { display: "initial" }
                    }
                    onClick={() =>
                      dispatch({ type: "PRODUCT_LIKED", likeIndex: index })
                    }
                  />
                  <FavoriteBorderOutlinedIcon
                    className={classes.cardLikedBtn}
                    style={
                      product.isLiked === false
                        ? {
                            display: "initial"
                          }
                        : { display: "none" }
                    }
                    onClick={() =>
                      dispatch({ type: "PRODUCT_LIKED", likeIndex: index })
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
