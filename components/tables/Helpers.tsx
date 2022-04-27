import {
  styled,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
  Zoom,
} from "@mui/material";

export function TableHeader(props: { children: React.ReactNode }) {
  return (
    <Typography variant="h6" fontWeight={500}>
      {props.children}
    </Typography>
  );
}

export function TableCell(props: {
  color?: string;
  truncateLength?: number;
  children: React.ReactNode;
}) {
  if (props.truncateLength) {
    const maybeEllipsis =
      (props.children as string).length > props.truncateLength ? "..." : "";
    return (
      <StyledTooltip
        followCursor
        TransitionComponent={Zoom}
        title={maybeEllipsis ? (props.children as string) : ""}
      >
        <Typography color={props.color} variant="body1">
          {(props.children as string).slice(0, props.truncateLength) +
            maybeEllipsis}
        </Typography>
      </StyledTooltip>
    );
  }

  return (
    <Typography color={props.color} variant="body1">
      {props.children}
    </Typography>
  );
}

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.main,
    boxShadow: theme.shadows[1],
    fontSize: 12,
    textAlign: "center",
    maxWidth: "none",
  },
}));
