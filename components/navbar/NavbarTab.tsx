import { Typography } from "@mui/material";
import * as React from "react";
import { gigTheme } from "../../src/Theme";

export default function NavbarTab(props: {
  tabIsTasker: boolean;
  currentTask: boolean;
  setCurrentTask: Function;
  tabName: string;
}) {

  const getColor = () => {
    if (props.tabIsTasker) {
      return props.currentTask ? gigTheme.palette.secondary.main : gigTheme.palette.primary.main;
    }
    return props.currentTask ? gigTheme.palette.primary.main : gigTheme.palette.secondary.main;
  }

  return (
    <Typography
      color = {getColor()}
      sx={{
          "&:hover": {
              cursor: "pointer",
              transition: "ease 0.1s",
          },
      }}
      onClick={() => props.setCurrentTask(props.tabIsTasker)}
    >
        {props.tabName}
    </Typography>
  );
}
