import { Box, CircularProgress, Container, Typography } from "@mui/material";
import MoralisType from "moralis";
import router from "next/router";
import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import Navbar from "../components/navbar/Navbar";
import PageTitle from "../components/common/PageTitle";
import { maybeMakeNewUser } from "../src/Database";
import { gigTheme } from "../src/Theme";

export default function Landing() {
  const {
    authenticate,
    isAuthenticated,
    isAuthenticating,
    authError,
    user,
    Moralis,
  } = useMoralis();

  useEffect(() => {
    if (!isAuthenticated || authError || !user) return;

    maybeMakeNewUser(Moralis, user.get("ethAddress")).then(
      (res: MoralisType.Object) => {
        console.log(`Logged in as ${res.get("ethAddress")}`);
        // TODO @nicholaspad replace pushed link
        router.push("/tasks");
      }
    );
  }, [isAuthenticated]);

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
              cursor: isAuthenticating ? "progress" : "pointer",
              pointerEvents: isAuthenticating ? "none" : "auto",
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
            onClick={() => {
              authenticate({ signingMessage: "GIG Authentication" });
            }}
          />
          {isAuthenticating && (
            <>
              <CircularProgress color="secondary" sx={{ mt: 6 }} />
              <Typography
                color="secondary"
                textAlign="center"
                fontWeight={500}
                mt={2}
                sx={{
                  fontSize: {
                    lg: 20,
                    md: 18,
                    sm: 16,
                    xs: 14,
                  },
                }}
              >
                Logging in...
              </Typography>
            </>
          )}
          {authError && (
            <Typography
              color="error"
              textAlign="center"
              fontWeight={500}
              mt={2}
              sx={{
                fontSize: {
                  lg: 20,
                  md: 18,
                  sm: 16,
                  xs: 14,
                },
              }}
            >
              {authError.message}
            </Typography>
          )}
        </Box>
      </Container>
    </>
  );
}
