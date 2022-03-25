import { Box, Typography } from "@mui/material";
import PrimaryButtonCTA from "../components/buttons/PrimaryButtonCTA";
import SecondaryButtonCTA from "../components/buttons/SecondaryButtonCTA";

export default function Landing() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontStyle="bold" color="primary.main">
        Primary color text
      </Typography>
      <Typography variant="h5" fontStyle="italic" mt={2} color="secondary.main">
        Secondary color text
      </Typography>
      <PrimaryButtonCTA text="Tasks" size="big" to="/tasks" />
      <br />
      <PrimaryButtonCTA text="My Tasks" size="small" to="/tasker/my-tasks" />
      <br />
      <SecondaryButtonCTA text="Big Secondary CTA" size="big" to="/" />
      <br />
      <SecondaryButtonCTA text="Small Secondary CTA" size="small" to="/" />
    </Box>
  );
}
