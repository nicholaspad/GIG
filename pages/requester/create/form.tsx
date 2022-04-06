import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Container, Modal, styled, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { gigTheme } from "../../../src/Theme";
import FormControl from "@mui/material/FormControl";
import PrimaryButtonCTA from "../../../components/buttons/PrimaryButtonCTA";
import SecondaryButtonCTA from "../../../components/buttons/SecondaryButtonCTA";
import DefaultGrayCard from "../../../components/common/DefaultGrayCard";
import TaskHeading from "../../../components/form/TaskHeading";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";

export default function Form() {
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState<Object[]>([]);
  const [currIndex, setCurrIndex] = useState(1);

  const [currQuestionTitle, setCurrQuestionTitle] = useState("");
  const [currQuestionChoices, setCurrQuestionChoices] = useState<string[]>([]);

  const [currQuestionTitleError, setCurrQuestionTitleError] = useState(false);
  const [currQuestionChoicesError, setCurrQuestionChoicesError] = useState(
    false
  );

  const removeQuestion = (index: number) => {
    var array = [...questions];
    array = array.slice(0, index).concat(array.slice(index + 1, -1));
    // array.splice(index, 1)
    setQuestions(array);
    setCurrIndex(currIndex - 1);
  };

  const handleClose = () => {
    setCurrQuestionTitle("");
    setCurrQuestionChoices([]);
    setCurrQuestionTitleError(false);
    setCurrQuestionChoicesError(false);
    setOpen(false);
  };

  return (
    <Container maxWidth="md">
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography color="secondary" variant="h4" sx={{ mt: 5, mb: 2 }}>
          Create New Task
        </Typography>
      </Grid>
      {/* TODO @nicholaspad replace with primary CTA */}

      {/* ===== Task Heading ===== */}
      {/* <TaskHeading /> */}
      <DefaultGrayCard>
        <FormControl fullWidth>
          <CustomTextField
            label="Task Title"
            placeholder="Ex: Consumer Research Survey"
            sx={{ my: 2 }}
          />
          <CustomTextField
            label="Description"
            placeholder="Ex: Answer a survey about your opinions"
            sx={{ mb: 2 }}
          />

          <Grid container spacing={4}>
            <Grid item xs={7.5}>
              <Box display="flex" alignItems="center" justifyContent="left">
                Total crypto allocated:
                <CustomTextField sx={{ ml: 2, mr: 1 }} />
                ETH
              </Box>
            </Grid>
            <Grid item xs={4.5}>
              <Box display="flex" alignItems="center" justifyContent="right">
                Number of Taskers:
                <CustomTextField />
              </Box>
            </Grid>
          </Grid>
        </FormControl>
      </DefaultGrayCard>
      {/* ===== End Task Heading ===== */}

      {/* Render all options in questions */}
      {questions.map((question: []) => (
        <QuestionCard title={question[0]} choices={question[1]} />
      ))}

      <Button
        variant="contained"
        color="secondary"
        onClick={() => setOpen(true)}
      >
        Add New Question
      </Button>

      {/* ===== Modal to add another question ===== */}
      <Modal
        open={open}
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
            borderRadius: 5,
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
              sx={{ mb: 2 }}
            />
            {/* Answer choices field */}
            <CustomTextField
              label="Answer Choices (comma-separated)"
              variant="outlined"
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
                    } answer choice(s) entered: ${currQuestionChoices.join(
                      ", "
                    )}`
                  : null
              }
              sx={{ mb: 2 }}
            />
            {/* Submit button */}
            {/* TODO @nicholaspad replace with primary CTA */}
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                if (
                  currQuestionTitleError ||
                  currQuestionChoicesError ||
                  currQuestionTitle == "" ||
                  currQuestionChoices.length == 0
                ) {
                  alert("Please provide proper input");
                  return;
                }
                const newQuestion = [currQuestionTitle, currQuestionChoices];
                const newQuestions = questions.concat([newQuestion]);
                setQuestions(newQuestions);
                handleClose();
              }}
              sx={{ mx: "auto" }}
            >
              Add Question
            </Button>
          </FormControl>
        </Box>
      </Modal>
      {/* ===== End Modal to add another question ===== */}
    </Container>
  );
}

function QuestionCard(props: { title: string; choices: string[] }) {
  return (
    <DefaultGrayCard>
      <Typography color="primary" variant="h5" mb={1.5}>
        {props.title}
      </Typography>
      <List>
        {props.choices.map((choice) => (
          <ListItem>
            <ListItemIcon>
              <CircleOutlinedIcon
                style={{ color: gigTheme.palette.primary.main }}
              />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{ fontSize: "20px" }}
              primary={choice}
              style={{ color: gigTheme.palette.primary.main }}
            />
          </ListItem>
        ))}
      </List>
    </DefaultGrayCard>
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
