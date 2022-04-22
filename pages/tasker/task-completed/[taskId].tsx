import {
  Container,
  styled,
  Rating,
  Box,
  CircularProgress,
} from "@mui/material";
import PrimaryButtonCTA from "../../../components/buttons/PrimaryButtonCTA";
import SecondaryButtonCTA from "../../../components/buttons/SecondaryButtonCTA";
import { Typography } from "@mui/material";
import GrayCard from "../../../components/common/DefaultGrayCard";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { gigTheme } from "../../../src/Theme";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import PageHeader from "../../../components/common/PageHeader";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import {
  checkTaskerTaskHasNotRated,
  postTaskRating,
} from "../../../src/Database";

export default function TaskCompleted() {
  const router = useRouter();
  const { taskId } = router.query;
  const { isInitialized, Moralis, user } = useMoralis();
  const [openPosting, setOpenPosting] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);

  const handleRating = async (rating: number) => {
    if (!taskId || !isInitialized) return;
    if (rating <= 0 || rating > 5) return;

    setOpenPosting(true);
    // sleep to allow time for the overlay
    await new Promise((r) => setTimeout(r, 25));

    const res = await postTaskRating(Moralis, taskId as string, rating);
    if (!res.success) {
      setOpenPosting(false);
      alert(res.message);
      return;
    }

    alert(res.message);
    setOpenPosting(false);
  };

  useEffect(() => {
    if (!isInitialized || !user || !taskId || !router) return;

    const ethAddress = user.get("ethAddress");

    checkTaskerTaskHasNotRated(Moralis, taskId as string).then((res) => {
      if (!res) {
        alert(`Address ${ethAddress} not allowed to rate task ${taskId}.`);
        router.push("/browse-tasks");
        return;
      }

      setIsAllowed(true);
    });
  }, [isInitialized, Moralis, taskId, router, user]);

  if (!isAllowed) return <LoadingOverlay open={true} text="Verifying..." />;

  return (
    <>
      <PageHeader title="Task Completed" />
      <LoadingOverlay open={openPosting} text="Submitting Rating..." />
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
              <Typography
                variant="h6"
                fontWeight="normal"
                color="primary"
                mr={2}
              >
                Rate your experience:
              </Typography>
              <StyledRating
                sx={{ mx: 0 }}
                size="large"
                precision={0.5}
                icon={<StarRoundedIcon fontSize="inherit" />}
                emptyIcon={<StarOutlineRoundedIcon fontSize="inherit" />}
                onChange={(_, value) => {
                  if (!value) return;
                  handleRating(value);
                }}
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
    </>
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
