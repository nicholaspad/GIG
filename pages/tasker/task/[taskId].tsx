import { Container, Box, CircularProgress } from "@mui/material";
import Question from "../../../components/taskerForm/Question";
import PrimaryButtonCTA from "../../../components/buttons/PrimaryButtonCTA";
import SecondaryButtonCTA from "../../../components/buttons/SecondaryButtonCTA";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import PageHeader from "../../../components/common/PageHeader";
import GrayCard from "../../../components/common/CustomizableGrayCard";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";
import {
  checkTaskerClaimedTask,
  taskerAbandonTask,
} from "../../../src/Database";
import LoadingOverlay from "../../../components/common/LoadingOverlay";

export default function TaskerForm() {
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

  const router = useRouter();
  const { taskId } = router.query;
  const { isInitialized, Moralis, user } = useMoralis();
  const [openLoading, setOpenLoading] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [answers, setAnswers] = useState({});

  const handleAbandonTask = async (taskName: string) => {
    if (!taskId) return;
    if (
      !isInitialized ||
      !confirm(`Are you sure you want to abandon task "${taskName}"?`)
    )
      return;

    setOpenLoading(true);

    const res = await taskerAbandonTask(Moralis, taskId as string);

    if (!res.success) {
      setOpenLoading(false);
      alert(res.message);
      return;
    }

    alert(res.message);
    router.push("/browse-tasks");
  };

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

  useEffect(() => {
    if (!isInitialized || !user || !taskId || !router || !user) return;

    const ethAddress = user.get("ethAddress");
    checkTaskerClaimedTask(Moralis, taskId as string).then((res) => {
      if (!res) {
        alert(`Address ${ethAddress} has not claimed task ${taskId}.`);
        router.push("/browse-tasks");
        return;
      }

      setIsAllowed(true);
    });
  }, [isInitialized, Moralis, taskId, router, user]);

  if (!isAllowed)
    return (
      <>
        <PageHeader title="Verifying" />
        <Box display="flex" flexDirection="column" alignItems="center">
          <CircularProgress color="secondary" sx={{ mt: 2, mb: 3 }} />
          <Typography
            textAlign="center"
            color="primary"
            fontWeight={400}
            fontSize={20}
          >
            Verifying...
          </Typography>
        </Box>
      </>
    );

  return (
    <>
      <PageHeader title="Task" />
      <LoadingOverlay open={openLoading} text="Abandoning Task..." />
      <Container maxWidth="sm">
        <GrayCard sx={{ mt: 2 }}>
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
          <SecondaryButtonCTA
            size="small"
            text="Abandon"
            onClick={() => {
              handleAbandonTask(formInfo.title);
            }}
          />
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
