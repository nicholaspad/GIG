import { Backdrop, CircularProgress } from "@mui/material";

export default function LoadingOverlay(props: { open: boolean }) {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={props.open}
      transitionDuration={0}
    >
      <CircularProgress color="secondary" />
    </Backdrop>
  );
}
