// Define our button, but with the use of props.theme this time

// Define what props.theme will look like
export const defaultTheme = {
  input: {
    fontSize: "1em",
    focus: {
      border: {
        color: "#f26e21"
      }
    }
  },
  button: {
    backgroundColor: {
      primary: "#f26e21",
      secondary: "#3b5998;",
      error: "#dd4b39"
    },
    textColor: {
      primary: "white",
      secondary: "#f26e21"
    },
    fontSize: "0.8em",
    borderRadius: "40px",
    width: { primary: "150px" }
  },
  select: {
    fontSize: "1em"
  },
  anchor: {
    textColor: {
      primary: "#f26e21"
    },
    fontSize: "1em"
  },
  p: {
    fontSize: "1em"
  },
  header: {
    backgroundColor: "white",
    fontSize: "1.3em"
  }
};
