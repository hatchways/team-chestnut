import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Roboto"',
    button: {
      borderRadius: "unset"
    }
  },
  palette: {
    primary: {
      light: "#0066ff",
      main: "#000000"
    },
    secondary: {
      main: "#90caf9",
      contrastText: "#000000"
    },
    background: {
      main: "#fff"
    }
  },
  secondary: "#1f1f1f",
  error: "#d8000c",
  bgcolor: "#f6f6f6"
});
