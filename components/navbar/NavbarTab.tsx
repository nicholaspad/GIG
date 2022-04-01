import { Box, Typography } from "@mui/material";
import * as React from "react";
import { gigTheme } from "../../src/Theme";

export default function NavbarTab(props: {
  tabIsTasker: boolean;
  currentTask: boolean;
  setCurrentTask: Function;
  isSelected: boolean;
  tabName: string;
}) {
  const getColor = () => {
    if (props.tabIsTasker) {
      return props.currentTask
        ? gigTheme.palette.secondary.main
        : gigTheme.palette.primary.main;
    }
    return props.currentTask
      ? gigTheme.palette.primary.main
      : gigTheme.palette.secondary.main;
  };

  return (
    <Box
      sx={{
        background: props.isSelected ? gigTheme.palette.secondary.main : null,
        p: 0.5,
        borderRadius: props.isSelected ? 1.5 : null,
      }}
    >
      <Typography
        color="primary"
        // fontSize={props.isSelected ? "2em" : "1em"}
        fontWeight={props.isSelected ? 800 : 400}
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
    </Box>
  );
}
