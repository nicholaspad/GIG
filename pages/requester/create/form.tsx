import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Container, Modal, styled, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { gigTheme } from "../../../src/Theme";
import FormControl from "@mui/material/FormControl";
import DefaultGrayCard from "../../../components/common/DefaultGrayCard";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { mcQuestionProps } from "../../../src/Types";

export default function Form() {
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState<mcQuestionProps[]>([]);
  const [currIndex, setCurrIndex] = useState(1);

  // Task overview
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cryptoAllocated, setCryptoAllocated] = useState(0);
  const [maxTaskers, setMaxTaskers] = useState(0);

  // Errors associated with task overvieww
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [cryptoAllocatedError, setCryptoAllocatedError] = useState(false);
  const [maxTaskersError, setMaxTaskersError] = useState(false);

  // New question from modal popup
  const [currQuestionTitle, setCurrQuestionTitle] = useState("");
  const [currQuestionChoices, setCurrQuestionChoices] = useState<string[]>([]);

  // Errors associated with new question modal popup
  const [currQuestionTitleError, setCurrQuestionTitleError] = useState(false);
  const [currQuestionChoicesError, setCurrQuestionChoicesError] =
    useState(false);

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
        <Typography
          color="primary"
          variant="h4"
          fontWeight={600}
          sx={{ mt: 5 }}
        >
          Create New Task
        </Typography>
      </Grid>
      {/* TODO @nicholaspad replace with primary CTA */}

      {/* ===== Task Heading ===== */}
      <DefaultGrayCard>
        <FormControl fullWidth>
          <CustomTextField
            label="Task Title"
            placeholder="Ex: Consumer Research Survey"
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleError(e.target.value.length < 10);
            }}
            error={titleError}
            helperText={titleError && "Title must be longer than 10 characters"}
            sx={{ my: 2 }}
          />
          <CustomTextField
            label="Description"
            placeholder="Ex: Answer a survey about your opinions"
            onChange={(e) => {
              setDescription(e.target.value);
              setDescriptionError(e.target.value.length < 10);
            }}
            error={descriptionError}
            helperText={
              descriptionError &&
              "Description must be longer than 10 characters"
            }
            sx={{ mb: 2 }}
          />

          <Grid container spacing={10}>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center" justifyContent="left">
                <Typography color="primary" sx={{ textAlign: "right" }}>
                  Total ETH allocated:
                </Typography>
                <CustomTextField
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (isNaN(val) || val <= 0) {
                      setCryptoAllocatedError(true);
                    } else {
                      setCryptoAllocatedError(false);
                      setCryptoAllocated(val);
                    }
                  }}
                  error={cryptoAllocatedError}
                  helperText={cryptoAllocatedError && "Must be >0"}
                  size="small"
                  placeholder="ETH"
                  sx={{
                    ml: 2,
                    mr: 1,
                    width: 100,
                    input: { textAlign: "right" },
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center" justifyContent="right">
                <Typography color="primary" sx={{ textAlign: "right" }}>
                  Max Number of Taskers:
                </Typography>
                <CustomTextField
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (isNaN(val) || val <= 0) {
                      setMaxTaskersError(true);
                    } else {
                      setMaxTaskersError(false);
                      setMaxTaskers(val);
                    }
                  }}
                  error={maxTaskersError}
                  helperText={maxTaskersError && "Must be >0"}
                  size="small"
                  sx={{ ml: 2, width: 100 }}
                />
              </Box>
            </Grid>
          </Grid>
        </FormControl>

        <Typography
          color="secondary"
          align="center"
          sx={{ fontStyle: "italic", mt: 2 }}
        >
          The task will close when either the crypto allocation runs out or the
          number of Taskers reaches the limit, whichever comes first
        </Typography>
      </DefaultGrayCard>
      {/* ===== End Task Heading ===== */}

      {/* Render all options in questions */}
      {questions.map((question: mcQuestionProps) => (
        <QuestionCard title={question.question} choices={question.options} />
      ))}

      <Button
        variant="contained"
        color="secondary"
        onClick={() => setOpen(true)}
      >
        Add New Question
      </Button>
      <br />
      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          const newTask = {
            title: title,
            description: description,
            options: questions,
          };
          console.log(newTask);
        }}
      >
        Post Task
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
            border: "2px solid #fafafa",
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
                setCurrQuestionChoicesError(
                  cleanedAnswerChoices.length == 0 ||
                    cleanedAnswerChoices.length > 5
                );
              }}
              placeholder="Choice 1, Choice 2, ..."
              error={currQuestionChoicesError}
              helperText={
                currQuestionChoices.length == 0
                  ? "Input at least one answer choice!"
                  : currQuestionChoices.length > 5
                  ? "Too many answer choices - maximum is 5"
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
                const newQuestions = questions.concat([
                  {
                    idx: questions.length,
                    question: currQuestionTitle,
                    options: currQuestionChoices,
                  },
                ]);
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
      <Typography color="primary" variant="h5" mb={1}>
        {props.title}
      </Typography>
      <List>
        {props.choices.map((choice) => (
          <ListItem sx={{ mb: -0.5 }}>
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
