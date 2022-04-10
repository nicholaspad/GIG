import { Container, Box } from "@mui/material";
import Question from "../../../components/taskerForm/Question";
import PrimaryButtonCTA from "../../../components/buttons/PrimaryButtonCTA";
import SecondaryButtonCTA from "../../../components/buttons/SecondaryButtonCTA";
import { Typography } from "@mui/material";
import { useState } from "react";
import PageHeader from "../../../components/common/PageHeader";
import GrayCard from "../../../components/common/CustomizableGrayCard";

export default function taskerForm() {
  /* Test Data */
  const q1 = {
    id: "00001",
    type: 1,
    question: "How are you",
    options: ["I'm fine", "I'm not fine", "None of your business"],
  };

  const q2 = {
    id: "00002",
    type: 1,
    question: "Do you want Ether",
    options: ["Yes", "No"],
  };

  const q3 = {
    id: "00003",
    type: 1,
    question: "Do you like GIG?",
    options: ["Yes", "Certainly", "Absolutely", "I'm a die hard fan"],
  };

  const formData = [q1, q2, q3];
  const formInfo = {
    title: "My Survey",
    description: "Please select the best answer",
    eta: 5,
  };
  /* End of Test Data */

  const [answers, setAnswers] = useState({});
  const handleSetAnswers = (id: string, answer: string) => {
    setAnswers({ ...answers, [id]: answer });
  };

  /* TODO: use this function after building submit handling */
  const convertResponseFormat = (responses: { [key: string]: string }) => {
    return Object.keys(responses).map((key) => ({
      questionId: key,
      response: responses[key],
    }));
  };

  return (
    <>
      <PageHeader title={"Task"} />
      <Container maxWidth="sm">
        <GrayCard>
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" color="primary" fontWeight={600}>
              {formInfo.title}
            </Typography>
            <Typography sx={{ mt: 2 }} variant="body2" color="primary">
              {formInfo.description}
            </Typography>
          </Box>
        </GrayCard>
        {formData.map((props, idx) => (
          <Question
            type={props.type}
            idx={idx}
            id={props.id}
            question={props.question}
            options={props.options}
            key={props.id}
            handleSetAnswers={handleSetAnswers}
          />
        ))}
        <Box
          sx={{
            mb: 5,
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <SecondaryButtonCTA size="small" text="Abandon" to="/browse-tasks" />
          <Box>
            <Typography
              variant="body1"
              color="secondary"
              align="center"
              fontStyle="italic"
            >
              Approximate time to complete
            </Typography>
            <Typography variant="body1" color="primary" align="center">
              {formInfo.eta} minutes
            </Typography>
          </Box>
          <PrimaryButtonCTA size="small" text="Submit" to="/tasker/completed" />
        </Box>
      </Container>
    </>
  );
}
