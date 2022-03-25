import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import PrimaryButtonCTA from "../components/buttons/PrimaryButtonCTA";
import SecondaryButtonCTA from "../components/buttons/SecondaryButtonCTA";
import Navbar from "../components/navbar";

export default function Landing() {
  return (
    <Box sx={{ p: 3 }}>
      <Navbar
        username="user"
        status={0}
        walletAddress = "wallet address"
      />

      <Typography variant="h4" fontStyle="bold" color="primary.main">
        Primary color text
      </Typography>
      <Typography variant="h5" fontStyle="italic" mt={2} color="secondary.main">
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
  );
}
