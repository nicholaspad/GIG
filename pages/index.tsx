import { Box, Container, Typography } from "@mui/material";
import Navbar from "../components/navbar/Navbar";
import PageTitle from "../components/common/PageTitle";
import { gigTheme } from "../src/Theme";

export default function Landing() {
  return (
    <>
      <PageTitle title={"Login"} />
      <Navbar />
      <Container maxWidth="md">
        <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
          <Typography
            fontWeight={700}
            color="primary"
            height="fit-content"
            component="div"
            sx={{
              fontSize: {
                lg: 250,
                md: 200,
                sm: 150,
                xs: 125,
              },
              backgroundImage: `linear-gradient(90deg, ${gigTheme.palette.primaryCTA.primary}, ${gigTheme.palette.primaryCTA.secondary})`,
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            G I G
          </Typography>
          <Typography
            color="primary"
            textAlign="center"
            fontWeight={500}
            sx={{
              fontSize: {
                lg: 28,
                md: 26,
                sm: 24,
                xs: 22,
              },
            }}
          >
            Take surveys. Earn crypto. The easiest way to get into web3.
          </Typography>
          <Typography
            color="secondary"
            textAlign="center"
            fontWeight={500}
            my={6}
            sx={{
              fontSize: {
                lg: 28,
                md: 26,
                sm: 24,
                xs: 22,
              },
            }}
          >
            Connect your wallet to get started.
          </Typography>
          <Box
            component="img"
            src="/metamask-logo.png"
            borderRadius={3}
            sx={{
              background: gigTheme.palette.primary.main,
              cursor: "pointer",
              transitionDuration: "0.2s",
              "&:hover": {
                transform: "scale(1.05)",
              },
              width: {
                lg: 280,
                md: 250,
                xs: 230,
              },
            }}
            // TODO @nicholaspad replace with Moralis authentication and remove Link
            onClick={() => {}}
          />
        </Box>
      </Container>
    </>
  );
}
