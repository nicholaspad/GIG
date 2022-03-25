import {
  Typography,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

// import shadows from "../../styles/shadows";
import GrayCard from "../common/GrayCard";

export interface mcQuestionProps {
  idx: number;
  id: string;
  question: string;
  options: string[];
}

export default function MCQuestion(props: mcQuestionProps) {
  return (
    <GrayCard>
      <FormControl>
        <FormLabel id={props.id}>
          <Typography variant="body1" fontStyle="bold" color="primary.main">
            {`${props.idx + 1}. ${props.question}`}
          </Typography>
        </FormLabel>
        <RadioGroup aria-labelledby={props.id} name={props.id}>
          {props.options.map((option, optionIdx) => (
            <FormControlLabel
              value={optionIdx}
              key={`${props.id}-${optionIdx}`}
              control={
                <Radio
                  sx={{
                    "&, &.Mui-checked": {
                      color: "secondary.main",
                    },
                  }}
                  required
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
