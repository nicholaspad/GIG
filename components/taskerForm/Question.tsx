import MCQuestion from "./MCQuestion";
import { Box, Typography } from "@mui/material";
import { GenericQuestion, QuestionType } from "../../src/Types";

export default function Question(
  props: GenericQuestion & {
    handleChange: Function;
  }
) {
  if (props.type === QuestionType.SINGLE_CHOICE) {
    return (
      <MCQuestion
        question={props.question}
        idx={props.idx}
        id={props.id}
        options={props.options}
        handleChange={props.handleChange}
      />
    );
  }
  return (
    <Box my={4} px={3}>
      <Typography color="error">
        Error retrieving question {props.idx + 1}
      </Typography>
    </Box>
  );
}
