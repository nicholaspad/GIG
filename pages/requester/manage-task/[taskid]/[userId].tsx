import { Container } from "@mui/material";
import Question from "../../../../components/taskerForm/Question";
import PrimaryButtonCTA from "../../../../components/buttons/PrimaryButtonCTA";
import { useEffect, useState } from "react";
import PageHeader from "../../../../components/common/PageHeader";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";
import { getTaskFormDataForView } from "../../../../src/Database";
import LoadingOverlay from "../../../../components/common/LoadingOverlay";
import { TaskProps } from "../../../../src/Types";

export default function TaskerForm() {
  const router = useRouter();
  const { taskid, userId } = router.query;
  const taskId = taskid;
  const { isInitialized, Moralis } = useMoralis();
  const [data, setData] = useState<TaskProps>();

  useEffect(() => {
    if (!isInitialized || !taskId) return;
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
  }, [isInitialized, Moralis, taskId, userId]);

  // if (!isAllowed) return <LoadingOverlay open={true} text="Verifying..." />;
  if (!data) return <LoadingOverlay open={true} text="Loading Task..." />;

  return (
    <>
      <PageHeader title="Task Response" />
      <PrimaryButtonCTA
        text="← Manage Responses"
        size="small"
        to={`/requester/manage-task/${taskId}`}
        sx={{ mx: "auto", mt: 2 }}
      />
      <Container maxWidth="sm">
        {data.questions.map((q) => (
          <Question q={q} key={q.idx} handleChange={() => {}} />
        ))}
      </Container>
    </>
  );
}
