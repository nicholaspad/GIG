import React, { useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import DefaultGrayCard from "../common/DefaultGrayCard";
import Button from "@mui/material/Button";
import { mcQuestionProps } from "../../src/Types";

export default function QuestionSingleChoice(props: {
  index: number;
  removeQuestion: Function;
}) {
  const newOptionRef = useRef(null);
  const [options, setOptions] = useState([]);
  const [text, setText] = useState("");

  return (
    <DefaultGrayCard>
      <TextField
        label="Type question here"
        fullWidth
        sx={{
          m: 1,
        }}
      />
      <FormControl>
        {/* The Options */}
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
        >
          {options.map((optionName) => (
            <FormControlLabel
              value={optionName}
              control={<Radio />}
              label={optionName}
            />
          ))}
        </RadioGroup>

        {/* Add an option */}
        <TextField
          label="Add an option..."
          ref={newOptionRef}
          value={text}
          onChange={(e) => {
            const { value } = e.target;
            setText(value);
          }}
          onBlur={(e) => {
            const { value } = e.target;
            if (value.trim() !== "") {
              setOptions([...options, value]);
              setText("");
            }
          }}
        />
      </FormControl>

      {/* Delete this question */}
      <Button
        color="secondary"
        onClick={() => {
          props.removeQuestion(props.index);
        }}
      >
        Delete
        {props.index}
      </Button>
    </DefaultGrayCard>
  );
}
