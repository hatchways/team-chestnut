import React from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
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
    height: "80vh",
    // max height not working
    maxHeight: "500px",
    justifyContent: "space-around"
  },
  editCoverBtn: {
    margin: theme.spacing(2)
  }
}));

export default function ShopBanner(props) {
  const classes = useStyles();
  return (
    <Grid container component="main">
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            {props.shop.shopData.title}
          </Typography>
          <Typography>{props.shop.shopData.description}</Typography>
          <Button
            fullWidth
            variant="contained"
            className={classes.contactOwner}
            onClick={
              props.shop.isMyShop
                ? () => props.setDetailsDialogOpen()
                : () => {
                    return null;
                  }
            }
          >
            {props.shop.isMyShop ? "Edit Shop Details" : "Contact Owner"}
          </Button>
        </div>
      </Grid>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        className={classes.image}
        style={{
          backgroundImage: props.coverChanged
            ? `url(${URL.createObjectURL(props.newCover[0])})`
            : `url(${props.shop.shopData.cover_photo})`
        }}
      >
        <Button
          className={classes.editCoverBtn}
          style={
            props.shop.isMyShop ? { display: "intial" } : { display: "none" }
          }
          onClick={
            props.shop.isMyShop
              ? () => props.setCoverDialogOpen()
              : () => {
                  return null;
                }
          }
        >
          Edit Cover
        </Button>
      </Grid>
    </Grid>
  );
}
