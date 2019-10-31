import React, { useEffect, useReducer } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import jwt from "jsonwebtoken";
import ShopBanner from "../components/shop/ShopBanner";
import ProductCard from "../components/shop/ProductCard";
import DetailsDialog from "../components/shop/DetailsDialog";
import shopReducer from "../components/shop/shopReducer";

const useStyles = makeStyles(theme => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  }
}));

export default function Shop() {
  const classes = useStyles();

  const [shop, dispatch] = useReducer(shopReducer, {
    shopData: {
      cover_photo: "",
      description: "",
      items: [{ title: "", photos: [""], price: "", isLiked: false }],
      title: "",
      user: ""
    },
    isMyShop: false,
    error: null,
    isLoading: false,
    shopDescriptionInput: "",
    shopTitleInput: "",
    editDetailsDialogOpen: false
  });
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
    const config = {
      headers: { "auth-token": token }
    };
    const data = {
      title: shop.shopTitleInput,
      description: shop.shopDescriptionInput
    };
    try {
      // Is it necessary to store the result value of the request in state?
      const updateStatus = await axios.put(
        `${UPDATE_DETAILS_API}${userid}`,
        data,
        config
      );
      dispatch({
        type: "SHOP_DETAILS_UPDATE_SUCCESS",
        data
      });
    } catch (err) {
      dispatch({ type: "SHOP_DETAILS_UPDATE_ERROR", error: err });
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
      dispatch({ type: "SHOP_TITLE_INPUT", title: event.target.value });
    }
    if (type === "description") {
      dispatch({
        type: "SHOP_DESCRIPTION_INPUT",
        description: event.target.value
      });
    }
  };
  const saveDetails = () => {
    updateDetails();
  };
  // because our seed data is not unique I had to use map index in the key
  return (
    <>
      <ShopBanner
        shop={shop}
        setDetailsDialogOpen={() =>
          dispatch({ type: "OPEN_EDIT_DETAILS_DIALOG" })
        }
      />
      <DetailsDialog
        saveDetails={saveDetails}
        closeDialog={() => dispatch({ type: "CLOSE_EDIT_DETAILS_DIALOG" })}
        dialogOpenStatus={shop.editDetailsDialogOpen}
        handleChange={handleChange}
        shop={shop}
      />
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          {shop.shopData.items.map((product, index) => (
            <ProductCard
              product={product}
              index={index}
              dispatch={dispatch}
              key={`${product.title}${product.price}${index}`}
            />
          ))}
        </Grid>
      </Container>
    </>
  );
}
