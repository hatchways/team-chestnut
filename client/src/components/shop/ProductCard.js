import React from "react";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import SettingsIcon from "@material-ui/icons/Settings";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles(() => ({
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
  },
  newProductIcon: {
    margin: "auto"
  }
}));

export default function ProductCard(props) {
  const classes = useStyles();
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card className={classes.card}>
        <div className={classes.cardHeader}>
          <SettingsIcon className={classes.cardSettingBtn} />
          <FavoriteIcon
            className={classes.cardLikedBtn}
            style={
              props.product.isLiked === false
                ? { display: "none" }
                : { display: "initial" }
            }
            onClick={() =>
              props.dispatch({ type: "PRODUCT_LIKED", likeIndex: props.index })
            }
          />
          <FavoriteBorderOutlinedIcon
            className={classes.cardLikedBtn}
            style={
              props.product.isLiked === false
                ? {
                    display: "initial"
                  }
                : { display: "none" }
            }
            onClick={() =>
              props.dispatch({ type: "PRODUCT_LIKED", likeIndex: props.index })
            }
          />
        </div>
        <CardMedia
          className={classes.cardMedia}
          image={props.product.photos[0]}
          title={props.product.title}
        />
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom variant="h5" component="h2">
            {props.product.title}
          </Typography>
          <Typography>{props.product.price}</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

export function NewProductCard(props) {
  const classes = useStyles();
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card className={classes.card} onClick={() => props.onNewProductClick()}>
        <CardContent className={classes.cardContent}>
          <AddIcon className={classes.newProductIcon} />
          <Typography gutterBottom variant="h5" component="h2">
            Add a new product
          </Typography>
          <Typography>$0</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
