import MCQuestion from "./MCQuestion";
import { Box, Typography } from "@mui/material";
import {
  GenericQuestion,
  QuestionType,
  SingleChoiceQuestion,
} from "../../src/Types";

export default function Question(props: {
  q: GenericQuestion;
  handleChange: Function;
}) {
  if (props.q.type === QuestionType.SINGLE_CHOICE) {
    return (
      <MCQuestion
        type={-1} // dummy
        question={props.q.question}
        idx={props.q.idx}
        id={props.q.id}
        content={props.q.content as SingleChoiceQuestion}
        handleChange={props.handleChange}
      />
    );
  }
  return (
    <Box my={4} px={3}>
      <Typography color="error">
        Error retrieving question {props.q.idx + 1}
      </Typography>
    </Box>
  );
}
