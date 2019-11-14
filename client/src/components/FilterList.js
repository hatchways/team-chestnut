import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  nested: {
    paddingLeft: theme.spacing(4)
  }
}));

export default function FilteredList(props) {
  const classes = useStyles();
  const [open, setOpen] = useState({
    product: true,
    price: false
  });

  const [products, setProducts] = useState({
    all: true,
    cakes: false,
    cookies: false,
    cupcakes: false,
    macarons: false
  });

  const [pricing, setPricing] = useState({
    all: true,
    lessTen: false,
    tenTwenty: false,
    fourty: false,
    fourtyMore: false
  });

  const productTypes = [
    { label: "All", value: "all", checked: products.all },
    { label: "Cakes", value: "cakes", checked: products.cakes },
    { label: "Cookies", value: "cookies", checked: products.cookies },
    { label: "Cupcakes", value: "cupcakes", checked: products.cupcakes },
    { label: "Macarons", value: "macarons", checked: products.macarons }
  ];

  const priceTypes = [
    {
      label: "All",
      value: "all",
      min: 0,
      max: Number.MAX_SAFE_INTEGER,
      checked: pricing.all
    },
    {
      label: "Less than $10",
      value: "lessTen",
      max: 10,
      min: 0,
      checked: pricing.lessTen
    },
    {
      label: "$10-$20",
      value: "tenTwenty",
      min: 10,
      max: 20,
      checked: pricing.tenTwenty
    },
    {
      label: "$20-$40",
      value: "fourty",
      min: 20,
      max: 40,
      checked: pricing.fourty
    },
    {
      label: "$40 and more",
      value: "fourtyMore",
      min: 40,
      max: Number.MAX_SAFE_INTEGER,
      checked: pricing.fourtyMore
    }
  ];

  const handleClick = type => {
    setOpen({ ...open, [type]: !open[type] });
  };

  function filterProducts(event, index, type) {
    if (type === "product") {
      if (productTypes[index].value === "all" && event === true) {
        setProducts({
          all: true,
          cakes: false,
          cookies: false,
          cupcakes: false,
          macarons: false
        });
      } else {
        setProducts({
          ...products,
          all: false,
          [productTypes[index].value]: event
        });
      }
    }

    if (type === "price") {
      if (priceTypes[index].value === "all" && event === true) {
        setPricing({
          all: true,
          lessTen: false,
          tenTwenty: false,
          fourty: false,
          fourtyMore: false
        });
      } else {
        setPricing({
          ...pricing,
          all: false,
          [priceTypes[index].value]: event
        });
      }
    }
  }

  useEffect(() => {

    let parameters = { category: [], priceMin: 0, priceMax: 0 };
    let zeroRecorded = false;
    priceTypes.forEach(pro => {
      if (pro.checked === true) {
        if (pro.min === 0) {
          zeroRecorded = true;
          parameters.priceMin = pro.min;
        } else if (
          pro.min > parameters.priceMin &&
          zeroRecorded === false &&
          pro.min !== parameters.priceMax
        ) {
          parameters.priceMin = pro.min;
        }
        if (pro.max > parameters.priceMax) {
          parameters.priceMax = pro.max;
        }
      }
    });

    productTypes.forEach(pro => {
      if (pro.checked === true) {
        parameters.category.push(pro.label);
      }
    });

    if (parameters.category.length === 0) {
      setProducts({ ...products, all: true });
      parameters.category.push("All");
    } else if (parameters.priceMax === 0) {
      setPricing({ ...pricing, all: true });
      parameters.priceMax = Number.MAX_SAFE_INTEGER;
    }
    props.callBack(parameters);
  }, [pricing, products]);

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={classes.root}
    >
      <ListItem
        button
        onClick={() => {
          handleClick("product");
        }}
      >
        <ListItemText primary="PRODUCT TYPE" />
        {open.product ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open.product} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {productTypes.map((productType, i) => (
            <ListItem className={classes.nested} key={productType.label}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={productType.checked}
                    onChange={event =>
                      filterProducts(event.target.checked, i, "product")
                    }
                    value={productType.value}
                  />
                }
                label={productType.label}
              />
            </ListItem>
          ))}
        </List>
      </Collapse>

      <ListItem
        onClick={() => {
          handleClick("price");
        }}
      >
        <ListItemText primary="PRICE" />
        {open.price ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open.price} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {priceTypes.map((priceType, i) => (
            <ListItem className={classes.nested} key={priceType.label}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={priceType.checked}
                    onChange={event =>
                      filterProducts(event.target.checked, i, "price")
                    }
                    value={priceType.value}
                  />
                }
                label={priceType.label}
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </List>
  );
}
