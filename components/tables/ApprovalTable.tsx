import { Container } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { ApprovalData } from "../../src/Types";
import CustomizableGrayCard from "../common/CustomizableGrayCard";
import TaskerPageHeader from "../common/TaskerPageHeader";
import ApprovalTable from "./ApprovalTableComponents";

export default function ApprovalsTable(props: {
  data?: ApprovalData[];
  extraColumns: GridColDef[];
}) {
  return (
    <Container maxWidth="lg">
      <TaskerPageHeader
        title={"Manage Responses"}
        subtitle={"Review, approve & reject tasker responses"}
      />
      <CustomizableGrayCard sx={{ px: 5, py: 2.5, mb: 5 }}>
        <ApprovalTable data={props.data} extraColumns={props.extraColumns} />
      </CustomizableGrayCard>
    </Container>
  );
}
