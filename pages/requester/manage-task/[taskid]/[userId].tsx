import { Container, Box } from "@mui/material";
import Question from "../../../../components/taskerForm/Question";
import PrimaryButtonCTA from "../../../../components/buttons/PrimaryButtonCTA";
import SecondaryButtonCTA from "../../../../components/buttons/SecondaryButtonCTA";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import PageHeader from "../../../../components/common/PageHeader";
import GrayCard from "../../../../components/common/CustomizableGrayCard";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";
import {
  getTaskFormDataForView,
  updateApprovalStatus,
} from "../../../../src/Database";
import LoadingOverlay from "../../../../components/common/LoadingOverlay";
import {
  GenericResponse,
  QuestionType,
  TaskProps,
} from "../../../../src/Types";
import { useFormik } from "formik";
import handler from "../../../api/hello";

export default function TaskerForm() {
  const router = useRouter();
  const { taskid, userId } = router.query;
  const taskId = taskid;
  const { isInitialized, Moralis, user } = useMoralis();
  const [openLoading, setOpenLoading] = useState(false);
  const [openAbandonLoading, setOpenAbandonLoading] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [data, setData] = useState<TaskProps>();

  const handleApproveResponse = async (
    objectId: string,
    taskerId: string,
    taskId: string
  ) => {
    if (
      !isInitialized ||
      !confirm(`Are you sure you want to approve the response of ${taskerId}?`)
    )
      return;

    setOpenLoading(true);

    const res = await updateApprovalStatus(Moralis, objectId, 2, taskId);

    if (!res.success) {
      setOpenLoading(false);
      alert(res.message);
      return;
    }

    alert(res.message);
    setOpenLoading(false);
  };

  const handleRejectResponse = async (
    objectId: string,
    taskerId: string,
    taskId: string
  ) => {
    if (
      !isInitialized ||
      !confirm(`Are you sure you want to reject the response of ${taskerId}?`)
    )
      return;

    setOpenLoading(true);

    const res = await updateApprovalStatus(Moralis, objectId, 3, taskId);

    if (!res.success) {
      setOpenLoading(false);
      alert("Failed to reject response!");
      return;
    }

    alert(`Successfully rejected response from user ${taskerId}!`);
    setOpenLoading(false);
  };

  useEffect(() => {
    if (!isInitialized || !taskId) return;
    console.log(taskId);
    getTaskFormDataForView(Moralis, taskId as string, userId as string).then(
      (res) => {
        if (!res) {
          alert("Failed to retrieve task data.");
          return;
        }

        res.questions.forEach((q) => {
          if (!q.id) return;
        });
        setData(res);
      }
    );
  }, [isInitialized, Moralis, taskId]);

  // if (!isAllowed) return <LoadingOverlay open={true} text="Verifying..." />;
  if (!data) return <LoadingOverlay open={true} text="Loading Task..." />;

  return (
    <>
      <PageHeader title="Task" />
      <PrimaryButtonCTA
        text="← Manage Responses"
        size="small"
        to={`/requester/manage-task/${taskId}`}
        sx={{ mx: "auto", mt: 2 }}
      />
      <LoadingOverlay open={openLoading} text="Submitting Task..." />
      <LoadingOverlay open={openAbandonLoading} text="Abandoning Task..." />
      <Container maxWidth="sm">
        {data.questions.map((q) => (
          <Question q={q} key={q.idx} handleChange={() => {}} />
        ))}
      </Container>
    </>
  );
}
