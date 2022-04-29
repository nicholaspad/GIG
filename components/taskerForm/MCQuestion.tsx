import {
  Typography,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

import GrayCard from "../common/DefaultGrayCard";
import { GenericQuestion, SingleChoiceQuestion } from "../../src/Types";

export default function MCQuestion(
  props: GenericQuestion & {
    content: SingleChoiceQuestion;
    handleChange: Function;
    response?: number;
  }
) {
  return (
    <GrayCard>
      <FormControl>
        <FormLabel id={props.id}>
          <Typography
            variant="body1"
            fontSize={20}
            fontWeight="medium"
            color="primary.main"
            mt={1}
            mb={2}
          >
            {`${props.idx + 1}. ${props.question}`}
          </Typography>
        </FormLabel>
        <RadioGroup
          value={props.response}
          name={props.id}
          onChange={props.handleChange as any}
        >
          {props.content.options.map((option, optionid) => (
            <FormControlLabel
              value={optionid}
              key={`${props.id}-${optionid}`}
              control={
                <Radio
                  sx={{
                    "&, &.Mui-checked": {
                      color: "secondary.main",
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" fontSize={16} color="primary">
                  {option}
                </Typography>
              }
            />
          ))}
        </RadioGroup>
      </FormControl>
    </GrayCard>
  );
}
