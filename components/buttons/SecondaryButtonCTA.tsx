import { Box, Typography } from "@mui/material";
import Link from "next/link";
import { gigTheme } from "../../src/Theme";

export default function SecondaryButtonCTA(props: {
  size: "big" | "small";
  text: string;
  to?: string;
  onClick?: Function;
}) {
  const isBig = props.size === "big";

  // must provide either a route or an onClick function, but not both!
  if (!props.to && !props.onClick) return null;
  if (props.to && props.onClick) return null;

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
      {props.to ? (
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
              variant={isBig ? "h6" : "body1"}
              fontWeight={500}
              textTransform="none"
              p="2px"
            >
              {props.text}
            </Typography>
          </Box>
        </Link>
      ) : null}
      {props.onClick ? (
        <a
          onClick={() => {
            (props.onClick as Function)();
          }}
        >
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
              variant={isBig ? "h6" : "body1"}
              fontWeight={500}
              textTransform="none"
              p="2px"
            >
              {props.text}
            </Typography>
          </Box>
        </a>
      ) : null}
    </Box>
  );
}
