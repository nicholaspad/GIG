import { Container, styled, Rating, Grid, Box } from "@mui/material";
import PrimaryButtonCTA from "../../../components/buttons/PrimaryButtonCTA";
import SecondaryButtonCTA from "../../../components/buttons/SecondaryButtonCTA";
import { Typography } from "@mui/material";
import GrayCard from "../../../components/common/DefaultGrayCard";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { gigTheme } from "../../../src/Theme";

export default function TaskCompleted() {
  return (
    <Container maxWidth="md">
      <GrayCard>
        <Box alignSelf="center">
          <Typography
            variant="h4"
            color="primary"
            textAlign="center"
            fontWeight={600}
          >
            Task Completed
          </Typography>
        </Box>
      </GrayCard>
      <GrayCard>
        <Box alignSelf="center">
          <Box display="flex" justifyContent="center" mt={2} mb={5}>
            <Typography variant="h6" fontWeight="normal" color="primary" mr={2}>
              Rate your experience:
            </Typography>
            <StyledRating
              sx={{ mx: 0 }}
              size="large"
              precision={0.5}
              icon={<StarRoundedIcon fontSize="inherit" />}
              emptyIcon={<StarOutlineRoundedIcon fontSize="inherit" />}
            />
          </Box>
          <hr
            style={{ border: `1px solid ${gigTheme.palette.secondary.main}` }}
          />
          <Typography
            variant="h6"
            fontWeight="normal"
            color="primary"
            textAlign="center"
            my={5}
          >
            When the requester approves your submission, you will receive a
            reward of:
          </Typography>
          <Box
            borderRadius={2}
            width="fit-content"
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            mx="auto"
            py={1}
            px={2}
            sx={{
              backgroundImage: `linear-gradient(90deg, ${gigTheme.palette.primaryCTA.primary}, ${gigTheme.palette.primaryCTA.secondary})`,
            }}
          >
            <Typography color="primary" fontWeight={400} fontSize={20}>
              {"5"} ETH
            </Typography>
          </Box>
          <Box display="flex" justifyContent="center" mt={5} mb={2}>
            <SecondaryButtonCTA
              text="My Tasks"
              size="big"
              to="/tasker/my-tasks"
            />
            <PrimaryButtonCTA
              text="Browse Tasks"
              size="big"
              to="/browse-tasks"
              sx={{ ml: 4 }}
            />
          </Box>
        </Box>
      </GrayCard>
    </Container>
  );
}

const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconFilled": {
    color: theme.palette.warning.main,
  },
  "& .MuiRating-iconEmpty": {
    color: theme.palette.primary.main,
    opacity: 0.3,
  },
}));
