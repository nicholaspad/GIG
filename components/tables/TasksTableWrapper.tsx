import { Box, Typography } from "@mui/material";
import TasksTable from "./TasksTable";
import { TaskData } from "../../src/Types";

export default function TasksTableWrapper(props: {
  type: "Tasks" | "MyTasks";
  data: TaskData[];
}) {
  // TODO @nicholaspad wrap the table in Byron's card component, center header text
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
        {/* TODO @nicholaspad replace button links with proper routes */}
        <TasksTable type={props.type} data={props.data} />
      </Box>
    </>
  );
}
