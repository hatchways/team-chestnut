import React, { useEffect, useReducer } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import jwt from "jsonwebtoken";
import ShopBanner from "../components/shop/ShopBanner";
import ProductCard from "../components/shop/ProductCard";
import EditDetailsDialog from "../components/shop/EditDetailsDialog";
import shopReducer from "../components/shop/shopReducer";
import EditCoverDialog from "../components/shop/EditCoverDialog";

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
    editDetailsDialogIsOpen: false,
    editCoverDialogIsOpen: false,
    coverImageChanged: false
  });
  // fetch shop data
  const token = localStorage.getItem("token");

  const USER_API = "/users/";
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
  }, [shop.coverImageChanged]);
  const UPDATE_DETAILS_API = "/shop/details/";
  async function updateDetails() {
    const config = {
      headers: { "auth-token": token }
    };
    const data = {
      title: shop.shopTitleInput,
      description: shop.shopDescriptionInput
    };
    try {
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
  const UPDATE_COVER_API = "/shop/cover/";
  const updateCover = async image => {
    const config = {
      headers: { "auth-token": token }
    };
    const bodyFormData = new FormData();
    bodyFormData.append("image", image);
    try {
      const updateStatus = await axios.put(
        `${UPDATE_COVER_API}${userid}`,
        bodyFormData,
        config
      );
      dispatch({ type: "COVER_IMAGE_CHANGED" });
    } catch (err) {
      return err;
    }
  };
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
  const saveCover = image => {
    updateCover(image);
  };
  // because our seed data is not unique I had to use map index in the key
  return (
    <>
      <ShopBanner
        shop={shop}
        setDetailsDialogOpen={() =>
          dispatch({ type: "OPEN_EDIT_DETAILS_DIALOG" })
        }
        setCoverDialogOpen={() => dispatch({ type: "OPEN_EDIT_COVER_DIALOG" })}
      />
      <EditDetailsDialog
        saveDetails={saveDetails}
        closeDialog={() => dispatch({ type: "CLOSE_EDIT_DETAILS_DIALOG" })}
        handleChange={handleChange}
        shop={shop}
      />
      <EditCoverDialog
        saveCover={saveCover}
        closeDialog={() => dispatch({ type: "CLOSE_EDIT_COVER_DIALOG" })}
        dialogOpenStatus={shop.editCoverDialogIsOpen}
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
