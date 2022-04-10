import { Typography } from "@mui/material";

export function TableHeader(props: { children: React.ReactNode }) {
  return (
    <Typography variant="h6" fontWeight={500}>
      {props.children}
    </Typography>
  );
}

export function TableCell(props: {
  color?: string;
  children: React.ReactNode;
}) {
  return (
    <Typography color={props.color} variant="body1">
      {props.children}
    </Typography>
  );
}
