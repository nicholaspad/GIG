import MCQuestion from "./MCQuestion";
import { Box, Typography } from "@mui/material";

export interface questionProps {
  type: number;
  idx: number;
  id: string;
  question: string;
  options?: string[];
}

export default function Question(props: questionProps) {
  if (props.options && props.type === 1) {
    return (
      <MCQuestion
        question={props.question}
        idx={props.idx}
        id={props.id}
        options={props.options}
      />
    );
  }
  return (
    <Box>
      <Typography color="primary">
        Error: Question type not available
      </Typography>
    </Box>
  );
}
