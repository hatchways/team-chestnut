import React from "react";
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

const useStyles = makeStyles(theme => ({
  productImg: {
    width: "16vw",
    height: "16vw",
    minWidth: "100px",
    minHeight: "100px"
  },
  productImgRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around"
  },
  addImgIcon: {
    fontSize: "75px"
  }
}));

export default function NewProduct(props) {
  const classes = useStyles();
  let mapArray = [];
  const imagePerRow = 6;
  for (let i = 0; i < imagePerRow; i += 1) {
    mapArray.push(i);
  }
  return (
    <>
      <Grid container xs={12} justify="flex-start">
        <Typography variant="h4" gutterBottom>
          Upload new product
        </Typography>
      </Grid>
      <Grid container component="main">
        <Grid container xs={12} sm={6} md={6} square>
          {mapArray.map(index => (
            <Grid
              container
              xs={4}
              sm={4}
              md={4}
              className={classes.productImg}
              key={index}
              justify="center"
              alignItems="center"
            >
              <AddIcon />
            </Grid>
          ))}
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Title"
            type="title"
            fullWidth
            variant="outlined"
          />
          <TextField
            autoFocus
            margin="dense"
            id="standard-multiline-flexible"
            label="Description"
            type="description"
            fullWidth
            multiline
            rows="4"
            variant="outlined"
          />
          <TextField
            autoFocus
            margin="dense"
            id="standard-multiline-flexible"
            label="Price"
            type="price"
            variant="outlined"
          />
          <FormControl variant="outlined">
            <InputLabel>Type of Product</InputLabel>
            <Select displayEmpty>
              <MenuItem value="" disabled>
                Placeholder
              </MenuItem>
              <MenuItem value={10}>Cake</MenuItem>
              <MenuItem value={20}>Cookie</MenuItem>
              <MenuItem value={30}>Pastry</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container xs={12} justify="center">
        <Button>UPLOAD</Button>
      </Grid>
    </>
  );
}
