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
import { fetchGet } from "../utils/apiFetching";

const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  heroContent: {
    padding: theme.spacing(5, 0, 6)
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
    paddingTop: "56.25%" // 16:9
  },
  cardContent: {
    flexGrow: 1
  },
  filter: {
    position: "sticky",
    top: 20
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

      fetchGet("http://localhost:3001/shop/items", params).then((res, err) => {
        if (res !== 'Failed to fetch') {
          setShopItems(res);
        }
        console.log(res)
      });
    }
  }, [filters]);

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="xl">
            <Typography
              component="h1"
              variant="h2"
              align="left"
              color="textPrimary"
              gutterBottom
            >
              Discover Baking Goods
            </Typography>
          </Container>
        </div>
        <div>
          <Grid container className={classes.heroContent}>
            <Grid item xs={3} className={classes.filter}>
              <Container maxWidth="xl" spacing={1}>
                <Typography
                  component="h4"
                  variant="h5"
                  align="left"
                  color="textPrimary"
                  gutterBottom
                >
                  FILTERS
                </Typography>

                <FilteredList callBack={callbackFunction}></FilteredList>
              </Container>
            </Grid>
            <Grid item xs={9}>
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
