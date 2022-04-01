import { AppBar, Avatar, Box, Stack, Toolbar, Typography } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { gigTheme } from "../../src/Theme";
import NavbarTab from "./NavbarTab";
import { useMoralis } from "react-moralis";

export type connectionStatus = 0 | 1;

export type workerView = "tasker" | "requester";

const connectionMap = {
  0: "connected",
  1: "not connected",
};

const connectionColorMap = {
  0: gigTheme.palette.success.main,
  1: gigTheme.palette.warning.main,
};

export default function Navbar(props: {
  walletAddress: string;
  isConnected: boolean;
  username: string;
}) {
  const { logout, isAuthenticated } = useMoralis();
  const [currentTask, setCurrentTask] = useState(true);

  return (
    <AppBar
      elevation={0}
      position="sticky"
      sx={{
        backgroundColor: gigTheme.palette.background.default,
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: isAuthenticated ? 0 : 1 }}>
          <Link href="/">
            {/* INSERT LOGO HERE */}
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                maxWidth: 100,
                "&:hover": {
                  cursor: "pointer",
                },
                backgroundImage: `linear-gradient(90deg, ${gigTheme.palette.primaryCTA.primary}, ${gigTheme.palette.primaryCTA.secondary})`,
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              GIG
            </Typography>
          </Link>
        </Box>
        {isAuthenticated && (
          <Stack
            direction="row"
            spacing={1}
            ml={5}
            sx={{
              flexGrow: 1,
            }}
          >
            <NavbarTab
              tabIsTasker={true}
              currentTask={currentTask}
              setCurrentTask={setCurrentTask}
              isSelected={currentTask}
              tabName="Tasker"
            />
            <NavbarTab
              tabIsTasker={false}
              currentTask={currentTask}
              setCurrentTask={setCurrentTask}
              isSelected={!currentTask}
              tabName="Requester"
            />
          </Stack>
        )}
        <Stack
          color={gigTheme.palette.primary.main}
          direction="row"
          spacing={1}
          alignItems="center"
        >
          <Avatar
            alt="Avatar Image"
            src="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
          />
          <Stack
            spacing={-0.3}
            sx={{
              flexGrow: 1,
            }}
          >
            <Typography fontWeight="medium">{props.username}</Typography>
            <Typography color={connectionColorMap[props.isConnected ? 0 : 1]}>
              {connectionMap[props.isConnected ? 0 : 1]}
              {props.walletAddress ? (
                <Typography display="inline" color="primary.main">
                  {" "}
                  - {props.walletAddress?.slice(0, 10)}
                  {props.walletAddress ? "..." : ""}
                </Typography>
              ) : null}
            </Typography>
            <Typography
              display={isAuthenticated ? "" : "none"}
              onClick={logout}
              sx={{
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              Log Out
            </Typography>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
