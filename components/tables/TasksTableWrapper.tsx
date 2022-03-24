import { Box, Typography } from "@mui/material";
import TasksTable, { TaskData } from "./TasksTable";

export default function TasksTableWrapper(props: {
  type: "Tasks" | "MyTasks";
  data: TaskData[];
}) {
  return (
    <>
      <Box p={2}>
        <Typography color="primary.main" fontWeight={600} fontSize={40}>
          {props.type === "Tasks" ? "Browse Tasks" : "My Tasks"}
        </Typography>
        <Typography
          color="secondary.main"
          fontStyle="italic"
          fontWeight={400}
          fontSize={20}
          mt={1}
        >
          {props.type === "Tasks"
            ? "Find your next task."
            : "View & continue your claimed tasks."}
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
        <TasksTable type={props.type} data={props.data} />
      </Box>
    </>
  );
}
