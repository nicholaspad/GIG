import { Container, styled, Rating, Grid, Box } from "@mui/material";
import PrimaryButtonCTA from "../../components/buttons/PrimaryButtonCTA";
import SecondaryButtonCTA from "../../components/buttons/SecondaryButtonCTA";
import { Typography } from "@mui/material";
import GrayCard from "../../components/common/DefaultGrayCard";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

export default function taskCompleted() {
  return (
    <Container maxWidth="sm">
      <GrayCard>
        <Typography variant="h4" color="primary">
          Task completed
        </Typography>
        <Grid
          container
          display="flex"
          flexDirection="column"
          alignItems="center"
          sx={{ mt: "10%", mb: "5%" }}
        >
          <Typography variant="body2" color="primary">
            Please rate your experience with this task:
          </Typography>
          <StyledRating
            sx={{ mx: 0 }}
            size="large"
            defaultValue={3}
            precision={0.5}
            icon={<StarRoundedIcon fontSize="inherit" />}
            emptyIcon={<StarOutlineRoundedIcon fontSize="inherit" />}
          />
        </Grid>
        <Typography sx={{ mt: "3%" }} variant="body2" color="primary">
          You will receive a reward of{" "}
          <Typography
            variant="body2"
            color="primaryCTA.primary"
            display="inline"
          >
            0.5 ETH
          </Typography>{" "}
          when the requester approves your responses. Thank you for your time!
        </Typography>
        <Grid
          container
          sx={{
            py: "5%",
            display: "flex",
            justifyContent: "space-evenly",
            flexDirection: "row",
          }}
        >
          <SecondaryButtonCTA
            size="small"
            text="My Tasks"
            to="/tasker/my-tasks"
          />
          <PrimaryButtonCTA
            size="small"
            text="Browse Tasks"
            to="/browse-tasks"
          />
        </Grid>
      </GrayCard>
    </Container>
  );
}

const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconFilled": {
    color: theme.palette.warning.main,
  },
  "& .MuiRating-iconEmpty": {
    // color: theme.palette.primaryCTA.secondary,
    color: theme.palette.primary.main,
    opacity: 0.3,
  },
}));
