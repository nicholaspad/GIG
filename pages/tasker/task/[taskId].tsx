import { Container, Box } from "@mui/material";
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
  getTaskFormData,
  postTaskFormData,
  taskerAbandonTask,
} from "../../../src/Database";
import LoadingOverlay from "../../../components/common/LoadingOverlay";
import { GenericResponse, QuestionType, TaskProps } from "../../../src/Types";
import { useFormik } from "formik";

export default function TaskerForm() {
  const router = useRouter();
  const { taskId } = router.query;
  const { isInitialized, Moralis, user } = useMoralis();
  const [openPosting, setOpenPosting] = useState(false);
  const [openAbandonLoading, setOpenAbandonLoading] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [data, setData] = useState<TaskProps>();
  const formik = useFormik({
    initialValues: {},
    onSubmit: async (values: { [key: string]: string }) => {
      if (Object.keys(values).some((k) => values[k] === null)) {
        alert("Please answer all questions!");
        return;
      }
      if (!data || !isInitialized) return;

      setOpenPosting(true);

      let qTypes: { [key: string]: QuestionType } = {};
      data.questions.forEach((q) => {
        if (!q.id) return;
        qTypes[q.id] = q.type;
      });

      let responses = Object.keys(values).map((k) => {
        if (qTypes[k] === QuestionType.SINGLE_CHOICE)
          return { questionId: k, response: { idx: Number(values[k]) } };
      }) as GenericResponse[];

      const res = await postTaskFormData(Moralis, taskId as string, responses);
      if (!res.success) {
        setOpenPosting(false);
        alert(res.message);
        return;
      }

      alert(res.message);
      // router.push("/requester/my-tasks");
    },
  });

  const handleAbandonTask = async (taskName: string) => {
    if (!taskId) return;
    if (
      !isInitialized ||
      !confirm(`Are you sure you want to abandon task "${taskName}"?`)
    )
      return;

    setOpenAbandonLoading(true);

    const res = await taskerAbandonTask(Moralis, taskId as string);

    if (!res.success) {
      setOpenAbandonLoading(false);
      alert(res.message);
      return;
    }

    alert(res.message);
    router.push("/browse-tasks");
  };

  useEffect(() => {
    if (!isInitialized || !user || !taskId || !router) return;

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

  useEffect(() => {
    if (!isInitialized || !taskId || !isAllowed) return;

    getTaskFormData(Moralis, taskId as string).then((res) => {
      if (!res) {
        alert("Failed to retrieve task data.");
        return;
      }

      res.questions.forEach((q) => {
        if (!q.id) return;
        formik.setFieldValue(q.id, null);
      });

      setData(res);
    });
  }, [isAllowed, isInitialized, Moralis, taskId]);

  if (!isAllowed) return <LoadingOverlay open={true} text="Verifying..." />;
  if (!data) return <LoadingOverlay open={true} text="Loading Task..." />;

  return (
    <>
      <PageHeader title="Task" />
      <LoadingOverlay open={openPosting} text="Submitting Task..." />
      <LoadingOverlay open={openAbandonLoading} text="Abandoning Task..." />
      <Container maxWidth="sm">
        <GrayCard sx={{ mt: 2 }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" color="primary" fontWeight={600}>
              {data.title}
            </Typography>
            <Typography sx={{ mt: 2 }} variant="body2" color="primary">
              {data.description}
            </Typography>
          </Box>
        </GrayCard>
        {data.questions.map((q) => (
          <Question q={q} key={q.idx} handleChange={formik.handleChange} />
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
              handleAbandonTask(data.title);
            }}
          />
          <Box>
            <Typography
              variant="body1"
              color="secondary"
              align="center"
              fontStyle="italic"
            >
              Approx time to complete
            </Typography>
            <Typography variant="body1" color="primary" align="center">
              {data.estCompletionTime} mins
            </Typography>
          </Box>
          <PrimaryButtonCTA
            size="small"
            text="Submit"
            onClick={formik.handleSubmit}
          />
        </Box>
      </Container>
    </>
  );
}
