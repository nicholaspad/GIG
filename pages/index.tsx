import { Box, ThemeProvider, Typography } from "@mui/material";
import { gigTheme } from "../components/Theme";

export default function Landing() {
  return (
    <ThemeProvider theme={gigTheme}>
      <Box sx={{ backgroundColor: "background.default", p: 3 }}>
        <Typography variant="h4" fontStyle="bold" color="primary.main">
          Primary color text
        </Typography>
        <Typography
          variant="h5"
          fontStyle="italic"
          mt={2}
          color="secondary.main"
        >
          Secondary color text
        </Typography>
      </Box>
    </ThemeProvider>
  );
}
