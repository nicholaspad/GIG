import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { gigTheme } from "../../src/Theme";

export default function SecondaryButtonCTA(props: {
  size: "big" | "small";
  text: string;
  to: string;
}) {
  const isBig = props.size === "big";

  return (
    <Box
      textAlign="center"
      width="fit-content"
      borderRadius={100}
      sx={{
        backgroundColor: gigTheme.palette.secondaryCTA.primary,
        transitionDuration: "0.2s",
        "&:hover": {
          transform: "scale(1.05)",
        },
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
            color: "white",
            cursor: "pointer",
            transitionDuration: "0.2s",
            "&:hover": {
              backgroundColor: gigTheme.palette.secondaryCTA.secondary,
            },
          }}
        >
          <Typography
            fontSize={isBig ? 20 : 16}
            fontWeight={500}
            textTransform="none"
            p="2px"
          >
            {props.text}
          </Typography>
        </Box>
      </Link>
    </Box>
  );
}
