import { Box, Typography } from "@mui/material";
import TasksTable, { TaskData } from "../components/TasksTable";

export default function Tasks() {
  // TODO @nicholaspad hard-coded for now
  const data: TaskData[] = [1.5, 2.5, 3, 4.5, 5, 6.5, 7, 8.5, 9, 10, 10.5].map(
    (e, i) => {
      return {
        task_id: e,
        name: `Task ${i + 1}`,
        rating: e % 6,
        reward: e,
      };
    }
  );

  return (
    <>
      <Box p={2}>
        <Typography color="primary.main" fontWeight={600} fontSize={40}>
          Browse Tasks
        </Typography>
        <Typography
          color="secondary.main"
          fontStyle="italic"
          fontWeight={400}
          fontSize={20}
          mt={1}
        >
          Find your next task.
        </Typography>
      </Box>
      <Box
        width={1100}
        height={800}
        display="flex"
        flexDirection="column"
        p={2}
        sx={{ backgroundColor: "background.paper" }}
      >
        <TasksTable type="Tasks" data={data} />
      </Box>
    </>
  );
}
