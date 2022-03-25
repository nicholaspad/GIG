import { Box, Container, Typography } from "@mui/material";
import CustomizableGrayCard from "../../components/common/CustomizableGrayCard";
import TaskerPageHeader from "../../components/common/TaskerPageHeader";

export default function TaskOverview() {
  return (
    <Container maxWidth="lg">
      <TaskerPageHeader
        title="Task Overview"
        subtitle="Confirm your task selection"
      />
      <CustomizableGrayCard sx={{ px: 5, py: 2.5 }}>hi</CustomizableGrayCard>
    </Container>
  );
}
