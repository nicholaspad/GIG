import { Card } from "@mui/material";
import shadows from "../../styles/shadows";

export default function GrayCard(props: { children: React.ReactNode }) {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        py: "3%",
        px: "5%",
        my: 5,
        bgcolor: "background.paper",
        borderRadius: 3,
        boxShadow: shadows[8],
      }}
    >
      {props.children}
    </Card>
  );
}
