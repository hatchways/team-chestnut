import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

export default function CoverDropzone(props) {
  const onDrop = useCallback(acceptedFiles => {
    props.setImages(acceptedFiles.slice(0, props.imageCount));
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  let promptText =
    props.imageCount > 1 ? ` up to ${props.imageCount} images` : " an image";
  return (
    <Grid container direction="column" {...getRootProps()} justify="center">
      <input {...getInputProps()} />
      <Grid
        container
        justify="center"
        style={props.images.length === 0 ? {} : { display: "none" }}
      >
        {isDragActive ? "Drag and drop or select" : "Select"}
        {promptText}
      </Grid>
      {props.images.length > 0
        ? props.images.map(image => {
            return (
              <Grid container justify="center" key={image.path}>
                {image.path}
              </Grid>
            );
          })
        : ""}
      <Grid container justify="center">
        <Button>Choose File</Button>
      </Grid>
    </Grid>
  );
}
