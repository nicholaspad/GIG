import { Box, Container, Typography } from "@mui/material";
import CustomizableGrayCard from "../common/CustomizableGrayCard";
import TaskerPageHeader from "../common/TaskerPageHeader";
import TasksTable, { TaskData } from "./TasksTable";

export default function TasksTableWrapper(props: {
  type: "BrowseTasks" | "MyTasks";
  data: TaskData[];
}) {
  return (
    <Container maxWidth="lg">
      <TaskerPageHeader
        title={props.type === "BrowseTasks" ? "Browse Tasks" : "My Tasks"}
        subtitle={
          props.type === "BrowseTasks"
            ? "Find your next task."
            : "View & continue your claimed tasks."
        }
      />
      <CustomizableGrayCard sx={{ px: 5, py: 2.5 }}>
        {/* TODO @nicholaspad replace button links with proper routes */}
        <TasksTable type={props.type} data={props.data} />
      </CustomizableGrayCard>
    </Container>
  );
}
