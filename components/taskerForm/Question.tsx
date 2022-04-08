import MCQuestion from "./MCQuestion";
import { Box, Typography } from "@mui/material";
import { GenericQuestion } from "../../src/Types";

export default function Question(
  props: GenericQuestion & { handleSetAnswers: Function }
) {
  if (props.options && props.type === 1) {
    return (
      <MCQuestion
        question={props.question}
        idx={props.idx}
        id={props.id}
        options={props.options}
        handleSetAnswers={props.handleSetAnswers}
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
