import { Container, Box } from "@mui/material";
import Question from "../../../components/taskerForm/Question";
import PrimaryButtonCTA from "../../../components/buttons/PrimaryButtonCTA";
import SecondaryButtonCTA from "../../../components/buttons/SecondaryButtonCTA";
import { Typography } from "@mui/material";
import GrayCard from "../../../components/common/DefaultGrayCard";
import PageHeader from "../../../components/common/PageHeader";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";

export default function taskerForm() {
  const router = useRouter();
  const { taskId } = router.query;
  const { isUnauthenticated } = useMoralis();

  useEffect(() => {
    if (isUnauthenticated) router.push("/");
  }, [isUnauthenticated]);

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

  return (
    <>
      <PageHeader title={"Task"} />
      <Container maxWidth="sm">
        <GrayCard>
          <Typography variant="h4" color="primary">
            {formInfo.title}
          </Typography>
          <Typography sx={{ mt: "3%" }} variant="body2" color="primary">
            {formInfo.description}
          </Typography>
        </GrayCard>
        {formData.map((props, idx) => (
          <Question
            type={props.type}
            idx={idx}
            id={props.id}
            question={props.question}
            options={props.options}
            key={props.id}
          />
        ))}
        <Box
          sx={{
            mb: "15%",
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
          <PrimaryButtonCTA size="small" text="Submit" to="/" />
        </Box>
      </Container>
    </>
  );
}
