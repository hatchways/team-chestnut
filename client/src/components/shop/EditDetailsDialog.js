import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function DetailsDialog(props) {
  return (
    <Dialog
      open={props.shop.editDetailsDialogIsOpen}
      onClose={() => props.closeDialog()}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Edit Shop Details</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Shop Name"
          type="title"
          onChange={props.handleChange("title")}
          fullWidth
          defaultValue={props.shop.shopData.title}
        />
        <TextField
          autoFocus
          margin="dense"
          id="standard-multiline-flexible"
          label="Shop Description"
          type="description"
          onChange={props.handleChange("description")}
          fullWidth
          defaultValue={props.shop.shopData.description}
          multiline
          rowsMax="4"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.closeDialog()} color="primary">
          Cancel
        </Button>
        <Button onClick={() => props.saveDetails()} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
