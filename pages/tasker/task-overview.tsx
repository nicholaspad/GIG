import { Box, Container, Typography } from "@mui/material";
import CustomizableGrayCard from "../../components/common/CustomizableGrayCard";

export default function TaskOverview() {
  return (
    <Container maxWidth="lg">
      <Box textAlign="center" my={3} p={2}>
        <Typography color="primary.main" fontWeight={600} fontSize={40}>
          Task Overview
        </Typography>
        <Typography
          color="secondary.main"
          fontStyle="italic"
          fontWeight={400}
          fontSize={20}
          mt={1}
        >
          Confirm your task selection.
        </Typography>
      </Box>
      <CustomizableGrayCard sx={{ px: 5, py: 2.5 }}>hi</CustomizableGrayCard>
    </Container>
  );
}
