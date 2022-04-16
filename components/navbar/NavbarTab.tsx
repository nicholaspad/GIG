import { Box, Typography } from "@mui/material";
import Link from "next/link";
import router from "next/router";
import { gigTheme } from "../../src/Theme";

export default function NavbarTab(props: {
  tabIsTasker: boolean;
  currentTask: boolean;
  setCurrentTask: Function;
  isSelected: boolean;
  tabName: string;
}) {
  const getTabRoute = (): string => {
    if (!props.tabIsTasker) return "/requester/my-tasks";
    if (router.pathname === "/tasker/my-tasks") return "/tasker/my-tasks";
    return "/browse-tasks";
  };

  return (
    <Link href={getTabRoute()} passHref>
      <Box
        sx={{
          background: props.isSelected ? gigTheme.palette.secondary.main : null,
          p: 0.5,
          borderRadius: props.isSelected ? 1.5 : null,
        }}
      >
        <Typography
          color="primary"
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
    </Link>
  );
}
