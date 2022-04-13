import LaunchIcon from "@mui/icons-material/Launch";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Link,
  Rating,
  styled,
  Typography,
} from "@mui/material";
import { gigTheme } from "../../src/Theme";
import { TaskOverviewData } from "../../src/Types";
import CustomizableGrayCard from "../common/CustomizableGrayCard";
import TaskerPageHeader from "../common/TaskerPageHeader";

export default function TaskOverviewTemplate(props: {
  data?: TaskOverviewData;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const { data } = props;

  function SectionTitle(props: { children: React.ReactNode }) {
    return (
      <Typography
        component="div"
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
      <Typography
        component="div"
        color="primary"
        fontWeight={400}
        fontSize={20}
        mt={1}
        mb={3}
      >
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
      <TaskerPageHeader title={props.title} subtitle={props.subtitle} />
      <CustomizableGrayCard sx={{ px: 5, py: 2.5, mb: 5 }}>
        <Grid
          container
          justifyContent="center"
          textAlign="center"
          spacing={1}
          py={2}
        >
          {data ? (
            <>
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
                <SectionContent>
                  Approx {data.estimatedTime} minutes
                </SectionContent>
              </Grid>
              <Grid item sm={6}>
                <SectionTitle>Requester rating</SectionTitle>
                <SectionContent>
                  {data.rating !== undefined && data.rating >= 0 ? (
                    <StyledRating
                      readOnly
                      value={data.rating}
                      size="large"
                      precision={0.5}
                      icon={<StarRoundedIcon fontSize="inherit" />}
                      emptyIcon={<StarOutlineRoundedIcon fontSize="inherit" />}
                    />
                  ) : (
                    <SectionContent>No ratings yet!</SectionContent>
                  )}
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
                {props.children}
              </Grid>
            </>
          ) : (
            <SectionContent>
              <Box display="flex" flexDirection="column" alignItems="center">
                <CircularProgress color="secondary" sx={{ mt: 2, mb: 3 }} />
                <Typography
                  textAlign="center"
                  color="primary"
                  fontWeight={400}
                  fontSize={20}
                >
                  Loading...
                </Typography>
              </Box>
            </SectionContent>
          )}
        </Grid>
      </CustomizableGrayCard>
    </Container>
  );
}
