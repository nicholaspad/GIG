import {
  Typography,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

import GrayCard from "../common/DefaultGrayCard";
import { SingleChoiceQuestion } from "../../src/Types";

export default function MCQuestion(
  props: SingleChoiceQuestion & { handleSetAnswers: Function }
) {
  return (
    <GrayCard>
      <FormControl>
        <FormLabel id={props.id}>
          <Typography
            variant="body1"
            fontWeight="medium"
            color="primary.main"
            mt={1}
            mb={2}
          >
            {`${props.idx + 1}. ${props.question}`}
          </Typography>
        </FormLabel>
        <RadioGroup aria-labelledby={props.id} name={props.id}>
          {props.options.map((option, optionid) => (
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
                  required
                  onClick={() => props.handleSetAnswers(props.id, optionid)}
                />
              }
              label={
                <Typography variant="body2" color="primary">
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
