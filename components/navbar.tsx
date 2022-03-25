import { AppBar, Avatar, Stack, Toolbar, Typography } from "@mui/material";
import * as React from "react";
import { gigTheme } from "../src/Theme";

export type connectionStatus = 0 | 1;

export type workerView = "tasker" | "requester";

export type userData = {
  username: string;
  status: number;
  walletAddress: string;
};

const connectionMap = {
  0: "connected",
  1: "not connected",
};

const connectionColorMap = {
  0: gigTheme.palette.success.main,
  1: gigTheme.palette.warning.main,
};

export default function Navbar(props: {
  username: string;
  status: connectionStatus;
  walletAddress: string;
}) {
  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: gigTheme.palette.background.default,
        color: gigTheme.palette.primary.main,
      }}
    >
      <Toolbar>
        <Typography
          sx={{
            flexGrow: 1,
            color: gigTheme.palette.secondary.main,
            "&:hover": {
              cursor: "pointer",
            },
          }}
        >
          GIG
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            flexGrow: 1,
          }}
        >
          <Typography
            sx={{
              "&:hover": {
                color: gigTheme.palette.secondary.main,
                cursor: "pointer",
                transition: "ease 0.3s",
              },
            }}
          >
            Tasker
          </Typography>
          <Typography
            sx={{
              "&:hover": {
                color: gigTheme.palette.secondary.main,
                cursor: "pointer",
                transition: "ease 0.3s",
              },
            }}
          >
            Requester
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            "&:hover": {
              cursor: "pointer",
            },
          }}
        >
          <Avatar
            alt="Avatar Image"
            src="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
          />
          <Stack
            spacing={-1}
            sx={{
              flexGrow: 1,
            }}
          >
            <Typography>{props.username}</Typography>
            <Typography color={connectionColorMap[props.status]}>
              {connectionMap[props.status]}
            </Typography>
            <Typography>{props.walletAddress}</Typography>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
