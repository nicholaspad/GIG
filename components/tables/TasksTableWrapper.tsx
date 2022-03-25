import { Box, Container, Typography } from "@mui/material";
import CustomizableGrayCard from "../common/CustomizableGrayCard";
import TasksTable, { TaskData } from "./TasksTable";

export default function TasksTableWrapper(props: {
  type: "Tasks" | "MyTasks";
  data: TaskData[];
}) {
  return (
    <Container maxWidth="lg">
      <Box textAlign="center" my={3} p={2}>
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
      <CustomizableGrayCard sx={{ px: 5, py: 2.5 }}>
        {/* TODO @nicholaspad replace button links with proper routes */}
        <TasksTable type={props.type} data={props.data} />
      </CustomizableGrayCard>
    </Container>
  );
}
