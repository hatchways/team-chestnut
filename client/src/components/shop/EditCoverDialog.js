import React, { useCallback, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dropzone from "./Dropzone";

export default function EditCoverDialog(props) {
  const [image, setImage] = useState("");
  return (
    <Dialog
      open={props.dialogOpenStatus}
      onClose={() => props.closeDialog()}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Edit Cover Photo</DialogTitle>
      <DialogContent>
        <Dropzone setImage={setImage} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.closeDialog()} color="primary">
          Cancel
        </Button>
        <Button onClick={() => props.saveCover(image)} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
