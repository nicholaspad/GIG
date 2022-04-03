import LaunchIcon from "@mui/icons-material/Launch";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import {
  Box,
  Container,
  Grid,
  Link,
  Rating,
  styled,
  Typography,
} from "@mui/material";
import router from "next/router";
import PrimaryButtonCTA from "../../../components/buttons/PrimaryButtonCTA";
import SecondaryButtonCTA from "../../../components/buttons/SecondaryButtonCTA";
import CustomizableGrayCard from "../../../components/common/CustomizableGrayCard";
import TaskerPageHeader from "../../../components/common/TaskerPageHeader";
import { TaskData } from "../../../components/tables/TasksTable";
import { gigTheme } from "../../../src/Theme";

export type TaskOverviewData = TaskData & {
  description: string;
  estimatedTime: number;
  requestorWallet: string;
  created: Date;
};

export default function TaskOverview() {
  const { taskId } = router.query;

  // TODO @nicholaspad hard-coded for now
  const data: TaskOverviewData = {
    task_id: 1,
    name: "Task 1",
    reward: 0.01343234,
    rating: 3.5,
    description: "Please complete my task!",
    estimatedTime: 8,
    requestorWallet: "0xBe09286A6F8763296066578B5E58d73b6f77b54e",
    created: new Date(),
  };

  function SectionTitle(props: { children: React.ReactNode }) {
    return (
      <Typography
        color="secondary"
        fontStyle="italic"
        fontWeight={400}
        fontSize={20}
        mt={3}
      >
        {props.children}
      </Typography>
    );
  }

  function SectionContent(props: { children: React.ReactNode }) {
    return (
      <Typography color="primary" fontWeight={400} fontSize={20} mt={1} mb={3}>
        {props.children}
      </Typography>
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

  return (
    <Container maxWidth="lg">
      <TaskerPageHeader
        title="Task Overview"
        subtitle="Confirm your task selection."
      />
      <CustomizableGrayCard sx={{ px: 5, py: 2.5 }}>
        <Grid
          container
          justifyContent="center"
          textAlign="center"
          spacing={1}
          py={2}
        >
          <Grid item sm={6}>
            <SectionTitle>Name</SectionTitle>
            <Typography color="primary" fontWeight={600} fontSize={25}>
              {data.name}
            </Typography>
            <SectionTitle>Description</SectionTitle>
            <SectionContent>{data.description}</SectionContent>
            <SectionTitle>Reward</SectionTitle>
            <Box
              borderRadius={2}
              width={230}
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              mt={1}
              mb={3}
              mx="auto"
              py={1}
              sx={{
                backgroundImage: `linear-gradient(90deg, ${gigTheme.palette.primaryCTA.primary}, ${gigTheme.palette.primaryCTA.secondary})`,
              }}
            >
              <Typography color="primary" fontWeight={400} fontSize={20}>
                {data.reward} ETH
              </Typography>
            </Box>
            <SectionTitle>Time to complete</SectionTitle>
            <SectionContent>Approx {data.estimatedTime} minutes</SectionContent>
          </Grid>
          <Grid item sm={6}>
            <SectionTitle>Requester rating</SectionTitle>
            <SectionContent>
              <StyledRating
                readOnly
                value={data.rating}
                size="large"
                precision={0.5}
                icon={<StarRoundedIcon fontSize="inherit" />}
                emptyIcon={<StarOutlineRoundedIcon fontSize="inherit" />}
              />
            </SectionContent>
            <SectionTitle>Requester wallet</SectionTitle>
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="center"
              mt={1}
              mb={3}
            >
              <Typography
                color="primary"
                fontWeight={400}
                fontSize={20}
                sx={{ alignItems: "center" }}
              >
                {data.requestorWallet.slice(0, 15)}...
              </Typography>
              <Link
                href={`https://etherscan.io/address/${data.requestorWallet}`}
                target="_blank"
              >
                <LaunchIcon sx={{ ml: 0.7, color: "secondary.main" }} />
              </Link>
            </Grid>
            <SectionTitle>Date created</SectionTitle>
            <SectionContent>
              {data.created.toISOString().split("T")[0]}
            </SectionContent>
          </Grid>
          <Grid item sm={12} display="flex" justifyContent="center" mt={2}>
            <Box mr={4}>
              <SecondaryButtonCTA text="Cancel" size="big" to="/browse-tasks" />
            </Box>
            <PrimaryButtonCTA
              text="Claim"
              size="big"
              to={`/tasker/task/${taskId}`}
            />
          </Grid>
        </Grid>
      </CustomizableGrayCard>
    </Container>
  );
}
