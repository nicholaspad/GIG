import { AppBar, Avatar, Stack, Toolbar, Typography } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { gigTheme } from "../src/Theme";
import NavbarTab from "./NavbarTab";

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

export default function Navbar() {
    const [currentTask, setCurrentTask] = useState(true);

  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: gigTheme.palette.background.default,
      }}
    >
      <Toolbar>
        {/* INSERT LOGO HERE */}
        <Typography
            color = {gigTheme.palette.primary.main}
            sx={{
                flexGrow: 1,
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
            <NavbarTab
                tabIsTasker={true}
                currentTask={currentTask}
                setCurrentTask={setCurrentTask}
                tabName='Tasker'
            />
            <NavbarTab
                tabIsTasker={false}
                currentTask={currentTask}
                setCurrentTask={setCurrentTask}
                tabName='Requester'
            />
        </Stack>

        <Stack
          color = {gigTheme.palette.primary.main}
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
            <Typography>username</Typography>
            <Typography color={connectionColorMap[0]}>
              {connectionMap[0]}
            </Typography>
            <Typography>Wallet Address</Typography>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
