import React, { useReducer } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(theme => ({
  conversation: {
    margin: theme.spacing(1),
    padding: theme.spacing(1)
  },
  profilePhoto: {
    height: "30px",
    width: "30px",
    borderRadius: "15px",
    backgroundColor: "grey",
    display: "inline",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  profileName: {
    paddingLeft: theme.spacing(1)
  },
  inboxTitle: {
    margin: theme.spacing(2)
  },
  chat: {
    margin: theme.spacing(2)
  },
  inboxGrid: {
    margin: theme.spacing(2)
  },
  messageField: {
    alignSelf: "flex-end"
  }
}));
function messagesReducer(state, action) {
  switch (action.type) {
    case "CHANGE_CHAT":
      return {
        ...state,
        currentChatIndex: action.newChatIndex
      };
    case "MESSAGE_INPUT":
      return {
        ...state,
        conversations: [
          ...state.conversations.slice(0, action.conversationIndex),
          {
            ...state.conversations[action.conversationIndex],
            unsentMessage: action.message
          },
          ...state.conversations.slice(action.conversationIndex + 1)
        ]
      };
    default:
      return { ...state };
  }
}
export default function Messages() {
  const classes = useStyles();
  const [state, dispatch] = useReducer(messagesReducer, {
    currentChatIndex: 0,
    conversations: [
      {
        firstName: "Mary",
        lastName: "Wills",
        photo: "https://tinyurl.com/vtm9jeq",
        unsentMessage: "",
        messageHistory: []
      },
      {
        firstName: "Scott",
        lastName: "Mackey",
        photo: "https://tinyurl.com/tb7vgl3",
        unsentMessage: "",
        messageHistory: []
      },
      {
        firstName: "Dorothy",
        lastName: "Irwin",
        photo: "https://tinyurl.com/r5jl2a2",
        unsentMessage: "",
        messageHistory: []
      },
      {
        firstName: "Daniel",
        lastName: " Wilson",
        photo: "https://tinyurl.com/uewtgys",
        unsentMessage: "",
        messageHistory: []
      },
      {
        firstName: "Christina",
        lastName: "Johnson",
        photo: "https://tinyurl.com/wqtrgb9",
        unsentMessage: "",
        messageHistory: []
      }
    ]
  });
  const handleChange = conversationIndex => event => {
    dispatch({
      type: "MESSAGE_INPUT",
      conversationIndex,
      message: event.target.value
    });
  };
  return (
    <Grid container>
      <Grid
        container
        xs={3}
        direction="column"
        alignItems="stretch"
        className={classes.inboxGrid}
      >
        <Grid item className={classes.inboxTitle}>
          <Typography variant="h5" gutterBottom>
            Inbox Messages
          </Typography>
        </Grid>
        {state.conversations.map((conversation, index) => {
          return (
            <Grid
              container
              className={classes.conversation}
              style={
                state.currentChatIndex === index
                  ? { border: "1px solid lightgrey" }
                  : { border: "1px solid rgba(0, 0, 0, 0)" }
              }
              onClick={() =>
                dispatch({ type: "CHANGE_CHAT", newChatIndex: index })
              }
              key={`${conversation.firstName} ${conversation.lastName}`}
            >
              <Grid
                item
                className={classes.profilePhoto}
                style={{
                  backgroundImage: `url(${conversation.photo})`
                }}
              />
              <Grid item className={classes.profileName}>
                {`${conversation.firstName} ${conversation.lastName}`}
              </Grid>
            </Grid>
          );
        })}
      </Grid>
      <Grid container xs={8} direction="column" className={classes.chat}>
        <Grid container>
          <Grid
            item
            className={classes.profilePhoto}
            style={{
              backgroundImage: `url(${state.conversations[state.currentChatIndex].photo})`
            }}
          />
          <Grid item>
            <Typography
              variant="h6"
              gutterBottom
              className={classes.profileName}
            >
              {`${state.conversations[state.currentChatIndex].firstName} ${state.conversations[state.currentChatIndex].lastName}`}
            </Typography>
          </Grid>
        </Grid>
        <Grid container xs={8}></Grid>
        <Grid container>
          <Grid item xs={9}>
            <TextField
              autoFocus
              margin="dense"
              id="standard-multiline-flexible"
              type="message"
              onChange={handleChange(state.currentChatIndex)}
              fullWidth
              label={`Reply to ${state.conversations[state.currentChatIndex].firstName}`}
              value={state.conversations[state.currentChatIndex].unsentMessage}
              multiline
              rowsMax="4"
            />
          </Grid>
          <Grid item xs={3}>
            <Button>Send</Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
