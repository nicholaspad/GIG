import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Container, Modal, styled, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { gigTheme } from "../../../src/Theme";
import FormControl from "@mui/material/FormControl";

export default function Form() {
  const [open, setOpen] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [currIndex, setCurrIndex] = useState(1);

  const removeQuestion = (index: number) => {
    var array = [...questions];
    array = array.slice(0, index).concat(array.slice(index + 1, -1));
    // array.splice(index, 1)
    setQuestions(array);
    setCurrIndex(currIndex - 1);
  };

  return (
    <Container maxWidth="md">
      {/* TODO @nicholaspad replace with primary CTA */}
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setOpen(true)}
      >
        Add New Question
      </Button>
      <AddQuestionModal open={open} setOpen={setOpen} />
      {/* <TaskHeading/> */}
      {questions}

      {/* <Button
        variant="contained"
        onClick={() => {
          setQuestions((questions) => [
            ...questions,
            <QuestionSingleChoice
              key={currIndex}
              index={currIndex}
              removeQuestion={removeQuestion}
            />,
          ]);
          setCurrIndex(currIndex + 1);
        }}
      >
        +
      </Button> */}
    </Container>
  );
}

function AddQuestionModal(props: { open: boolean; setOpen: Function }) {
  const [currQuestionTitle, setCurrQuestionTitle] = useState("");
  const [currQuestionChoices, setCurrQuestionChoices] = useState<string[]>([]);

  const [currQuestionTitleError, setCurrQuestionTitleError] = useState(false);
  const [currQuestionChoicesError, setCurrQuestionChoicesError] =
    useState(false);

  const handleClose = () => {
    setCurrQuestionTitle("");
    setCurrQuestionChoices([]);
    setCurrQuestionTitleError(false);
    setCurrQuestionChoicesError(false);
    props.setOpen(false);
  };

  return (
    <Modal
      open={props.open}
      onClose={() => {
        handleClose();
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        {/* Text field for the title, answer choices as csv */}
        <Typography color="primary" variant="h5" component="h2" mb={2}>
          Add a new question
        </Typography>
        <FormControl fullWidth>
          {/* Task Title field */}
          <CustomTextField
            label="Task Title"
            variant="outlined"
            color="secondary"
            onChange={(e) => {
              setCurrQuestionTitle(e.target.value);
              setCurrQuestionTitleError(e.target.value.length < 10);
            }}
            placeholder="Interesting Task Title"
            error={currQuestionTitleError}
            helperText={
              currQuestionTitleError &&
              "Title must be longer than 10 characters!"
            }
            sx={{ color: "primary", mb: 2 }}
          />
          {/* Answer choices field */}
          <CustomTextField
            label="Answer Choices (comma-separated)"
            variant="outlined"
            color="secondary"
            onChange={(e) => {
              const input = e.target.value;
              const cleanedAnswerChoices = input
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s !== "");
              setCurrQuestionChoices(cleanedAnswerChoices);
              setCurrQuestionChoicesError(cleanedAnswerChoices.length == 0);
            }}
            placeholder="Choice 1, Choice 2, ..."
            error={currQuestionChoicesError}
            helperText={
              currQuestionChoicesError
                ? "Input at least one answer choice!"
                : currQuestionChoices.length > 0
                ? `${
                    currQuestionChoices.length
                  } answer choice(s) entered: ${currQuestionChoices.join(", ")}`
                : null
            }
            sx={{ color: "primary", mb: 2 }}
          />
          {/* Submit button */}
          {/* TODO @nicholaspad replace with primary CTA */}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              if (currQuestionTitleError || currQuestionChoicesError) {
                alert("Validation error");
                return;
              }
              // TODO @christine-sun do something with currQuestionTitle and currQuestionChoices
              console.log(currQuestionTitle);
              console.log(currQuestionChoices);
              handleClose();
            }}
          >
            Add Question
          </Button>
        </FormControl>
      </Box>
    </Modal>
  );
}

const CustomTextField = styled(TextField)({
  "& .MuiInputLabel-root, .MuiOutlinedInput-root": {
    color: gigTheme.palette.primary.main,
  },
  "& .MuiInputLabel-root.MuiInputLabel-formControl.MuiInputLabel-animated": {
    color: gigTheme.palette.primary.main,
  },
  "& .MuiFormHelperText-root": {
    color: gigTheme.palette.primary.main,
  },
  "& .MuiFormHelperText-root.Mui-error": {
    color: gigTheme.palette.error.main,
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: gigTheme.palette.secondary.main,
    },
    "&:hover fieldset": {
      borderColor: gigTheme.palette.secondary.main,
    },
    "&.Mui-focused fieldset": {
      borderColor: gigTheme.palette.secondary.main,
    },
    borderColor: gigTheme.palette.secondary.main,
  },
});
