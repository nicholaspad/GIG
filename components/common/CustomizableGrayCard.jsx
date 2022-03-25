import {Card} from "@mui/material";
import React from "react";
import shadows from "../../styles/shadows";

export default function GrayCard(props) {
	const defaultSx = {
		bgcolor: "background.paper",
		borderRadius: 3,
		boxShadow: shadows[8],
	};
  return (
    <Card
      sx={{...defaultSx, ...props.sx}}
    >
      {props.children}
    </Card>
  );
}