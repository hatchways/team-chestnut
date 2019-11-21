import React from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles(theme => ({
  conversation: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    border: "1px solid lightgrey"
  },
  profilePhoto: {
    height: "30px",
    width: "30px",
    borderRadius: "15px",
    backgroundColor: "grey",
    display: "inline"
  },
  profileName: {
    paddingLeft: theme.spacing(1)
  }
}));
export default function Messages() {
  const classes = useStyles();
  // dev data to be fetched later
  const conversations = [
    { user: "Mary Wills" },
    { user: "Scott Mackey" },
    { user: "Dorothy Irwin" },
    { user: "Daniel Wilson" },
    { user: "Christina Johnson" }
  ];
  return (
    <Grid container>
      <Grid container xs={3} direction="column" alignItems="stretch">
        {conversations.map(conversation => {
          return (
            <Grid container className={classes.conversation}>
              <Grid item className={classes.profilePhoto} />
              <Grid item className={classes.profileName}>{conversation.user}</Grid>
            </Grid>
          );
        })}
      </Grid>
      <Grid container xs={9}></Grid>
    </Grid>
  );
}
