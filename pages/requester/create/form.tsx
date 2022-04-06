// import React, { useState } from "react";
// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
// import { Container, Modal, styled, Typography } from "@mui/material";
// import TextField from "@mui/material/TextField";
// import { gigTheme } from "../../../src/Theme";
// import FormControl from "@mui/material/FormControl";
// import PrimaryButtonCTA from "../../../components/buttons/PrimaryButtonCTA";
// import SecondaryButtonCTA from "../../../components/buttons/SecondaryButtonCTA";
// import DefaultGrayCard from "../../../components/common/DefaultGrayCard";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";

// export default function Form() {
//   const [open, setOpen] = useState(false);
//   const [questions, setQuestions] = useState<Object[]>([]);
//   const [currIndex, setCurrIndex] = useState(1);

//   const removeQuestion = (index: number) => {
//     var array = [...questions];
//     array = array.slice(0, index).concat(array.slice(index + 1, -1));
//     // array.splice(index, 1)
//     setQuestions(array);
//     setCurrIndex(currIndex - 1);
//   };

//   return (
//     <Container maxWidth="md">
//       {/* TODO @nicholaspad replace with primary CTA */}
//       <QuestionCard title="my title" choices={["hi", "bye"]}/>
//       <Button
//         variant="contained"
//         color="secondary"
//         onClick={() => setOpen(true)}
//       >
//         Add New Question
//       </Button>
//       <AddQuestionModal open={open} setOpen={setOpen} />
//       {/* <TaskHeading/> */}
//       <div>heree</div>
//       console.log("oh hi")
//       console.log(questions)
//       {questions}
//     </Container>
//   );
// }

// // function generate(element: React.ReactElement) {
// //   return [0,1,2].map((value) =>
// //     React.cloneElement(element, {
// //       key: value,
// //     }),
// //   );
// // }

// function QuestionCard(props: { title: string, choices: string[] }) {
//   return (
//     <DefaultGrayCard>
//       <Typography color="primary" variant="h5" mb={1.5}>{props.title}</Typography>
//       <List>
//         {props.choices.map((choice) => (
//           <ListItem>
//             <ListItemIcon>
//               <CircleOutlinedIcon
//                 style={{ color: gigTheme.palette.primary.main }}
//               />
//             </ListItemIcon>
//             <ListItemText
//               primaryTypographyProps={{ fontSize: '20px' }}
//               primary={choice}
//               style={{ color: gigTheme.palette.primary.main }}
//             />
//           </ListItem>
//         ))}
//       </List>
//     </DefaultGrayCard>
//   );
// }

// function AddQuestionModal(props: { open: boolean; setOpen: Function }) {
//   const [currQuestionTitle, setCurrQuestionTitle] = useState("");
//   const [currQuestionChoices, setCurrQuestionChoices] = useState<string[]>([]);

//   const [currQuestionTitleError, setCurrQuestionTitleError] = useState(false);
//   const [currQuestionChoicesError, setCurrQuestionChoicesError] =
//     useState(false);

//   const handleClose = () => {
//     setCurrQuestionTitle("");
//     setCurrQuestionChoices([]);
//     setCurrQuestionTitleError(false);
//     setCurrQuestionChoicesError(false);
//     props.setOpen(false);
//   };

//   return (
//     <Modal
//       open={props.open}
//       onClose={() => {
//         handleClose();
//       }}
//     >
//       <Box
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           width: 600,
//           bgcolor: "background.paper",
//           border: "2px solid #000",
//           borderRadius: 5,
//           boxShadow: 24,
//           p: 4,
//         }}
//       >
//         {/* Text field for the title, answer choices as csv */}
//         <Typography color="primary" variant="h5" component="h2" mb={2}>
//           Add a new question
//         </Typography>
//         <FormControl fullWidth>
//           {/* Task Title field */}
//           <CustomTextField
//             label="Task Title"
//             variant="outlined"
//             onChange={(e) => {
//               setCurrQuestionTitle(e.target.value);
//               setCurrQuestionTitleError(e.target.value.length < 10);
//             }}
//             placeholder="Interesting Task Title"
//             error={currQuestionTitleError}
//             helperText={
//               currQuestionTitleError &&
//               "Title must be longer than 10 characters!"
//             }
//             sx={{ mb: 2 }}
//           />
//           {/* Answer choices field */}
//           <CustomTextField
//             label="Answer Choices (comma-separated)"
//             variant="outlined"
//             onChange={(e) => {
//               const input = e.target.value;
//               const cleanedAnswerChoices = input
//                 .split(",")
//                 .map((s) => s.trim())
//                 .filter((s) => s !== "");
//               setCurrQuestionChoices(cleanedAnswerChoices);
//               setCurrQuestionChoicesError(cleanedAnswerChoices.length == 0);
//             }}
//             placeholder="Choice 1, Choice 2, ..."
//             error={currQuestionChoicesError}
//             helperText={
//               currQuestionChoicesError
//                 ? "Input at least one answer choice!"
//                 : currQuestionChoices.length > 0
//                 ? `${
//                     currQuestionChoices.length
//                   } answer choice(s) entered: ${currQuestionChoices.join(", ")}`
//                 : null
//             }
//             sx={{ mb: 2 }}
//           />
//           {/* Submit button */}
//           {/* TODO @nicholaspad replace with primary CTA */}
//           <Button
//             variant="contained"
//             color="secondary"
//             onClick={() => {
//               if (currQuestionTitleError || currQuestionChoicesError) {
//                 alert("Please provide proper input");
//                 return;
//               }
//               // TODO @christine-sun do something with currQuestionTitle and currQuestionChoices
//               const newQuestion = {
//                 title: currQuestionTitle,
//                 choices: currQuestionChoices
//               }
//               const newQuestions = questions.concat([newQuestion]);
//               setQuestions(newQuestions)
//               // console.log(currQuestionTitle);
//               // console.log(currQuestionChoices);

//               handleClose();
//             }}
//           >
//             Add Question
//           </Button>
//         </FormControl>
//       </Box>
//     </Modal>
//   );
// }

// const CustomTextField = styled(TextField)({
//   "& .MuiInputLabel-root, .MuiOutlinedInput-root": {
//     color: gigTheme.palette.primary.main,
//   },
//   "& .MuiInputLabel-root.MuiInputLabel-formControl.MuiInputLabel-animated": {
//     color: gigTheme.palette.primary.main,
//   },
//   "& .MuiFormHelperText-root": {
//     color: gigTheme.palette.primary.main,
//   },
//   "& .MuiFormHelperText-root.Mui-error": {
//     color: gigTheme.palette.error.main,
//   },
//   "& .MuiOutlinedInput-root": {
//     "& fieldset": {
//       borderColor: gigTheme.palette.secondary.main,
//     },
//     "&:hover fieldset": {
//       borderColor: gigTheme.palette.secondary.main,
//     },
//     "&.Mui-focused fieldset": {
//       borderColor: gigTheme.palette.secondary.main,
//     },
//     borderColor: gigTheme.palette.secondary.main,
//   },
// });

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
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";

export default function Form() {
  const [open, setOpen] = useState(false);
  const [questions, setQuestions] = useState<Object[]>([]);
  const [currIndex, setCurrIndex] = useState(1);

  const removeQuestion = (index: number) => {
    var array = [...questions];
    array = array.slice(0, index).concat(array.slice(index + 1, -1));
    // array.splice(index, 1)
    setQuestions(array);
    setCurrIndex(currIndex - 1);
  };

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
    setOpen(false);
  };

  return (
    <Container maxWidth="md">
      {/* TODO @nicholaspad replace with primary CTA */}

      {/* Render all options in questions */}
      {questions.map((question: []) => (
        <QuestionCard title={question[0]} choices={question[1]}/>
      ))}
      {/* =============================== */}

      <Button
        variant="contained"
        color="secondary"
        onClick={() => setOpen(true)}
      >
        Add New Question
      </Button>
{/* ============================= */}
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
                  } answer choice(s) entered: ${currQuestionChoices.join(", ")}`
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
              if (currQuestionTitleError || currQuestionChoicesError) {
                alert("Please provide proper input");
                return;
              }
              // TODO @christine-sun do something with currQuestionTitle and currQuestionChoices
              const newQuestion = [currQuestionTitle, currQuestionChoices]
              const newQuestions = questions.concat([newQuestion]);
              setQuestions(newQuestions)

              handleClose();
            }}
          >
            Add Question
          </Button>
        </FormControl>
      </Box>
    </Modal>
    {/* ================= */}
      {/* <TaskHeading/> */}
    </Container>
  );
}

function QuestionCard(props: { title: string, choices: string[] }) {
  return (
    <DefaultGrayCard>
      <Typography color="primary" variant="h5" mb={1.5}>{props.title}</Typography>
      <List>
        {props.choices.map((choice) => (
          <ListItem>
            <ListItemIcon>
              <CircleOutlinedIcon
                style={{ color: gigTheme.palette.primary.main }}
              />
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{ fontSize: '20px' }}
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
