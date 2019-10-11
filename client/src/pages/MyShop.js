import React from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles(theme => ({
  "@global": {
    ".MuiPaper-root": {
      borderRadius: "unset"
    }
  },
  root: {
    flexGrow: 1
  },
  shopDetails: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "100%",
    border: "0px"
  },
  coverPhoto: {
    height: "auto",
    width: "40vw"
  }
}));

export default function MyShop() {
  // material ui styles init
  const classes = useStyles();
  const coverPhotoSrc =
    "https://glutenfreecuppatea.co.uk/wp-content/uploads/2019/05/gluten-free-victoria-sponge-recipe-dairy-free-featured-1.jpg";
  const shopDetailsCopy = {
    title: "MAPLE BAKERY",
    description: `Welcome to my bakery! I've been baking for 8 years and have 
      recently decided to expand online. I specialize in wedding cakes and party favours. 
      Please contact me for more information!`
  };
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper className={classes.shopDetails}>
            <Typography>{shopDetailsCopy.title}</Typography>
            <Typography>{shopDetailsCopy.description}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <img
            src={coverPhotoSrc}
            alt="My Shop Cover"
            className={classes.coverPhoto}
          />
        </Grid>
      </Grid>
    </div>
  );
}
