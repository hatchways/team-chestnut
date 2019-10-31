import React, { useCallback } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useDropzone } from "react-dropzone";

function CoverDropzone() {
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag and drop some files here, or click to select files</p>
      )}
    </div>
  );
}

export default function EditCoverDialog(props) {
  return (
    <Dialog
      open={props.dialogOpenStatus}
      onClose={() => props.closeDialog()}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Edit Cover Photo</DialogTitle>
      <DialogContent>{CoverDropzone()}</DialogContent>
      <DialogActions>
        <Button onClick={() => props.closeDialog()} color="primary">
          Cancel
        </Button>
        <Button onClick={() => props.saveCover()} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
