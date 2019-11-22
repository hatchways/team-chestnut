import React, { useReducer } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { Button } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import jwt from "jsonwebtoken";
import axios from "axios";

import UploadImageDialog from "../components/shop/UploadImageDialog";

const useStyles = makeStyles(theme => ({
  productImg: {
    width: "15vw",
    height: "15vw",
    minWidth: "100px",
    minHeight: "100px",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    margin: theme.spacing(1),
    border: "1px solid lightgrey"
  },
  productImgRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around"
  },
  addImgIcon: {
    fontSize: "75px"
  },
  dropdownForm: {
    height: "40px",
    width: "95%",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
    marginLeft: "5%"
  },
  dropdownPlaceholder: {
    height: "40px",
    transform: "translate(14px, 12px) scale(1)"
  },
  dropdownItem: {
    height: "40px"
  },
  priceInput: {
    width: "100%"
  },
  pageTitle: {
    margin: theme.spacing(4)
  },
  uploadButton: {
    margin: theme.spacing(2)
  }
}));
function newProductReducer(state, action) {
  const urls = [];
  switch (action.type) {
    case "OPEN_IMAGE_DIALOG":
      return {
        ...state,
        uploadDialogOpenStatus: true
      };
    case "CLOSE_IMAGE_DIALOG":
      return {
        ...state,
        uploadDialogOpenStatus: false
      };
    case "SELECTED_PRODUCT_IMAGE":
      for (let i = 0; i < action.images.length; i += 1) {
        urls.push(URL.createObjectURL(action.images[i]));
      }
      return {
        ...state,
        productImages: [...state.productImages, ...action.images],
        productImageURLs: [...state.productImageURLs, ...urls],
        uploadDialogOpenStatus: false
      };
    case "USER_FORM_INPUT":
      return {
        ...state,
        [action.name]: action.value
      };
    case "UPLOAD_COMPLETED":
      return {
        ...state,
        uploadCompleted: true
      };
    default:
      return { ...state };
  }
}

export default function NewProduct(props) {
  const token = sessionStorage.getItem("token");
  const decoded = jwt.decode(token, { complete: true });
  const userid = decoded.payload._id;
  const imageCount = 6;
  const [state, dispatch] = useReducer(newProductReducer, {
    title: "",
    description: "",
    price: "",
    category: "",
    validatedStatus: false,
    uploadDialogOpenStatus: false,
    productImages: [],
    productImageURLs: [],
    isLoading: "",
    error: "",
    uploadCompleted: false
  });
  const classes = useStyles();
  const gridSpacing = 2;
  // should fetch catagories in future
  // Should user be able to create new catagories?
  const productCategories = ["Cake", "Pastry", "Cookie"];
  const handleImage = images => {
    dispatch({ type: "SELECTED_PRODUCT_IMAGE", images });
    return null;
  };
  const NEW_PRODUCT_API = "/shop/new-item/";
  const handleSave = async () => {
    // need to add front end validation
    const config = {
      headers: { "auth-token": token }
    };
    const bodyFormData = new FormData();
    for (let i = 0; i < state.productImages.length; i += 1) {
      bodyFormData.append(`image`, state.productImages[i]);
    }
    bodyFormData.append("title", state.title);
    bodyFormData.append("description", state.description);
    bodyFormData.append("price", state.price);
    bodyFormData.append("category", state.category);
    try {
      const updateStatus = await axios.post(
        `${NEW_PRODUCT_API}${userid}`,
        bodyFormData,
        config
      );
      dispatch({ type: "UPLOAD_COMPLETE" });
    } catch (err) {
      return err;
    }
  };
  if (state.isLoading) {
    return <div>Loading...</div>;
  }
  if (state.error !== "") {
    return <div>{state.error}</div>;
  }
  return (
    <>
      <UploadImageDialog
        saveImage={handleImage}
        dialogTitle="Upload product photos"
        closeDialog={() => dispatch({ type: "CLOSE_IMAGE_DIALOG" })}
        dialogOpenStatus={state.uploadDialogOpenStatus}
        imageCount={imageCount}
      />
      <Grid container xs={12} justify="flex-start" spacing={gridSpacing}>
        <Typography variant="h4" gutterBottom className={classes.pageTitle}>
          Upload new product
        </Typography>
      </Grid>
      <Grid container component="main" spacing={gridSpacing}>
        <Grid
          container
          xs={12}
          sm={6}
          md={6}
          square
          spacing={gridSpacing}
          justify="center"
        >
          {state.productImageURLs.map(item => (
            <Grid
              container
              xs={3}
              sm={3}
              md={3}
              className={classes.productImg}
              key={item}
              justify="center"
              alignItems="center"
              style={{
                backgroundImage: `url(${item})`
              }}
            />
          ))}
          <Grid
            container
            xs={3}
            sm={3}
            md={3}
            className={classes.productImg}
            justify="center"
            alignItems="center"
            onClick={() => dispatch({ type: "OPEN_IMAGE_DIALOG" })}
          >
            <AddIcon />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            variant="outlined"
            onChange={event =>
              dispatch({
                type: "USER_FORM_INPUT",
                name: event.target.name,
                value: event.target.value
              })
            }
          />
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            name="description"
            fullWidth
            multiline
            rows="4"
            variant="outlined"
            onChange={event =>
              dispatch({
                type: "USER_FORM_INPUT",
                name: event.target.name,
                value: event.target.value
              })
            }
          />
          <Grid
            container
            xs={12}
            className={classes.dropdownGrid}
            justify="space-between"
          >
            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                name="price"
                label="Price"
                variant="outlined"
                className={classes.priceInput}
                onChange={event =>
                  dispatch({
                    type: "USER_FORM_INPUT",
                    name: event.target.name,
                    value: event.target.value
                  })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl variant="outlined" className={classes.dropdownForm}>
                <InputLabel className={classes.dropdownPlaceholder}>
                  Type of Product
                </InputLabel>
                <Select
                  displayEmpty
                  className={classes.dropdownItem}
                  name="category"
                  onChange={event =>
                    dispatch({
                      type: "USER_FORM_INPUT",
                      name: event.target.name,
                      value: event.target.value
                    })
                  }
                >
                  <MenuItem value="" disabled>
                    Placeholder
                  </MenuItem>
                  {productCategories.map(category => {
                    return (
                      <MenuItem value={category} key={category}>
                        {category}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container xs={12} justify="center" variant="contained">
        <Button onClick={() => handleSave()} className={classes.uploadButton}>
          UPLOAD
        </Button>
      </Grid>
    </>
  );
}
