import React, { useEffect, useState } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import FilteredList from "../components/FilterList";
import { fetchGet } from "../utils/ApiFetching";

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  heroContent: {
    padding: theme.spacing(5, 0, 0)
  },
  heroButtons: {
    marginTop: theme.spacing(4)
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
    paddingTop: "75%"
  },
  cardContent: {
    flexGrow: 1
  },
  [theme.breakpoints.between('sm', 'lg')]: {
    sticky:{
      position: 'sticky',
      top: '20px'
    }
  },
  fontweight:{
    fontWeight: 500
  }
  
  
}));

export default function Album() {
  const classes = useStyles();
  const [shopItems, setShopItems] = useState([

  ]);
  const [filters, setFilters] = useState(null);
  const callbackFunction = data => {
    setFilters(data);
  };

  useEffect(() => {
    let params;
    if (filters !== null) {
      if (filters.category[0] === "All") {
        params = {
          priceMin: filters.priceMin,
          priceMax: filters.priceMax
        };
      } else {
        params = {
          category: JSON.stringify(filters.category),
          priceMin: filters.priceMin,
          priceMax: filters.priceMax
        };
      }
      fetchGet("/shop/items", params).then((res, err) => {
        if (res !== 'Failed to fetch') {
          setShopItems(res);
        }
      });
    }
  }, [filters]);

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        <div className={classes.heroContent}>
          <Container maxWidth="xl">
            <Typography
              component="h2"
              variant="h3"
              align="left"
              color="textPrimary"
              gutterBottom
              className={classes.fontweight}
            >
              Discover Baking Goods
            </Typography>
          </Container>
        </div>
        <div>
          <Grid container className={classes.heroContent}>
            <Grid item xs={12} sm={3}>
              <Container maxWidth="xl" spacing={1} className={classes.sticky}>
                <Typography
                  component="h5"
                  variant="h6"
                  align="left"
                  color="textPrimary"
                  gutterBottom
                  className={classes.fontweight}
                >
                  FILTERS
                </Typography>
                <FilteredList callBack={callbackFunction}></FilteredList>
              </Container>
            </Grid>
            <Grid item xs={12} sm={9}>
              <Container className={classes.cardGrid} maxWidth="lg">
                <Grid container spacing={3}>
                  {shopItems.map((card, i) => (
                    <Grid item key={card._id} xs={12} sm={6} md={4}>
                      <Card className={classes.card} key={card._id}>
                        <CardMedia
                          className={classes.cardMedia}
                          image={card.photos[0]}
                          title={card.title}
                          key={card._id}
                        />
                        <CardContent className={classes.cardContent}>
                          <Typography align="center">{card.title}</Typography>
                          <Typography gutterBottom align="center">
                            ${card.price}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Container>
            </Grid>
          </Grid>
        </div>
      </main>
    </React.Fragment>
  );
}
