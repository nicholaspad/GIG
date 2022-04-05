import { Box, SxProps, Theme, Typography } from "@mui/material";
import Link from "next/link";
import { gigTheme } from "../../src/Theme";

export default function PrimaryButtonCTA(props: {
  size: "big" | "small";
  text: string;
  to: string;
  sx?: SxProps<Theme>;
}) {
  const isBig = props.size === "big";

  return (
    <Box
      textAlign="center"
      width="fit-content"
      borderRadius={100}
      p="2px"
      sx={{
        backgroundImage: `linear-gradient(90deg, ${gigTheme.palette.primaryCTA.primary}, ${gigTheme.palette.primaryCTA.secondary})`,
        transitionDuration: "0.2s",
        "&:hover": {
          transform: "scale(1.05)",
        },
        ...props.sx,
      }}
    >
      <Link href={props.to}>
        <Box
          display="flex"
          flexDirection="column"
          height="100%"
          borderRadius={100}
          py={isBig ? 1.8 : 1}
          px={isBig ? 4 : 3}
          sx={{
            justifyContent: "center",
            backgroundColor: "background.paper",
            color: "primaryCTA.primary",
            cursor: "pointer",
            transitionDuration: "0.2s",
            "&:hover": {
              backgroundColor: "transparent",
              color: "background.paper",
            },
          }}
        >
          <Typography
            variant={isBig ? "h6" : "body1"}
            fontWeight={650}
            textTransform="none"
          >
            {props.text}
          </Typography>
        </Box>
      </Link>
    </Box>
  );
}
