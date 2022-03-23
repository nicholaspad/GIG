import { Box, ThemeProvider, Typography } from "@mui/material";
import PrimaryButtonCTA from "../components/buttons/PrimaryButtonCTA";
import SecondaryButtonCTA from "../components/buttons/SecondaryButtonCTA";
import { gigTheme } from "../src/Theme";

export default function Landing() {
  return (
    <ThemeProvider theme={gigTheme}>
      <Box sx={{ p: 3 }}>
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
        <PrimaryButtonCTA text="Big Primary CTA" size="big" to="/" />
        <br />
        <PrimaryButtonCTA text="Small Primary CTA" size="small" to="/" />
        <br />
        <SecondaryButtonCTA text="Big Secondary CTA" size="big" to="/" />
        <br />
        <SecondaryButtonCTA text="Small Secondary CTA" size="small" to="/" />
      </Box>
    </ThemeProvider>
  );
}
