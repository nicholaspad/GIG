import { createTheme } from "@mui/material/styles";

// @team: If you add additional custom color categories, make sure
// to update the below `declare module` appropriately!
// See https://mui.com/customization/theming/#theme-provider for docs.
declare module "@mui/material/styles" {
  interface Palette {
    modal: Palette["primary"];
    ratingsStar: Palette["primary"];
    primaryCTA: Palette["text"];
    secondaryCTA: Palette["text"];
  }

  interface PaletteOptions {
    modal?: PaletteOptions["primary"];
    ratingsStar?: PaletteOptions["primary"];
    primaryCTA?: PaletteOptions["text"];
    secondaryCTA?: PaletteOptions["text"];
  }
}

export const gigTheme = createTheme({
  palette: {
    primary: {
      main: "#fafafa",
    },
    secondary: {
      main: "#A055FF",
    },
    background: {
      default: "#141414",
      paper: "#262626",
    },
    divider: "#D9D9D9",
    text: {
      disabled: "#9e9e9e",
    },
    info: {
      main: "#64B5F6",
    },
    success: {
      main: "#aed581",
    },
    warning: {
      main: "#FFD54F",
    },
    error: {
      main: "#E57373",
    },
    modal: {
      main: "#A055FF",
    },
    ratingsStar: {
      main: "#FFCB45",
    },
    primaryCTA: {
      primary: "#FF7586",
      secondary: "#6F86FF",
    },
    secondaryCTA: {
      primary: "#392c3e",
      secondary: "#1c1a26",
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  },
});
