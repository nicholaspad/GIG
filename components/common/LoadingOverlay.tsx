import { Backdrop, CircularProgress, Typography } from "@mui/material";

export default function LoadingOverlay(props: {
  open: boolean;
  text?: string;
}) {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={props.open}
      transitionDuration={0}
    >
      {props.text ? (
        <Typography fontSize={20} mr={2}>
          {props.text}
        </Typography>
      ) : null}
      <CircularProgress color="secondary" />
    </Backdrop>
  );
}
