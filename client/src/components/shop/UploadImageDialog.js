import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dropzone from "./Dropzone";

export default function UploadImageDialog(props) {
  const [images, setImages] = useState("");
  const onSave = () => {
    props.saveImage(images);
  };
  if (props.saveSucess) {
    setImages("");
  }
  const onCancel = () => {
    props.closeDialog();
    setImages("");
  };
  return (
    <Dialog
      open={props.dialogOpenStatus}
      onClose={() => props.closeDialog()}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{props.dialogTitle}</DialogTitle>
      <DialogContent>
        <Dropzone
          setImages={setImages}
          images={images}
          imageCount={props.imageCount}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onCancel()} color="primary">
          Cancel
        </Button>
        <Button onClick={() => onSave()} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
