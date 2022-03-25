import { AppBar, Avatar, Stack, Toolbar, Typography } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { gigTheme } from "../src/Theme";

const taskerColorMap = {
  0: gigTheme.palette.secondary.main,
  1: gigTheme.palette.primary.main,
}

const RequesterColorMap = {
  0: gigTheme.palette.primary.main,
  1: gigTheme.palette.secondary.main,
}

export default function NavbarTab(props: {
  tabIsTasker: boolean;
  isTasker: boolean;
  setIsTasker: Function;
  tabName: string;
}) {

  const getColor = () => {
    if (props.tabIsTasker) {
      return props.isTasker ? gigTheme.palette.secondary.main : gigTheme.palette.primary.main;
    }
    return props.isTasker ? gigTheme.palette.primary.main : gigTheme.palette.secondary.main;
  }
  {console.log("istask", props.tabIsTasker)}
  {console.log("isTasker", props.isTasker)}

  return (
    <Typography
      color = {getColor()}
      sx={{
          "&:hover": {
              cursor: "pointer",
              transition: "ease 0.1s",
          },
      }}
      onClick={() => props.setIsTasker(props.setIsTasker)}
    >
        {props.tabName}
    </Typography>
  );
}
