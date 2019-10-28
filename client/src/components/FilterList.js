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
  const [open, setOpen] = useState(true);
  const [openPrice, setOpenPrice] = useState(false);
  const [allProducts, setAllProducts] = useState(true);
  const [cakes, setCakes] = useState(false);
  const [cookies, setCookies] = useState(false);
  const [cupcakes, setCupcakes] = useState(false);
  const [macarons, setMacarons] = useState(false);
  const [allPrices, setAllPrices] = useState(true);
  const [lessTen, setLessTen] = useState(false);
  const [tenTwenty, setTenTwenty] = useState(false);
  const [fourty, setFourty] = useState(false);
  const [fourtyMore, setFourtyMore] = useState(false);
  const [dataChanged, setDataChanged] = useState(0);

  const handleClick = type => {
    if (type === "product") {
      setOpen(!open);
    }
    if (type === "price") {
      setOpenPrice(!openPrice);
    }
  };

  const productTypes = [
    { label: "All", value: "All", checked: allProducts, set: setAllProducts },
    { label: "Cakes", value: "Cakes", checked: cakes, set: setCakes },
    { label: "Cookies", value: "Cookies", checked: cookies, set: setCookies },
    {
      label: "Cupcakes",
      value: "Cupcakes",
      checked: cupcakes,
      set: setCupcakes
    },
    {
      label: "Macarons",
      value: "Macarons",
      checked: macarons,
      set: setMacarons
    }
  ];

  const priceTypes = [
    {
      label: "All",
      value: "All",
      checked: allPrices,
      set: setAllPrices,
      min: 0,
      max: Number.MAX_SAFE_INTEGER
    },
    {
      label: "Less than $10",
      value: "<10",
      checked: lessTen,
      set: setLessTen,
      max: 10,
      min: 0
    },
    {
      label: "$10-$20",
      value: "10-20",
      checked: tenTwenty,
      set: setTenTwenty,
      min: 10,
      max: 20
    },
    {
      label: "$20-$40",
      value: "20-40",
      checked: fourty,
      set: setFourty,
      min: 20,
      max: 40
    },
    {
      label: "$40 and more",
      value: "40>",
      checked: fourtyMore,
      set: setFourtyMore,
      min: 40,
      max: Number.MAX_SAFE_INTEGER
    }
  ];

  function filterProducts(event, index, type) {
    if (type === "product") {
      if (productTypes[index].value === "All" && event === true) {
        setAllProducts(true);
        setCakes(false);
        setCookies(false);
        setCupcakes(false);
        setMacarons(false);
      } else {
        setAllProducts(false);
        productTypes[index].set(event);
      }
    }

    if (type === "price") {
      if (priceTypes[index].value === "All" && event === true) {
        setAllPrices(true);
        setLessTen(false);
        setTenTwenty(false);
        setFourty(false);
        setFourtyMore(false);
      } else if (priceTypes[index].value === "40>" && event === true) {
        setAllPrices(false);
        setLessTen(false);
        setTenTwenty(false);
        setFourty(false);
        priceTypes[index].set(event);
      } else {
        setAllPrices(false);
        setFourtyMore(false);
        priceTypes[index].set(event);
      }
    }
    setDataChanged(dataChanged + index + 1);
  }

  useEffect(() => {
    let data = { category: [], priceMin: 0, priceMax: 0 };
    let zeroRecorded = false;
    priceTypes.forEach(pro => {
      if (pro.checked === true) {
        if (pro.min === 0) {
          zeroRecorded = true;
          data.priceMin = pro.min;
        } else if (
          pro.min > data.priceMin &&
          zeroRecorded === false &&
          pro.min !== data.priceMax
        ) {
          data.priceMin = pro.min;
        }
        if (pro.max > data.priceMax) {
          data.priceMax = pro.max;
        }
      }
    });

    productTypes.forEach(pro => {
      if (pro.checked === true) {
        data.category.push(pro.value);
      }
    });

    if (data.category.length === 0) {
      setAllProducts(true);
      data.category.push("All");
    } else if (data.priceMax === 0) {
      setAllPrices(true);
      data.priceMax = Number.MAX_SAFE_INTEGER;
    }

    props.callBack(data);
  }, [dataChanged]);

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
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {productTypes.map((productType, i) => (
            <ListItem className={classes.nested} key={productType.label}>
              <FormControlLabel
                control={
                  <Checkbox
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
        {openPrice ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={openPrice} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {priceTypes.map((priceType, i) => (
            <ListItem className={classes.nested} key={priceType.label}>
              <FormControlLabel
                control={
                  <Checkbox
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
